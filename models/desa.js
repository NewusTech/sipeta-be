'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Desa extends Model {
    static associate(models) {
      Desa.belongsTo(models.Kecamatan, {
        foreignKey: 'kecamatan_id',
      });
      Desa.hasMany(models.Userinfo, {
        foreignKey: 'desa_id',
      });
    }
  }
  Desa.init({
    name: DataTypes.STRING,
    kecamatan_id: DataTypes.INTEGER,
    alamat: DataTypes.STRING,
    kepala: DataTypes.STRING,
    telp: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Desa',
  });
  return Desa;
};