const { CartDetail, Category, Order } = require("../../models");

exports.order = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.user.id },
        });

        res.render("customer/order", { user: req.user, nCart, categories });
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { totalPrice } = req.body;
        const userId = req.user.id;
        const order = await Order.create({
            userId,
            orderDate: new Date(),
            totalPrice,
            status: "Pending",
        });
        res.status(200).json({ status: "success", order });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id, ...payload } = req.body;
        await Order.update(
            { ...payload },
            {
                where: {
                    id,
                },
            }
        );
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};