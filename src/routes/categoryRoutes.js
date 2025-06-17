const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// POST /categories → crear categoría
router.post('/create', categoryController.createCategory);
router.post('/destroy', categoryController.deleteCategories);
// GET /categories → obtener todas las categorías
router.get('/', categoryController.getAllCategories);

module.exports = router;
