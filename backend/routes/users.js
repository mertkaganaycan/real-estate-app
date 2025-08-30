//routes

const express = require('express');                 // Import Express framework
const router = express.Router();                     // Create a new router instance
const User = require('../models/User');             // Import the User model
const bcrypt = require('bcrypt');                   // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');                // Import jsonwebtoken for token generation
const multer = require('multer');                   // Import multer for file uploads
const auth = require('../middleware/auth');

const upload_avatar = multer({ dest: 'uploads/avatars/' });


//me 
router.get('/me', auth, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    if (!u) return res.status(404).json({ message: "User not found" });

    // Send a clean shape with id
    res.json({
      id: u._id.toString(),
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      avatar: u.avatar,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    });
  } catch (err) {
    console.error("Me route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Post /api/users/register
router.post('/register', async (req, res) => {
  try 
  {
    const { username, password, email, firstName, lastName } = req.body;  // Destructure variables from request body

    if(!username || !email || !password || !firstName || !lastName) 
    {
      return res.status(400).json({ message: 'All fields are required'});
    }

    const usernameTaken = await User.findOne({username} );
    if(usernameTaken)
    {
      return res.status(409).json({message: 'Username already in use'});
    }

    const emailTaken = await User.findOne({email: email.toLowerCase()});
    if(emailTaken)
    {
      return res.status(409).json({message: 'Email already in use'});
    }

    const hashed = await bcrypt.hash(password, 10);
    
    const user = await User.create
    (
    {
      username : username.trim(),
      email : email.toLowerCase().trim(),
      password : hashed,
      firstName: firstName.trim(),
      lastName : lastName.trim()

    }
    )

    res.status(201).json({ message: 'Registered successfully' });



  } 
  catch (err)
  {
    console.error('Register error', err);
    res.status(500).json({ message : 'Server Error'})
  }        
  
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, username, password } = req.body;

  // must send exactly one of email/username, and a password
  if (!password) return res.status(400).json({ message: 'Password is required' });
  const count = (email ? 1 : 0) + (username ? 1 : 0);
  if (count !== 1) {
    return res.status(400).json({ message: 'Send only one: email OR username' });
  }

  const value = (email || username).trim();
  const query = email ? { email: value.toLowerCase() } : { username: value };

  try {
    const user = await User.findOne(query);
    if (!user)
    {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/avatar', auth, upload_avatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = `/uploads/avatars/${req.file.filename}`; // relative path to serve statically

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: imagePath },
      { new: true, select: '-password' } // never return password
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    // keep the response minimal and what the UI expects
    return res.json({ avatar: updated.avatar });
  } catch (err) {
    console.error('Avatar upload error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});
  
 
module.exports = router; // Export the router to be used in index.js