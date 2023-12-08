exports.getCategoryView = (req, res) => {
    res.status(200).render("clientCategory", { layout: "clientLayout" });
};