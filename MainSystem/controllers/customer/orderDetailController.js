const { OrderDetail } = require("../../models");

exports.createOrderDetail = async (req, res) => {
    try {
        const { orderId, productId, quantity, totalPrice } = req.body;
        await OrderDetail.create({
            orderId,
            productId,
            quantity,
            totalPrice
        });

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
