"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Payment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.TEXT,
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
    return Payment;

};

