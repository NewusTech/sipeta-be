'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Desa extends Model {
    static associate(models) {
    }
  }
  Desa.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Desa',
  });
  return Desa;
};