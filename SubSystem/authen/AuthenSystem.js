const jwt = require("jsonwebtoken");

const authenSystem = (req, res, next) => {
    const token = req.cookies["token"];
    if (!token) {
        res.status(401).json({ status: 401 }); //chua dang nhap
        return;
    } //authorize

    jwt.verify(token, process.env.SUBSYTEM_SECRET_KEY_TOKEN, (err, data) => {
        if (err) {
            res.status(403).json({ status: 403 }); //forbidden
        } else {
            if(data.id !== req.body.userId) {
                return res.status(403).json({ status: 403 });
            }
            next();
        }
    });
};

module.exports = authenSystem;
