const express = require("express");
const router = express.Router();
const viewController = require("../../controllers/client/viewController");

router.route("/").get(viewController.getDefaultView);
router.route("/login").get(viewController.getLoginView);
router.route("/signup").get(viewController.getSignUpView);
router.route("/checkout").get(viewController.getCheckoutView);
router.route("/payment").get(viewController.getPaymentView);

module.exports = router;
