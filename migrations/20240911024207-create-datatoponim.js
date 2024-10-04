'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Datatoponims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_toponim: {
        type: Sequelize.STRING,
      },
      nama_lokal: {
        type: Sequelize.STRING,
      },
      nama_spesifik: {
        type: Sequelize.STRING,
      },
      nama_peta: {
        type: Sequelize.STRING,
      },
      tipe_geometri: {
        type: Sequelize.INTEGER,
      },
      klasifikasi_id: {
        type: Sequelize.INTEGER,
      },
      unsur_id: {
        type: Sequelize.INTEGER,
      },
      koordinat: {
        type: Sequelize.TEXT,
      },
      bujur: {
        type: Sequelize.TEXT,
      },
      lintang: {
        type: Sequelize.TEXT,
      },
      kecamatan_id: {
        type: Sequelize.INTEGER,
      },
      desa_id: {
        type: Sequelize.INTEGER,
      },
      sketsa: {
        type: Sequelize.STRING,
      },
      docpendukung: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.SMALLINT
      },
      kepala: {
        type: Sequelize.STRING
      },
      sekretaris: {
        type: Sequelize.STRING
      },
      verifiednotes: {
        type: Sequelize.TEXT,
      },
      verifiedat: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Datatoponims', {
      fields: ['klasifikasi_id'],
      type: 'foreign key',
      name: 'custom_fkey_klasifikasi_id',
      references: {
        table: 'Klasifikasis',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Datatoponims', {
      fields: ['unsur_id'],
      type: 'foreign key',
      name: 'custom_fkey_unsur_id',
      references: {
        table: 'Unsurs',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Datatoponims', {
      fields: ['kecamatan_id'],
      type: 'foreign key',
      name: 'custom_fkey_kecamatan_id',
      references: {
        table: 'Kecamatans',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Datatoponims', {
      fields: ['desa_id'],
      type: 'foreign key',
      name: 'custom_fkey_desa_id',
      references: {
        table: 'Desas',
        field: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Datatoponims');
  },
};
