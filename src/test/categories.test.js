const request = require('supertest');
const app = require('../app'); 

describe('GET /categories', () => {
  it('debería devolver un array con las categorías existentes', async () => {
    const response = await request(app).get('/categories');

    expect(response.statusCode).toBe(200);                     
    expect(Array.isArray(response.body)).toBe(true);       
    expect(response.body.length).toBeGreaterThan(0);          

 
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('category_id');
  });
});
