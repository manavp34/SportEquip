const db = require('./db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT NOW() AS time;');
        console.log('Database connected successfully! Current time:', rows[0].time);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testConnection();