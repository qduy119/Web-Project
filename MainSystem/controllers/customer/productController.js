const Category = require("../../models/Category");
const Product = require("../../models/Product");

exports.product = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        const products = await Product.findAll({
            where: {
                categoryId: product.categoryId,
            },
        });
        const relatedProducts = products.filter((product) => product.id !== +id);
        const categories = await Category.findAll();
    
        res.render("customer/productDetail", {
            product,
            categories,
            relatedProducts,
        });
    } catch (error) {
        next(error);
    }
};
