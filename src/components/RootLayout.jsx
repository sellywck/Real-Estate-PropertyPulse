import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./userAuthentication/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../features/users/profileSlice";
import { auth } from "../firebase";


export default function RootLayout() {
  const { identity } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      dispatch(fetchUserInfo(identity.id));
    }
  }, [dispatch, identity]);

  useSelector((state) => state.profile.loading);
  const profile = useSelector((state) => state.profile.profile);
  const profilePictureUrl = profile?.profilepicture;

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setNavbarOpen(false); // Close the navbar on search submit
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const closeNavbar = () => {
    setNavbarOpen(false);
  };

  const { handleIdentitySignOut } = useContext(AuthContext);

  const handleSignOut = () => {
    auth.signOut();
    handleIdentitySignOut();
    localStorage.clear();
    console.log(localStorage.getItem("jwt_token"));
    navigate("/");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="flex max-w-6xl mx-auto p-3 flex-wrap items-center">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link to="/" className="no-underline" onClick={closeNavbar}>
            <h1 className="font-bold text-2xl sm:text-3xl flex flex-wrap m-0">
              <span className="text-red-600">Property</span>
              <span className="text-red-800">Pulse</span>
              <span className="mx-1 h-9 mr-2 font-bold">
                <i className="bi bi-houses text-red-500"></i>
              </span>
            </h1>
          </Link>

          <button
            className="menu-icon lg:hidden text-2xl mb-2"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            ☰
          </button>
        </div>

        <div
          className={
            "lg:flex flex-grow items-center justify-end " +
            (navbarOpen ? "" : " hidden")
          }
        >
          <form
            onSubmit={handleSearchFormSubmit}
            className="bg-white-100 p-3 rounded-lg border flex items-center search-form w-full lg:w-[20rem]"
          >
            <input
              className="bg-transparent focus:outline-none w-full search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="">
              <i className="bi bi-search text-red-500"></i>
            </button>
          </form>

          <ul className="flex flex-col lg:flex-row items-center font-semibold list-none lg:m-0">
            <Link
              to="/"
              className="no-underline text-center"
              onClick={closeNavbar}
            >
              <li className="h-8 px-6 text-xl text-slate-700 hover:underline decoration-red-600 sm:inline">
                Home
              </li>
            </Link>
            <Link
              to="about"
              className="no-underline text-center"
              onClick={closeNavbar}
            >
              <li className="h-8 px-6 text-xl sm:inline text-slate-700 hover:underline decoration-red-600 ">
                About
              </li>
            </Link>
            <Link
              to="wishlist"
              className="no-underline text-center"
              onClick={closeNavbar}
            >
              {identity && (
                <li className="h-8 px-6 text-xl sm:inline text-slate-700 hover:underline decoration-red-600">
                  Wishlists
                </li>
              )}
            </Link>
            <Link
              to="profile"
              className="no-underline text-center"
              onClick={closeNavbar}
            >
              {identity ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={profilePictureUrl}
                  alt="profile"
                />
              ) : (
                <button
                  className="h-8 px-6 text-xl sm:inline text-slate-700 hover:underline decoration-red-600"
                  href="/signin"
                >
                  Sign In
                </button>
              )}
            </Link>

            {identity && (
  <div className="flex items-center justify-center h-8 px-6">
    <button
      onClick={handleSignOut}
      className="border bg-red-600 border-slate-300 text-white px-2 py-0.5 rounded text-xl transition-colors duration-200 ease-in-out focus:outline-none"
    >
      Sign out
    </button>
  </div>
)}

          </ul>
        </div>
      </div>
    </header>
  );
}
