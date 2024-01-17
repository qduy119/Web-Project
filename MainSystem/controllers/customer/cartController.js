const Category = require("../../models/Category");

exports.cart = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("customer/cart", { categories });
    } catch (error) {
        next(error);
    }
};
