"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
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
    return OrderDetail;
};
