import React, { useState } from 'react';
import api from '../api/axios';

const RepaymentForm = ({ loanId }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/loans/${loanId}/repay`, { amount, description });
      alert('Repayment recorded successfully');
    } catch (err) {
      alert('Error making repayment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Make a Repayment</h3>
      <label>Amount</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <button type="submit">Submit Repayment</button>
    </form>
  );
};

export default RepaymentForm;
