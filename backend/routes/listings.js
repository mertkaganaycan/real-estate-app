const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// GET /api/listings → public
router.get('/', async (req, res) => {
  const listings = await Listing.find().populate('user', 'username');
  res.json(listings);
});

router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const listings = await Listing.find({ user: userId });
  res.json(listings);
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log("🔨 DELETE /api/listings/:id called for ID:", req.params.id);

    const listing = await Listing.findById(req.params.id);
    console.log("📦 Listing found:", listing);
    console.log("👤 Authenticated user ID:", req.user.id);

    if (!listing.user || listing.user.toString() !== req.user.id) {
      console.warn("🚫 Unauthorized delete attempt by", req.user.id);
      return res.status(403).json({ message: "Unauthorized" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.error("❌ Server error while deleting listing:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/listings → protected
router.post('/', auth, upload.single('image'), async (req, res) => {
  console.log("Uploaded file:", req.file);
  const { title, description } = req.body;

  const fileName = req.file?.filename;
  const imagePath = `/uploads/${fileName}`; // ✅ No host
  const listing = new Listing({
    title,
    description,
    image: imagePath,
    user: req.user.id
  }); 

  await listing.save();
  res.status(201).json(listing);
});

module.exports = router;
