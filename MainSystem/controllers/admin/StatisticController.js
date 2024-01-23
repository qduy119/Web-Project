const BaseController = require('./BaseController');
const { Product, Order, OrderDetail } = require('../../models');

class StatisticController {

  index_GET(req, res, next) {

    BaseController.View(req, res);
    try {
      
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts_GET(req, res, next) {
    try {
      const products = await Product.findAll();

      return res.json({ data: products });
    } catch (error) {
      console.log(error);
    }
  }


  async getOrders_GET(req, res, next) {
    try {
      const orderList = await Order.findAll();

      return res.json({ data: orderList });
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderDetails_GET(req, res, next) {
    try {
      const orderDetails = await OrderDetail.findAll();
      return res.json({ data: orderDetails });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = StatisticController;
