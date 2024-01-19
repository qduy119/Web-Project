const express = require("express");
const router = express.Router();
const mainController = require("../controllers/customer/mainController");
const categoryController = require("../controllers/customer/categoryController");
const productController = require("../controllers/customer/productController");
const cartController = require("../controllers/customer/cartController");
const orderController = require("../controllers/customer/orderController");
const paymentController = require("../controllers/customer/paymentController");
const checkoutController = require("../controllers/customer/checkoutController");
const authController = require("../controllers/customer/authController");

router.route("/homepage").get(mainController.home);
router.route("/category/:id").get(categoryController.category);
router.route("/product/:id").get(productController.product);

router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    next();
});
router.route("/cart").get(cartController.cart);
router.route("/order").get(orderController.order);
router.route("/checkout").get(checkoutController.checkout);
router.route("/payment").get(paymentController.payment);

// api
router.route("/api/register").post(authController.register);

router
    .route("/api/cart")
    .get(cartController.getAllItemInCart)
    .post(cartController.addToCart)
    .put(cartController.modifyQuantity)
    .delete(cartController.deleteFromCart);

router.route("/api/product").put(productController.modifyQuantity);

module.exports = router;
