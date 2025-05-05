import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get('/loans');
        setLoans(response.data.data);
      } catch (err) {
        setError('Error fetching loans');
      }
    };
    fetchLoans();
  }, []);

  return (
    <div>
      <h2>Your Loans</h2>
      {error && <div>{error}</div>}
      <ul>
        {loans.map(loan => (
          <li key={loan._id}>
            <p>Loan Amount: {loan.amount}</p>
            <p>Status: {loan.status}</p>
            <p>Balance: {loan.balance}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanList;
