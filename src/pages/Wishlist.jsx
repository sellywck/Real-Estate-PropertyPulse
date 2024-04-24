import ListingCard from "../components/listing/ListingCard";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

import { AuthContext } from "../components/userAuthentication/AuthProvider";

export default function Wishlist() {
  const { identity } = useContext(AuthContext);
  const user_id = identity ? identity.id : null;

  const [listings, setlistings] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (identity) {
      const fetchLikedListing = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("jwt_token");
          const headers = {
            Authorization: token,
          };
          const response = await axios.get(
            `${BASE_URL}/v1/likes/users/${user_id}`,
            {
              headers: headers,
            }
          );
          setlistings(response.data);
          console.log("likedlisting:", response.data);
        } catch (error) {
          console.log(error);
        } finally{
          setIsLoading(false);
        }
      };
      fetchLikedListing();
    }
  }, [user_id, identity]);
  console.log(listings);

  const handleUnlike = (listingId) => {
    setlistings(prevListings => prevListings.filter(listing => listing.id !== listingId));
  };

  if (isLoading) {
    return <Spinner
    animation="grow"
    className="d-flex"
    style={{ position: "fixed", top: "50%", left: "50%" }}
    variant="danger"
  />;
  }

  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col">
      <h2 className="text-center text-3xl font-semibold text-slate-600 my-4 mb-4">
        Wishlists
      </h2>
      {listings.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onUnlike={handleUnlike} />
          ))}
        </div>
        )}
        {listings.length === 0 && (
        <>
          <h3 className="text-2xl font-semibold text-slate-600 my-4">
            Create your first wishlist
          </h3>
          <p className="text-xl text-slate-600">
            As you search, click the heart icon to save your favorite places to
            a wishlist.....
          </p>
        </>
        )}
    </div>
  );
}
