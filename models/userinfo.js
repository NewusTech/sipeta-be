'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Userinfo extends Model {
    static associate(models) {
      Userinfo.hasOne(models.User, {
        foreignKey: 'userinfo_id',
      });
      Userinfo.belongsTo(models.Kecamatan, {
        foreignKey: 'kecamatan_id',
      });
      Userinfo.belongsTo(models.Desa, {
        foreignKey: 'desa_id',
      });
    }
  }
  Userinfo.init({
    name: DataTypes.STRING,
    nik: {
      type: DataTypes.STRING,
      unique: true,
    },
    slug: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    telepon: DataTypes.STRING,
    kecamatan_id: DataTypes.INTEGER,
    desa_id: DataTypes.INTEGER,
    alamat: DataTypes.STRING,
    agama: DataTypes.INTEGER,
    tempat_lahir: DataTypes.STRING,
    tgl_lahir: DataTypes.DATEONLY,
    status_kawin: DataTypes.SMALLINT,
    gender: DataTypes.SMALLINT,
    pekerjaan: DataTypes.STRING,
    goldar: DataTypes.SMALLINT,
    pendidikan: DataTypes.SMALLINT,
    foto: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Userinfo',
  });
  return Userinfo;
};