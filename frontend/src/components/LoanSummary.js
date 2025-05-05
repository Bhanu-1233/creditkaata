import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const LoanSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/loans/summary');
        setSummary(response.data.data);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div>
      <h2>Loan Summary</h2>
      {summary ? (
        <div>
          <p>Total Loaned: {summary.totalLoaned}</p>
          <p>Total Collected: {summary.totalCollected}</p>
          <p>Overdue Amount: {summary.overdueAmount}</p>
          <p>Average Repayment Time: {summary.averageRepaymentTimeInDays} days</p>
        </div>
      ) : (
        <p>Loading summary...</p>
      )}
    </div>
  );
};

export default LoanSummary;
