'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Kecamatans', 'count_surveyor', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Kecamatans', 'count_kontributor', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Kecamatans', 'count_surveyor');
    await queryInterface.removeColumn('Kecamatans', 'count_kontributor');
  }
};
