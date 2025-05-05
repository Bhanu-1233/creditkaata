import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>
        <input type="text" placeholder="Name"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, name: e.target.value })}
          required />
        <input type="email" placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, email: e.target.value })}
          required />
        <input type="password" placeholder="Password"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, password: e.target.value })}
          required />
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
