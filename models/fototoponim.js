'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fototoponim extends Model {
    static associate(models) {
      Fototoponim.belongsTo(models.Datatoponim, {
        foreignKey: 'datatoponim_id',
      });
    }
  }
  Fototoponim.init({
    datatoponim_id: DataTypes.INTEGER,
    foto_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Fototoponim',
  });
  return Fototoponim;
};