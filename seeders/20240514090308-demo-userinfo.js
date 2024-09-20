'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Userinfos = [
      {
        name: 'Super Admin',
        nik: 'superadmin',
        slug: "superadmin-20240620041615213",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kabag',
        nik: 'Kabag',
        slug: "Kabag-20240620041615213",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Verifikasi',
        nik: 'Verifikasi',
        slug: "Verifikasi-20240620041615213",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        nik: 'Admin',
        slug: "Admin-20240620041615213",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Newus',
        nik: '1234567812345678',
        slug: "Newus-20240620041615213",
        email: 'newus@gmail.com',
        telepon: '086969696969',
        alamat: 'Bandar Lampung',
        agama: 1,
        tempat_lahir: 'Bandar Lampung',
        tgl_lahir: '1999-08-07',
        status_kawin: 1,
        gender: 1,
        pekerjaan: "Hacker Akhirat",
        goldar: 1,
        pendidikan: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Userinfos', Userinfos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Userinfos', null, {});
  }
};
