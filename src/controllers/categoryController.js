const { Category } = require('../../models');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validación temprana
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Verifica si ya existe una categoría con ese nombre
    const existingCategoryName = await Category.findOne({
      where: { name }
    });

    if (existingCategoryName) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    // Crea la nueva categoría
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

exports.deleteCategories = async (req, res) => {
  try {
    const { category_id } = req.body;

    const deleted = await Category.destroy({
      where: { category_id }
    });

    if (deleted) {
      return res.status(200).json({ message: 'Categoría eliminada correctamente.' });
    } else {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};
