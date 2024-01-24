const BaseController = require("./BaseController");
const { Product } = require("../../models");
const pageSize = 5;
const cloudinary = require("cloudinary").v2;
const Joi = require("joi");
const { Op, FLOAT } = require("sequelize");

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
      let { priceFrom, priceTo, cat } = req.query;
      if (!cat) cat = 0;
      let flag = 1;
      if (!priceFrom) {
        priceFrom = 0; 
        flag = 0;
      }
      if (!priceTo) {
        priceTo = 100000000;
        flag = 0; 
      }
      if (!text || text == "null") text = "";
      const count = cat == 0 ? (
        await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
            
          },
        })
      ).length : (
        await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
            categoryId: cat
          },
        })
      ).length;
      const pager = {
        pageSize: pageSize,
        pages: Math.ceil(count / pageSize),
        curPage: 1,
      };
      const products = cat == 0 ? await Product.findAll({
        where: {
          title: {
            [Op.substring]: text,
          },
          price: {
            [Op.between]: [priceFrom, priceTo],
          },
        },
        limit: pageSize,
        offset: 0,
        order: [["id", "ASC"]],
      }) : await Product.findAll({
        where: {
          title: {
            [Op.substring]: text,
          },
          price: {
            [Op.between]: [priceFrom, priceTo],
          },
          categoryId: cat
        },
        limit: pageSize,
        offset: 0,
        order: [["id", "ASC"]],
      });

      if (flag == 0) {
        priceFrom = '';
        priceTo = '';
      }

      BaseController.View(req, res, { list: products, pager: pager, text: text, priceFrom: priceFrom, priceTo: priceTo });
    } catch (error) {
      next(error);
    }
  }

  async getEntity_GET(req, res, next) {
    try {
      let text = req.query.search;
      let { priceFrom, priceTo, cat } = req.query;
      if (!cat) cat = 0;
      if (!priceFrom) {
        priceFrom = 0; 
      }
      if (!priceTo) {
        priceTo = 100000000;
      }
      if (!text || text == "null") text = "";
      const count = cat == 0 ? (
        await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
          },
        })
      ).length : (
        await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
            categoryId: cat
          },
        })
      ).length;
      let products;
      const { page } = req.query;
      const numOfPages = Math.ceil(count / pageSize);
      if (page == numOfPages) {
        products = cat == 0 ? await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
          },
          limit: count - (page - 1) * pageSize,
          offset: (page - 1) * pageSize,
          order: [["id", "ASC"]],
        }) : await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
            categoryId: cat
          },
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [["id", "ASC"]],
        });
      } else {
        products = cat == 0 ? await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
          },
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [["id", "ASC"]],
        }) : await Product.findAll({
          where: {
            title: {
              [Op.substring]: text,
            },
            price: {
              [Op.between]: [priceFrom, priceTo],
            },
            categoryId: cat
          },
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [["id", "ASC"]],
        });
      }
      return res.json({ data: products });
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

      return res.json({ data: product });
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
