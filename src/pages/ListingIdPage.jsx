import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchListing } from "../features/listings/listingsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

import { FaShare, FaMapPin, FaChair } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { IoMdPhonePortrait } from "react-icons/io";
import { TbBathFilled } from "react-icons/tb";
import { RiParkingBoxFill } from "react-icons/ri";
import { BsFillSignNoParkingFill } from "react-icons/bs";
import Contact from "../components/listing/Contact";
import Map from "../components/Map";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ListingIdPage() {
  const currentUser = useSelector((state) => state.profile.profile);

  console.log(currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const listing_id = params.listingId;
  // console.log({listing_id})
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [viewPhoneNumber, setviewPhoneNumber] = useState(false);
  const [landlord, setLandlord] = useState(null);

  useEffect(() => {
    dispatch(fetchListing(listing_id));
  }, [dispatch, listing_id]);

  const selectedListing = useSelector(
    (state) => state.listings.selectedListing
  );
  // console.log(selectedListing);
  const loading = useSelector((state) => state.listings.loading);
  const error = useSelector((state) => state.listings.error);

  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v1/listings/landlord/${listing_id}`
        );
        setLandlord(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlordInfo();
  }, [listing_id]);

  const handleContactLandLord = () => {
    if (!currentUser.id) {
      setContact(false);
      toast.info("Please sign in or sign up to contact the landlord", {
        autoClose: 2000,
        position: "top-center",
      });
      navigate("/signin");
    } else {
      setContact(true);
    }
  };

  const handleViewContact = () => {
    if (!currentUser.id) {
      toast.info("Please sign in or sign up to contact the landlord", {
        autoClose: 2000,
        position: "top-center",
      });
      navigate("/signin");
    } else {
      setviewPhoneNumber(!viewPhoneNumber);
    }
  };

  return (
    <main>
      {loading && (
        <Spinner
          animation="border"
          className="text-center mx-auto my-7 d-block"
          style={{ position: "fixed", top: "50%", left: "50%" }}
          variant="danger"
        />
      )}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {selectedListing && !loading && !error && (
        <div>
          <Carousel>
            {selectedListing["imageurls"].map((url) => (
              <Carousel.Item interval={1000} key={url}>
                <div
                  className="h-[450px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                    display: "block",
                  }}
                ></div>
              </Carousel.Item>
            ))}
          </Carousel>
          <div
            className="fixed top-[20%] right-[4%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
            style={{ top: "7rem" }}
          >
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className="fixed top-[20%] right-[3%] z-10 rounded-md bg-slate-100 p-2">
              Link copied
            </p>
          )}
<div className="p-4 m-12 max-w-6xl lg:mx-auto bg-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl lg:mx-auto rounded-lg ">
              <div className="row-span-2">
                <p className="text-xl sm:text-2xl font-semibold mb-3">
                  {selectedListing.name} - RM{" "}
                  {selectedListing.offer
                    ? selectedListing.discountedprice?.toLocaleString("en-US")
                    : selectedListing.regularprice?.toLocaleString("en-US")}
                  {selectedListing.type === "rent" && " / month"}
                </p>
                <p className="items-center text-slate-600 text-sm sm:text-lg">
                  <FaMapPin className="text-red-600 inline-block h-4 w-3 mr-2 mb-1 sm:h-6 sm:w-4 sm:mb-2 " />
                  {selectedListing.address}
                </p>
                <div className="flex gap-4 ">
                  <p className="bg-red-600 font-semibold w-full max-w-auto text-white text-center p-1 rounded-md text-sm sm:text-lg">
                    {selectedListing.type === "rent" ? "RENT" : "SALE"}
                  </p>
                  {selectedListing.offer && (
                    <p className="bg-green-600 font-semibold w-full max-w-auto text-white text-center p-1 rounded-md text-sm sm:text-lg">
                      RM
                      {+selectedListing.regularprice -
                        +selectedListing.discountedprice}{" "}
                      OFF
                    </p>
                  )}
                </div>
                <p className="text-slate-900 text-justify hyphens-auto text-sm sm:text-lg">
                  {" "}
                  <span className="font-semibold text-black ">
                    Description -
                  </span>{" "}
                  {selectedListing.description}
                </p>
                <ul className="flex p-1 items-center space-x-2 sm:space-x-10 sm:text-lg text-sm font-semibold mb-3 text-green-900">
                  <li className="flex items-center gap-0.5 whitespace-nowrap ">
                    {" "}
                    <IoBed className="text-lg" />
                    {selectedListing.bedrooms > 1
                      ? `${selectedListing.bedrooms} beds`
                      : `${selectedListing.bedrooms} bed`}
                  </li>
                  <li className="flex items-center gap-0.5  whitespace-nowrap ">
                    {" "}
                    <TbBathFilled className="text-lg" />
                    {selectedListing.bathrooms > 1
                      ? `${selectedListing.bathrooms} baths`
                      : `${selectedListing.bathrooms} bath`}
                  </li>
                  {selectedListing.parking ? (
                    <li className="flex items-center gap-0.5  whitespace-nowrap ">
                      {" "}
                      <RiParkingBoxFill className="text-lg" />
                      Parking
                    </li>
                  ) : (
                    <li className="flex items-center gap-0.5 whitespace-nowrap ">
                      {" "}
                      <BsFillSignNoParkingFill className="text-lg" />
                      No Parking{" "}
                    </li>
                  )}
                  <li className="flex items-center gap-0.5 whitespace-nowrap">
                    <FaChair className="text-lg" />
                    {selectedListing.furnished ? "Furnished" : "Not furnished"}
                  </li>
                </ul>
                {currentUser &&
                  selectedListing.user_id !== currentUser.id &&
                  !contact && (
                    <button
                      onClick={handleViewContact}
                      className="bg-slate-800 hover:bg-opacity-90 w-full text-white p-2 rounded-lg mb-2 flex items-center justify-center gap-2 text-sm sm:text-lg"
                      aria-label={
                        viewPhoneNumber
                          ? "Hide phone number"
                          : "View phone number"
                      }
                    >
                      {viewPhoneNumber ? (
                        <span>{landlord.phonenumber}</span>
                      ) : (
                        <>
                          <IoMdPhonePortrait className="text-sm sm:text-lg" />
                          <span>VIEW PHONE NUMBER</span>
                        </>
                      )}
                    </button>
                  )}
                {currentUser &&
                  selectedListing.user_id !== currentUser.id &&
                  !contact && (
                    <>
                      <button
                        onClick={handleContactLandLord}
                        className="bg-slate-800 hover:opacity-90 w-full text-white p-2 rounded-lg text-sm sm:text-lg "
                      >
                        ENQUIRE NOW
                      </button>
                    </>
                  )}
                {currentUser && contact && (
                  <Contact selectedListing={selectedListing} />
                )}
              </div>
              <div className="row-span-2 h-full overflow-x-hidden">
                <Map selectedListing={selectedListing} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
