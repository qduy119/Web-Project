const PORT = process.env.SUB_PORT || 8080;

require("dotenv").config({ path: "../.env" });
const express = require("express");
const hbsEngine = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const { connectDB } = require("../utils/db");
const cookieParser = require("cookie-parser");
const route = require("./routes/route.js")

const app = express();

app.use(
      session({
            secret: process.env.SESSION_SECRET,
            saveUninitialized: true,
            cookie: {
                  sameSite: true,
                  httpOnly: true,
                  maxAge: +process.env.SESSION_EXPIRATION,
            },
            resave: false,
      })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.engine(
      "hbs",
      hbsEngine.engine({
            extname: "hbs",
            helpers: {},
      })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

connectDB();
route(app);
app.listen(PORT, () => {
      console.log(`Sub server listening on ${PORT}`);
});
