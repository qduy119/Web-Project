"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.hasMany(models.CartDetail, {
                foreignKey: "productId",
            });
            Product.hasMany(models.OrderDetail, {
                foreignKey: "productId",
            });
        }
    }
    Product.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Categories",
                    key: "id",
                },
            },
            title: DataTypes.TEXT,
            description: DataTypes.TEXT,
            thumbnail: DataTypes.TEXT,
            images: DataTypes.JSON,
            discountPercentage: DataTypes.FLOAT,
            price: DataTypes.FLOAT,
            brand: DataTypes.TEXT,
            stock: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Product",
            timestamps: false,
        }
    );
    return Product;
};
