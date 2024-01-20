const BaseController = require('./BaseController');
const User = require('../../models/User');
const pageSize = 5;
const cloudinary = require('cloudinary').v2;
const Joi = require('joi');
const { Op } = require("sequelize");

const schema = Joi.object({
  id: Joi.number().required(),
  email: Joi.string().required().messages({
    'string.empty': 'Email không được để trống'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password không được để trống',
  }),
  role: Joi.string().messages({
    'string.empty': 'Role không được để trống',
  }),
  username: Joi.string().required().messages({
    'string.empty': 'Username không được để trống'
  }),
  avatar: Joi.string().messages({
    'string.empty': 'Avartar không được để trống'
  }),
  gender: Joi.string().messages({
    'string.empty': 'Gender không được để trống'
  }),
  dob: Joi.string().messages({
    'string.empty': 'Dob không được để trống'
  }),
});

class UserController {

  async index_GET(req, res, next) {
    try {
        let text = req.query.search;
        if (!text || text == 'null') text = '';
        const count = (await User.findAll({
          where: {
            title: {
              [Op.substring]: text    
            }
          }
        })).length;
        const pager = { pageSize: pageSize, pages: Math.ceil(count / pageSize), curPage: 1 }
        const users = await User.findAll({ 
          where: {
            title: {
              [Op.substring]: text    
            }
          },
          limit: pageSize, 
          offset: 0, 
          order: [['id', 'ASC']] 
        });

        BaseController.View(req, res, { list: users, pager: pager });
    } catch (error) {
      next(error);
    }
  }


  async getEntity_GET(req, res, next) {
    try {
      let text = req.query.search;
      console.log(text)
        if (!text || text == 'null') text = '';
        const count = (await User.findAll({
          where: {
            title: {
              [Op.substring]: text    
            }
          }
        })).length;
        let users;
        const { page } = req.query;
        const numOfPages = Math.ceil(count / pageSize);
        if (page == numOfPages) {
            users = await User.findAll({ 
            where: {
              title: {
                [Op.substring]: text    
              }
            },
            limit: count - (page - 1) * pageSize, 
            offset: (page - 1) * pageSize, 
            order: [['id', 'ASC']] });
        }
        else {
          users = await User.findAll({
            where: {
              title: {
                [Op.substring]: text    
              }
            }, 
            limit: pageSize, 
            offset: (page - 1) * pageSize, 
            order: [['id', 'ASC']] });
        }
        res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  async delete_POST(req, res, next) {
    try {
        const { id } = req.body;
        await User.destroy({ where: {
          id: id
        }});
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
        const maxId = await User.max('id');
        const value = schema.validate({id: maxId + 1, title: title, description: description });
        
        if (value.error) {
          if (image) cloudinary.uploader.destroy(image.filename);
          BaseController.View(req, res, { errors: value.error.details });
          return;
        }
        
        
        const user = await User.create({
          id: maxId + 1, 
          title: title, 
          description: description, 
          thumbnail: image?.path
        });
        
        res.redirect('/admin/user/index');
    } catch (error) {
      next(error);
    }
  }

  async edit_GET(req, res, next) {
    try {
      const { id } = req.query;
      const category = await User.findOne({ where: { id: id } });
      BaseController.View(req, res, { entity: user, errors: null });
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
        
        
        await User.update({
          title: title,
          description: description,
          thumbnail: image?.path
        }, { where: { id: id } });

        
        res.redirect('/admin/user/index');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
