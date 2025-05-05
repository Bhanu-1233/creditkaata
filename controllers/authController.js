const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
    try {
      // Logic for user registration
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error, please try again' });
    }
  };
  
  // Login User
  exports.loginUser = async (req, res) => {
    try {
      // Logic for user login
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error, please try again' });
    }
  };


