const BaseController = require('./BaseController');

class HomeController {

  index(req, res, next) {
    BaseController.View(req, res, {name: 'Cuong'});
    try {
      
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HomeController;
