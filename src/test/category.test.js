const request = require('supertest');
const app = require('../app');
const { sequelize, Category } = require('../../models');

afterAll(async () => {
  await sequelize.close();
});

describe('Test de la API crear Categoría', () => {
  /*beforeAll(async () => {
    await Category.destroy({ where: { name: 'Tecnología' } });
  });
*/
  afterAll(async () => {
    await Category.destroy({ where: { name: 'Tecnología' } });
  });

  it('Debe crear una nueva categoría correctamente', async () => {
    const res = await request(app)
      .post('/categories')
      .send({ name: 'Tecnología' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('category_id');
    expect(res.body.name).toBe('Tecnología');
  });

  it('Debe rechazar la creación de una categoría duplicada', async () => {
    const res = await request(app)
      .post('/categories')
      .send({ name: 'Tecnología' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('Ya existe una categoría con ese nombre');
  });

  it('Debe retornar error 500 si no se envía el nombre', async () => {
    const res = await request(app)
      .post('/categories')
      .send({});

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Error al crear la categoría');
  });
});

describe('GET /categories', () => {
  const categoryName = 'Prueba GET';

  beforeAll(async () => {
    // Borrar por si ya existe
    await Category.destroy({ where: { name: categoryName } });

    // Crear explícitamente
    const res = await request(app)
      .post('/categories')
      .send({ name: categoryName });

    expect(res.statusCode).toBe(201); // Asegura que se creó correctamente
  });

  it('debería devolver un array con las categorías existentes', async () => {
    const response = await request(app).get('/categories');

    expect(response.statusCode).toBe(200);                     
    expect(Array.isArray(response.body)).toBe(true);       
    expect(response.body.length).toBeGreaterThan(0);          

    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('category_id');
  });
});



describe('DELETE /categories/:id', () => {
  let testId;
  beforeAll(async () => {
    const uniqueName = 'ToDelete_' + Date.now();

    const res = await request(app)
      .post('/categories')
      .send({ name: uniqueName });

    testId = res.body.category_id;

  });

  it('should delete an existing category and return 200', async () => {
    const res = await request(app)
      .delete(`/categories/`)
      .send({ category_id: testId });

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should return 404 when deleting a non-existent category', async () => {
    const res = await request(app)
      .delete('/categories/fake-id')
      .send({ category_id: 'fake-id' });

    expect([404, 400]).toContain(res.statusCode);
  });
});
