const BaseController = require('./BaseController');
const Category = require('../../models/Category');

class CategoryController {

  async index(req, res, next) {
    try {
        const categories = await Category.findAll();
        const pageSize = 5;
        let { page } = req.query;
        if (!page) page = 1;
        const pager = { pageSize: pageSize, pages: Math.ceil(categories.length / pageSize), curPage: page }
        BaseController.View(req, res, { list: categories, pager: pager });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
