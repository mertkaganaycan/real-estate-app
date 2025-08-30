import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom"; // ⬅️ NEW

function Profile() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [me, setMe] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatar: "/uploads/avatars/default_avatar.jpg",
  });
  const [listings, setListings] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        // 1) load me
        const r = await fetch("http://localhost:5050/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await r.json();
        if (!r.ok) { console.warn("ME failed:", meData); return; }
        setMe(meData);

        const id = meData.id || meData._id;
        localStorage.setItem("userId", id);

        // 2) my listings
        const rl = await fetch(`http://localhost:5050/api/listings/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lst = await rl.json();
        if (rl.ok) setListings(lst);
      } catch (e) {
        console.error("profile load error:", e);
      }
    })();
  }, [token]);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5050/api/users/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      setUploading(false);

      if (!res.ok) {
        alert(data?.message || "Avatar upload failed");
        return;
      }
      setMe((m) => ({ ...m, avatar: data.avatar }));
    } catch (err) {
      setUploading(false);
      console.error("avatar upload error:", err);
      alert("Network error uploading avatar");
    }
  }

  if (!token) {
    return (
      <div className="profile-wrapper">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-grid">
        {/* Left: Avatar + Basic Info */}
        <section className="profile-card">
          <div className="avatar-block">
            <img
              src={`http://localhost:5050${me.avatar}`}
              alt="avatar"
              className="avatar-img"
              onError={(e) =>
                (e.currentTarget.src =
                  "http://localhost:5050/uploads/avatars/default_avatar.jpg")
              }
            />

            <label className="upload-btn">
              {uploading ? "Uploading..." : "Change Avatar"}
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>
          </div>

          <div className="info-block">
            <div className="info-row">
              <span className="info-label">First name</span>
              <span className="info-value">{me.firstName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last name</span>
              <span className="info-value">{me.lastName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Username</span>
              <span className="info-value">{me.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{me.email}</span>
            </div>
          </div>
        </section>

        {/* Right: My Listings */}
        <section className="profile-card">
          <h2 className="section-title">My Listings</h2>

          <div className="listings-grid">
            {listings.map((listing) => {
              if (!listing?._id) return null;
              return (
                <div className="listing-card" key={listing._id}>
                  <h3>{listing.title}</h3>
                  <p className="muted truncate-2">{listing.description}</p>

                  {listing.image && (
                    <img
                      src={`http://localhost:5050${listing.image}`}
                      alt={listing.title}
                      className="profile-listing-image"
                    />
                  )}

                  <div className="buttons">
                    <Link to={`/listing/${listing._id}`} className="btn btn-detail">
                      Details
                    </Link>
                    <Link to={`/edit-listing/${listing._id}`} className="btn btn-edit">
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })} 

            {listings.length === 0 && (
              <p className="muted">You haven’t added a listing yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;