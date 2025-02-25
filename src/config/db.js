const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,           // Ambil host dari .env
    user: process.env.DB_USER,           // Ambil username dari .env
    password: process.env.DB_PASSWORD,   // Ambil password dari .env
    database: process.env.DB_NAME,       // Ambil nama database dari .env
    port: process.env.DB_PORT || 3306,     // Gunakan port dari .env, default 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
