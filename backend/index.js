const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ serve uploads (avatars + listing images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ mount routes once
app.use('/api/users', require('./routes/users'));
app.use('/api/listings', require('./routes/listings'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5050, () => console.log('Server running on 5050')))
  .catch(err => console.error('Server not running', err));
