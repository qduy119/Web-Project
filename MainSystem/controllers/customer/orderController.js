const { CartDetail, Category } = require("../../models");

exports.order = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.user.id },
        });

        res.render("customer/order", { user: req.user, nCart, categories });
    } catch (error) {
        next(error);
    }
};
