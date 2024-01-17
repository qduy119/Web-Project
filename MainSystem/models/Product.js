"use strict";
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");

class Product extends Model {}

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

module.exports = Product;
