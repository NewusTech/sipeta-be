'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Userpermission extends Model {
    static associate(models) {
    }
  }
  Userpermission.init({
    user_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Userpermission',
  });
  return Userpermission;
};