const { Op } = require("sequelize");
const { Category, Product, CartDetail } = require("../../models");

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
        const nCart = await CartDetail.count({
            where: { userId: req.user?.id || "" },
        });
        const { rows: products, count: total } = await Product.findAndCountAll({
            where: {
                title: {
                    [Op.iLike]: `%${query}%`,
                },
                price: {
                    [Op.between]: hashRange[range] ?? [0, 2147483647],
                },
            },
            offset: (page - 1) * limit,
            limit,
        });
        if (query) {
            res.render("customer/search", {
                user: req.user,
                categories,
                products,
                nCart,
                query,
                range,
                currPage: +page,
                totalPage: Math.ceil(total / limit),
                message: "Thêm vào giỏ hàng thành công",
            });
        } else {
            res.render("customer/home", {
                user: req.user,
                categories,
                nCart,
                products,
                range,
                currPage: +page,
                totalPage: Math.ceil(total / limit),
                message: "Thêm vào giỏ hàng thành công",
            });
        }
    } catch (error) {
        next(error);
    }
};
