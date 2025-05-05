import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/customers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Customers</h2>
        <ul>
          {customers.map(c => (
            <li key={c._id} className="mb-2 p-2 border rounded bg-white shadow-sm">
              <strong>{c.name}</strong> - {c.phone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Customers;
