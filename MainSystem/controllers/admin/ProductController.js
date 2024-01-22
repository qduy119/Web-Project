const BaseController = require("./BaseController");
const Product = require("../../models/Product");
const pageSize = 5;
const cloudinary = require("cloudinary").v2;
const Joi = require("joi");
const { Op } = require("sequelize");

const schema = Joi.object({
  id: Joi.number().required(),
  categoryId: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string(),
  brand: Joi.string(),
  price: Joi.number().required(),
  discountPercent: Joi.number(),
  stock: Joi.number().required()
});

class ProductController {
  async index_GET(req, res, next) {
    try {
      let text = req.query.search;
      if (!text || text == "null") text = "";
      const count = (
        await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
          },
        })
      ).length;
      const pager = {
        pageSize: pageSize,
        pages: Math.ceil(count / pageSize),
        curPage: 1,
      };
      const products = await Product.findAll({
        where: {
          title: {
            [Op.substring]: text,
          },
        },
        limit: pageSize,
        offset: 0,
        order: [["id", "ASC"]],
      });
      
      BaseController.View(req, res, { list: products, pager: pager });
    } catch (error) {
      next(error);
    }
  }

  async getEntity_GET(req, res, next) {
    try {
      let text = req.query.search;
      if (!text || text == "null") text = "";
      const count = (
        await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
          },
        })
      ).length;
      let products;
      const { page } = req.query;
      const numOfPages = Math.ceil(count / pageSize);
      if (page == numOfPages) {
        products = await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
          },
          limit: count - (page - 1) * pageSize,
          offset: (page - 1) * pageSize,
          order: [["id", "ASC"]],
        });
      } else {
        products = await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
          },
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [["id", "ASC"]],
        });
      }
      res.json({ data: products });
    } catch (error) {
      next(error);
    }
  }

  async getProductById_GET(req, res, next) {
    try {
      const { id } = req.query;
      const product = await Product.findAll({
        where: {
          id: id
        }
      });

      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete_POST(req, res, next) {
    try {
      const { id } = req.body;
      await Product.destroy({
        where: {
          id: id,
        },
      });
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
      const { categoryId, title, description, brand, price, discountPercent, stock } =
        req.body;
      const thumbnail = req.file;
      const images = req.files;
      console.log(images)
      const maxId = await Product.max("id");
      const value = schema.validate({
        id: maxId + 1,
        categoryId: categoryId,
        title: title,
        description: description,
        brand: brand,
        price: price,
        discountPercent: discountPercent,
        stock: stock,
      });

      if (value.error) {
        if (thumbnail) cloudinary.uploader.destroy(thumbnail.filename);
        BaseController.View(req, res, { errors: value.error.details });
        return;
      }

      const product = await Product.create({
        id: maxId + 1,
        categoryId: categoryId,
        title: title,
        description: description,
        brand: brand,
        price: price,
        discountPercent: discountPercent,
        stock: stock,
        thumbnail: thumbnail?.path,
      });

      res.redirect("/admin/product/index");
    } catch (error) {
      next(error);
    }
  }

  async edit_GET(req, res, next) {
    try {
      const { id } = req.query;
      const product = await Product.findOne({ where: { id: id } });
      BaseController.View(req, res, { entity: product, errors: null });
    } catch (error) {
      next(error);
    }
  }

  async edit_POST(req, res, next) {
    try {
      const { id, categoryId, title, description, brand, price, discountPercent, stock } =
        req.body;
      const image = req.file;
      const value = schema.validate({
        id: id,
        categoryId: categoryId,
        title: title,
        description: description,
        brand: brand,
        price: price,
        discountPercent: discountPercent,
        stock: stock,
      });

      if (value.error) {
        if (image) cloudinary.uploader.destroy(image.filename);
        BaseController.View(req, res, {
          entity: {
            id: id,
            categoryId: categoryId,
            title: title,
            description: description,
            brand: brand,
            price: price,
            discountPercent: discountPercent,
            stock: stock
          },
          errors: value.error.details,
        });
        return;
      }

      await Product.update(
        {
          categoryId: categoryId,
          title: title,
          description: description,
          brand: brand,
          price: price,
          discountPercent: discountPercent,
          stock: stock,
          thumbnail: image?.path,
        },
        { where: { id: id } }
      );

      res.redirect("/admin/product/index");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
