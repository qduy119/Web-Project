require("dotenv").config({ path: "../.env" });
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
const store = new session.MemoryStore();
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");
const connect = require("./connection");

const app = express();

const PORT = process.env.MAIN_PORT || 5050;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: +process.env.SESSION_EXPIRATION,
        },
        resave: false,
        store,
    })
);

require("./utils/passport")(app);

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

app.get("/getPaging", (req, res, next) => {
    try {
        const { page, totalPage } = req.query;
        const html = res.render("partials/paging.ejs", {
            layout: false,
            pager: {
                pages: totalPage,
                curPage: page,
            },
        });
        res.send(html);
    } catch (error) {
        next(error);
    }
});

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
    res.status(err.statusCode).render("customer/error", {
        layout: false,
        message: `${err.status}: ${err.message} !`,
    });
});

(async () => {
    await connect();
})();

const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};

const server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(`Main server listening on ${PORT}`);
});
