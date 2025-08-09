//routes

const express = require('express');                 // Import Express framework
const router = express.Router();                     // Create a new router instance
const User = require('../models/User');             // Import the User model
const bcrypt = require('bcrypt');                   // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');                // Import jsonwebtoken for token generation

// Post /api/users/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;          // Destructure username and password from request body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;          // Destructure username and password from request body

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }   

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }   

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'  // Token expires in 1 hour
    });     

    //send token to frontend
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // Export the router to be used in index.js