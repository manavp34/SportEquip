const express = require('express');
const router = express.Router();
const db = require('../db'); // Import database connection

// 📌 View all users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.render('users', { users: rows }); // Pass data to EJS view
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

// 📌 Add a new user
router.post('/users/add', async (req, res) => {
    const { first_name, last_name, email, password, phone_number, address, user_role } = req.body;
    try {
        await db.query('INSERT INTO users (first_name, last_name, email, password, phone_number, address, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [first_name, last_name, email, password, phone_number, address, user_role]);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

// 📌 Show user details
router.get('/users/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
        res.render('user-details', { user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

// 📌 Edit user details
router.post('/users/edit/:id', async (req, res) => {
    const { first_name, last_name, email, phone_number, address, user_role } = req.body;
    try {
        await db.query('UPDATE users SET first_name=?, last_name=?, email=?, phone_number=?, address=?, user_role=? WHERE user_id=?', 
            [first_name, last_name, email, phone_number, address, user_role, req.params.id]);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

// 📌 Delete a user
router.post('/users/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

module.exports = router;