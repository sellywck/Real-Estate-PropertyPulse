import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"
import mapIcon from '../assets/mapIcon_red.png'

const markerIcon = new L.Icon({
  iconUrl : mapIcon, 
  iconSize: [50, 50]

})

export default function Map({selectedListing}) {
  const longitude = selectedListing.longitude
  const latitude = selectedListing.latitude


  const position = [latitude, longitude ]
  return (
    <MapContainer style={{ height: "100%", width: "100%", borderRadius:"10px" }}  center={position} zoom={9} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position} icon={markerIcon}>
      <Popup>
        {selectedListing.address}
      </Popup>
    </Marker>
  </MapContainer>
  );
}



