'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detailtoponim extends Model {
    static associate(models) {
      // Association dengan Datatoponim
      Detailtoponim.belongsTo(models.Datatoponim, {
        foreignKey: 'datatoponim_id',
      });
    }
  }
  Detailtoponim.init({
    datatoponim_id: DataTypes.INTEGER,
    zona_utm: DataTypes.STRING,
    nlp: DataTypes.STRING,
    lcode: DataTypes.STRING,
    nama_gazeter: DataTypes.STRING,
    nama_lain: DataTypes.STRING,
    asal_bahasa: DataTypes.STRING,
    arti_nama: DataTypes.STRING,
    sejarah_nama: DataTypes.TEXT,
    nama_sebelumnya: DataTypes.STRING,
    nama_rekomendasi: DataTypes.STRING,
    ucapan: DataTypes.STRING,
    ejaan: DataTypes.STRING,
    nilai_ketinggian: DataTypes.FLOAT,
    akurasi: DataTypes.FLOAT,
    narasumber: DataTypes.STRING,
    sumber_data: DataTypes.STRING,
    catatan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Detailtoponim',
  });
  return Detailtoponim;
};
