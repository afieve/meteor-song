import Map, { Marker } from "react-map-gl/maplibre";
import { useMeteoriteDataContext } from "../../../context/MeteoriteDataContextProvider";
import maplibregl, { StyleSpecification } from "maplibre-gl";
import { useMemo } from "react";
// import "maplibre-gl/dist/maplibre-gl.css";
// import mapGLCustomTiles from "../map-gl-custom-tiles.json" ;

export default function MapGLMeteorMap() {

    const { filteredMeteorites } = useMeteoriteDataContext();


    const popup = useMemo(() => {
        return new maplibregl.Popup().setText('test');
    }, []);


    // const loadMapCustomTiles: StyleSpecification  = async () => {
    //     const res = await fetch('./map-gl-custom-tiles.json');
    //     // const json = await data.json();
    //     const data = Immutable.fromJS(res);

    //     return json;
    // }

    
    return (
        <Map
            initialViewState={{
                longitude: -122.4,
                latitude: 37.8,
                zoom: 1
            }}
            // mapStyle={"./dark_matter.json"}

        >
            {/* {displayedMeteorites.map((meteorite, index) => {
                if (index < 1000 && meteorite.geometry.coordinates && meteorite.properties.mass) {
                    return (
                        <Marker 
                            longitude={meteorite.geometry.coordinates[1]} 
                            latitude={meteorite.geometry.coordinates[0]} 
                            // popup={popup}    
                        />
                    )
                }
            })} */}

        </Map>
    )
}