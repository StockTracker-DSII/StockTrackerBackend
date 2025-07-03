const request = require('supertest');
const app = require('../app');
const { sequelize, Category } = require('../../models'); // 👈 Aquí está la solución

afterAll(async () => {
  await sequelize.close();
});

describe('POST /products/create ', () => {
  it('debería crear un nuevo producto con ID autogenerado', async () => {
    const response = await request(app)
      .post('/products/create')
      .send({
        name: 'Laptop HP',
        description: 'Laptop de alto rendimiento',
        sale_price: 250.0,
        bought_price: 180.0,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('product_id');
    expect(response.body.name).toBe('Laptop HP');
    expect(response.body.stock).toBe(0);
  });
});

describe('GET /products', () => {

  it('debería devolver todos los productos con sus categorías', async () => {
    const response = await request(app).get('/products');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Verificar que cada producto tenga la estructura esperada
    response.body.forEach(product => {
      expect(product).toHaveProperty('product_id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('category_id');
      expect(product).toHaveProperty('category'); // Por el include
      expect(typeof product.category).toBe('object');
    });
  });

  it('debería filtrar productos por category_id cuando se especifica', async () => {
    // 1. Primero obtenemos alguna category_id existente
    const allProducts = await request(app).get('/products');
    const testCategoryId = allProducts.body[0]?.category_id;
    
    if (testCategoryId) {
      // 2. Hacemos la petición filtrada
      const filteredResponse = await request(app)
        .get('/products')
        .query({ category_id: testCategoryId });
      
      expect(filteredResponse.statusCode).toBe(200);
      
      // 3. Verificamos que todos los productos sean de esa categoría
      filteredResponse.body.forEach(product => {
        expect(product.category_id).toBe(testCategoryId);
      });
      
      // 4. Verificamos que la cantidad sea menor o igual que sin filtro
      expect(filteredResponse.body.length).toBeLessThanOrEqual(allProducts.body.length);
    }
  });
});

describe('POST /products/available', () => {
  let productoCreado;

  beforeAll(async () => {
    const res = await request(app)
      .post('/products/create')
      .send({
        name: 'Producto Test Act/Desact',
        description: 'Producto para test de activación y desactivación',
        sale_price: 10000,
        bought_price: 5000,
      });

    productoCreado = res.body;
  });

  test('Debe activar un producto inactivo', async () => {
    const res = await request(app)
      .post('/products/available')
      .send({ product_id: productoCreado.product_id });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/activado/i);
    expect(res.body.producto.isActive).toBe(true);
  });
  
  test('Debe desactivar un producto activo', async () => {
    const res = await request(app)
      .post('/products/available')
      .send({ product_id: productoCreado.product_id });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/desactivado/i);
    expect(res.body.producto.isActive).toBe(false);
  });
  
});

describe('POST /products/destroy', () => {
  let productoCreado;

  beforeAll(async () => {
    const res = await request(app)
      .post('/products/create')
      .send({
        name: 'Producto Test Eliminar',
        description: 'Producto para test de eliminacion',
        sale_price: 3000,
        bought_price: 5000,
      });

    productoCreado = res.body;
  });

  test('Debe eliminar un producto', async () => {
    const res = await request(app)
      .post('/products/destroy')
      .send({ product_id: productoCreado.product_id });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  test('Verificar la eliminacion del producto', async () => {
    const res = await request(app)
      .get(`/products/${productoCreado.product_id}`);

    expect(res.statusCode).toBe(404);
  });

});


