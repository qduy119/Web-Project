exports.getFavoriteView = (req, res) => {
    res.status(200).render("clientFavorite", { layout: "clientLayout" });
}