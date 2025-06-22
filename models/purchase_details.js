'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchase_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      purchase_details.belongsTo(models.Purchase, {
        foreignKey: 'purchase_id',
        as: 'purchase'
      })
    }
  }
  purchase_details.init({
    purchase_detail_id: {
      type:DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    purchase_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Purchases', // el nombre de la tabla a la que se relaciona (¡en plural!)
        key: 'purchase_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    
    product_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Products', // el nombre de la tabla a la que se relaciona (¡en plural!)
        key: 'product_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    quantity: DataTypes.INTEGER,
    value_individual: DataTypes.FLOAT,
    value_quantity: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'purchase_details',
  });
  return purchase_details;
};