import { LatLngTuple } from "leaflet";
import { useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";

interface CustomCircleMarkerProps {
    center: LatLngTuple;
    radius: number;
    name: string;
    index: number;
}

export default function CustomCircleMarker({ center, radius, name, index }: CustomCircleMarkerProps) {

    // const [openPopup, setOpenPopUp] = useState(false);

    // function handleMarkerClick() {
    //     setOpenPopUp(!openPopup);
    // }



    return (
        <CircleMarker key={index}
            center={center}
            // radius={getMarkerRadius(meteorite.properties.mass)}
            radius={radius}
            
            // eventHandlers={{
            //     click: () => handleMarkerClick()
            // }}
        >
            {/* {
                openPopup && ( */}
                    <Popup>
                        {name || "<nom inconnu>"}
                    </Popup>
                {/* )
            } */}

        </CircleMarker>
    )
}