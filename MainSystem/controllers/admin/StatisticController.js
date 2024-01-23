const BaseController = require('./BaseController');
const { Order } = require('../../models');

class StatisticController {

  index_GET(req, res, next) {

    BaseController.View(req, res);
    try {
      
    } catch (error) {
      console.log(error);
    }
  }

  async getRevenue_GET(req, res, next) {
    try {
      const orderList = await Order.findAll();

      return res.json({ data: orderList });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = StatisticController;
