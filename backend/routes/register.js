// routes/register.js
const express = require('express');
const router = express.Router();

// Handle the POST request for user registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation check
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Example user registration logic (replace with DB logic)
    // Create a new user (you can replace this with actual database operations)
    const newUser = {
      username,
      password, // In real-world apps, remember to hash the password
    };

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
