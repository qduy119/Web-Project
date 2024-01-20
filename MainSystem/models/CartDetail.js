"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CartDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            CartDetail.belongsTo(models.Product, {
                foreignKey: "productId",
                targetKey: "id",
                as: "product",
            });
        }
    }
    CartDetail.init(
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
            modelName: "CartDetail",
            timestamps: false,
        }
    );
    return CartDetail;
};
