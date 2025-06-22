'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Purchases', 'total_value',{
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Purchases', 'total_value');
  }
};
