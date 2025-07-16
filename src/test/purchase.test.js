const request = require('supertest');
const app = require('../app');
const { Purchase, PurchaseDetail, Product, Category, sequelize } = require('../../models');

afterAll(async () => {
  await sequelize.close();
});


describe('POST /purchase/newPurchase', () => {
  beforeEach(async () => {
    await PurchaseDetail.destroy({ where: {} });
    await Purchase.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
  });

  it('debería registrar una nueva compra exitosamente', async () => {
    const category = await Category.create({ name: 'categoria_prueba' });

    const p1 = await Product.create({
      name: 'Mouse',
      bought_price: 10.0,
      sale_price: 20.0,
      category_id: category.category_id
    });

    const p2 = await Product.create({
      name: 'Teclado',
      bought_price: 15.0,
      sale_price: 30.0,
      category_id: category.category_id
    });

    const payload = {
      productos: [
        { product_id: p1.product_id, quantity: 2 },
        { product_id: p2.product_id, quantity: 1 }
      ]
    };

    const response = await request(app)
      .post('/purchase/newPurchase')
      .send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Compra registrada con éxito.');
    expect(response.body).toHaveProperty('purchase_id');
    expect(response.body).toHaveProperty('total_value');
  });

  it('debería retornar 400 si no se envían productos', async () => {
    const response = await request(app)
      .post('/purchase/newPurchase')
      .send({ productos: [] });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Lista de productos inválida o vacía.');
  });

  it('debería retornar 404 si un producto no existe', async () => {
    const response = await request(app)
      .post('/purchase/newPurchase')
      .send({ productos: [{ product_id: 9999, quantity: 1 }] });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Producto con ID 9999 no encontrado.');
  });
});
