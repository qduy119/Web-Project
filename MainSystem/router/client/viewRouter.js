const express = require("express");
const router = express.Router();
const viewController = require("../../controller/client/viewController");

router.route("/").get(viewController.getDefaultView);

module.exports = router;
