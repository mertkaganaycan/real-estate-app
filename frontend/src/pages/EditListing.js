import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditListing.css";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    image: "",
  });
  const [newImageFile, setNewImageFile] = useState(null);

  const previewUrl = useMemo(() => {
    if (newImageFile) return URL.createObjectURL(newImageFile);
    return form.image ? (form.image.startsWith("http") ? form.image : `http://localhost:5050${form.image}`) : "";
  }, [newImageFile, form.image]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`http://localhost:5050/api/listings/${id}`);
        if (!r.ok) throw new Error("Failed to load listing");
        const data = await r.json();
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price ?? "",
          phone: data.phone || "",
          city: data.city || "",
          district: data.district || "",
          address: data.address || "",
          image: data.image || "",
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    setNewImageFile(file || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) { setError("Not authenticated"); return; }

    try {
      setSaving(true);
      setError("");

      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("price", String(form.price ?? ""));
      fd.append("phone", form.phone.trim());
      fd.append("city", form.city.trim());
      fd.append("district", form.district.trim());
      fd.append("address", form.address.trim());
      if (newImageFile) fd.append("image", newImageFile);

      const r = await fetch(`http://localhost:5050/api/listings/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!r.ok) {
        const msg = (await r.json().catch(() => null))?.message || "Update failed";
        throw new Error(msg);
      }

      navigate(`/profile`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) { setError("Not authenticated"); return; }
    if (!window.confirm("Bu ilanı silmek istediğine emin misin?")) return;

    try {
      setDeleting(true);
      setError("");

      const r = await fetch(`http://localhost:5050/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!r.ok) {
        const msg = (await r.json().catch(() => null))?.message || "Delete failed";
        throw new Error(msg);
      }

      navigate("/profile");
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="container"><p>Loading…</p></div>;

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Listing</h1>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Left column */}
        <div>
          <label className="lbl">Title</label>
          <input className="inp" name="title" value={form.title} onChange={onChange} required minLength={2} maxLength={40} />

          <label className="lbl">Description</label>
          <textarea className="inp" name="description" value={form.description} onChange={onChange} required minLength={10} maxLength={500} rows={5} />

          <div className="two-cols">
            <div>
              <label className="lbl">Price</label>
              <input className="inp" type="number" name="price" value={form.price} onChange={onChange} min={0} />
            </div>
            <div>
              <label className="lbl">Phone</label>
              <input className="inp" name="phone" value={form.phone} onChange={onChange} />
            </div>
          </div>

          <div className="two-cols">
            <div>
              <label className="lbl">City</label>
              <input className="inp" name="city" value={form.city} onChange={onChange} />
            </div>
            <div>
              <label className="lbl">District</label>
              <input className="inp" name="district" value={form.district} onChange={onChange} />
            </div>
          </div>

          <label className="lbl">Address</label>
          <input className="inp" name="address" value={form.address} onChange={onChange} />
        </div>

        {/* Right column */}
        <div>
          <div className="image-box">
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="preview-img" />
            ) : (
              <div className="preview-placeholder" />
            )}
            <input type="file" accept="image/*" onChange={onFileChange} />
          </div>

          <div className="buttons">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" disabled={deleting} className="btn-danger" onClick={handleDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}