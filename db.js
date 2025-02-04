const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'eagle.cdm.depaul.edu', // DePaul server
    user: 'mpate211', // Your DePaul username
    password: 'mpate211', // Your MariaDB password
    database: 'sportequip_db' // Your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to database.');
});

module.exports = db;