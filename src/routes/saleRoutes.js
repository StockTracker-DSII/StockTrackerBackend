const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/newSale', saleController.newSale);

module.exports = router;
