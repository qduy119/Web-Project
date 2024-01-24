


const UserModel = require("../models/UserModel.js")
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

module.exports = class UserController {

    static handleLogout = async (req, res) => {
        res.clearCookie("tokenAccess");
        res.redirect("/");
    }

    static handleLoginAdmin = async (req, res) => {
        const { username, password } = req.body;
        const data = await UserModel.getAccountAdmin(username);
        if (data.length === 0) {
            res.json({ status: 401, message: "Tài khoản không tồn tại" });
        }
        else if (data[0].password !== password) {
            res.json({ status: 401, message: "Mật khẩu không đúng" })
        }
        else if (data[0].role !== "admin") {
            res.json({ status: 403 });
        }
        else {
            const tokenAccess = jwt.sign(
                { username: username },
                process.env.SESSION_SECRET,
                { expiresIn: "1h" }
            )

            res.cookie("tokenAccess", tokenAccess, {
                secure: true,
                httpOnly: true,
                sameSite: 'lax'
            });
        }
        res.json({ status: 200 });

    }

    static handleDetailUser = async (req, res) => {
        const data = await UserModel.getUserByID(req.query.id);
        res.render("detailUser", { data: data });
    }

    static handdleGetAllUser = async (req, res) => {
        const data = await UserModel.getAllUser();
        res.json(data);
    }

    static handleGet10User = async (req, res) => {
        const data = await UserModel.get10User();
        return res.json(data);
    }
}