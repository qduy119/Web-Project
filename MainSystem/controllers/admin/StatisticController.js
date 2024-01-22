const BaseController = require('./BaseController');
const Order = require('../../models/Category');

class StatisticController {

  index_GET(req, res, next) {

    BaseController.View(req, res, {name: 'Cuong'});
    try {
      
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = StatisticController;
