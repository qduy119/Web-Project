const Category = require("../../models/Category");
const CartDetail = require("../../models/CartDetail");

exports.cart = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render("customer/cart", { user: req.user, categories });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        await CartDetail.create({ userId, productId, quantity });
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
        const { id } = req.body;
        await CartDetail.destroy({ where: { id } });
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
