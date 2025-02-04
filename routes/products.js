const express = require("express");
const router = express.Router();
const db = require("../db");

// List all products
router.get("/", (req, res) => {
    db.query("SELECT * FROM products", (err, products) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).send("Error fetching products");
        }
        res.render("products", { title: "Products", products });
    });
});

// View single product
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM products WHERE product_id = ?", [req.params.id], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).send("Error fetching product");
        }
        if (results.length === 0) {
            return res.status(404).send("Product not found");
        }
        res.render("product-detail", { title: results[0].name, product: results[0] });
    });
});

module.exports = router;