const { CartDetail, Category } = require("../../models");

exports.checkout = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.user.id },
        });

        res.render("customer/checkout", { user: req.user, nCart, categories });
    } catch (error) {
        next(error);
    }
};
