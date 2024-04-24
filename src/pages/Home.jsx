import ListingCard from "../components/listing/ListingCard";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("offers"); // Added state to track the active section
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/v1/alllistings?offer=true&limit=4`
        );
        setOfferListings(res.data);
        fetchRentListings();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/v1/alllistings?type=rent&limit=4`
        );
        setRentListings(res.data);
        fetchSaleListings();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/v1/alllistings?type=sale&limit=4`
        );
        setSaleListings(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  const SectionHeadings = () => {
    const headingClass = "text-2xl font-semibold cursor-pointer transition-colors duration-200";
    const activeTabClass = "text-black";
    const inactiveTabClass = "text-gray-400";
    const activeUnderlineClass = "border-b-4 border-yellow-400";
  
    return (
      <div className="flex justify-center space-x-10 my-4">
        <div 
          onClick={() => setActiveSection("offers")}
          className={`${headingClass} ${activeSection === 'offers' ? `${activeTabClass} ${activeUnderlineClass}` : inactiveTabClass}`}
        >
          Offers
        </div>
        <div 
          onClick={() => setActiveSection("rent")}
          className={`${headingClass} ${activeSection === 'rent' ? `${activeTabClass} ${activeUnderlineClass}` : inactiveTabClass}`}
        >
          Rent
        </div>
        <div 
          onClick={() => setActiveSection("buy")}
          className={`${headingClass} ${activeSection === 'buy' ? `${activeTabClass} ${activeUnderlineClass}` : inactiveTabClass}`}
        >
          Buy
        </div>
      </div>
    );
  };
  

  return (
    <>
      {loading && (
        <Spinner
          animation="grow"
          className="d-flex"
          style={{ position: "fixed", top: "50%", left: "50%" }}
          variant="danger"
        />
      )}
      <div>
        <Carousel>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <Carousel.Item interval={2000} key={listing.id}>
                <Carousel.Caption>
                  <h3 className="">{listing.name}</h3>
                  {/* <p>{listing.description}</p> */}
                </Carousel.Caption>
                <Link to={`/listings/${listing.id}`}>
                  <div
                    style={{
                      background: `url(${listing.imageurls[0]})  center no-repeat`,
                      backgroundSize: "cover",
                    }}
                    className="h-[500px] "
                  ></div>
                </Link>
              </Carousel.Item>
            ))}
        </Carousel>

        <SectionHeadings/>

        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-4">
          {activeSection === "offers" && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-bold text-slate-950">Recent Offers</h2>
                <Link
                  className="text-sm font-bold text-blue-800 hover:underline no-underline"
                  to="/search?offer=true"
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
          {activeSection === "rent" && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-bold text-slate-950">Property For Rent </h2>
                <Link
                  className="text-sm font-bold text-blue-800 hover:underline no-underline"
                  to="/search?type=rent"
                >
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
          {activeSection === "buy" && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-bold text-slate-950">Property For Sale </h2>
                <Link
                  className="text-sm font-bold text-blue-800 hover:underline no-underline"
                  to="/search?type=sale"
                >
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
