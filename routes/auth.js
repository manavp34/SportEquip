const express = require("express");
const router = express.Router();

// Simulated User Database (Replace with Real Database Logic)
const users = [{ email: "admin@example.com", password: "password123" }];

// 📌 Render Login Page
router.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: null });
});

// 📌 Handle Login Submission
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        req.session.user = user;
        return res.redirect("/"); // ✅ Redirect to home after login
    } else {
        return res.render("login", { title: "Login", error: "Invalid email or password" });
    }
});

// 📌 Handle Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/"); // ✅ Redirect to home after logout
    });
});

module.exports = router;