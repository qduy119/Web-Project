const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: DataTypes.TEXT,
        password: DataTypes.TEXT,
        role: DataTypes.TEXT,
        username: DataTypes.TEXT,
        avatar: DataTypes.TEXT,
        gender: DataTypes.TEXT,
        dob: DataTypes.DATEONLY
    },
    {
        sequelize,
        modelName: "User",
        timestamps: false,
    }
);

module.exports = User;
