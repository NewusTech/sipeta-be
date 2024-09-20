'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Klasifikasi extends Model {
    static associate(models) {
    }
  }
  Klasifikasi.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Klasifikasi',
  });
  return Klasifikasi;
};