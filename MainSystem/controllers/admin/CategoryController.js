const BaseController = require('./BaseController');
const Category = require('../../models/Category');
const pageSize = 5;
const cloudinary = require('cloudinary').v2;
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
        const { page } = req.body;
        const categories = await Category.findAll({ limit: pageSize, offset: (page - 1) * pageSize });
        res.json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  async delete_POST(req, res, next) {
    try {
        const { id } = req.body;
        await Category.destroy({ where: {
          id: id
        }});
    } catch (error) {
      next(error);
    }
  }

  async create_GET(req, res, next) {
    try {
        
        BaseController.View(req, res);
    } catch (error) {
      next(error);
    }
  }

  async create_POST(req, res, next) {
    try {
        const { title, description } = req.body;
        const image = req.file;
        
      
        if (image) cloudinary.uploader.destroy(image.filename);
        
        const maxId = await Category.max('id');
        const category = await Category.create({
          id: maxId + 1, 
          title: title, 
          description: description, 
          thumbnail: image.path
        });
        console.log(category.id);
        res.redirect('/admin/category/index');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
