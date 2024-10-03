'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Fototoponims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      datatoponim_id: {
        type: Sequelize.INTEGER,
      },
      foto_url: {
        type: Sequelize.STRING,
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

    await queryInterface.addConstraint('Fototoponims', {
      fields: ['datatoponim_id'],
      type: 'foreign key',
      name: 'custom_fkey_datatoponim_idfile',
      references: {
        table: 'Datatoponims',
        field: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Fototoponims');
  },
};
