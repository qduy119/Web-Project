const BaseController = require('./BaseController');
const Category = require('../../models/Category');
const pageSize = 5;
class CategoryController {

  async index_GET(req, res, next) {
    try {
        const count = await Category.count();
        const pager = { pageSize: pageSize, pages: Math.ceil(count / pageSize), curPage: 1 }
        const categories = await Category.findAll({ limit: pageSize, offset: 0 });
        BaseController.View(req, res, { list: categories, pager: pager });
    } catch (error) {
      next(error);
    }
  }
  async getEntity_POST(req, res, next) {
    try {
        const { page } = req.params;
        console.log(page)
        const count = await Category.count();
        const pager = { pageSize: pageSize, pages: Math.ceil(count / pageSize), curPage: page }
        const categories = await Category.findAll({ limit: pageSize, offset: (page - 1) * pageSize });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
