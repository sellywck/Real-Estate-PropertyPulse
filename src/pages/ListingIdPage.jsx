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
      toast.info("Please sign in or sign up to contact the landlord");
      navigate("/signin");
    } else {
      setContact(true);
    }
  };

  const handleViewContact = () => {
    if (!currentUser.id) {
      toast.info("Please sign in or sign up to contact the landlord");
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
                  className="h-[400px]"
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
          <div className="m-12 flex flex-col md:flex-row max-w-6xl lg:mx-auto  rounded-lg">
            <div className="w-full">
              <p className="text-2xl font-semibold">
                {selectedListing.name} - RM{" "}
                {selectedListing.offer
                  ? selectedListing.discountedprice?.toLocaleString("en-US")
                  : selectedListing.regularprice?.toLocaleString("en-US")}
                {selectedListing.type === "rent" && " / month"}
              </p>
              <p className="items-center text-slate-600">
                <FaMapPin className="text-red-600 inline-block h-5 w-4 mr-2 " />
                {selectedListing.address}
              </p>
              <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {selectedListing.type === "rent" ? "For rent" : "For Sale"}
                </p>
                {selectedListing.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    RM
                    {+selectedListing.regularprice -
                      +selectedListing.discountedprice}{" "}
                    off
                  </p>
                )}
              </div>
              <p className="text-slate-900 text-justify hyphens-auto">
                {" "}
                <span className="font-semibold text-black ">
                  Description -
                </span>{" "}
                {selectedListing.description}
              </p>
              <ul className="flex p-0 items-center space-x-2.5 sm:space-x-10 text-sm font-semibold mb-3 text-green-900">
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
                    className="bg-slate-800 hover:bg-opacity-90 w-full text-white p-2 rounded-lg mb-2 flex items-center justify-center gap-2"
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
                        <IoMdPhonePortrait className="text-lg" />
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
                      className="bg-slate-800 hover:opacity-90 w-full text-white p-2 rounded-lg "
                    >
                      ENQUIRE NOW
                    </button>
                  </>
                )}
              {currentUser && contact && (
                <Contact selectedListing={selectedListing} />
              )}
            </div>
            <hr className="mb-4" />
            <div className="mt-6 mb-4 md:mt-0 md:ml-2 w-full h-[300px] md:h-[450px] z-10 overflow-x-hidden">
              <Map selectedListing={selectedListing} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
