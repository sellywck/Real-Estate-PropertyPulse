import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapPin from "./MapPin";

export default function SearchMap({listings}) {
  console.log({listings})
  // const position = [latitude, longitude ]

  const position = [3.04, 101.63 ]
  return (
    <MapContainer style={{ height: "100%", width: "100%", borderRadius: "10px"}}  center={position} zoom={5} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      listings && listings.map((listing) => <MapPin key={listing.id} listing={listing}/>)
    }
  </MapContainer>
  );
}

