'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Unsurs = [
      { name: 'Gedung/Bangunan', klasifikasi_id: 1, createdAt: new Date(), updatedAt: new Date() },

      { name: 'Industri Manufaktur', klasifikasi_id: 2, createdAt: new Date(), updatedAt: new Date() },

      { name: 'Kawasan Khusus', klasifikasi_id: 3, createdAt: new Date(), updatedAt: new Date() },

      { name: 'Arena Atletik dan Olah Raga', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arena Balap Otomotif', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arena Balap Sepeda/Velodrome', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arena Kolam Renang/Olah Raga Air', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arena Olah Raga/Jalur Golf', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arena Pacuan Kuda', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Stadion/Tribun/Bangunan Olah Raga', klasifikasi_id: 4, createdAt: new Date(), updatedAt: new Date() },

      { name: 'Bioskop', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cagar Alam', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Candi', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gardu Pandang', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hotel/Motel/Hostel/Losmen', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kandang/Sangkar Binatang', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kebun Binatang', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Menara', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Museum', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pariwisata/Rekreasi Budaya', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pariwisata/Rekreasi Pantai', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pariwisata/Rekreasi Pegunungan', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pariwisata/Seni/Budaya/Olah Raga Lainnya', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pasar Seni/Galeri', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Peternakan/Penangkaran', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Prasasti', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Restauran/Tempat Makan', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rumah Kaca Taman Botani', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Situs Purbakala', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Taman Botani', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Taman Margasatwa', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Taman Sumber Air Panas', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Teater Seni/Konser/Pameran/Pertemuan', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tempat Hiburan', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tugu/Monumen/Gapura', klasifikasi_id: 5, createdAt: new Date(), updatedAt: new Date() }

    ];

    await queryInterface.bulkInsert('Unsurs', Unsurs, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Unsurs', null, {});
  }
};
