const request = require('supertest');
const app = require('../app'); // Asegúrate que exporte la instancia de Express
const { Purchase, PurchaseDetail, Product, Category, sequelize } = require('../../models');

beforeAll(async () => {
  // Sincronizar modelos si estás usando una DB en memoria (opcional)
  // await sequelize.sync({ force: true });

  // Crear categoría y productos reales
  const category = await Category.create({ name: 'categoria_prueba' });

  await Product.create({ name: 'Mouse', bought_price: 10.0, sale_price: 20.0, category_id: category.category_id });
  await Product.create({ name: 'Teclado', bought_price: 15.0, sale_price: 30.0, category_id: category.category_id });
});

afterAll(async () => {
  // Cierra la conexión a la base de datos si es necesario
  await sequelize.close();
});

describe('POST /purchase/newPurchase', () => {

  it('debería registrar una nueva compra exitosamente', async () => {
    const productos = await Product.findAll();

    const payload = {
      productos: [
        { product_id: productos[0].product_id, quantity: 2 },
        { product_id: productos[1].product_id, quantity: 1 },
      ]
    };

    const response = await request(app)
      .post('/purchase/newPurchase')
      .send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Compra registrada con éxito.');
    expect(response.body).toHaveProperty('purchase_id');
    expect(response.body).toHaveProperty('total_value');
  });

  it('debería retornar 400 si no se envían productos', async () => {
    const response = await request(app)
      .post('/purchase/newPurchase')
      .send({ productos: [] });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Lista de productos inválida o vacía.');
  });

  it('debería retornar 404 si un producto no existe', async () => {
    // Buscar un ID de producto que no exista
    const response = await request(app)
      .post('/purchase/newPurchase')
      .send({ productos: [{ product_id: 9999, quantity: 1 }] });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Producto con ID 9999 no encontrado.');
  });

});
