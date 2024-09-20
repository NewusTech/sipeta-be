'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
      });

      User.belongsTo(models.Userinfo, {
        foreignKey: 'userinfo_id',
      });

      User.belongsToMany(models.Permission, {
        through: 'Userpermissions',
        as: 'permissions',
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    password: DataTypes.STRING,
    slug: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    userinfo_id: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
    resetpasswordtoken: DataTypes.STRING,
    resetpasswordexpires: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};