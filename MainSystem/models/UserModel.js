const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password:{
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.TEXT,
    
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT,
    
  },
  gender: {
    type: DataTypes.TEXT,
  },
  dob: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: false 
});

module.exports = User;