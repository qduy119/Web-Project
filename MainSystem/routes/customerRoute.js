const express = require("express");
const router = express.Router();
const mainController = require("../controllers/customer/mainController");
const categoryController = require("../controllers/customer/categoryController");
const productController = require("../controllers/customer/productController");
const cartController = require("../controllers/customer/cartController");
const orderController = require("../controllers/customer/orderController");
const paymentController = require("../controllers/customer/paymentController");
const checkoutController = require("../controllers/customer/checkoutController");

router.route("/homepage").get(mainController.home);
router.route("/search").get(mainController.search);
router.route("/category/:id").get(categoryController.category);
router.route("/product/:id").get(productController.product);
router.route("/cart").get(cartController.cart);
router.route("/order").get(orderController.order);
router.route("/checkout").get(checkoutController.checkout);
router.route("/payment").get(paymentController.payment);

module.exports = router;
