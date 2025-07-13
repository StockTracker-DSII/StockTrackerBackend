const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /reports/top-selling
router.get('/top-selling', reportController.getTopSellingProducts);

module.exports = router;
