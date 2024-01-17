const BaseController = require('./BaseController');

class ProductController {

  index(req, res, next) {
    BaseController.View(req, res, {name: 'Cường'});
    try {
      
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductController;
