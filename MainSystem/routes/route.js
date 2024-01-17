// routes.js
const express = require('express');
const router = express.Router();
const cloudUploader = require('../utils/cloudinary');


router.get('/', (req, res, next) => {
    try {
        if (req.originalUrl.split('/').filter(Boolean).length == 3) {
            let index = req.originalUrl.indexOf('?');
            if (index < 0) index = req.originalUrl.length;
            let [areaName, controllerName, actionName] = req.originalUrl.slice(0, index).split('/').filter(Boolean);
            controllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
            const Controller = require(`../controllers/${areaName}/${controllerName}Controller`);
            const controller = new Controller();
            controller[actionName + '_' + req.method](req, res, next);
        } else if (req.originalUrl.split('/').filter(Boolean).length == 2) {
            let index = req.originalUrl.indexOf('?');
            if (index < 0) index = req.originalUrl.length;
            let [controllerName, actionName] = req.originalUrl.slice(0, index).split('/').filter(Boolean);
            controllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
            const Controller = require(`../controllers/${controllerName}Controller`);
            const controller = new Controller();
            controller[actionName + '_' + req.method](req, res, next);
        }
    } catch (error) {
        next(error);
    }
    
});

router.post('/', cloudUploader.single('image'), (req, res, next) => {
    try {
        if (req.originalUrl.split('/').filter(Boolean).length == 3) {
            let index = req.originalUrl.indexOf('?');
            if (index < 0) index = req.originalUrl.length;
            let [areaName, controllerName, actionName] = req.originalUrl.slice(0, index).split('/').filter(Boolean);
            controllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
            const Controller = require(`../controllers/${areaName}/${controllerName}Controller`);
            const controller = new Controller();
            controller[actionName + '_' + req.method](req, res, next);
        } else if (req.originalUrl.split('/').filter(Boolean).length == 2) {
            let index = req.originalUrl.indexOf('?');
            if (index < 0) index = req.originalUrl.length;
            let [controllerName, actionName] = req.originalUrl.slice(0, index).split('/').filter(Boolean);
            controllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
            const Controller = require(`../controllers/${controllerName}Controller`);
            const controller = new Controller();
            controller[actionName + '_' + req.method](req, res, next);
        }
    } catch (error) {
        next(error);
    }
    
});

module.exports = router;
