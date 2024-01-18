const express = require("express");
const router = express.Router();
const authController = require("../controllers/customer/authController");
const cartController = require("../controllers/customer/cartController");

router.route("/register").post(authController.register);

router
    .route("/cart")
    .post(cartController.addToCart)
    .patch(cartController.modifyQuantity)
    .delete(cartController.deleteFromCart);

module.exports = router;
