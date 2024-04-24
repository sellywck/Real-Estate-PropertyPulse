import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteListing,
  fetchListingsByUserId,
} from "../../features/listings/listingsSlice";
// import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UpdateListing from "./UpdateListing";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

export default function Listings() {
  const [showModal, setShowModal] = useState({});
  const handleCloseModal = (listingId) =>
    setShowModal({ ...showModal, [listingId]: false });
  const handleShowModal = (listingId) =>
    setShowModal({ ...showModal, [listingId]: true });

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings);

  useEffect(() => {
    dispatch(fetchListingsByUserId());
  }, [dispatch]);

  const handleDeleteListing = async (listing_id) => {
    try {
      await dispatch(deleteListing(listing_id));
      toast.success("Listing deleted successfully!", {
        autoClose: 2000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div className="max-w items-center">
        {listings &&
          listings.length > 0 &&
          listings.map((listing) => (
            <div
              className="border rounded-lg p-3 flex  items-center gap-4 mb-3 listing-container"
              key={listing.id}
            >
              <Link to={`/listings/${listing.id}`}>
                <img
                  className="h-40 w-40 object-cover "
                  src={listing.imageurls[0]}
                  alt="listingCover"
                />
              </Link>
              <div className="flex-grow">
                <Link
                  className="no-underline flex-grow "
                  to={`/listings/${listing.id}`}
                >
                  <p className="text-slate-700 text-wrap hover:underline truncate font-semibold">
                    {listing.name}
                  </p>
                </Link>
              </div>
              <div className="flex gap-4 items-center justify-end  ">
                <button
                  className="text-green-700 align-middle"
                  onClick={() => handleShowModal(listing.id)}
                >
                  <BiEdit style={{ fontSize: "20px" }} />
                </button>
                <button
                  className="text-red-700 align-middle"
                  onClick={() => handleDeleteListing(listing.id)}
                >
                  <AiOutlineDelete style={{ fontSize: "20px" }} />
                </button>
              </div>
              <UpdateListing
                show={showModal[listing.id] || false}
                handleClose={() => handleCloseModal(listing.id)}
                OriginalFormData={listing}
              />
            </div>
          ))}
        {listings && listings.length === 0 && (
          <div className="items-center text-lg text-gray-600">
            No listings available....
          </div>
        )}
      </div>
    </>
  );
}
