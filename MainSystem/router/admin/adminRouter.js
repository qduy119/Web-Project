const express = require("express");
const router = express.Router();
const homeController = require("../../controller/admin/homeController");
const categoryController = require('../../controller/admin/categoryController');

// Home
router.route("/").get(homeController.get.index);

// Category
router.route("/category").get(categoryController.get.index);
router.route("/ajax-table/category").get(categoryController.get.pagingCategories);
router.route("/category/create").get(categoryController.get.create);
router.route("/category/create").post(categoryController.post.create);



module.exports = router;
