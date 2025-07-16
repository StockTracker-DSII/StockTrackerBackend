const reportController = require('../controllers/reportController');
const { sequelize } = require('../../models');

jest.mock('../../models', () => ({
  sequelize: {
    query: jest.fn()
  }
}));

describe('getTopSellingProducts', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver los productos más vendidos con status 200', async () => {
    const mockResults = [
      { product_id: 1, name: 'Producto A', stock: 50, total_sold: 120 },
      { product_id: 2, name: 'Producto B', stock: 30, total_sold: 80 }
    ];

    sequelize.query.mockResolvedValue([mockResults]);

    await reportController.getTopSellingProducts(req, res);

    expect(sequelize.query).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockResults);
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it('debería manejar errores y devolver status 500', async () => {
    sequelize.query.mockRejectedValue(new Error('DB fail'));

    await reportController.getTopSellingProducts(req, res);

    expect(sequelize.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al generar el reporte' });
  });
});
