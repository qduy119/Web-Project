const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize');

class Category extends Model {}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
    
  },
  title: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
  thumbnail: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Category',
  timestamps: false 
});

module.exports = Category;