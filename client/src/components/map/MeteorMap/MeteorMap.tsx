import './MeteorMap.css';
import L, { DivOverlay, LatLngTuple, MarkerCluster } from "leaflet";
import { Circle, MapContainer, Marker, CircleMarker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import logRender from "../../../utils/logCompRender";
// import CircleMarker from "./CircleMarker";
import { useEffect } from "react";
import { useMeteoriteDataContext } from "../../../context/MeteoriteDataContextProvider";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import CircleMarker from "./CustomCircleMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import CustomCircleMarker from '../CustomCircleMarker';

import countries from "../data/countries.json";
// import { SuperClustering } from 'react-leaflet-supercluster';

export default function MeteorMap() {

    const { filteredMeteorites } = useMeteoriteDataContext();

    const startPosition: LatLngTuple = [0, 0];

    useEffect(() => {
        logRender("MeteorMap");
    }, [])

    const createClusterCustomIcon = function (cluster: MarkerCluster) {
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: "custom-marker-cluster",
            iconSize: L.point(33, 33, true)

        })
    }

    const createMarkerCustomIcon = (name: string) => {
        return L.divIcon({
            html: `<span>${name}</span>`,
            className: "custom-marker-icon",
            iconSize: L.point(33,33,true)
        })
    }

    function getMarkerRadius (mass:number)  {
        const minMass = 0.2;
        const maxMass = 60000000;
        const minSize = 5;
        const maxSize = 50;

        // Calcul du rayon selon la formule
        const radius = minSize + (maxSize - minSize) * (Math.log(mass) - Math.log(minMass)) / (Math.log(maxMass) - Math.log(minMass));
        
        return radius;
    }

    return (
        <div id="map">
            <MapContainer
                center={startPosition}
                zoom={2}
                scrollWheelZoom={true}
                style={{ height: "100%" }}
                maxBounds={[
                    [84.936085, -174.891211],
                    [-85.013073, 199.226379]
                ]}
                minZoom={2}
                preferCanvas={true}
                zoomSnap={0.25}
                
            >
                {/* <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    subdomains='abcd'
                    maxZoom={20}
                /> */}
                {/* <GeoJSON data={countries.features} /> */}
                <MarkerClusterGroup
                    chunkedLoading={true}
                    animate={true}
                    iconCreateFunction={createClusterCustomIcon}
                    maxClusterRadius={60}
                    
                >

                    {filteredMeteorites.map((meteorite, index) => (

                        (index < 1000 && meteorite.geometry.coordinates && meteorite.properties.mass) && (
                            // <CustomCircleMarker index={index} center={meteorite.geometry.coordinates} radius={10} name={meteorite.properties.name || "<nom inconnu>"}/>
                            <Marker position={meteorite.geometry.coordinates} icon={createMarkerCustomIcon(meteorite.properties.recclass || "<inconnue>")} >
                                <Popup>{meteorite.properties.name}</Popup>
                            </Marker>
                        )

                    ))}

                </MarkerClusterGroup>


            </MapContainer>

        </div>
    )

}