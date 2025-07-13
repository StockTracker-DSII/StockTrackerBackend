const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../../models');

beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
});


describe('🧪 Auth API', () => {
  const baseUrl = '/api/auth';
  const testUser = {
    user_id: 'juan123',
    name: 'Juan Esteban',
    email: 'juan@example.com',
    password: 'supersegura',
    is_admin: false
  };

  describe('📌 POST /register', () => {
    it('debería registrar un usuario y devolver token', async () => {
      const res = await request(app)
        .post(`${baseUrl}/register`)
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        email: testUser.email,
        name: testUser.name,
        is_admin: false
      });
    });

    it('debería rechazar un registro con email duplicado', async () => {
      // Primer registro
      await request(app)
        .post(`${baseUrl}/register`)
        .send(testUser)
        .expect(201);
        
      // Segundo intento con mismo email
      const res = await request(app)
        .post(`${baseUrl}/register`)
        .send({ ...testUser, user_id: 'otro_id' }) // distinto user_id, mismo email
        .expect(409);

      expect(res.body.message).toMatch(/correo ya está en uso/i);
    });

    it('debería fallar si faltan campos', async () => {
      const res = await request(app)
        .post(`${baseUrl}/register`)
        .send({ email: 'falta@todo.com' }) // faltan campos
        .expect(400);

      expect(res.body.message).toMatch(/faltan campos/i);
    });
  });

  describe('📌 POST /login', () => {
    beforeEach(async () => {
      // Asegúrate de que el usuario exista antes de testear login
      await request(app)
        .post(`${baseUrl}/register`)
        .send(testUser)
        .expect(201);
    });

    it('debería loguear correctamente con credenciales válidas', async () => {
        
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body).toHaveProperty('token');      
    });

    it('debería rechazar login con contraseña incorrecta', async () => {
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: testUser.email,
          password: 'contrasena_mala'
        })
        .expect(401);

      expect(res.body.message).toMatch(/credenciales inválidas/i);
    });

    it('debería rechazar login con email que no existe', async () => {
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: 'noexiste@correo.com',
          password: 'irrelevante'
        })
        .expect(401);

      expect(res.body.message).toMatch(/credenciales inválidas/i);
    });
  });
});
