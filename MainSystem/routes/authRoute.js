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

router.route("/register").get(authController.registerView);
router.route("/logout").get(authController.logout);

module.exports = router;
