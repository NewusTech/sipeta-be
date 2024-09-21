'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Contacts = [
      {
        alamat: 'Jl. Jend. Sudirman No.1, Kota Gapura, Kec. Kotabumi, Kabupaten Lampung Utara, Lampung 34516',
        email: 'kominfo.lampura@gmail.com',
        telp: '072421007',
        latitude: '-4.8288578',
        longitude: '104.8880501',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Contacts', Contacts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Contacts', null, {});
  }
};
