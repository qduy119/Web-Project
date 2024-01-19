const Category = require("../../models/Category");
const Product = require("../../models/Product");
const CartDetail = require("../../models/CartDetail");

exports.product = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nCart = await CartDetail.count({
            where: { userId: req.user?.id || -1 },
        });

        const product = await Product.findByPk(id);
        const products = await Product.findAll({
            where: {
                categoryId: product.categoryId,
            },
        });
        const relatedProducts = products.filter(
            (product) => product.id !== +id
        );
        const categories = await Category.findAll();

        res.render("customer/productDetail", {
            user: req.user,
            product,
            categories,
            nCart,
            relatedProducts,
            message: "Thêm vào giỏ hàng thành công"
        });
    } catch (error) {
        next(error);
    }
};

exports.modifyQuantity = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        await Product.increment(
            { stock: quantity },
            { where: { id } }
        );

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
