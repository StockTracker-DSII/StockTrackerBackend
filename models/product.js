'use strict';
const {
  Model,
  BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      Product.hasMany(models.PurchaseDetail, {
        foreignKey: 'product_id',
        as: 'purchaseDetails'
      });


    }
  }
  Product.init({
    product_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    description: DataTypes.STRING,
    sale_price: DataTypes.FLOAT,
    bought_price: DataTypes.FLOAT,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories', // el nombre de la tabla a la que se relaciona (¡en plural!)
        key: 'category_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};