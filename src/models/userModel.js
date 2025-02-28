const pool = require('../config/db');   // Koneksi MySQL
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Mengambil data user berdasarkan username
const getUserByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

// Membuat user baru dengan ID random (UUID) & password ter-hash
const createUser = async (username, password) => {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    await pool.query(
        'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
        [id, username, hashedPassword]
    );

    return id; // Kembalikan ID user baru
};

module.exports = {
    getUserByUsername,
    createUser
};
