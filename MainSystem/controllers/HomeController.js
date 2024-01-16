const BaseController = require('./BaseController');

class HomeController {

  index(req, res, next) {
    console.log(this)
    BaseController.View(req, res, {name: 'Cường'}, 'index');
    try {
      
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HomeController;
