import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import AddListing from "./pages/AddListing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import MyListings from "./pages/MyListings";



function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <NavBar />
        {/* Add mt-16 here to push content below the fixed navbar */}          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="*" element={<Home />} />
          </Routes>
        
      </div>
    </Router> 
  );
}

export default App;
