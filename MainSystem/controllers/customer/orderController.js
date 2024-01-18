const Category = require("../../models/Category");

exports.order = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("customer/order", { user: req.user, categories });
    } catch (error) {
        next(error);
    }
};
