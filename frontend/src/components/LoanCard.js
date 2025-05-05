import React from 'react';
import './Card.css';

const LoanCard = ({ loan, onRepay }) => {
  return (
    <div className="card loan-card">
      <h4>Amount: ₹{loan.amount}</h4>
      <p>Balance: ₹{loan.balance}</p>
      <p>Status: <strong>{loan.status}</strong></p>
      <p>Due Date: {new Date(loan.dueDate).toLocaleDateString()}</p>
      <button onClick={() => onRepay(loan._id)}>Repay</button>
    </div>
  );
};

export default LoanCard;
