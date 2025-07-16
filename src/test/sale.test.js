const request = require('supertest');
const app = require('../app');
const { Sale, SaleDetail, Product, Category, sequelize } = require('../../models');

afterAll(async () => {
  await sequelize.close();
});

describe('POST /sale/newSale', () => {
  it('debería registrar una nueva venta exitosamente', async () => {
    const category = await Category.create({ name: 'categoria_ventas' });

    const p1 = await Product.create({
      name: 'Mouse',
      bought_price: 10,
      sale_price: 20,
      stock: 10,
      isActive: true,
      category_id: category.category_id
    });

    const p2 = await Product.create({
      name: 'Teclado',
      bought_price: 15,
      sale_price: 30,
      stock: 10,
      isActive: true,
      category_id: category.category_id
    });

    const payload = {
      productos: [
        { product_id: p1.product_id, quantity: 2 },
        { product_id: p2.product_id, quantity: 1 }
      ]
    };

    const response = await request(app)
      .post('/sale/newSale')
      .send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Venta registrada con éxito.');
    expect(response.body).toHaveProperty('sale_id');
    expect(response.body).toHaveProperty('total_value');
  });

  it('debería fallar si no hay productos', async () => {
    const response = await request(app)
      .post('/sale/newSale')
      .send({ productos: [] });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Lista de productos inválida o vacía.');
  });

  it('debería fallar si no hay suficiente stock', async () => {
    const category = await Category.create({ name: 'categoria_stock_bajo' });

    const p = await Product.create({
      name: 'Teclado',
      bought_price: 15,
      sale_price: 30,
      stock: 1,
      isActive: true,
      category_id: category.category_id
    });

    const response = await request(app)
      .post('/sale/newSale')
      .send({ productos: [{ product_id: p.product_id, quantity: 999 }] });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Stock insuficiente/);
  });
});
