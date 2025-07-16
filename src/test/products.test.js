const request = require('supertest');
const app = require('../app');
const { sequelize, Category, Product } = require('../../models');

afterAll(async () => {
  await sequelize.close();
});


describe('POST /products/create', () => {
  it('debería crear un nuevo producto con ID autogenerado', async () => {
    const catRes = await request(app).post('/categories/create').send({ name: 'Electronica' });
    const categoryId = catRes.body.category_id;

    const res = await request(app)
      .post('/products/create')
      .send({
        name: 'Laptop HP',
        description: 'Laptop de alto rendimiento',
        sale_price: 250.0,
        bought_price: 180.0,
        category_id: categoryId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('product_id');
    expect(res.body.name).toBe('Laptop HP');
    expect(res.body.stock).toBe(0);
  });
});

describe('GET /products', () => {
  it('debería devolver todos los productos con sus categorías', async () => {

    const a = await request(app).get('/categories');
    const categoryId = a.body[0].category_id;

    await request(app)
      .post('/products/create')
      .send({
        name: 'Test Prod',
        description: 'Desc',
        sale_price: 100,
        bought_price: 90,
        category_id: categoryId
      });

    const response = await request(app).get('/products');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach(product => {
      expect(product).toHaveProperty('product_id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('category_id');
      expect(product).toHaveProperty('category');
      expect(typeof product.category).toBe('object');
    });
  });

  it('debería filtrar productos por category_id cuando se especifica', async () => {

    const a = await request(app).get('/categories');
    const categoryId = a.body[0].category_id;

    await request(app)
      .post('/products/create')
      .send({
        name: 'Test Prod',
        description: 'Desc',
        sale_price: 100,
        bought_price: 90,
        category_id: categoryId
      });

    const allProducts = await request(app).get('/products');
    const filteredResponse = await request(app)
      .get('/products')
      .query({ category_id: categoryId });

    expect(filteredResponse.statusCode).toBe(200);
    filteredResponse.body.forEach(product => {
      expect(product.category_id).toBe(categoryId);
    });

    expect(filteredResponse.body.length).toBeLessThanOrEqual(allProducts.body.length);
  });
});

describe('POST /products/available', () => {
  test('Debe activar un producto inactivo', async () => {

    const a = await request(app).get('/categories');
    const categoryId = a.body[0].category_id;

    const resProd = await request(app)
      .post('/products/create')
      .send({
        name: 'Producto Test Act/Desact',
        description: 'Producto para test',
        sale_price: 10000,
        bought_price: 5000,
        category_id: categoryId
      });

    const producto = resProd.body;

    const res = await request(app)
      .post('/products/available')
      .send({ product_id: producto.product_id });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/activado/i);
    expect(res.body.producto.isActive).toBe(true);
  });

  test('Debe desactivar un producto activo', async () => {

    const a = await request(app).get('/categories');
    const categoryId = a.body[0].category_id;

    const resProd = await request(app)
      .post('/products/create')
      .send({
        name: 'Producto Test Act/Desact',
        description: 'Producto para test',
        sale_price: 10000,
        bought_price: 5000,
        category_id: categoryId
      });

    const producto = resProd.body;

    await request(app).post('/products/available').send({ product_id: producto.product_id }); // Activar
    const res = await request(app).post('/products/available').send({ product_id: producto.product_id }); // Desactivar

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/desactivado/i);
    expect(res.body.producto.isActive).toBe(false);
  });
});

describe('POST /products/destroy', () => {
  test('Debe eliminar un producto', async () => {

    const a = await request(app).get('/categories');
    const categoryId = a.body[0].category_id;

    const resProd = await request(app)
      .post('/products/create')
      .send({
        name: 'Producto Test Eliminar',
        description: 'Producto para test de eliminacion',
        sale_price: 3000,
        bought_price: 5000,
        category_id: categoryId
      });

    const producto = resProd.body;

    const res = await request(app)
      .post('/products/destroy')
      .send({ product_id: producto.product_id });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  test('Verificar la eliminacion del producto', async () => {

    const a = await request(app).get('/categories');
    const categoryId = a.body[0].category_id;

    const resProd = await request(app)
      .post('/products/create')
      .send({
        name: 'Producto Test Eliminar',
        description: 'Producto para test de eliminacion',
        sale_price: 3000,
        bought_price: 5000,
        category_id: categoryId
      });

    const producto = resProd.body;

    await request(app)
      .post('/products/destroy')
      .send({ product_id: producto.product_id });

    const res = await request(app).get(`/products/${producto.product_id}`);
    expect(res.statusCode).toBe(404);
  });
});
