const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session"); // ✅ Session support
const layouts = require("express-ejs-layouts");

const app = express();

// ✅ Configure Session Middleware (Fixes Login Button)
app.use(session({
    secret: "your-secret-key", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(layouts);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // ✅ Ensures CSS & images load

// ✅ Middleware to make 'user' available in all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes (Everything remains exactly the same)
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const cartRouter = require("./routes/cart");
const usersRouter = require("./routes/users"); // ✅ Users route is kept
const contactRouter = require("./routes/contact");
const aboutRouter = require("./routes/about");
const authRouter = require("./routes/auth"); // ✅ Auth route remains
const privacyRouter = require("./routes/privacy");
const helpRouter = require("./routes/help");

app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter); // ✅ Users route is kept
app.use("/contact", contactRouter);
app.use("/about", aboutRouter);
app.use("/auth", authRouter);
app.use("/privacy", privacyRouter);
app.use("/help", helpRouter);

// 404 Error Handling (No changes)
app.use((req, res) => {
    res.status(404).render("error", { title: "Page Not Found" });
});

module.exports = app;