const request = require('supertest');
const app = require('../app'); // tu instancia de Express
const { sequelize, Product, Purchase, PurchaseDetail } = require('../../models');



describe('Report Controller - getTopSellingProducts', () => {

  afterAll(async () => {
    await sequelize.close();
  });

  it('debería devolver los productos más vendidos con status 200', async () => {

    // Crea productos
    const productA = await Product.create({
      name: 'Producto A',
      description: 'Desc A',
      sale_price: 100,
      bought_price: 50,
      stock: 10,
      isActive: true
    });

    const productB = await Product.create({
      name: 'Producto B',
      description: 'Desc B',
      sale_price: 150,
      bought_price: 70,
      stock: 20,
      isActive: true
    });

    // Crea una compra
    const purchase = await Purchase.create({
      date: new Date(),
      total_value: 500
    });

    // Agrega detalles de compra
    await PurchaseDetail.create({
      purchase_id: purchase.purchase_id,
      product_id: productA.product_id,
      quantity: 3,
      value_individual: 100,
      value_quantity: 300
    });

    await PurchaseDetail.create({
      purchase_id: purchase.purchase_id,
      product_id: productB.product_id,
      quantity: 2,
      value_individual: 150,
      value_quantity: 300
    });

    const res = await request(app).get('/reports/top-selling');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('product_id');
    expect(res.body[0]).toHaveProperty('total_sold');
  });

});
