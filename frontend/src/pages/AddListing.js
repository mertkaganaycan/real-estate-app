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
  const [title, setTitle] = useState("");
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

    try {
      const res = await fetch("http://localhost:5050/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
        body: formData,
      });

      if (res.ok) {
        navigate("/");
      } else {
        console.error("Failed to add listing");
      }
    } catch (err) {
      console.error("Error adding listing:", err);
    }
  };

  return (
    <div className="add-page">
      <form className="add-form" onSubmit={handleSubmit}>
        <h1>Add Listing</h1>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <div>
  <label htmlFor="description">
    Description ({description.length}/500)
  </label>
  <textarea
    id="description"
    maxLength={500}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="description-textarea"
    placeholder="Write something about your listing..."
    required
  />
</div>


        <label htmlFor="image">Image:</label>
        <input type="file" id="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

        <button type="submit">Add Listing</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/">Back to Home</Link>
        </p>
      </form>
    </div>
  );
};

export default AddListing;