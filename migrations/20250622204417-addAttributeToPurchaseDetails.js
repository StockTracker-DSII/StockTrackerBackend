'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Purchase_Details', 'value_individual',{
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    });

    await queryInterface.addColumn('Purchase_Details', 'value_quantity',{
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Purchase_Details', 'value_individual');
    await queryInterface.removeColumn('Purchase_Details', 'value_quantity');
  }
};
