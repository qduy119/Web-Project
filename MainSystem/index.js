require("dotenv").config({ path: "../.env" });
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
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

// Sử dụng express-ejs-layouts
app.use(expressLayouts);

// Middleware để xác định layout dựa trên tuyến đường
app.use((req, res, next) => {
  const [area] = req.originalUrl.split('/').filter(Boolean)[0];
  let renderArea = area;
  if (req.originalUrl.split('/').filter(Boolean).length == 3) { 
    const [area, controller, action] = req.originalUrl.split('/').filter(Boolean);
    app.set('layout', `layouts/${area}Layout`);
  } else {
    app.set('layout', 'layouts/customerLayout');
  } 

  next();
});

app.use("/:area/:controller/:action", require('./routes/route'));


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

const sequelize = require('./utils/sequelize');


app.listen(PORT, () => {
    console.log(`Main server listening on ${PORT}`);
});