'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Datatoponim extends Model {
    static associate(models) {
      Datatoponim.belongsTo(models.Kecamatan, {
        foreignKey: 'kecamatan_id',
      });
      Datatoponim.belongsTo(models.Desa, {
        foreignKey: 'desa_id',
      });
      Datatoponim.belongsTo(models.Klasifikasi, {
        foreignKey: 'klasifikasi_id',
      });
      Datatoponim.belongsTo(models.Unsur, {
        foreignKey: 'unsur_id',
      });
    }
  }
  Datatoponim.init({
    id_toponim: DataTypes.STRING,
    nama_tempat: DataTypes.STRING,
    tipe_geometri: DataTypes.INTEGER,
    klasifikasi_id: DataTypes.INTEGER,
    unsur_id: DataTypes.INTEGER,
    koordinat: DataTypes.TEXT,
    bujur: DataTypes.TEXT,
    lintang: DataTypes.TEXT,
    kecamatan_id: DataTypes.INTEGER,
    desa_id: DataTypes.INTEGER,
    sketsa: DataTypes.STRING,
    docpendukung: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Datatoponim',
  });
  return Datatoponim;
};