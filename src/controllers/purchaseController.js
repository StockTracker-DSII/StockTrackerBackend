const { Purchase, Purchase_detail, Product } = require('../../models');

/*
exports.bulkPurchase = async (req, res) => {
  const { items } = req.body;
  // items: [{ product_id: '123', quantity: 10 }, ...]

  const t = await Purchase.sequelize.transaction();
  try {
    // Crear registro de compra
    const purchase = await Purchase.create({ date: new Date() }, { transaction: t });

    for (const item of items) {
      const { product_id, quantity } = item;

      // Verificar si el producto existe
      const product = await Product.findByPk(product_id, { transaction: t });
      if (!product) throw new Error(`Producto no encontrado: ${product_id}`);

      // Aumentar stock
      product.stock += quantity;
      await product.save({ transaction: t });

      // Crear detalle de compra
      await Purchase_detail.create({
        purchase_id: purchase.purchase_id,
        product_id,
        quantity
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Compra realizada con éxito', purchase_id: purchase.purchase_id });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la compra' });
  }
};
*/