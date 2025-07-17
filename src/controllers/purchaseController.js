const { Purchase, PurchaseDetail, Product } = require('../../models');

exports.newPurchase = async (req, res) => {
  try {
    const { productos } = req.body;

    // Validación básica
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Lista de productos inválida o vacía.' });
    }

    const fechaActual = new Date();

    // Crear la compra inicial con total en 0
    const nuevaCompra = await Purchase.create({
      date: fechaActual,
      total_value: 0.0
    });

    let total = 0.0;

    for (const item of productos) {
      const { product_id, quantity } = item;

      // Verificar que el producto exista
      const producto = await Product.findByPk(product_id);
      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${product_id} no encontrado.` });
      }

      const valorUnitario = producto.bought_price;
      const valorTotal = valorUnitario * quantity;
      const newPurchaseID = nuevaCompra.purchase_id

      // Crear el detalle
      // Crear el detalle
      await PurchaseDetail.create({
        purchase_id: newPurchaseID,
        product_id,
        quantity,
        value_individual: valorUnitario,
        value_quantity: valorTotal
      });

      // Actualizar el stock del producto
      producto.stock += quantity;
      await producto.save();

    }

    // Actualizar el valor total en la compra
    nuevaCompra.total_value = total;
    await nuevaCompra.save();

    return res.status(201).json({
      message: 'Compra registrada con éxito.',
      purchase_id: nuevaCompra.purchase_id,
      total_value: nuevaCompra.total_value
    });

  } catch (error) {
    console.error('Error al registrar la compra:', error);
    return res.status(500).json({ error: 'Error al registrar la compra.' });
  }
};
