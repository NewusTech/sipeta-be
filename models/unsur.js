'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unsur extends Model {
    static associate(models) {
    }
  }
  Unsur.init({
    name: DataTypes.STRING,
    klasifikasi_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Unsur',
  });
  return Unsur;
};