const express = require("express");
const router = express.Router();
const mainController = require("../controllers/customer/mainController");
const categoryController = require("../controllers/customer/categoryController");
const productController = require("../controllers/customer/productController");
const cartController = require("../controllers/customer/cartController");
const orderController = require("../controllers/customer/orderController");
const orderDetailController = require("../controllers/customer/orderDetailController");
const paymentController = require("../controllers/customer/paymentController");
const checkoutController = require("../controllers/customer/checkoutController");
const { protect, restrictTo } = require("../middleware/auth");

router.route("/homepage").get(mainController.home);
router.route("/category/:id").get(categoryController.category);
router.route("/product/:id").get(productController.product);

router.use((req, res, next) => {
    if (!req.session?.user) {
        return res.redirect("/login");
    }
    next();
});

router.route("/cart").get(cartController.cart);
router.route("/order").get(orderController.order);
router.route("/checkout").get(checkoutController.checkout);
router.route("/payment").get(paymentController.payment);

// router.use(protect);
// router.use(restrictTo("customer"));

router
    .route("/api/cart")
    .get(protect, restrictTo("customer"), cartController.getAll)
    .post(protect, restrictTo("customer"), cartController.addToCart)
    .put(protect, restrictTo("customer"), cartController.modifyQuantity);
router.route("/api/cart/:id").delete(protect, restrictTo("customer"), cartController.deleteFromCart);

router
    .route("/api/order")
    .post(protect, restrictTo("customer"), orderController.createOrder)
    .put(protect, restrictTo("customer"), orderController.updateOrder);
router.route("/api/orderdetail").post(protect, restrictTo("customer"), orderDetailController.createOrderDetail);

router.route("/api/product").put(protect, restrictTo("customer"), productController.modifyQuantity);
router.route("/api/checkout").post(protect, restrictTo("customer"), checkoutController.getSelectedItem);

router
    .route("/api/payment")
    .post(protect, restrictTo("customer"), paymentController.createPayment)
    .put(protect, restrictTo("customer"), paymentController.updatePayment);

module.exports = router;
