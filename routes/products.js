const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all products (List View)
router.get("/", (req, res) => {
    db.query("SELECT * FROM products", (err, products) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).send("Error fetching products");
        }
        res.render("products", { title: "Products", products });
    });
});

// ✅ FIXED: View single product (Correct route structure)
router.get("/view/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM products WHERE product_id = ?";

    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).send("Error fetching product");
        }
        if (results.length === 0) {
            console.error("❌ Product not found:", productId);
            return res.status(404).render("error", { title: "Error", message: "Product not found" });
        }

        res.render("product-detail", { // ✅ Ensure this matches your EJS file name
            title: results[0].name,  
            product: results[0]  
        });
    });
});

// ✅ Show the Add Product Page
router.get("/add", (req, res) => {
    res.render("add-product", { title: "Add Product" });
});

// ✅ Add Product (POST)
router.post("/add", (req, res) => {
    const { name, description, price, stock_quantity, category, image_url } = req.body;
    db.query(
        "INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?)",
        [name, description, price, stock_quantity, category, image_url],
        (err, result) => {
            if (err) {
                console.error("Error adding product:", err);
                return res.status(500).send("Error adding product");
            }
            res.redirect("/products");
        }
    );
});

// ✅ DELETE Product
router.get("/delete/:id", (req, res) => {
    const productId = req.params.id;
    db.query("DELETE FROM products WHERE product_id = ?", [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).send("Error deleting product");
        }
        res.redirect("/products");
    });
});

module.exports = router;