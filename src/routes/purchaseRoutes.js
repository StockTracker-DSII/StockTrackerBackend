const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/newPurchase',purchaseController.newPurchase);

module.exports = router;
