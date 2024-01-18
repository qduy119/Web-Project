"use strict";
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");

class Payment extends Model {}

Payment.init(
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
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Orders",
                key: "id",
            },
        },
        paymentDate: DataTypes.DATE,
        amount: DataTypes.FLOAT,
        status: DataTypes.TEXT,
    },
    {
        sequelize,
        modelName: "Payment",
        timestamps: false,
    }
);

module.exports = Payment;
