const express = require("express");
const router = express.Router();
const homeController = require("../../controller/admin/homeController");

router.route("/").get(homeController.get.index);

module.exports = router;
