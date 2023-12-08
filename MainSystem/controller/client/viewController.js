exports.getDefaultView = (req, res) => {
    res.status(200).render("clientHome", { layout: "clientLayout" });
};
