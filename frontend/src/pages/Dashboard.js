import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to CrediKhaata</h1>
        <p className="text-gray-700">Manage your credit, customers, and loans easily.</p>
      </div>
    </div>
  );
};

export default Dashboard;
