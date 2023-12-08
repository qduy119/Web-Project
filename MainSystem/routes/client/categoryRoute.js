const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/client/categoryController");

router.route("/category").get(categoryController.getCategoryView);

module.exports = router;
