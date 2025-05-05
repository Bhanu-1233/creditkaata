import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          return;
        }

        const res = await axios.get('/loans', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLoans(res.data.data);
      } catch (err) {
        console.error('Failed to fetch loans:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch loans');
      }
    };

    fetchLoans();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Loans</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        <table className="w-full border bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Customer</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="text-center border-t">
                <td className="p-2">{loan.customer?.name || 'N/A'}</td>
                <td>{loan.amount}</td>
                <td>{loan.balance}</td>
                <td className={`text-${loan.status === 'paid' ? 'green' : loan.status === 'overdue' ? 'red' : 'yellow'}-500`}>
                  {loan.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loans;
