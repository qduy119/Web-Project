exports.getProductDetailView = (req, res) => {
    res.status(200).render("clientProductDetail", { layout: "clientLayout" });
};