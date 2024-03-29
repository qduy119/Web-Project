const { Op } = require("sequelize");
const { Category, Product, CartDetail, sequelize } = require("../../models");

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
        const defaultRange = [0, 2147483647];

        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.session?.user?.id || "" },
        });
        const { rows: products, count: total } = await Product.findAndCountAll({
            where: {
                title: {
                    [Op.iLike]: `%${query}%`,
                },
                [Op.and]: sequelize.literal(
                    `"price" * (1 - "discountPercentage" * 0.01) BETWEEN ${
                        hashRange[range]?.[0] || defaultRange[0]
                    } AND ${hashRange[range]?.[1] || defaultRange[1]}`
                ),
            },
            offset: (page - 1) * limit,
            limit,
        });
        if (query) {
            res.render("customer/search", {
                user: req.session?.user,
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
                user: req.session?.user,
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
