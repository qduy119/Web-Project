const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

exports.loginView = (req, res, next) => {
    try {
        res.render("auth/login");
    } catch (error) {
        next(error);
    }
};

exports.registerView = (req, res, next) => {
    try {
        res.render("auth/register", { message: "Đăng ký thành công" });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: {
                username,
            },
        });

        if (user) {
            res.status(409).json({
                status: "error",
                message: "User đã tồn tại",
            });
        } else {
            const id = uuidv4();
            await User.create({ id, username, password });

            res.status(200).json({ status: "success" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const accessToken = (user) =>
    jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });

const refreshToken = (user) =>
    jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

const sendRefreshToken = (res, user) => {
    const token = refreshToken(user);
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
    res.cookie("refreshToken", token, options);
};

exports.handleAuthentication =
    (req, res, next) => async (error, user, info) => {
        try {
            if (error) {
                return next(error);
            }
            if (!user) {
                const { message } = info;
                return res.status(401).json({ message });
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                delete user.get().password;
                req.session.user = user;
                const token = accessToken(user);
                sendRefreshToken(res, user);

                return res.status(200).json({ token, user });
            });
        } catch (error) {
            next(error);
        }
    };

exports.logout = (req, res) => {
    try {
        const options = {
            httpOnly: true,
        };
        req.session.user = null;
        res.clearCookie("refreshToken", options);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
};

exports.requestRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(new Error("You are not logged in"));
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, user) => {
            if (error) {
                return next(error);
            }
            const newAccessToken = accessToken(user);
            sendRefreshToken(res, user);
            res.status(200).json({ token: newAccessToken });
        }
    );
};
