'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Mapslampuras', 'count_surveyor', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Mapslampuras', 'count_kontributor', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Mapslampuras', 'count_surveyor');
    await queryInterface.removeColumn('Mapslampuras', 'count_kontributor');
  }
};
