const express = require("express");
const router = express.Router();
const homeController = require("../../controller/admin/homeController");
const categoryController = require('../../controller/admin/categoryController');

// Home
router.route("/").get(homeController.get.index);

// Category
router.route("/category").get(categoryController.get.index);

module.exports = router;
