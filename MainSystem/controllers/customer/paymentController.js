const { Payment } = require("../../models");

exports.createPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const userId = req.session.user.id;
        const payment = await Payment.create({
            userId,
            orderId,
            paymentDate: new Date(),
            amount,
            status: "Pending",
            message: null,
        });
        res.status(200).json({ status: "success", payment });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const { id, ...payload } = req.body;
        await Payment.update(
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