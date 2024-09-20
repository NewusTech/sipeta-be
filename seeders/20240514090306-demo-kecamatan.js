'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Kecamatans = [
      { name: 'Bukit Kemuning', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Tinggi', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tanjung Raja', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Barat', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Tengah', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Kunang', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Pekurun', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kotabumi', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kotabumi Utara', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kotabumi Selatan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Selatan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Semuli', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Blambangan Pagar', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Timur', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Abung Surakarta', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sungkai Selatan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Muara Sungkai', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bunga Mayang', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sungkai Barat', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sungkai Jaya', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sungkai Utara', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hulu Sungkai', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sungkai Tengah', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('Kecamatans', Kecamatans, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Kecamatans', null, {});
  }
};
