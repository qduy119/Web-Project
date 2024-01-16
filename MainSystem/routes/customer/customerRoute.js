// routes.js
const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/ProductController');
const productController = new ProductController();
router.route('/').get(productController.index);

module.exports = router;
