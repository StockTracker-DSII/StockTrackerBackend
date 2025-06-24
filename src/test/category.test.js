const request = require('supertest');
const app = require('../app');
const { sequelize, Category } = require('../../models');

beforeAll(async () => {
  // Solo sincronizamos Category
  await Category.sync({ force: true });

  // Creamos una categoría inicial con ID para evitar el error en slice()
  await Category.create({
    category_id: 'CAT001',
    name: 'Inicial'
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Test de la API crear Categoría', () => {
  it('Debe crear una nueva categoría correctamente', async () => {
    const res = await request(app)
      .post('/categories/create')
      .send({ name: 'Tecnología' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('category_id');
    expect(res.body.name).toBe('Tecnología');
  });

  it('Debe rechazar la creación de una categoría duplicada', async () => {
    const res = await request(app)
      .post('/categories/create')
      .send({ name: 'Tecnología' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('Ya existe una categoría con ese nombre');
  });

  it('Debe retornar error 500 si no se envía el nombre', async () => {
    const res = await request(app)
      .post('/categories/create')
      .send({});

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Error al crear la categoría');
  });
});
