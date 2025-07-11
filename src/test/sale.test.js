const request = require('supertest');
const app = require('../app');
const { Sale, SaleDetail, Product, Category, sequelize } = require('../../models');

beforeAll(async () => {
  const category = await Category.create({ name: 'categoria_ventas' });

  await Product.create({
    name: 'Monitor',
    bought_price: 50.0,
    sale_price: 100.0,
    stock: 10,
    category_id: category.category_id
  });

  await Product.create({
    name: 'CPU',
    bought_price: 200.0,
    sale_price: 350.0,
    stock: 5,
    category_id: category.category_id
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /sale/newSale', () => {
  it('debería registrar una nueva venta exitosamente', async () => {
    const productos = await Product.findAll();

    const payload = {
      productos: [
        { product_id: productos[0].product_id, quantity: 2 },
        { product_id: productos[1].product_id, quantity: 1 }
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
    const productos = await Product.findAll();

    const response = await request(app)
      .post('/sale/newSale')
      .send({ productos: [{ product_id: productos[1].product_id, quantity: 999 }] });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Stock insuficiente/);
  });
});
