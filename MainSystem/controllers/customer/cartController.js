const { Category, CartDetail } = require("../../models");

exports.cart = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.session.user.id },
        });
        const cartItems = await CartDetail.findAll({
            where: { userId: req.session.user.id },
            include: "product",
        });

        res.render("customer/cart", {
            user: req.session.user,
            categories,
            nCart,
            cartItems,
            message: "Xóa khỏi giỏ hàng thành công",
        });
    } catch (error) {
        next(error);
    }
};

exports.getAll = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const items = await CartDetail.findAll({ where: { userId } });
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.session.user.id;
        const isExist = await CartDetail.findOne({
            where: {
                userId,
                productId,
            },
        });
        if (isExist) {
            await CartDetail.increment(
                { quantity },
                { where: { userId, productId } }
            );
        } else {
            await CartDetail.create({ userId, productId, quantity });
        }
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.modifyQuantity = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        await CartDetail.increment({ quantity }, { where: { id } });
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.deleteFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        await CartDetail.destroy({ where: { id } });
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
