const express = require("express");
const router = express.Router();
const authController = require("../../controllers/client/authController");

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
router.route("/logout").post(authController.logout);
router.route("/refresh").post(authController.refreshToken);
router.route("/valid-token").post(authController.isValid);

module.exports = router;
