const mongoose = require('mongoose');               // Import Mongoose to talk to MongoDB


const UserSchema = new mongoose.Schema({                   // Define the User schema
  username: { type: String, required: true, unique: true },  
  password: { type: String, required: true }
});

//expoert the User model based on the schema

module.exports = mongoose.model('User', UserSchema);      // Export the User model