const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 View Cart Page
router.get("/", (req, res) => {
    const getUsersSQL = `SELECT user_id, first_name, last_name FROM users`;
    const getProductsSQL = `SELECT product_id, name, price FROM products`;

    db.query(getUsersSQL, (err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Error fetching users");
        }

        db.query(getProductsSQL, (err, products) => {
            if (err) {
                console.error("Error fetching products:", err);
                return res.status(500).send("Error fetching products");
            }

            res.render("cart", {
                title: "Shopping Cart",
                users,
                products,
                cartItems: [],
                selectedUser: null
            });
        });
    });
});

// 📌 Fetch Cart Items for Selected User
router.post("/view", (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.redirect("/cart");
    }

    const cartSQL = `
        SELECT cart.product_id, products.name AS product_name, products.price, 
               SUM(cart.quantity) AS quantity, SUM(products.price * cart.quantity) AS total
        FROM cart
        JOIN products ON cart.product_id = products.product_id
        WHERE cart.user_id = ?
        GROUP BY cart.product_id
    `;

    db.query(cartSQL, [user_id], (err, cartItems) => {
        if (err) {
            console.error("Error fetching cart:", err);
            return res.status(500).send("Error fetching cart");
        }

        db.query(`SELECT user_id, first_name, last_name FROM users`, (err, users) => {
            if (err) {
                console.error("Error fetching users:", err);
                return res.status(500).send("Error fetching users");
            }

            db.query(`SELECT product_id, name, price FROM products`, (err, products) => {
                if (err) {
                    console.error("Error fetching products:", err);
                    return res.status(500).send("Error fetching products");
                }

                res.render("cart", { 
                    title: "Shopping Cart",
                    users,
                    products,
                    cartItems,
                    selectedUser: user_id
                });
            });
        });
    });
});

// 📌 Add Item to Cart
router.post("/add", (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity) {
        return res.status(400).send("Missing required fields");
    }

    const sql = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
    db.query(sql, [user_id, product_id, quantity], (err) => {
        if (err) {
            console.error("Error adding to cart:", err);
            return res.status(500).send("Error adding to cart");
        }
        res.redirect("/cart");
    });
});

// 📌 Remove Item from Cart
router.get("/remove/:id", (req, res) => {
    const productId = req.params.id;
    const userId = req.query.user_id; // Get user_id to reload the correct cart

    const sql = "DELETE FROM cart WHERE product_id = ? AND user_id = ?";
    db.query(sql, [productId, userId], (err) => {
        if (err) {
            console.error("Error removing item from cart:", err);
            res.status(500).send("Error removing item from cart");
        } else {
            res.redirect(`/cart?user_id=${userId}`);
        }
    });
});

module.exports = router;