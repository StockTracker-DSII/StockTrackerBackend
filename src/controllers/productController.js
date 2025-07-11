const { where } = require('sequelize');
const { Product, Category } = require('../../models');

exports.getAllProducts = async (req, res) => {
  try {
    const { category_id } = req.query;

    const filter = category_id ? { where: { category_id } } : {};

    const products = await Product.findAll({
      ...filter,
      include: 'category',
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, sale_price, bought_price, category_id } = req.body;

    const product = await Product.create({
      name,
      description,
      sale_price,
      bought_price,
      category_id,
      stock: 0 // siempre en 0 al crear
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

/*
exports.addStock = async (req, res) => {
  try {
    const { product_id, stock} = req.body;

    const newStock
  } catch (error) {
    console.error(error);
      res.status(500).json({ error: 'Error al añadir productos' });
  }
}
*/  

exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const deleted = await Product.destroy({
        where: {product_id}
    })

    if (deleted) {
      return res.status(200).json({ message: 'Producto eliminado correctamente'})
    } else{
      return res.status(404).json({ message: ' Producto no encontrado'})
    }
  } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
      }
}

exports.ActiveDeactivate = async (req, res) => {

  try {
    
    const { product_id } = req.body;

    const producto = await Product.findByPk(product_id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    producto.isActive = !producto.isActive;

    await producto.save();

    res.status(200).json({
      message: `Producto ${producto.isActive ? 'activado' : 'desactivado'} correctamente`,
      producto
    });
    
  } catch (error) {
    console.error('Error al cambiar el estado del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
  
}
