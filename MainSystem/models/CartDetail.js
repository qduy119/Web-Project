const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");

class CartDetail extends Model {}

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

module.exports = CartDetail;
