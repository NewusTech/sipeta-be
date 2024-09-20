'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mapslampura extends Model {
    static associate(models) {
    }
  }
  Mapslampura.init({
    file: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Mapslampura',
  });
  return Mapslampura;
};