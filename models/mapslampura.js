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
    count_surveyor: DataTypes.INTEGER,
    count_kontributor: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Mapslampura',
  });
  return Mapslampura;
};