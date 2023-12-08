
module.exports = {
    get: {
        index: (req, res, err) => {
            try {
                res.render("adminHome", {layout: "adminLayout"});
            } catch(error) {
                throw error;
            }
        }
    }
}