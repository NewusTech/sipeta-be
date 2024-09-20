'use strict';

const passwordHash = require('password-hash');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        userinfo_id: 1,
        password: passwordHash.generate('123456'),
        slug: "superadmin-20240620041615213",
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userinfo_id: 2,
        password: passwordHash.generate('123456'),
        slug: "Kabag-20240620041615213",
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userinfo_id: 3,
        password: passwordHash.generate('123456'),
        slug: "Verifikasi-20240620041615213",
        role_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userinfo_id: 4,
        password: passwordHash.generate('123456'),
        slug: "Admin-20240620041615213",
        role_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userinfo_id: 5,
        password: passwordHash.generate('123456'),
        slug: "Newus-20240620041615213",
        role_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
