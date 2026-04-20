const express = require('express');
const { getReportsOverview } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', protect, getReportsOverview);

module.exports = router;