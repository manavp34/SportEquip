const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session"); // ✅ Added session support
const layouts = require("express-ejs-layouts");

const app = express();

// ✅ Configure Session Middleware
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
app.use(express.static(path.join(__dirname, "public")));

// ✅ Middleware to make 'user' available in all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes (Ensure They Are Imported Correctly)
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const cartRouter = require("./routes/cart");
const usersRouter = require("./routes/users");
const contactRouter = require("./routes/contact");
const aboutRouter = require("./routes/about");
const authRouter = require("./routes/auth"); // ✅ New Auth Route for Login/Logout
const privacyRouter = require("./routes/privacy"); // ✅ Add Privacy Route
const helpRouter = require("./routes/help"); // ✅ Add Help Route


// ✅ Check if Route Imports are Valid (Debugging Step)
if (typeof indexRouter !== "function") console.error("❌ indexRouter is not a function");
if (typeof productsRouter !== "function") console.error("❌ productsRouter is not a function");
if (typeof ordersRouter !== "function") console.error("❌ ordersRouter is not a function");
if (typeof cartRouter !== "function") console.error("❌ cartRouter is not a function");
if (typeof usersRouter !== "function") console.error("❌ usersRouter is not a function");
if (typeof authRouter !== "function") console.error("❌ authRouter is not a function");

// ✅ Apply Routes
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter);
app.use("/contact", contactRouter);
app.use("/about", aboutRouter);
app.use("/auth", authRouter); // ✅ Added Authentication Routes
app.use("/privacy", privacyRouter); // ✅ Register Privacy Route
app.use("/help", helpRouter); // ✅ Register Help Route

// 404 Error Handling
app.use((req, res) => {
    res.status(404).render("error", { title: "Page Not Found" });
});

module.exports = app;