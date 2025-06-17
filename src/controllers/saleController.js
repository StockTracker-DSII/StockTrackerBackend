const { Sale, Sale_detail, Product } = require('../../models');
/*
exports.bulkSale = async (req, res) => {
  const { items } = req.body;
  // items: [{ product_id: '123', quantity: 5 }, ...]

  const t = await Sale.sequelize.transaction();
  try {
    // Crear registro de venta
    const sale = await Sale.create({}, { transaction: t });

    for (const item of items) {
      const { product_id, quantity } = item;

      // Verificar si el producto existe
      const product = await Product.findByPk(product_id, { transaction: t });
      if (!product) throw new Error(`Producto no encontrado: ${product_id}`);

      // Verificar stock suficiente
      if (product.stock < quantity) throw new Error(`Stock insuficiente para el producto ${product_id}`);

      // Disminuir stock
      product.stock -= quantity;
      await product.save({ transaction: t });

      // Crear detalle de venta
      await Sale_detail.create({
        sale_id: sale.sale_id,
        product_id,
        quantity
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Venta realizada con éxito', sale_id: sale.sale_id });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la venta' });
  }
};
*/