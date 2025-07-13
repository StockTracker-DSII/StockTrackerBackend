const { Sale, SaleDetail, Product } = require('../../models');

exports.newSale = async (req, res) => {
  try {
    console.log('🟦 BODY recibido:', req.body); // 👈 Verifica el body

    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      console.log('❌ Productos inválidos o vacíos');
      return res.status(400).json({ error: 'Lista de productos inválida o vacía.' });
    }

    const fechaActual = new Date();

    const nuevaVenta = await Sale.create({
      date: fechaActual,
      total_value: 0.0
    });

    let total = 0.0;

    for (const item of productos) {
      const { product_id, quantity } = item;
      console.log('🔍 Buscando producto con ID:', product_id, 'Cantidad:', quantity);

      const producto = await Product.findByPk(product_id);

      if (!producto) {
        console.log('❌ Producto no encontrado:', product_id);
        return res.status(404).json({ error: `Producto con ID ${product_id} no encontrado.` });
      }

      console.log('✅ Producto encontrado:', producto.toJSON());

      if (producto.stock < quantity) {
        console.log('❌ Stock insuficiente:', {
          product_id: producto.product_id,
          stock: producto.stock,
          solicitado: quantity
        });
        return res.status(400).json({ error: `Stock insuficiente para el producto con ID ${product_id}.` });
      }

      const valorUnitario = producto.sale_price;
      const valorTotal = valorUnitario * quantity;
      const newSaleID = nuevaVenta.sale_id;

      await SaleDetail.create({
        sale_id: newSaleID,
        product_id,
        quantity,
        value_individual: valorUnitario,
        value_quantity: valorTotal
      });

      producto.stock -= quantity;
      await producto.save();

      total += valorTotal;
    }

    nuevaVenta.total_value = total;
    await nuevaVenta.save();

    console.log('✅ Venta completada con éxito:', {
      sale_id: nuevaVenta.sale_id,
      total_value: nuevaVenta.total_value
    });

    return res.status(201).json({
      message: 'Venta registrada con éxito.',
      sale_id: nuevaVenta.sale_id,
      total_value: nuevaVenta.total_value
    });

  } catch (error) {
    console.error('❗Error al registrar la venta:', error);
    return res.status(500).json({ error: 'Error al registrar la venta.' });
  }
};
