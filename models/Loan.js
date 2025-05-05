const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repaymentSchema = new Schema({
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

const loanSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  description: { type: String },
  repaymentHistory: [{ amount: Number, description: String, date: Date }],
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'overdue'] }
});

// Pre-save hook to handle status changes and balance updates
loanSchema.pre('save', function (next) {
  const now = new Date();

  // If loan due date is passed and not paid, update the status to 'overdue'
  if (this.status !== 'paid' && this.dueDate < now) {
    this.status = 'overdue';
  }

  // Ensure balance cannot go below 0
  if (this.balance <= 0) {
    this.balance = 0;
    this.status = 'paid';
  }

  next();
});

module.exports = mongoose.model('Loan', loanSchema);
