const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCreditHistory } = require('../controllers/customerController');

router.get('/:customerId/history', protect, getCreditHistory);

module.exports = router;
