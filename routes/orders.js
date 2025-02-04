const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 Get All Orders
router.get("/", (req, res) => {
    const sql = `
        SELECT orders.order_id, users.first_name, users.last_name, 
               IFNULL(orders.total_price, 0) AS total_price, orders.status 
        FROM orders
        JOIN users ON orders.user_id = users.user_id
    `;

    db.query(sql, (err, orders) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).send("Error fetching orders");
        }
        res.render("orders", { title: "Orders", orders });
    });
});

// 📌 View Order Details
router.get("/view/:id", (req, res) => {
    const orderId = req.params.id;

    const orderSQL = `
        SELECT orders.*, users.first_name, users.last_name, users.email, users.phone_number, users.address
        FROM orders
        JOIN users ON orders.user_id = users.user_id
        WHERE orders.order_id = ?
    `;

    const itemsSQL = `
        SELECT products.name AS product_name, products.price, order_items.quantity
        FROM order_items
        JOIN products ON order_items.product_id = products.product_id
        WHERE order_items.order_id = ?
    `;

    db.query(orderSQL, [orderId], (err, orderResult) => {
        if (err) {
            console.error("Error fetching order details:", err);
            return res.status(500).send("Error fetching order details");
        }
        if (orderResult.length === 0) {
            return res.status(404).send("Order not found");
        }

        db.query(itemsSQL, [orderId], (err, itemsResult) => {
            if (err) {
                console.error("Error fetching order items:", err);
                return res.status(500).send("Error fetching order items");
            }

            res.render("order-details", { 
                title: "Order Details", 
                order: orderResult[0],  
                items: itemsResult 
            });
        });
    });
});

// 📌 Add Order Form
router.get("/add", (req, res) => {
    db.query("SELECT * FROM users", (err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Error fetching users");
        }
        res.render("add-order", { title: "Add Order", users });
    });
});

// 📌 Add Order (POST)
router.post("/add", (req, res) => {
    const { user_id, total_price, status } = req.body;
    const sql = `INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)`;

    db.query(sql, [user_id, total_price, status], (err) => {
        if (err) {
            console.error("Error adding order:", err);
            return res.status(500).send("Error adding order");
        }
        res.redirect("/orders");
    });
});

// 📌 Delete Order
router.get("/delete/:id", (req, res) => {
    const orderId = req.params.id;

    const deleteItemsSQL = "DELETE FROM order_items WHERE order_id = ?";
    const deleteOrderSQL = "DELETE FROM orders WHERE order_id = ?";

    db.query(deleteItemsSQL, [orderId], (err) => {
        if (err) {
            console.error("Error deleting order items:", err);
            return res.status(500).send("Error deleting order items");
        } else {
            db.query(deleteOrderSQL, [orderId], (err) => {
                if (err) {
                    console.error("Error deleting order:", err);
                    return res.status(500).send("Error deleting order");
                }
                res.redirect("/orders");
            });
        }
    });
});

module.exports = router;