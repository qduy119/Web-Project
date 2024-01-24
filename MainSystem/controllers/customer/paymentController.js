const { CartDetail, Category } = require("../../models");

exports.payment = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.session.user.id },
        });
        
        res.render("customer/payment", { categories, nCart, user: req.session.user });
    } catch (error) {
        next(error);
    }
};
