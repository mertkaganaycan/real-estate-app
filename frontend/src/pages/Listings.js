import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "./Listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/listings");
        const data = await res.json();
        console.log("API response:", data); // shows array with _id
        if (res.ok && Array.isArray(data)) {
          setListings(data); // no normalization needed
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="listings-wrapper">
      <h1>All Listings</h1>

      {listings.length === 0 ? (
        <p>No listings available at the moment.</p>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => {
            if (!listing?._id) return null; // guard just in case
            return (
              <div className="listing-card" key={listing._id}>
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                {listing.image && (
                  <img
                    src={`http://localhost:5050${listing.image}`}
                    alt={listing.title}
                  />
                )}
                <div className="actions">
                  <Link to={`/listing/${listing._id}`} className="btn btn-detail">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Listings;