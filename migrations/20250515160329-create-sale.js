'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Sales', {
      sale_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_value: {
        type: Sequelize.FLOAT
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Sales');
  }
};
