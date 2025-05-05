import React, { useState } from 'react';
import api from '../api/axios';

const LoanForm = () => {
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/loans', {
        customerId,
        amount,
        dueDate,
        description,
      });
      alert('Loan created successfully');
    } catch (err) {
      setError('Error creating loan');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Loan</h2>
      {error && <div>{error}</div>}
      <label>Customer ID</label>
      <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
      <label>Amount</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <label>Due Date</label>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <button type="submit">Create Loan</button>
    </form>
  );
};

export default LoanForm;
