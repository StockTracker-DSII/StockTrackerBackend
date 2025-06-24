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
        category_id: "CAT001"
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


/*
describe('GET /products', () => {
  it('debería devolver la lista de todos los productos', async () => {
    // TODO: Implementar test para obtener productos
  });
});
*/

/*
describe('POST /products/destroy', () => {
  it('debería eliminar un producto por su ID', async () => {
    // TODO: Implementar test para borrado
  });
});
*/

