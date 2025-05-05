const Credit = require('../models/creditModel');

const Customer = require('../models/customerModel');

// Create a new customer
const createCustomer = async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Please provide name and phone number' });
  }

  try {
    const customer = new Customer({
      name,
      phone,
      user: req.user.id, // User ID from the token
    });

    await customer.save();
    res.status(201).json({ message: 'Customer added successfully', customer });
  } catch (err) {
    console.error('Error in createCustomer:', err.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const recordRepayment = async (req, res) => {
    try {
      const { amount } = req.body;
      const customer = await Customer.findOne({ _id: req.params.id, user: req.user.id });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      customer.repayments.push({ amount });
      customer.balance -= amount;
      await customer.save();
  
      res.status(200).json({ message: 'Repayment recorded successfully', customer });
    } catch (err) {
      console.error('Error in recordRepayment:', err.message);
      res.status(500).json({ error: 'Server error, please try again' });
    }
  };

  const getCreditHistory = async (req, res) => {
    try {
      const { customerId } = req.params;
      const customer = await Customer.findOne({ _id: customerId, shopkeeper: req.user.id });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      const history = await Credit.find({ customer: customerId }).sort({ date: -1 });
  
      res.json({ customer: customer.name, creditHistory: history });
    } catch (err) {
      console.error('Error fetching credit history:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

module.exports = { createCustomer,recordRepayment, getCreditHistory};
