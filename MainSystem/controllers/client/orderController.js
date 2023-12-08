exports.getOrderView = (req, res) => {
    res.status(200).render("clientOrder", { layout: "clientLayout" });
}