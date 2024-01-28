const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protect = async (req, res, next) => {
    let token = "";
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        if (req.headers.authorization.split(" ")[1] === "null") {
            token = null;
        } else {
            token = req.headers.authorization.split(" ")[1];
        }
    }
    if (!token) {
        return next(new Error("You are not logged in"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
        if (!user) {
            return res.status(401).json({});
        }
        if (error) {
            return next(error);
        }
        const freshUser = await User.findOne({
            where: {
                id: user.id,
            },
        });
        if (!freshUser) {
            return next(Error("User no longer exists"));
        }
        delete freshUser.get().password;
        // Grant access to protected route
        req.session.user = freshUser;
        next();
    });
};

const restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.session?.user?.role)) {
            return res.render("auth/notallow", { layout: false });
        }
        next();
    };

module.exports = { protect, restrictTo };
