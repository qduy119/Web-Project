const BaseController = require('./BaseController');
const Category = require('../../models/Category');

class CategoryController {

  async index(req, res, next) {
    try {
        const categories = await Category.findAll();
        console.log(categories)
        BaseController.View(req, res, { list: categories });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
