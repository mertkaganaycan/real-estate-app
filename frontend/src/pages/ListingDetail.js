import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ListingDetail.css";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/listings/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Listing not found");
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setListing(data);
      } catch (e) {
        setErr(e.message || "Could not load listing.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="container"><p>Loading…</p></div>;
  if (err) return <div className="container"><p>{err}</p><Link className="btn" to="/listings">← Back</Link></div>;
  if (!listing) return <div className="container"><p>Not found.</p></div>;

  return (
    <div className="container listing-detail">
      <Link to="/listings" className="btn">← Back</Link>
      <h1>{listing.title}</h1>

      {listing.image && (
        <img
          src={`http://localhost:5050${listing.image}`}
          alt={listing.title}
          className="detail-image"
        />
      )}

      <p>{listing.description}</p>
      {listing.price && (
        <p className="price">
          Price: <span className="amount">{listing.price}</span> ₺
        </p>
      )}
      {listing.phone && <p className="phone">Phone: {listing.phone}</p>}

      {(listing.city || listing.district || listing.address) && (
        <p className="meta">
          Location: {[listing.address, listing.district, listing.city].filter(Boolean).join(", ")}
        </p>
      )}
      {listing.user?.username && <p className="meta">Owner: {listing.user.username}</p>}
      {listing.createdAt && (
        <p className="meta">Created: {new Date(listing.createdAt).toLocaleString()}</p>
      )}
    </div>
  );
}

