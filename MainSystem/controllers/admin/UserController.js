const BaseController = require('./BaseController');
const { User } = require('../../models');
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
            username: {
              [Op.substring]: text    
            }
          }
        })).length;
        const pager = { pageSize: pageSize, pages: Math.ceil(count / pageSize), curPage: 1 }
        const users = await User.findAll({ 
          where: {
            username: {
              [Op.substring]: text    
            }
          },
          limit: pageSize, 
          offset: 0, 
          order: [['id', 'ASC']] 
        });

        BaseController.View(req, res, { list: users, pager: pager, text: text });
    } catch (error) {
      next(error);
    }
  }


  async getEntity_GET(req, res, next) {
    try {
      let text = req.query.search;
        if (!text || text == 'null') text = '';
        const count = (await User.findAll({
          where: {
            username: {
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
              username: {
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
              username: {
                [Op.substring]: text    
              }
            }, 
            limit: pageSize, 
            offset: (page - 1) * pageSize, 
            order: [['id', 'ASC']] });
        }
        return res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  async getUserById_GET(req, res, next) {
    try {
      const { id } = req.query;
      const user = await User.findAll({
        where: {
          id: id
        }
      });

      return res.json({ data: user });
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
        const { username, password, email, role, gender, dob } = req.body;
        const avatar = req.file;
        const maxId = await User.max('id');
        const value = schema.validate({
          id: maxId + 1, 
          username: username, 
          password: password,
          email: email,
          role: role,
          gender: gender,
          dob: dob
         });
        
        if (value.error) {
          if (avatar) cloudinary.uploader.destroy(avatar.filename);
          BaseController.View(req, res, { errors: value.error.details });
          return;
        }
        
        
        const user = await User.create({
          id: maxId + 1, 
          username: username, 
          password: password,
          email: email,
          role: role,
          gender: gender,
          dob: dob,
          avatar: avatar?.path
        });
        
        return res.redirect('/admin/user/index');
    } catch (error) {
      next(error);
    }
  }

  async edit_GET(req, res, next) {
    try {
      const { id } = req.query;
      const user = await User.findOne({ where: { id: id } });
      BaseController.View(req, res, { entity: user, errors: null });
    } catch (error) {
      next(error);
    }
  }

  async edit_POST(req, res, next) {
    try {
      const { id, username, email, role, gender, dob } = req.body;
        const avatar = req.file;
        const value = schema.validate({
          id: id, 
          password: 'xyz',
          username: username, 
          email: email,
          role: role,
          gender: gender,
          dob: dob
         });

        
        if (value.error) {
          if (avatar) cloudinary.uploader.destroy(avatar.filename);
          BaseController.View(req, res, { 
            entity: { 
              id: id, 
              username: username, 
              email: email,
              role: role,
              gender: gender,
              dob: dob,
              avatar: avatar?.path
            }, 
            errors: value.error.details 
          });
          return;
        }
        
        
        await User.update({
              username: username, 
              email: email,
              role: role,
              gender: gender,
              dob: dob,
              avatar: avatar?.path
        }, { where: { id: id } });

        
        return res.redirect('/admin/user/index');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
