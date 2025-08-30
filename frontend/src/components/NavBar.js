import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css'; // Assuming you have a CSS file for styling

const NavBar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">
        <Link to="/" className="home-link">🏠 Real Estate App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/listings">View Listings</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/add-listing">Add Listing</Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button  onClick={handleLogout} className="logout-button">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
