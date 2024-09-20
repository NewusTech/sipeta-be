'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Klasifikasis = [
      { name: 'Toponim Bangunan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Industri', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Kawasan Khusus', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Olahraga', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Pariwisata, Seni dan Budaya', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Pemerintahan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Pemerintahan Negara Asing', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Pendidikan dan IPTEK', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Perairan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Perekonomian dan Perdagangan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Peribadatan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Permakaman', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Permukiman', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Pertahanan dan Keamanan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Pertambangan Mineral', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Relief', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Sarana Kesehatan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Sosial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Transportasi', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Utilitas', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Vegetasi dan Lahan Terbuka', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toponim Wilayah Administrasi', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('Klasifikasis', Klasifikasis, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Klasifikasis', null, {});
  }
};
