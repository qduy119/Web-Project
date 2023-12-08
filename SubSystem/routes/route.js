

const route = (app) => {
      app.get("/", (req, res) => {
            res.render("content");
      })
}

module.exports = route;