"use strict";
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");

class Order extends Model {}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "id",
            },
        },
        orderDate: DataTypes.DATE,
        totalPrice: DataTypes.FLOAT,
        status: DataTypes.TEXT,
    },
    {
        sequelize,
        modelName: "Order",
        timestamps: false,
    }
);

module.exports = Order;
