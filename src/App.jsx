import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Profile from "./pages/Profile";
import RootLayout from "./components/RootLayout";
import SignUp from "./pages/SignUp";
import AuthProvider from "./components/userAuthentication/AuthProvider";
import { ToastContainer } from "react-toastify";
import PrivateProfileRoute from "./components/PrivateProfileRoute";
import { Provider } from "react-redux";
import store from "./store";
// import Listings from "./pages/Listings";
import ListingIdPage from "./pages/ListingIdPage";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
        <RootLayout/>
          <Routes>
              <Route index element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search/>}/>
              <Route path="/listings/:listingId" element={<ListingIdPage/>}/>
              <Route element={<PrivateProfileRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </Provider>
    </AuthProvider>
  );
}
