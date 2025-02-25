const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Mengambil semua buku
const getAllBooks = async () => {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
};

// Mengambil buku berdasarkan id
const getBookById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
};

// Menambahkan buku dengan ID random (UUID)
const createBook = async (bookData) => {
    const { title, author, publication_year, isbn, stock } = bookData;
    const id = uuidv4(); // Generate UUID
    await pool.query(
        'INSERT INTO books (id, title, author, publication_year, isbn, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title, author, publication_year, isbn, stock]
    );
    return id;
};

// Mengupdate buku berdasarkan id
const updateBook = async (id, bookData) => {
    // Membangun query dinamis berdasarkan field yang ingin diupdate
    const fields = [];
    const values = [];
    for (const key in bookData) {
        fields.push(`${key} = ?`);
        values.push(bookData[key]);
    }

    if (fields.length === 0) return 0; // Tidak ada data untuk diupdate

    const sql = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(sql, values);
    return result.affectedRows;
};

// Menghapus buku berdasarkan id
const deleteBook = async (id) => {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
