const {
    CartDetail,
    Category,
    Order,
    OrderDetail,
    Product,
} = require("../../models");

exports.order = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        const orders = await Order.findAll({
            where: {
                userId: req.session.user.id,
            },
            include: [
                {
                    model: OrderDetail,
                    as: "details",
                    include: [
                        {
                            model: Product,
                            as: "product",
                        },
                    ],
                },
            ],
            order: [["orderDate", "desc"]],
        });

        const nCart = await CartDetail.count({
            where: { userId: req.session.user.id },
        });

        res.render("customer/order", {
            user: req.session.user,
            nCart,
            categories,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { totalPrice } = req.body;
        const userId = req.session.user.id;
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
