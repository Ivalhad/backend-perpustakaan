const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Import UUID

// Mengambil data admin berdasarkan username
const getAdminByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
};

// Membuat admin baru dengan ID random (UUID)
const createAdmin = async (adminData) => {
    const { username, password } = adminData;
    // Generate UUID untuk ID admin
    const id = uuidv4();
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
        'INSERT INTO admins (id, username, password) VALUES (?, ?, ?)',
        [id, username, hashedPassword]
    );
    return id;
};

module.exports = { getAdminByUsername, createAdmin };
