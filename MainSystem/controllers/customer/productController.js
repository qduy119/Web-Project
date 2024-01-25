const {
    Category,
    Product,
    CartDetail,
    OrderDetail,
    Order,
} = require("../../models");

exports.product = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nCart = await CartDetail.count({
            where: { userId: req.session?.user?.id || "" },
        });

        const product = await Product.findByPk(id);
        const soldQuantity = await OrderDetail.sum("quantity", {
            where: { productId: id },
            include: [
                {
                    model: Order,
                    attributes: [],
                    where: {
                        status: "Success",
                    },
                },
            ],
        }) ?? 0;
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
            user: req.session?.user,
            product,
            soldQuantity,
            categories,
            nCart,
            relatedProducts,
            message: "Thêm vào giỏ hàng thành công",
        });
    } catch (error) {
        next(error);
    }
};

exports.modifyQuantity = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        await Product.increment({ stock: quantity }, { where: { id } });

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
