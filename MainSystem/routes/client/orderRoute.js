const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/client/orderController");

router.route("/cart").get(orderController.getOrderView);

module.exports = router;
