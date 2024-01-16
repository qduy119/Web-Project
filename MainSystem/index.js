require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./utils/db");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("www"));


// Đặt đường dẫn thư mục views và sử dụng EJS làm view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use("/:area/:controller/:action", require('./routes/admin/adminRoute'));
app.use("/:controller/:action", require('./routes/customer/customerRoute'));



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