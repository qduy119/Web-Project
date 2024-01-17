const Category = require("../../models/Category");

exports.order = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("customer/order", { categories });
    } catch (error) {
        next(error);
    }
};
