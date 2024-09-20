'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Mapslampuras = [
      {
        file: 'https://newus-bucket.s3.ap-southeast-2.amazonaws.com/sipeta_lokal/mapslampura/1726562207431-1806.json',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Mapslampuras', Mapslampuras, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Mapslampuras', null, {});
  }
};
