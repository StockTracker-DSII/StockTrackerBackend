'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.hasMany(models.SaleDetail, {
        foreignKey: 'sale_id',
        as: 'details'
      });
    }
  }

  Sale.init({
    sale_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    date: DataTypes.DATE,
    total_value: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Sale',
    tableName: 'Sales'
  });

  return Sale;
};
