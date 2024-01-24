const { CartDetail, Category } = require("../../models");

exports.getSelectedItem = async (req, res, next) => {
    const { selectedItems } = req.body;
    req.session.selectedItems = selectedItems;
    res.status(200).json({});
};

exports.checkout = async (req, res, next) => {
    try {
        const items = req.session.selectedItems;
        const categories = await Category.findAll();
        const nCart = await CartDetail.count({
            where: { userId: req.session.user.id },
        });

        res.render("customer/checkout", {
            user: req.session.user,
            nCart,
            categories,
            items,
        });
    } catch (error) {
        next(error);
    }
};
