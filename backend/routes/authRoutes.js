const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Add this at the top
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; 

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required' });
  
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: 'Invalid credentials' });
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });
module.exports = router;
