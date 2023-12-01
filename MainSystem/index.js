require("dotenv").config();
const express = require("express");
const hbsEngine = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
// const session = require("express-session");
const cookieParser = require("cookie-parser");
const viewRouter = require("./router/viewRouter");

const app = express();
const PORT = process.env.MAIN_PORT || 5050;

// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         saveUninitialized: true,
//         cookie: {
//             sameSite: true,
//             httpOnly: true,
//             maxAge: +process.env.SESSION_EXPIRATION,
//         },
//         resave: false,
//     })
// );

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

app.use("/", viewRouter);

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

app.listen(PORT, () => {
    console.log(`Main server listening on ${PORT}`);
});
