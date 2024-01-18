const express = require("express");
const router = express.Router();
const authController = require("../controllers/customer/authController");

router.route("/login").get(authController.login);
router.route("/register").get(authController.register);

module.exports = router;
