//My Listings Page
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Listings.css"; // Assuming you have a CSS file for styling







const MyListings = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    console.log("Trying to delete:", id);
    console.log("Token being sent:", token);


    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete listing");
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/listings/user/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setListings(data);
        } else {
          console.error("Failed to fetch listings:", data.message);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    if (userId) {
      fetchMyListings();
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);

   return (
  <div className="listings-wrapper">
    <h1>My Listings</h1>
    <div className="listings-grid">
      {listings.map((listing) => (
        <div className="listing-card" key={listing._id}>
          <h3>{listing.title}</h3>
          <p>{listing.description}</p>
          <img src={`http://localhost:5050${listing.image}`} alt={listing.title} />
          <button onClick={() => handleDelete(listing._id)}>Delete</button>
        </div>
      ))}
    </div>
  </div>
);

};


export default MyListings;