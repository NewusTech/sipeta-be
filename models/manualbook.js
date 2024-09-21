'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manualbook extends Model {
  }
  Manualbook.init({
    dokumen: DataTypes.STRING,
    tipe: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Manualbook',
  });
  return Manualbook;
};