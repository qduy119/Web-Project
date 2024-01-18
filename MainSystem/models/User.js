const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
    async correctPassword(userPassword) {
        return await bcrypt.compare(userPassword, this.password);
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

module.exports = User;
