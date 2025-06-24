const request = require('supertest');
const app = require('../app');

describe('POST /products/create ', () => {
  it('debería crear un nuevo producto con ID autogenerado', async () => {
    const response = await request(app)
      .post('/products/create')
      .send({
        name: 'Laptop HP',
        description: 'Laptop de alto rendimiento',
        sale_price: 250.0,
        bought_price: 180.0,
        category_id: "CAT001" 
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('product_id');
    expect(response.body.name).toBe('Laptop HP');
    expect(response.body.stock).toBe(0);
    expect(response.body.product_id).toMatch(/^PRD\d{5}$/); // Formato PRD00001
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


/*
describe('POST /products/destroy', () => {
  it('debería eliminar un producto por su ID', async () => {
    // TODO: Implementar test para borrado
  });
});
*/

/*
describe('POST /products/available', () => {
  it('debería activa o desactivar un producto por su ID', async () => {
    // TODO: Implementar test para cambiar disponibilidad
  });
});
*/