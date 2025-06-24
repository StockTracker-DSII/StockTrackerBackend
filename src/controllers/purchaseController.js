const { Purchase, PurchaseDetail, Product } = require('../../models');

exports.newPurchase = async (req, res) => {
  try {
    const { productos } = req.body;

    // Validación básica
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Lista de productos inválida o vacía.' });
    }

    // Generar fecha y ID único
    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().slice(0, 10); // YYYY-MM-DD

    const lastPurchase = await Purchase.findOne({
      order: [['purchase_id', 'DESC']]
    });

    const lastID = lastPurchase?.purchase_id || `${fechaISO}_000000000000`;
    const lastNumber = parseInt(lastID.slice(11));
    const newNumber = lastNumber + 1;
    const newPurchaseID = `${fechaISO}_${newNumber.toString().padStart(12, '0')}`;

    // Crear la compra inicial con total en 0
    const nuevaCompra = await Purchase.create({
      purchase_id: newPurchaseID,
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

      // Generar ID para purchase_detail
      const lastDetail = await PurchaseDetail.findOne({
        order: [['purchase_detail_id', 'DESC']]
      });

      const lastDetailID = lastDetail?.purchase_detail_id || '000000000000';
      const detailNumber = parseInt(lastDetailID) + 1;
      const newDetailID = detailNumber.toString().padStart(12, '0');

      // Crear el detalle
      await PurchaseDetail.create({
        purchase_detail_id: newDetailID,
        purchase_id: newPurchaseID,
        product_id,
        quantity,
        value_individual: valorUnitario,
        value_quantity: valorTotal
      });

      // Sumar al total de la compra
      total += valorTotal;
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
