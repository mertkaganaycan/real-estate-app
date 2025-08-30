const mongoose = require('mongoose');               // Import Mongoose to talk to MongoDB


const UserSchema = new mongoose.Schema({                   // Define the User schema
  username: { type: String, required: true, unique: true }, 
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  firstName: {type: String, required: true},
  lastName: { type: String, required:true},
  avatar: 
  { 
  type: String, 
  default: '/uploads/avatars/default_avatar.jpg' // generic profile picture path
  }
}, {timestamps: true});

//export the User model based on the schema 

module.exports = mongoose.model('User', UserSchema);      // Export the User model
