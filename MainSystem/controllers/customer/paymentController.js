const CartDetail = require("../../models/CartDetail");
const Category = require("../../models/Category");

exports.payment = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.user?.id || -1 },
        });
        
        res.render("customer/payment", { categories, nCart, user: req.user });
    } catch (error) {
        next(error);
    }
};
