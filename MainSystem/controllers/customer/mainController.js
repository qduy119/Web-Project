const { Op } = require("sequelize");
const Category = require("../../models/Category");
const Product = require("../../models/Product");

exports.home = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const categories = await Category.findAll();
        const products = await Product.findAll();

        res.render("customer/home", { categories, products });
    } catch (error) {
        next(error);
    }
};

exports.search = async (req, res, next) => {
    try {
        const { query } = req.query;
        const categories = await Category.findAll();
        const products = await Product.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${query}%`,
                },
            },
        });
        console.log(products);

        res.render("customer/search", { categories, products, query });
    } catch (error) {
        next(error);
    }
};
