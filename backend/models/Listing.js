const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }, 
  title: 
  {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
    trim: true,
  },
  description: 
  {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
    trim: true,
  },
  image: 
  {
    type: String,
    required: true,
    trim  : true,
    
  },
  //detail page fields
  price: 
  {
    type: Number,
    required: true,
    min: 0,
    max: 1000000000000000000000,
    default: 0
  },
  phone: 
  {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    default: '',
  },
  city: 
  {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
    default: '',
  },
  district: 
  {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true,
    default: '',
  },
  address: 
  {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    trim: true,
    default: '',
  },


  


}, 
{
  timestamps: true // automatically add createdAt and updatedAt fields
});

// create index for listings sorted by newest first
listingSchema.index({ user: 1, createdAt: -1 });
listingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    if (ret._id && !ret.id) ret.id = ret._id.toString();
  }
});



module.exports = mongoose.model('Listing', listingSchema);
