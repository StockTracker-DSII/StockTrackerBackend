'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Purchases', {
      purchase_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Purchases');
  }
};
