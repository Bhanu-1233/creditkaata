const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Customer = require('../models/Customer');
const router = express.Router();

// CREATE a new customer
// routes/customer.js
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, trustScore } = req.body;

    const customer = new Customer({
      name,
      phone,
      trustScore,
      user: req.user.userId  // Set the user field to the authenticated userId
    });

    await customer.save();
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
});


// READ all customers for a user
// Get all customers for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user.userId });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// READ single customer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, user: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE a customer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.phone && !/^[0-9]{10}$/.test(updates.phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Must be 10 digits.' });
    }
    if (updates.trustScore && (updates.trustScore < 0 || updates.trustScore > 100)) {
      return res.status(400).json({ message: 'Trust score must be between 0 and 100.' });
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a customer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Customer.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET credit history
router.get('/:id/history', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, user: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ creditHistory: customer.creditHistory });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credit history', error: error.message });
  }
});

// POST repayment
router.post('/:id/repay', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const customer = await Customer.findOne({ _id: req.params.id, user: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.creditHistory.push({
      date: new Date(),
      amount: -Math.abs(amount),
      description: 'Repayment'
    });

    await customer.save();
    res.json({ message: 'Repayment recorded', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error recording repayment', error: error.message });
  }
});

module.exports = router;
