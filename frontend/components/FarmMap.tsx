"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const markerIcon = new L.Icon({
iconUrl:"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
iconRetinaUrl:"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
shadowUrl:"https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
iconSize:[25,41],
iconAnchor:[12,41]
})

function LocationMarker({setLocation,setCrop}:any){

const [position,setPosition]=useState<any>(null)

useMapEvents({

click(e:any){

const lat=e.latlng.lat
const lon=e.latlng.lng

setPosition(e.latlng)

setLocation(`Lat: ${lat.toFixed(3)}, Lon: ${lon.toFixed(3)}`)

/* Improved AI Crop Logic */

if(lat >= 26){
setCrop("Wheat / Barley")
}

else if(lat >= 21 && lat < 26){
setCrop("Rice / Sugarcane")
}

else if(lat >= 16 && lat < 21){
setCrop("Cotton / Groundnut")
}

else{
setCrop("Millets / Maize")
}

}

})

return position===null?null:(

<Marker position={position} icon={markerIcon}/>

)

}

export default function FarmMap({setLocation,setCrop}:any){

return(

<MapContainer
center={[22.9734,78.6569]}
zoom={5}
style={{height:"350px",width:"100%"}}
>

<TileLayer
attribution="&copy; OpenStreetMap contributors"
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<LocationMarker setLocation={setLocation} setCrop={setCrop}/>

</MapContainer>

)

}