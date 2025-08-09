const express = require('express');                 // Import Express framework
const mongoose = require('mongoose');               // Import Mongoose to talk to MongoDB
const cors = require('cors');                       // Import CORS to allow cross-origin requests
const dotenv = require('dotenv');   
const app = express();            // Import dotenv to load .env config


dotenv.config();                                    // Load environment variables from .env                          // Create the Express app

app.use(cors());                                    // Allow frontend requests from other origins
app.use(express.json());                            // Parse incoming JSON bodies
app.use('/uploads', express.static('uploads'));  
   // Serve image files statically

  
// Import route files
const userRoutes = require('./routes/users');       
const listingRoutes = require('./routes/listings');


// Mount routes with prefixes
app.use('/api/users', userRoutes);                  // All /api/users requests go to users.js
app.use('/api/listings', listingRoutes);           // All /api/listings requests go to listings.js

// Connect to MongoDB using URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // If successful, start the server
    app.listen(5050, () => console.log("Server running on port 5050"));
  })
  .catch(err => console.error("Server not running", err));
                // Log error if connection fails
