const express = require("express");
const router = express.Router();
const productController = require("../../controllers/client/productController");

router.route("/product").get(productController.getProductDetailView);

module.exports = router;
