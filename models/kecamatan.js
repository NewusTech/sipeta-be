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
      Kecamatan.hasMany(models.Userinfo, {
        foreignKey: 'kecamatan_id',
      });
    }
  }
  Kecamatan.init({
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    camat: DataTypes.STRING,
    telp: DataTypes.STRING,
    count_surveyor: DataTypes.INTEGER,
    count_kontributor: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Kecamatan',
  });
  return Kecamatan;
};