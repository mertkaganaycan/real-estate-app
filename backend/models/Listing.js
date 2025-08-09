const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String, // file path to uploaded image
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true // automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Listing', listingSchema);
