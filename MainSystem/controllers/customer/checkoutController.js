const CartDetail = require("../../models/CartDetail");
const Category = require("../../models/Category");

exports.checkout = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.user?.id || -1 },
        });

        res.render("customer/checkout", { user: req.user, nCart, categories });
    } catch (error) {
        next(error);
    }
};
