const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/listing-images/' });
const fs = require('fs');
const path = require('path');


// GET /api/listings → public
router.get('/', async (req, res) => {
  const listings = await Listing.find().populate('user', 'username');
  res.json(listings);
}); 
// GET /api/listings/user/:id → protected
router.get('/user/:id', auth , async (req, res) => {
  const userId = req.params.id;
  const listings = await Listing.find({ user: userId });
  res.json(listings);

});
// GET /api/listings/:id → public (detail)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: validate ObjectId
    const isValid = id && id.match(/^[0-9a-fA-F]{24}$/);
    if (!isValid) return res.status(400).json({ message: 'Invalid id' });

    const listing = await Listing.findById(id)
      .populate('user', 'username') // get owner username
      .lean();

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    return res.json(listing);
  } catch (err) {
    console.error('❌ Error getting listing by id:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/listings/:id → protected
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const id = req.params.id;
  try {
    console.log('➡️ PUT /api/listings/:id', id);
    console.log('   body keys:', Object.keys(req.body));
    console.log('   file:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : null);

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (!listing.user || listing.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, price, phone, city, district, address } = req.body;

    if (title       !== undefined) listing.title       = title;
    if (description !== undefined) listing.description = description;
    if (price       !== undefined) listing.price       = Number(price);
    if (phone       !== undefined) listing.phone       = phone;
    if (city        !== undefined) listing.city        = city;
    if (district    !== undefined) listing.district    = district;
    if (address     !== undefined) listing.address     = address;

    if (req.file) {
      const newPath = `/uploads/listing-images/${req.file.filename}`;
      console.log('   ✅ new image path:', newPath);

      // Build absolute path RELATIVE TO THIS ROUTE FILE
      // routes/ -> go up one level to backend/, then into listing.image path
      if (listing.image && listing.image.startsWith('/uploads/listing-images/')) {
        const relative = listing.image.replace(/^\//, ''); // 'uploads/xxx'
        const oldAbs = path.join(__dirname, '..', relative);
        console.log('   🔎 unlink attempt:', oldAbs);

        try {
          if (fs.existsSync(oldAbs)) {
            fs.unlinkSync(oldAbs);
            console.log('   🗑️ old image removed');
          } else {
            console.log('   (old image not found, skipping)');
          }
        } catch (e) {
          console.warn('   ⚠️ unlink failed:', e.message);
          // do not fail update because of unlink
        }
      }

      listing.image = newPath;
    }

    await listing.save();
    console.log('   ✅ listing updated');
    res.json(listing);
  } catch (err) {
    console.error('❌ Update listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




// DELETE /api/listings/:id → protected
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
  const { title, description, price, phone, city, district, address } = req.body;

  const fileName = req.file?.filename;
  const imagePath = `/uploads/listing-images/${fileName}`; // ✅ No host
  const listing = new Listing({
    title,
    description,
    image: imagePath,
    user: req.user.id,
    price,
    phone,
    city,
    district,
    address,
  }); 

  await listing.save();
  res.status(201).json(listing);
});

module.exports = router;
