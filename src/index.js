const app = require('./app');

const PORT = process.env.PORT || 3000;
const { sequelize } = require('./models');

sequelize.sync();
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
