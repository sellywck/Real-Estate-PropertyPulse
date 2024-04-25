import { Link } from "react-router-dom";
import { FaMapPin } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { TbBathFilled } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../userAuthentication/AuthProvider";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ListingCard({ listing, onUnlike }) {
  const { identity } = useContext(AuthContext);
  const user_id = identity ? identity.id : null;

  const [likes, setLikes] = useState([]);
  const listing_id = listing.id;
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      const fetchLikes = async () => {
        try {
          const token = localStorage.getItem("jwt_token");
          const headers = {
            Authorization: token,
          };
          const response = await axios.get(
            `${BASE_URL}/v1/likes/listings/${listing_id}`,
            {
              headers: headers,
            }
          );
          setLikes(response.data[0]); // Update to response.data[0] since the API returns an array inside an array
          setIsLiked(response.data[0].some((like) => like.user_id === user_id)); // Update isLiked state based on fetched likes
          console.log("likes:", response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchLikes();
    }
  }, [listing_id, user_id, identity]);

  const handleLike = async () => {
    if (identity) {
      try {
        const token = localStorage.getItem("jwt_token");
        const headers = {
          Authorization: token,
        };

        const response = await axios.post(
          `${BASE_URL}/v1/likes`,
          { user_id, listing_id },
          { headers: headers }
        );

        if (
          response.data.message === "The like has been removed successfully"
        ) {
          // If the like has been removed (unliked), update isLiked to false
          setIsLiked(false);
          // Remove the unliked item from likes array
          setLikes(likes.filter((like) => like.user_id !== user_id));
          toast.success("Property successfully removed from wishlists", {
            autoClose: 2000,
            position: "top-center",
          });
          onUnlike(listing.id);
    
        } else {
          // Otherwise, if a new like has been added, update isLiked to true
          setIsLiked(true);
          // Add the new like to likes array
 
          setLikes([...likes, response.data.data]);
          toast.success("Property successfully added to wishlists", {
            autoClose: 2000,
            position: "top-center",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const likebutton = () => {
    toast.info("Please sign in or sign up access this feature", {
      autoClose: 2000,
      position: "top-center",
    });

    navigate("/signin");
  };

  return (
    <div className=" bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-xl w-full sm:w-[350px] mb-4 ">
      <Link className="no-underline " to={`/listings/${listing.id}`}>
        <img
          className="h-[320px] w-[400px] sm:h-[220px] object-obtain hover:scale-105 transition-scale duration-300"
          style={{ position: "relative", display: "inline-block" }}
          src={listing.imageurls[0]}
          alt="listingImage"
        />
      </Link>
      <div className="p-2.5 flex flex-col w-full">
        <p className="font-bold text-black text-2xl flex items-center mb-2 justify-between">
          RM{" "}
          {listing.offer
            ? listing.discountedprice.toLocaleString("en-US")
            : listing.regularprice.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
          {identity ? (
            <button onClick={handleLike} className="transition-transform duration-300 hover:scale-125" >
              {isLiked ? (
                <i
                  className="bi bi-heart-fill"
                  style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                    fontSize: "20px",
                    color: "red",
                  }}
                ></i>
              ) : (
                <i
                  className="bi bi-heart"
                  style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                    fontSize: "20px",
                  }}
                ></i>
              )}
            </button>
          ) : (
            <button onClick={likebutton} className="transition-transform duration-300 hover:scale-125">
              <i
                className="bi bi-heart"
                style={{
                  position: "relative",
                  width: "20px",
                  height: "20px",
                  fontSize: "20px",
                }}
              ></i>
            </button>
          )}
        </p>
        <div className="flex items-center justify-between">
          <p className="truncate text-wrap text-lg font-bold text-slate-700 mt-0 mb-2">
            {listing.name}
          </p>
        </div>
        <div className="flex items-centers">
          <FaMapPin className="text-red-600 h-5 w-4 mr-2" />
          <p className="text-gray-600 text-md line-clamp-1">
            {listing.address}
          </p>
        </div>
        <div className="flex gap-3 text-gray-500">
          <div className="flex items-center gap-1 whitespace-nowrap">
            {listing.bedrooms}
            <IoBed className="text-lg" />
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            {listing.bathrooms}
            <TbBathFilled className="text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
