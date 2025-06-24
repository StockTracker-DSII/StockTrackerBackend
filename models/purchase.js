'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase.hasMany(models.PurchaseDetail, {
        foreignKey: 'purchase_id',
        as: 'details'
      })
    }
  }
  Purchase.init({
    purchase_id: {
      allowNull: false,
      primaryKey: true,
      type:DataTypes.STRING
    },
    date: DataTypes.DATE,
    total_value: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'Purchases'
  });
  return Purchase;
};