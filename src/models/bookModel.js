const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getAllBooks = async () => {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
};

const createBook = async (bookData) => {
    const { title, author, publication_year, isbn, stock } = bookData;
    const id = uuidv4(); // Generate UUID

    const [result] = await pool.query(
        'INSERT INTO books (id, title, author, publication_year, isbn, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title, author, publication_year, isbn, stock]
    );

    return id; // Kembalikan ID yang di-generate
};

const updateBook = async (id, bookData) => {
    const { title, author, publication_year, isbn, stock } = bookData;
    const [result] = await pool.query(
        'UPDATE books SET title = ?, author = ?, publication_year = ?, isbn = ?, stock = ? WHERE id = ?',
        [title, author, publication_year, isbn, stock, id]
    );
    return result.affectedRows;
};

const deleteBook = async (id) => {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = { getAllBooks, createBook, updateBook, deleteBook };
