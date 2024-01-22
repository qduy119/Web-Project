"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.hasMany(models.OrderDetail, {
                foreignKey: "orderId",
                as: "details"
            });
        }
    }
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
    return Order;

};
