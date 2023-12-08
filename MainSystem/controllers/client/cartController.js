exports.getCartView = (req, res) => {
    res.status(200).render("clientCart", { layout: "clientLayout" });
};