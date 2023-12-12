require("dotenv").config({ path: "../.env" });
const express = require("express");
const hbsEngine = require("express-handlebars");
const helpers = require('./services/handlebarsHelpers');
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const { connectDB } = require("./utils/db");
const cookieParser = require("cookie-parser");
const viewRouter = require("./router/viewRouter");
const adminRouter = require("./router/admin/adminRouter");

const app = express();

const PORT = process.env.MAIN_PORT || 5050;

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

//app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("www"));

const hbs = hbsEngine.create({
    //defaultLayout: '_layout' ,
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    helpers: {
      ...helpers.helpers,
      subtract: helpers.subtract,
      add: helpers.add,
      eq: helpers.eq
    }
  });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// routing
app.use("/", viewRouter);
app.use("/admin", adminRouter);

app.all("*", (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on server`);
    err.status = "Error";
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Something went wrong";
    res.status(err.statusCode).send(`${err.status}: ${err.message} !`);
});

connectDB();


app.listen(PORT, () => {
    console.log(`Main server listening on ${PORT}`);
});