import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteListing,
  fetchListingsByUserId,
} from "../../features/listings/listingsSlice";

import UpdateListing from "./UpdateListing";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

export default function ListingForDeleteUpdate() {
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
      {listings &&
        listings.length > 0 &&
        listings.map((listing) => (
          <div
            className=" relative bg-white shadow-md  hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[350px] mb-4 "
            key={listing.id}
          >
            <Link className="no-underline " to={`/listings/${listing.id}`}>
              <img
                className="h-[320px] w-[400px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300"
                style={{ position: "relative", display: "inline-block" }}
                src={listing.imageurls[0]}
                alt="listingImage"
              />
            </Link>
            <div className="p-3 flex flex-col w-full">
              <div className="flex items-center justify-between">
                <p className="truncate text-wrap text-lg font-bold text-slate-700">
                  {listing.name}
                </p>
              </div>
              {/* <div className="flex items-centers gap-1">
                <FaMapPin className="text-green-700 h-4 w-4 " />
                <p className="text-gray-600 text-sm line-clamp-1">
                  {listing.address}
                </p>
              </div>
              <p className="text-gray-600 text-sm line-clamp-1">
                {listing.description}
              </p>
              <p className="font-semibold text-slate-600 flex items-center">
                RM{" "}
                {listing.offer
                  ? listing.discountedprice.toLocaleString("en-US")
                  : listing.regularprice.toLocaleString("en-US")}
                {listing.type === "rent" && " / month"}
              </p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1 whitespace-nowrap text-slate-700">
                  {listing.bedrooms}
                  <IoBed className="text-lg h-8" />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap text-slate-700">
                  {listing.bathrooms}
                  <TbBathFilled className="text-lg h-8" />
                </div>
              </div> */}
              <div className="flex gap-4 items-center justify-center  ">
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
          </div>
        ))}
      {listings && listings.length === 0 && (
        <div className="text-center text-lg text-gray-600">
          No listings available....
        </div>
      )}
    </>
  );
}

