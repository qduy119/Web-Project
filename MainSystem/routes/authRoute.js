const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/customer/authController");

router
    .route("/login")
    .get(authController.loginView)
    .post(
        passport.authenticate("local", {
            successReturnToOrRedirect: "/customer/homepage",
            failureRedirect: "/login",
            failureFlash: true,
        })
    );

router
    .route("/auth/google")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/auth/google/callback").get(
    passport.authenticate("google", {
        failureRedirect: "/login",
        successReturnToOrRedirect: "/customer/homepage",
    })
);

router.route("/auth/facebook").get(passport.authenticate("facebook"));

router.route("/auth/facebook/callback").get(
    passport.authenticate("facebook", {
        failureRedirect: "/login",
        successReturnToOrRedirect: "/customer/homepage",
    })
);

router.route("/register").get(authController.registerView);
router.route("/logout").get(authController.logout);

module.exports = router;
