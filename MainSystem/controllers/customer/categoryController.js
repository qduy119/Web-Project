const { CartDetail, Product, Category } = require("../../models");

exports.category = async (req, res, next) => {
    try {
        const { id } = req.params;
        const products = await Product.findAll({
            where: {
                categoryId: id,
            },
        });
        const categories = await Category.findAll();
        const category = categories.find((category) => category.id === +id);
        const nCart = await CartDetail.count({
            where: { userId: req.user?.id || "" },
        });

        res.render("customer/category", {
            user: req.user,
            products,
            category,
            nCart,
            categories,
            message: "Thêm vào giỏ hàng thành công",
        });
    } catch (error) {
        next(error);
    }
};
