const express = require("express");
const router = express.Router();
const favoriteController = require("../../controllers/client/favoriteController");

router.route("/favorite").get(favoriteController.getFavoriteView);

module.exports = router;
