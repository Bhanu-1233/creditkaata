import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <span>CrediKhaata</span>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/loans">Loans</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Navbar;
