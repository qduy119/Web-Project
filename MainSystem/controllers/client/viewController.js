exports.getDefaultView = (req, res) => {
    res.status(200).render("clientHome", { layout: "clientLayout" });
};

exports.getLoginView = (req, res) => {
    res.status(200).render("login", { layout: "clientLayout" });
};

exports.getSignUpView = (req, res) => {
    res.status(200).render("signup", { layout: "clientLayout" });
};

exports.getCheckoutView = (req, res) => {
    res.status(200).render("clientCheckout", { layout: "clientLayout" });
}

exports.getPaymentView = (req, res) => {
    res.status(200).render("clientPayment", { layout: "clientLayout" });
}