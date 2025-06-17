'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '' // o lo que desees
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'name');
  }
};
