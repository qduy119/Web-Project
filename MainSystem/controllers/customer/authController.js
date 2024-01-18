exports.login = (req, res, next) => {
    try {
        res.render("auth/login")
    } catch (error) {
        next(error);
    }
}

exports.register = (req, res, next) => {
    try {
        res.render("auth/register")
    } catch (error) {
        next(error);
    }
}