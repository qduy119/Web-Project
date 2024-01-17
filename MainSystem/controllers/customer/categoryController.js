const Category = require("../../models/Category");
const Product = require("../../models/Product");

exports.category = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.findAll({
            where: {
                categoryId: id,
            },
        });
        const categories = await Category.findAll();
        const category = categories.find((category) => category.id === +id);
    
        res.render("customer/category", {
            products,
            category,
            categories,
        });
    } catch (error) {
        next(error);
    }
};
