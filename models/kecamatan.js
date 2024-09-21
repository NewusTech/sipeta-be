'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kecamatan extends Model {
    static associate(models) {
      Kecamatan.hasMany(models.Desa, {
        foreignKey: 'kecamatan_id',
      });
    }
  }
  Kecamatan.init({
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    camat: DataTypes.STRING,
    telp: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Kecamatan',
  });
  return Kecamatan;
};