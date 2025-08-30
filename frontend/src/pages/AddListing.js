//Add Listing

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Navigate} from 'react-router-dom';
import NavBar from '../components/NavBar';
import './AddListingForm.css'; // Assuming you have a CSS file for styling
console.log("Rendering AddListing page");
const token = localStorage.getItem('token');

//title max
const MAX_TITLE_LENGTH = 100;
//description max
const MAX_DESCRIPTION_LENGTH = 500;


const AddListing = () => {
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();


  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return (
      <div>
        <NavBar />
        <Navigate to="/login" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

if( title.length > MAX_TITLE_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
      alert(`Title must be less than ${MAX_TITLE_LENGTH} characters and description must be less than ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }




    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("district", district);    
    formData.append("address", address);

    try {
      const res = await fetch("http://localhost:5050/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
        body: formData,
      });

      if (res.ok) {
        navigate("/profile");
      } else {
        console.error("Failed to add listing");
      }
    } catch (err) {
      console.error("Error adding listing:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setPrice(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "city") {
      setCity(value);
    } else if (name === "district") {
      setDistrict(value);
    } else if (name === "address") {
      setAddress(value);
    }
  };

  return (
    <div className="add-page">
      <form className="add-form" onSubmit={handleSubmit} >
        <h1>Add Listing</h1>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div><div>
  <label htmlFor="phone">Phone:</label>
  <input
    type="text"
    id="phone"
    name="phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
  />
</div>

<div>
  <label htmlFor="city">City:</label>
  <input
    type="text"
    id="city"
    name="city"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    required
  />
</div>

<div>
  <label htmlFor="district">District:</label>
  <input
    type="text"
    id="district"
    name="district"
    value={district}
    onChange={(e) => setDistrict(e.target.value)}
    required
  />
</div>

<div>
  <label htmlFor="address">Address:</label>
  <input
    type="text"
    id="address"
    name="address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
  />
</div>

<div>
  <label htmlFor="description">
    Description ({description.length}/{MAX_DESCRIPTION_LENGTH})
  </label>
  <textarea
    id="description"
    name="description"
    maxLength={MAX_DESCRIPTION_LENGTH}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
    className="description-textarea"
  />
</div>

<div>
  <label htmlFor="image">Image:</label>
  <input
    type="file"
    id="image"
    accept="image/*"
    onChange={(e) => setImage(e.target.files?.[0] || null)}
    required
  />
</div>

<button type="submit">Create Listing</button>
      </form>

    </div>
  );
};

export default AddListing;