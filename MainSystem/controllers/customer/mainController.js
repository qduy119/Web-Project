const { Op } = require("sequelize");
const Category = require("../../models/Category");
const Product = require("../../models/Product");

exports.home = async (req, res, next) => {
    try {
        const hashRange = {
            under_50: [0, 50],
            "50_100": [50, 100],
            "100_500": [100, 500],
            "500_1000": [500, 1000],
            above_1000: [1000, 2147483647],
        };
        const { page = 1, range = "", query = "" } = req.query;
        const limit = 12;
        
        const categories = await Category.findAll();
        const { rows: products, count: total } = await Product.findAndCountAll({
            where: {
                title: {
                    [Op.iLike]: `%${query}%`,
                },
                price: {
                    [Op.between]: hashRange[range] ?? [0, 2147483647]
                }
            },
            offset: (page - 1) * limit,
            limit,
        });
        if (query) {
            res.render("customer/search", {
                categories,
                products,
                query,
                range,
                currPage: +page,
                totalPage: Math.ceil(total / limit),
            });
        } else {
            res.render("customer/home", {
                categories,
                products,
                range,
                currPage: +page,
                totalPage: Math.ceil(total / limit),
            });
        }
    } catch (error) {
        next(error);
    }
};