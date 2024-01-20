"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        async correctPassword(userPassword) {
            return await bcrypt.compare(userPassword, this.password);
        }
        static associate(models) {
            // define association here
        }
    }
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
            dob: DataTypes.DATEONLY,
        },
        {
            sequelize,
            modelName: "User",
            timestamps: false,
        }
    );
    User.beforeSave(async (user) => {
        const salt = await bcrypt.genSalt(16);
        user.password = await bcrypt.hash(user.password, salt);
    });
    return User;
};