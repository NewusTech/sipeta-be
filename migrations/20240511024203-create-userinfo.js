'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Userinfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      nik: {
        type: Sequelize.STRING,
        unique: true
      },
      slug: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      telepon: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      agama: {
        type: Sequelize.SMALLINT
      },
      tempat_lahir: {
        type: Sequelize.STRING
      },
      tgl_lahir: {
        type: Sequelize.DATEONLY
      },
      status_kawin: {
        type: Sequelize.SMALLINT
      },
      gender: {
        type: Sequelize.SMALLINT
      },
      pekerjaan: {
        type: Sequelize.STRING
      },
      goldar: {
        type: Sequelize.SMALLINT
      },
      pendidikan: {
        type: Sequelize.SMALLINT
      },
      foto: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Userinfos');
  }
};