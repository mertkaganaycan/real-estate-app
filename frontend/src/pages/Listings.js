import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
// Listings Page
import { useNavigate } from "react-router-dom";
// Listings component to fetch and display all listings
import "./Listings.css"; // Assuming you have a CSS file for styling

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/listings");
        const data = await res.json();
        if (res.ok) setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  return (
  <div className="listings-wrapper">
    <h1>All Listings</h1>

    <div className="listings-grid">
      {listings.map((listing) => (
        <div className="listing-card" key={listing._id}>
          <h3>{listing.title}</h3>
          <p>{listing.description}</p>
          <img
            src={`http://localhost:5050${listing.image}`}
            alt={listing.title}
          />
        </div>
      ))}
    </div>
  </div>
);

};

export default Listings;
