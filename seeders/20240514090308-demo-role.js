'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Roles = [
      {
        name: 'Super Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Verifikator',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Surveyor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Roles', Roles, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
