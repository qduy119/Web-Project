const BaseController = require('./BaseController');
const { Category } = require('../../models');
const pageSize = 5;
const cloudinary = require('cloudinary').v2;
const Joi = require('joi');
const { Op } = require("sequelize");

const schema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required().messages({
    'string.empty': 'Tên danh mục không được để trống'
  }),
  description: Joi.string().messages({
    'string.empty': 'Mô tả không được để trống',
  })
});

class CategoryController {

  async index_GET(req, res, next) {
    try {
        let text = req.query.search;
        if (!text || text == 'null') text = '';
        const count = (await Category.findAll({
          where: {
            title: {
              [Op.iLike]: `%${text}%`    
            }
          }
        })).length;
        const pager = { pageSize: pageSize, pages: Math.ceil(count / pageSize), curPage: 1 }
        const categories = await Category.findAll({ 
          where: {
            title: {
              [Op.iLike]: `%${text}%`    
            }
          },
          limit: pageSize, 
          offset: 0, 
          order: [['id', 'ASC']] 
        });

        BaseController.View(req, res, { list: categories, pager: pager, text: text });
    } catch (error) {
      next(error);
    }
  }


  async getEntity_GET(req, res, next) {
    try {
      let text = req.query.search;
        if (!text || text == 'null') text = '';
        const count = (await Category.findAll({
          where: {
            title: {
              [Op.iLike]: `%${text}%`    
            }
          }
        })).length;
        let categories;
        const { page } = req.query;
        const numOfPages = Math.ceil(count / pageSize);
        if (page == numOfPages) {
          categories = await Category.findAll({ 
            where: {
              title: {
                [Op.iLike]: `%${text}%`    
              }
            },
            limit: count - (page - 1) * pageSize, 
            offset: (page - 1) * pageSize, 
            order: [['id', 'ASC']] });
        }
        else {
          categories = await Category.findAll({
            where: {
              title: {
                [Op.iLike]: `%${text}%`    
              }
            }, 
            limit: pageSize, 
            offset: (page - 1) * pageSize, 
            order: [['id', 'ASC']] });
        }
        return res.json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getCategory_GET(req, res, next) {
    try {
        const { page } = req.body;
          let categories = await Category.findAll({
            order: [['title', 'ASC']] });
        res.json({ data: categories });
    } catch (error) {
      next(error);
    } 
  }

  async getCategoryById_GET(req, res, next) {
    try {
      const { id } = req.query;
      const category = await Category.findAll({
        where: {
          id: id
        }
      });

      return res.json({ data: category });
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
        return;
    } catch (error) {
      next(error);
    }
  }

  async create_GET(req, res, next) {
    try {
        
        BaseController.View(req, res, { errors: null });
    } catch (error) {
      next(error);
    }
  }

  async create_POST(req, res, next) {
    try {
        const { title, description } = req.body;
        const image = req.file;
        const maxId = await Category.max('id');
        const value = schema.validate({id: maxId + 1, title: title, description: description });
        
        if (value.error) {
          if (image) cloudinary.uploader.destroy(image.filename);
          BaseController.View(req, res, { errors: value.error.details });
          return;
        }
        
        
        const category = await Category.create({
          id: maxId + 1, 
          title: title, 
          description: description, 
          thumbnail: image?.path
        });
        
        return res.redirect('/admin/category/index');
    } catch (error) {
      next(error);
    }
  }

  async edit_GET(req, res, next) {
    try {
      const { id } = req.query;
      const category = await Category.findOne({ where: { id: id } });
      BaseController.View(req, res, { entity: category, errors: null });
    } catch (error) {
      next(error);
    }
  }

  async edit_POST(req, res, next) {
    try {
        const { id, title, description } = req.body;
        const image = req.file;
        console.log(image)
        const value = schema.validate({id: id, title: title, description: description });

        
        if (value.error) {
          if (image) cloudinary.uploader.destroy(image.filename);
          BaseController.View(req, res, { 
            entity: { 
              id: id, 
              title: title, 
              description: description
            }, 
            errors: value.error.details 
          });
          return;
        }
        
        
        await Category.update({
          title: title,
          description: description,
          thumbnail: image?.path
        }, { where: { id: id } });

        
        return res.redirect('/admin/category/index');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
