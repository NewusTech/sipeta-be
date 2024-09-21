'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Detailtoponims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      datatoponim_id: {
        type: Sequelize.INTEGER,
      },
      zona_utm: {
        type: Sequelize.STRING,
      },
      nlp: {
        type: Sequelize.STRING,
      },
      lcode: {
        type: Sequelize.STRING,
      },
      nama_gazeter: {
        type: Sequelize.STRING,
      },
      nama_lain: {
        type: Sequelize.STRING,
      },    
      asal_bahasa: {
        type: Sequelize.STRING,
      },
      arti_nama: {
        type: Sequelize.STRING,
      },
      sejarah_nama: {
        type: Sequelize.TEXT,
      },
      nama_sebelumnya: {
        type: Sequelize.STRING,
      },
      nama_rekomendasi: {
        type: Sequelize.STRING,
      },
      ucapan: {
        type: Sequelize.STRING,
      },
      ejaan: {
        type: Sequelize.STRING,
      },
      nilai_ketinggian: {
        type: Sequelize.FLOAT,
      },
      akurasi: {
        type: Sequelize.FLOAT,
      },
      narasumber: {
        type: Sequelize.STRING,
      },
      sumber_data: {
        type: Sequelize.STRING,
      },
      catatan: {
        type: Sequelize.TEXT,
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

    await queryInterface.addConstraint('Detailtoponims', {
      fields: ['datatoponim_id'],
      type: 'foreign key',
      name: 'custom_fkey_datatoponim_id',
      references: {
        table: 'Datatoponims',
        field: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Detailtoponims');
  },
};
