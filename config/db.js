const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'eagle.cdm.depaul.edu', // ✅ Your Red Hat server
  user: 'mpate211',        // 🔑 Replace with your MySQL username
  password: 'mpate211',    // 🔒 Replace with your MySQL password
  database: 'sportequip_db'     // 📂 Replace with your actual database name
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MariaDB on Eagle CDM');
});

module.exports = db;