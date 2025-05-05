import React from 'react';
import './Card.css';

const CustomerCard = ({ customer, onViewLoans }) => {
  return (
    <div className="card">
      <h3>{customer.name}</h3>
      <p>Phone: {customer.phone}</p>
      <button onClick={() => onViewLoans(customer._id)}>View Loans</button>
    </div>
  );
};

export default CustomerCard;
