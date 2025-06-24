const request = require('supertest');
const app = require('../app');


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
      .delete(`/categories/${testId}`)
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
