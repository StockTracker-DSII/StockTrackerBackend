const { sequelize } = require('../../models');
//para conseguir las 10 ventas MM
exports.getTopSellingProducts = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        p.product_id,
        p.name,
        p.stock,
        SUM(pd.quantity) AS total_sold
      FROM 
        "Products" p
      JOIN 
        "Purchase_Details" pd ON pd.product_id = p.product_id
      GROUP BY 
        p.product_id, p.name, p.stock
      ORDER BY 
        total_sold DESC
      LIMIT 10;
    `);

    res.json(results);
  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
};
