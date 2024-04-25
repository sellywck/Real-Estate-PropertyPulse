import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";
import ListingCard from "../components/listing/ListingCard";
import SearchMap from "../components/SearchMap";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Search() {
  const [searchListData, setSearchListData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSearchListData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await axios.get(`${BASE_URL}/v1/alllistings?${searchQuery}`);
      if (res.data.length > 4) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(res.data);
      setLoading(false);
      console.log("fetchListing", res.data);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchListData({ ...searchListData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSearchListData({ ...searchListData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSearchListData({
        ...searchListData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const value = e.target.value;
      let sort, order;

      if (value === "regularprice_desc") {
        sort = "regularprice";
        order = "desc";
      } else if (value === "regularprice_asc") {
        sort = "regularprice";
        order = "asc";
      } else if (value === "created_at_desc") {
        sort = "created_at";
        order = "desc";
      } else if (value === "created_at_asc") {
        sort = "created_at";
        order = "asc";
      } else {
        sort = "created_at";
        order = "desc";
      }
      setSearchListData({ ...searchListData, sort, order });
    }
  };
  const navigate = useNavigate();

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchListData.searchTerm);
    urlParams.set("type", searchListData.type);
    urlParams.set("parking", searchListData.parking);
    urlParams.set("furnished", searchListData.furnished);
    urlParams.set("offer", searchListData.offer);
    urlParams.set("sort", searchListData.sort);
    urlParams.set("order", searchListData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const clickToShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`${BASE_URL}/v1/alllistings?${searchQuery}`);
    if (res.data.length < 5) {
      setShowMore(false);
    }
    setListings([...listings, ...res.data]);
  };

    
  if (loading) {
    return <Spinner
    animation="grow"
    className="d-flex"
    style={{ position: "fixed", top: "50%", left: "50%" }}
    variant="danger"
  />;
  }

  return (
    <>
      <Container className="p-7 flex gap-2 max-w-6xl mx-auto h-screen overflow-hidden lg:flex-row flex-col">
        <div className=" flex-4 overflow-y-scroll ">
          <h1 className="text-3xl font-semibold text-gray-600">
            Listing results:
          </h1>
          <form
            onSubmit={handleSearchFormSubmit}
            className="flex flex-col gap-8 mt-2"
          >
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="border rounded-lg p-2 w-full"
                value={searchListData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center ">
              <label className="font-semibold">Type: </label>
              <div className="flex gap-2">
                <input
                  className="w-5"
                  type="checkbox"
                  id="all"
                  checked={searchListData.type === "all"}
                  onChange={handleChange}
                />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-5"
                  type="checkbox"
                  id="rent"
                  checked={searchListData.type === "rent"}
                  onChange={handleChange}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-5"
                  type="checkbox"
                  id="sale"
                  checked={searchListData.type === "sale"}
                  onChange={handleChange}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-5"
                  type="checkbox"
                  id="offer"
                  checked={searchListData.offer}
                  onChange={handleChange}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Amenities: </label>
              <div className="flex gap-2">
                <input
                  className="w-5"
                  type="checkbox"
                  id="parking"
                  checked={searchListData.parking}
                  onChange={handleChange}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-5"
                  type="checkbox"
                  id="furnished"
                  checked={searchListData.furnished}
                  onChange={handleChange}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select
                className="border rounded-lg p-2"
                id="sort_order"
                onChange={handleChange}
                defaultValue={"created_at_desc"}
              >
                <option value="regularprice_desc">Price high to low</option>
                <option value="regularprice_asc">Price low to hig</option>
                <option value="created_at_desc">Latest</option>
                <option value="created_at_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-2 rounded-lg hover:opacity-95">
              SEARCH
            </button>
          </form>
          <div className="mt-4 flex-2 flex-wrap gap-4 hidden lg:block">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-slate-700">No listing found!</p>
            )}

            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            {showMore && (
              <button
                onClick={clickToShowMore}
                className="text-green-500 hover:underline text-center w-full p-7"
              >
                Show More ...
              </button>
            )}
          </div>
        </div>
        <div
          className="flex-1 rounded-lg z-10"
        >
          <SearchMap listings={listings} />
        </div>
      </Container>
    </>
  );
}
