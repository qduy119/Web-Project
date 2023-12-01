const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");

router.route("/").get(viewController.getDefaultView);

module.exports = router;
