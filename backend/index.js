const express = require('express');
const registerRoutes = require('./routes/register'); // Import auth routes  // Import the register route
const router = express.Router();const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');  // If you use CORS
const customerRoutes = require('./routes/customer');
const loanRoutes = require('./routes/loan');
const app = express();

// Middlewares
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only React app to make requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Import Routes
const authRoutes = require('./routes/authRoutes');

// Route Middlewares
app.use('/api', authRoutes);
// Start server
const mongoUrl = process.env.MONGO_URI;

mongoose.connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

  app.use('/api/customers', customerRoutes);

  app.use('/api', registerRoutes);

  app.use('/api/loans', loanRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
      errorDetails: err.message
    });
  });
  

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


