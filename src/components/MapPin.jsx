
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import L from "leaflet";
import mapIcon from '../assets/mapIcon_red.png';

const markerIcon = new L.Icon({
  iconUrl: mapIcon, 
  iconSize: [35, 45]
});

export default function MapPin({ listing }) {
  const latitude = listing.latitude;
  const longitude = listing.longitude;
  const position = [latitude, longitude];
  
  return (
    <Marker position={position} icon={markerIcon}>
      <Popup >
        <div className="flex items-center gap-4 ">
          <img src={listing.imageurls[0]} alt="Listing" className="w-20 h-20 rounded object-cover" />
          <div className="">
            <Link to={`/listings/${listing.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {listing.name}
            </Link>
            <p className="text-gray-600">
              {listing.offer ? (
                <span>RM {listing.discountedprice.toLocaleString("en-US")}</span>
              ) : (
                <span>RM {listing.regularprice.toLocaleString("en-US")}</span>
              )}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
