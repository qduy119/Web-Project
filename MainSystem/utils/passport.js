const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
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

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    profile = profile["_json"];
                    const {
                        sub: id,
                        name: fullName,
                        picture: avatar,
                        email,
                    } = profile;
                    // console.log({ accessToken });
                    const user = await User.findByPk(id);
                    if (user) {
                        done(null, user);
                    } else {
                        const newUser = await User.create({
                            id,
                            fullName,
                            avatar,
                            email,
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL,
                profileFields: ["id", "displayName", "photos", "email"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    profile = profile["_json"];
                    const { picture, id, name: fullName, email } = profile;
                    const { url: avatar } = picture.data;
                    // console.log({ accessToken });
                    const user = await User.findByPk(id);
                    if (user) {
                        done(null, user);
                    } else {
                        const newUser = await User.create({
                            id,
                            fullName,
                            avatar,
                            email,
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    done(error);
                }
            }
        )
    );
};
