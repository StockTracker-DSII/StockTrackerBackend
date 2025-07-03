'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SaleDetail extends Model {
    static associate(models) {
      // Un detalle pertenece a una venta
      SaleDetail.belongsTo(models.Sale, {
        foreignKey: 'sale_id',
        as: 'sale'
      });

      // Un detalle pertenece a un producto
      SaleDetail.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }

  SaleDetail.init({
    sale_detail_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false // O true si usas onDelete: 'SET NULL'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SaleDetail',
    tableName: 'Sale_Details'
  });

  return SaleDetail;
};
