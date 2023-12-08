const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/client/cartController");

router.route("/cart").get(cartController.getCartView);

module.exports = router;
