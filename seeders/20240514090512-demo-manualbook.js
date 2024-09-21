'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Manualbooks = [
      {
        dokumen: null,
        tipe: "Surveyor",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dokumen: null,
        tipe: "Kontributor",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dokumen: null,
        tipe: "Verifikator",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Manualbooks', Manualbooks, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Manualbooks', null, {});
  }
};
