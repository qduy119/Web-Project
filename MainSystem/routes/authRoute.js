const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/customer/authController");
const { protect, restrictTo } = require("../middleware/auth");

router
    .route("/login")
    .get(authController.loginView)
    .post((req, res, next) => {
        passport.authenticate(
            "local",
            authController.handleAuthentication(req, res, next)
        )(req, res, next);
    });

// Google
router
    .route("/auth/google")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/auth/google/callback").get((req, res, next) => {
    passport.authenticate(
        "google",
        authController.handleThirdPartyAuthentication(req, res, next)
    )(req, res, next);
});

// Facebook
router.route("/auth/facebook").get(passport.authenticate("facebook"));

router.route("/auth/facebook/callback").get((req, res, next) => {
    passport.authenticate(
        "facebook",
        authController.handleThirdPartyAuthentication(req, res, next)
    )(req, res, next);
});

router
    .route("/register")
    .get(authController.registerView)
    .post(authController.register);

router
    .route("/logout")
    .get(protect, restrictTo("customer", "admin"), authController.logout);

router.route("/refresh").get(authController.requestRefreshToken);

router.route("/oauth-success").get(authController.authSuccessView);

module.exports = router;
