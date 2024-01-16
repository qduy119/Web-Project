// routes.js
const express = require('express');
const router = express.Router();

const HomeController = require('../../controllers/HomeController');
const homeController = new HomeController();
router.route('/').get(homeController.index);

module.exports = router;
