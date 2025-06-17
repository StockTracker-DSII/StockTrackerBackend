const { where } = require('sequelize');
const { Category } = require('../../models');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

      // Traemos el Id de mayor valor
    const lastCategory = await Category.findOne({
      order: [['category_id', 'DESC']]
    });

      // Obtenemos el Id de la categoria
    const lastId = lastCategory?.category_id;
      // Separa la parte numerica del ID
    const numericPart = lastId.slice(3); 
      // Ahora puedes convertir a número y sumar:
    const newNumber = parseInt(numericPart) + 1;
      // Formatear con ceros a la izquierda:
    const newId = `CAT${newNumber.toString().padStart(3, '0')}`;

    // Verifica si ya exitste una categoria con ese nombre
    const existingCategoryName = await Category.findOne({
      where: { name }
    });
    if (existingCategoryName) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    const newCategory = await Category.create({
      category_id: newId,
      name
    });

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
            where: {category_id}
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