var LocalStrategy = require("passport-local").Strategy;
var passport = require("passport");
const { User } = require("../models");

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findByPk(id);
        if (user) {
            done(null, user);
        } else {
            done(new Error("Invalid auth"), null);
        }
    } catch (error) {
        done(error);
    }
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async function (username, password, done) {
            try {
                const user = await User.findOne({ where: { username } });
                if (user) {
                    const isCorrect = await user.correctPassword(password);
                    if (!isCorrect) {
                        return done(null, false, {
                            message: "Username hoặc password không chính xác",
                        });
                    }
                    return done(null, user);
                }
                done(null, false, {
                    message: "User không tồn tại",
                });
            } catch (error) {
                done(error);
            }
        })
    );
};
