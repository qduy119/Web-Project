const Category = require("../../models/Category");

exports.payment = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("customer/payment", { categories });
    } catch (error) {
        next(error);
    }
};
