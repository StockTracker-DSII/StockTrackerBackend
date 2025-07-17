const request = require('supertest');
const app = require('../app');
const { Sale, SaleDetail, Product, Category, sequelize } = require('../../models');


afterAll(async () => {
  await sequelize.close();
});

describe('POST /sale/newSale', () => {
  it('debería registrar una nueva venta exitosamente', async () => {

    const category = await request(app).post('/categories').send({ name: 'categoria_ventas' });

  // Crear productos
  await request(app).post('/products/create').send({
    name: 'Mouse',
    bought_price: 10,
    sale_price: 20,
    category_id: category.category_id
  });
  await request(app).post('/products/create').send({
    name: 'Teclado',
    bought_price: 15,
    sale_price: 30,
    category_id: category.category_id
  });

  const productosResponse = await request(app).get('/products');
  const productos = productosResponse.body; // <- Aquí está el array real

  console.log(productos)

    const payload = {
      productos: [
        { product_id: productos[0].product_id, quantity: 2 }
      ]
    };

    const a = await request(app)
      .post('/purchase/newPurchase')
      .send(payload);

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

  /*
  it('debería fallar si no hay suficiente stock', async () => {


    const response = await request(app)
      .post('/sale/newSale')
      .send({ productos: [{ product_id: 610, quantity: 999 }] });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Stock insuficiente/);
  });*/
});
