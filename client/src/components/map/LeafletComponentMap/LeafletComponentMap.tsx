import React, { useEffect, useRef, useCallback, useState, useMemo } from "react";
import type { FeatureCollection } from "geojson";
import L, { Map as LeafletMap, LatLngBoundsExpression, FitBoundsOptions, MapOptions } from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet/dist/leaflet.css";
import "./LeafletComponentMap.css";
import countries from "../data/world_countries.json";
import { useMeteoriteDataContext } from "../../../context/MeteoriteDataContextProvider";
import { useDispatch } from "react-redux";
import { openDetailsModal, setDetailedMeteorite } from "../../../store/slices";

type ControlledLayer = {
    addLayer(layer: L.Layer): void;
    removeLayer(layer: L.Layer): void;
};

type LeafletContextInterface = Readonly<{
    __version: number;
    map: LeafletMap;
    layerContainer?: ControlledLayer | L.LayerGroup;
    layersControl?: L.Control.Layers;
    overlayContainer?: L.Layer;
    pane?: string;
}>;

const CONTEXT_VERSION = 1;

function createLeafletContext(map: LeafletMap): LeafletContextInterface {
    return Object.freeze({ __version: CONTEXT_VERSION, map });
}

type DivProps = React.HTMLProps<HTMLDivElement>;

interface MapContainerProps extends MapOptions, DivProps {
    center?: [number, number];
    zoom?: number;
    bounds?: LatLngBoundsExpression;
    maxBounds?: LatLngBoundsExpression;
    boundsOptions?: FitBoundsOptions;
    whenReady?: () => void;
}

export const LeafletComponentMap: React.FC<MapContainerProps> = ({
    center = [0, 0],
    zoom = 2,
    bounds,
    maxBounds,
    boundsOptions = { maxZoom: 20 },
    minZoom = 2,
    whenReady,
    ...options
}) => {

    // Paramètres de la carte Leaflet
    const [context, setContext] = useState<LeafletContextInterface | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    // const [clustersAreActive, setClustersAreActive] = useState(true);
    const clustersAreActive = true;
    const meteoritesLayer = useRef<L.LayerGroup>(new L.LayerGroup()); // Référence pour le calque contenant les météorites affichées
    const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null); // Référence pour le groupe de clusters

    // Données
    const { filteredMeteorites } = useMeteoriteDataContext(); // Données des météorites filtrées par le contexte MeteoriteDataContext
    // const [detailedMeteorite, setDetailedMeteorite] = useState<IMeteoriteLandingGeoJSONDocument | null>(null);


    // Store
    const dispatch = useDispatch();

    // Initialisation de la carte
    const initMap = useCallback(() => {

        if (mapRef.current && !context) {

            // INIT MAP
            const map = new LeafletMap(mapRef.current, {
                zoomControl: false,
                preferCanvas: true,
                style: { height: "100%" },
                maxBounds: [
                    [120.936085, -200.891211],
                    [-120.013073, 199.226379]
                ],
                minZoom: 2,
                zoomSnap: 0.25,
                ...options,
            });


            // TILES : RASTER OU GEOJSON
            const TILE_MODE: "RASTER" | "GEOJSON" = "RASTER";

            if (TILE_MODE === "RASTER") {

                // Ajouter une couche de tuiles (carte OpenStreetMap)
                const rasterTileLayer = new L.TileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                });
                rasterTileLayer.addTo(map);

            } else if (TILE_MODE === "GEOJSON") {

                // Ajouter une couche GeoJSON décrivant des polygones / multi-polygones dessinant les formes des pays
                const geoJSONTileLayerStyle = {
                    "weight": 1,
                    "color": "#444444",
                    "fillColor": "#555555"
                }
                const geoJSONTileLayer = new L.GeoJSON(countries as FeatureCollection, {
                    style: geoJSONTileLayerStyle
                });
                geoJSONTileLayer.addTo(map);
            }


            // INSERT CLUSTERS AND MARKERS
            if (clustersAreActive) {
                // Initialiser le groupe de clusters
                clusterGroupRef.current = L.markerClusterGroup({
                    iconCreateFunction: (cluster) => {
                        return L.divIcon({
                            html: `<span>${cluster.getChildCount()}</span>`,
                            className: "custom-marker-cluster",
                            iconSize: [33, 33],
                        });
                    },
                    maxClusterRadius: (zoom) => zoom >= 5 ? 1 : 80
                });
                clusterGroupRef.current.addTo(map);

            } else {
                // Ajouter le groupe de calques des météorites à la carte
                meteoritesLayer.current.addTo(map);
            }

            // map.on('zoom', () => {
            //     console.log('zoom', map.getZoom());
            // })

            if (center && zoom) {
                map.setView(center, zoom);
                // console.log('zoom', zoom);
            } else if (bounds) {
                map.fitBounds(bounds, boundsOptions);
            }

            if (whenReady) {
                map.whenReady(whenReady);
            }

            setContext(createLeafletContext(map));
        }
    }, [context, center, zoom, bounds, boundsOptions, options, whenReady, clustersAreActive]);

    const meteoriteFamilyRegex = useMemo(() => ({
        Stony: new RegExp("^OC+$|^OC[1-7].*|^H+$|^H[-|?|(|\/|~|1-7].*|^L(?![A-Za-z]).*$|^LL(?![A-Za-z]).*$|^C+$|^C+[H|B|I|K|O|R|V|M|1-7]+.*|^E+$|^E+\\-+.*|^E+[1-7]+.*|^E[H|L]+.*|^E-(an)$|K+$|^K[1-7].*|^R+$|^R[1-7].*|^Chondrite-fusion crust+$|^Chondrite-ung+$|^Howardite.*|^Eucrite.*|^Diogenite.*|^Aubrite.*|^Angrite.*|^Lunar.*|^Martian.*|^Achondrite-ung+$|^Enst achon-ung+$|^Enst achon+$|^Achondrite-prim|Acapulcoite|[L|l]odranite.*|^Brachinite.*|^Ureilite.*|^Winonaite.*"),
        Iron: new RegExp("^Iron."),
        Relict: new RegExp("^Relict .*"),
        Mixed: new RegExp("^Mesosiderite.*|^Pallasite.*")
    }), []);

    const getMeteoriteColorClass = useCallback((recclass: string) => {

        if (recclass) {

            if (meteoriteFamilyRegex.Relict.test(recclass)) return "#E6D087"
            else if (meteoriteFamilyRegex.Mixed.test(recclass)) return "#87E69F"
            else if (meteoriteFamilyRegex.Iron.test(recclass)) return "#E6878D"
            else if (meteoriteFamilyRegex.Stony.test(recclass)) return "#8893E6"
        }
    }, [meteoriteFamilyRegex]);

    const customCircleMarkerOptions = useCallback((recclass: string) => (
        {
            radius: 8,
            color: getMeteoriteColorClass(recclass),
            weight: 1
        }
    ), [getMeteoriteColorClass]);


    const updateMeteoritesMarkers = useCallback(() => {

        // console.log('from updateMeteoritesMarkers:', filteredMeteorites.length, 'météorites');

        const layerGroup = meteoritesLayer.current;
        layerGroup.clearLayers(); // Vider le calque pour ajouter les nouveaux marqueurs
        clusterGroupRef.current?.clearLayers(); // Vider le groupe de cluster s'il existe

        // Ajouter un marqueur pour chaque météorite filtrée
        filteredMeteorites.forEach((meteorite, index) => {

            if (meteorite.geometry.coordinates && meteorite.properties.mass && meteorite.properties.name && meteorite.properties.recclass) {
                const marker = L.circleMarker(meteorite.geometry.coordinates, customCircleMarkerOptions(meteorite.properties.recclass))
                    .bindPopup(`
                        <div class='marker-popup'>
                            <p><b>${meteorite.properties.name}</b></p>
                            <p>Classe: ${meteorite.properties.recclass}</p>
                            <button class="info-btn" data-id="${index}">En savoir plus</button>
                        </div>
                    `);

                // Utiliser l'événement 'popupopen' pour gérer les clics sur le bouton info
                marker.on('popupopen', (event) => {

                    const infoButton = event.popup.getElement()?.querySelector('.info-btn') as HTMLElement | null;

                    if (infoButton) {
                        infoButton.onclick = () => {
                            dispatch(setDetailedMeteorite(meteorite));
                            dispatch(openDetailsModal());
                        };
                    }
                });

                layerGroup.addLayer(marker);

                if (clustersAreActive) {
                    clusterGroupRef.current?.addLayer(marker);
                }
            }
        });
    }, [filteredMeteorites, customCircleMarkerOptions, clustersAreActive, dispatch]);

    // Supprimer la carte lors du démontage du composant
    useEffect(() => {
        initMap();

        /*
        return () => {
            context?.map.remove();
        };
        */
    }, [context, initMap]);

    useEffect(() => {
        //~ console.log(`from useEffect: filteredMeteorites:`, filteredMeteorites);
        if (context && filteredMeteorites.length > 0) {
            // debouncedUpdateMarkers()
            updateMeteoritesMarkers();
        }
    }, [context, filteredMeteorites, updateMeteoritesMarkers]);

    return <div
        ref={mapRef}
        id="map"
        style={{ height: "100%" }}
    />;
};
