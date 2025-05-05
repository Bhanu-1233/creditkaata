const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const { differenceInDays, isAfter } = require('date-fns');

// Create loan
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerId, amount, dueDate, description } = req.body;

    const errors = [];
    if (!customerId) errors.push({ field: "customerId", message: "Customer ID is required." });
    if (!amount || amount <= 0) errors.push({ field: "amount", message: "Amount must be a positive number." });
    if (!dueDate || isNaN(new Date(dueDate))) errors.push({ field: "dueDate", message: "Due date must be a valid date." });

    if (errors.length > 0) {
      return res.status(400).json({ status: "error", message: "Validation error", errors });
    }

    const customer = await Customer.findOne({ _id: customerId, user: req.user.userId });
    if (!customer) {
      return res.status(404).json({ status: "error", message: "Customer not found or not owned by you." });
    }

    const loan = new Loan({
      user: req.user.userId,
      customer: customerId,
      amount,
      balance: amount,
      dueDate,
      description,
      repaymentHistory: []
    });

    await loan.save();
    res.status(201).json({ status: "success", message: "Loan created successfully", data: { loan } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error", errorDetails: error.message });
  }
});


// Get loans by user with optional status
router.get('/user/:userId/loans', authenticateToken, async (req, res) => {
  const { status } = req.query;
  try {
    const loans = await Loan.find({
      user: req.user.userId,
      ...(status && { status })
    });
    res.status(200).json({ status: 'success', data: loans });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching loans', error: error.message });
  }
});

// Get all/enriched loans
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const loans = await Loan.find({ user: req.user.userId }).populate('customer');

    const enrichedLoans = loans.map(loan => {
      const loanObj = loan.toObject();
      const isOverdue = isAfter(new Date(), new Date(loan.dueDate)) && loan.status !== 'paid';
      loanObj.status = isOverdue ? 'overdue' : loan.status;
      return loanObj;
    });

    const filtered = status ? enrichedLoans.filter(l => l.status === status) : enrichedLoans;

    res.status(200).json({ status: 'success', data: filtered });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching loans', error: error.message });
  }
});

// ✅ Repay a loan (fixed user and path issues)
// ✅ Repay a loan (fixed user and path issues)
router.post('/:loanId/repay', authenticateToken, async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Amount must be greater than zero.' });
    }
    console.log('Looking for loan with:', loanId, 'and user:', req.user.userId);

    // Ensure we are matching the correct loan with the authenticated user
    const loan = await Loan.findOne({ _id: loanId, user: req.user.userId });

    if (!loan) {
      return res.status(404).json({ status: 'error', message: 'Loan not found or not owned by you.' });
    }

    loan.repaymentHistory.push({ amount, description: description || '', date: new Date() });

    const totalPaid = loan.repaymentHistory.reduce((sum, rep) => sum + rep.amount, 0);
    loan.balance = loan.amount - totalPaid;

    if (loan.balance <= 0) {
      loan.balance = 0;
      loan.status = 'paid';
    } else if (isAfter(new Date(), new Date(loan.dueDate))) {
      loan.status = 'overdue';
    }

    await loan.save();
    res.status(200).json({ status: 'success', message: 'Repayment recorded successfully.', data: loan });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error recording repayment', error: error.message });
  }
});

// Loan summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.userId });
    const now = new Date();

    let totalLoaned = 0, totalCollected = 0, overdueAmount = 0;
    let repaymentDurations = [];

    loans.forEach(loan => {
      totalLoaned += loan.amount;
      const collected = loan.amount - loan.balance;
      totalCollected += collected;

      if (loan.status !== 'paid' && isAfter(now, loan.dueDate)) {
        overdueAmount += loan.balance;
      }

      if (loan.repaymentHistory.length > 0) {
        const days = differenceInDays(
          new Date(loan.repaymentHistory[loan.repaymentHistory.length - 1].date),
          new Date(loan.createdAt)
        );
        if (!isNaN(days)) repaymentDurations.push(days);
      }
    });

    const avgRepaymentTime = repaymentDurations.length > 0
      ? (repaymentDurations.reduce((a, b) => a + b, 0) / repaymentDurations.length).toFixed(2)
      : null;

    res.status(200).json({
      status: 'success',
      data: {
        totalLoaned,
        totalCollected,
        overdueAmount,
        averageRepaymentTimeInDays: avgRepaymentTime
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error generating summary', error: error.message });
  }
});

// Overdue loans
router.get('/overdue', authenticateToken, async (req, res) => {
  try {
    const overdueLoans = await Loan.find({
      user: req.user.userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'paid' }
    }).populate('customer');

    const customersWithOverdueLoans = overdueLoans.map(loan => ({
      customerId: loan.customer._id,
      customerName: loan.customer.name,
      phone: loan.customer.phone,
      loanId: loan._id,
      dueDate: loan.dueDate,
      amount: loan.amount,
      balance: loan.balance
    }));

    res.status(200).json({ status: 'success', data: customersWithOverdueLoans });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching overdue loans', error: error.message });
  }
});

module.exports = router;
