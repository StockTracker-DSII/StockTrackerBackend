const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// POST /categories → crear categoría
router.post('/', categoryController.createCategory); // POST /categories
router.delete('/', categoryController.deleteCategories); // DELETE /categories/:id
router.get('/', categoryController.getAllCategories); // GET /categories

module.exports = router;
