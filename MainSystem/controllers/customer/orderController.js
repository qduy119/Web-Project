const CartDetail = require("../../models/CartDetail");
const Category = require("../../models/Category");

exports.order = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.user?.id || -1 },
        });

        res.render("customer/order", { user: req.user, nCart, categories });
    } catch (error) {
        next(error);
    }
};
