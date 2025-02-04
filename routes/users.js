const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 Get All Users
router.get("/", (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Error fetching users");
        }
        res.render("users", { title: "Users", users });
    });
});

// 📌 Add User (Form)
router.get("/add", (req, res) => {
    res.render("add-user", { title: "Add User" });
});

// 📌 Insert New User
router.post("/add", (req, res) => {
    const { first_name, last_name, email, password, phone_number, address } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send("Missing required fields");
    }

    const sql = `INSERT INTO users (first_name, last_name, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [first_name, last_name, email, password, phone_number, address], (err) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).send("Error adding user");
        }
        res.redirect("/users");
    });
});

// 📌 View a Single User
router.get("/view/:id", (req, res) => {
    const userId = req.params.id;

    const sql = "SELECT * FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user details:", err);
            return res.status(500).send("Error fetching user details");
        }
        if (results.length > 0) {
            res.render("user-detail", { title: "User Details", user: results[0] });
        } else {
            res.status(404).send("User not found");
        }
    });
});

// 📌 Edit User (Form)
router.get("/edit/:id", (req, res) => {
    const userId = req.params.id;

    const sql = "SELECT * FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).send("Error fetching user");
        }
        if (results.length > 0) {
            res.render("edit-user", { title: "Edit User", user: results[0] });
        } else {
            res.status(404).send("User not found");
        }
    });
});

// 📌 Update User
router.post("/edit/:id", (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone_number, address } = req.body;

    const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ? WHERE user_id = ?`;

    db.query(sql, [first_name, last_name, email, phone_number, address, userId], (err) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send("Error updating user");
        }
        res.redirect("/users");
    });
});

// 📌 Delete User
router.get("/delete/:id", (req, res) => {
    const userId = req.params.id;

    const sql = "DELETE FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("Error deleting user");
        }
        res.redirect("/users");
    });
});

module.exports = router;