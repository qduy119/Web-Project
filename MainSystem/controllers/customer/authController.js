const { User } = require("../../models");

exports.loginView = (req, res, next) => {
    try {
        res.render("auth/login", { message: req.flash() });
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
            const newUser = User.build({ username, password });
            await newUser.save();
            
            res.status(200).json({ status: "success" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/customer/homepage");
    });
};
