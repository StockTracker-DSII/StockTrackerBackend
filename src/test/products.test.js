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
