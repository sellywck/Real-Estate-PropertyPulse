import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Contact({ selectedListing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v1/listings/landlord/${selectedListing.id}`
        );
        setLandlord(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlordInfo();
  }, [selectedListing.id]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 text-sm sm:text-lg">
          <p className="mb-0">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{selectedListing.name.toLowerCase()}</span>.
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
          ></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${selectedListing.name}&body=${message}`}
          className="bg-slate-700 text-white text-center p-2 rounded-lg hover:opacity-95 no-underline "
          >
            SEND MESSAGE
          </Link>
        </div>
      )}
    </>
  );
}
