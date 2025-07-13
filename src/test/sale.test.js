const request = require('supertest');
const app = require('../app');
const { Sale, SaleDetail, Product, Category, sequelize } = require('../../models');

beforeAll(async () => {
  // Crear categoría
  const category = await Category.create({ name: 'categoria_ventas' });

  // Crear productos
  const monitor = await Product.create({
    name: 'Mouse',
    bought_price: 10,
    sale_price: 20,
    stock: 0, // se modificará después
    category_id: category.category_id
  });

  const cpu = await Product.create({
    name: 'Teclado',
    bought_price: 15,
    sale_price: 30,
    stock: 0, // se modificará después
    category_id: category.category_id
  });

  // Activar productos y actualizar el stock
  await Product.update(
    { isActive: true, stock: 10 },
    { where: {} }
  );
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
