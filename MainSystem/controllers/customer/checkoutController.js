const Category = require("../../models/Category");

exports.checkout = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("customer/checkout", { categories });
    } catch (error) {
        next(error);
    }
};
