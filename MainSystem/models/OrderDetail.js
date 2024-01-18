"use strict";
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");

class OrderDetail extends Model {}

OrderDetail.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Orders",
                key: "id",
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Products",
                key: "id",
            },
        },
        quantity: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "OrderDetail",
        timestamps: false,
    }
);

module.exports = OrderDetail;
