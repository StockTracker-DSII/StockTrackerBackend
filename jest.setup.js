// jest.setup.js
const { sequelize } = require('./models');
const {  Category, Product, Purchase, PurchaseDetail, User  } = require('./models');

module.exports = async () => {
  await sequelize.sync({ force: true });
  await Category.create({ name: 'Default' });
};
