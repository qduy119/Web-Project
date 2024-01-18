require("dotenv").config({ path: "../.env" });
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("www"));
app.use(express.static("public"));
app.use(/^\/customer(\/(\w+))?/i, express.static("public"));

// Đặt đường dẫn thư mục views và sử dụng EJS làm view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Sử dụng express-ejs-layouts
app.use(expressLayouts);

// Middleware để xác định layout dựa trên tuyến đường
app.use((req, res, next) => {
    if (
        req.originalUrl.startsWith("/login") ||
        req.originalUrl.startsWith("/register")
    ) {
        app.set("layout", "layouts/authLayout");
    } else if (req.originalUrl.split("/").filter(Boolean)[0] === "customer") {
        app.set("layout", "layouts/customerLayout");
    } else {
        const [area] = req.originalUrl.split("/").filter(Boolean)[0];
        let renderArea = area;
        if (req.originalUrl.split("/").filter(Boolean).length == 3) {
            const [area, controller, action] = req.originalUrl
                .split("/")
                .filter(Boolean);
            app.set("layout", `layouts/${area}Layout`);
        }
    }
    next();
});

app.use("/", require("./routes/authRoute"));
app.use("/customer", require("./routes/customerRoute"));
app.use("/:area/:controller/:action", require("./routes/route"));

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
