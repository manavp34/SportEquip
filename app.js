const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const layouts = require("express-ejs-layouts");

const app = express();

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

// Routes (Ensure They Are Imported Correctly)
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const cartRouter = require("./routes/cart");
const usersRouter = require("./routes/users");
const contactRouter = require("./routes/contact");
const aboutRouter = require("./routes/about");

// ✅ Check if Route Imports are Valid (Debugging Step)
if (typeof indexRouter !== "function") console.error("❌ indexRouter is not a function");
if (typeof productsRouter !== "function") console.error("❌ productsRouter is not a function");
if (typeof ordersRouter !== "function") console.error("❌ ordersRouter is not a function");
if (typeof cartRouter !== "function") console.error("❌ cartRouter is not a function");
if (typeof usersRouter !== "function") console.error("❌ usersRouter is not a function");

// ✅ Apply Routes
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter);
app.use("/contact", contactRouter);
app.use("/about", aboutRouter);

// 404 Error Handling
app.use((req, res) => {
    res.status(404).render("error", { title: "Page Not Found" });
});

module.exports = app;