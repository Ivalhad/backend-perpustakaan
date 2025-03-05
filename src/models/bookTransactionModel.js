const pool = require('../config/db');

// Fungsi untuk mengecek ketersediaan stok buku
const checkBookAvailability = async (bookId) => {
    const [rows] = await pool.query(
        'SELECT stock FROM books WHERE id = ?',
        [bookId]
    );
    return rows.length > 0 ? rows[0].stock : null;
};

// Fungsi untuk mengecek apakah user sudah meminjam buku yang sama (belum dikembalikan)
const checkUserBorrowing = async (userId, bookId) => {
    const [rows] = await pool.query(
        'SELECT id FROM borrowed_books WHERE user_id = ? AND book_id = ? AND return_date IS NULL',
        [userId, bookId]
    );
    return rows.length > 0;
};

// Fungsi untuk mengambil judul buku dari tabel books
const getBookTitle = async (bookId) => {
    const [rows] = await pool.query(
        'SELECT title FROM books WHERE id = ?',
        [bookId]
    );
    return rows.length > 0 ? rows[0].title : null;
};

// Fungsi untuk memproses peminjaman buku
const borrowBook = async (userId, bookId) => {
    const stock = await checkBookAvailability(bookId);
    if (stock === null) {
        throw new Error('Buku tidak ditemukan');
    }
    if (stock <= 0) {
        throw new Error('Stok buku habis');
    }
    const alreadyBorrowed = await checkUserBorrowing(userId, bookId);
    if (alreadyBorrowed) {
        throw new Error('Anda sudah meminjam buku ini');
    }

    // Ambil judul buku
    const title = await getBookTitle(bookId);
    if (!title) {
        throw new Error('Judul buku tidak ditemukan');
    }

    // Kurangi stok buku
    await pool.query('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId]);

    // Catat transaksi peminjaman di tabel borrowed_books termasuk nama buku
    const [result] = await pool.query(
        'INSERT INTO borrowed_books (user_id, book_id, book_title) VALUES (?, ?, ?)',
        [userId, bookId, title]
    );
    return result.insertId;
};

// Fungsi untuk memproses pengembalian buku
const returnBook = async (userId, bookId) => {
    const [rows] = await pool.query(
        'SELECT id FROM borrowed_books WHERE user_id = ? AND book_id = ? AND return_date IS NULL',
        [userId, bookId]
    );
    if (rows.length === 0) {
        throw new Error('Buku tidak ditemukan dalam peminjaman Anda');
    }

    // Tandai buku sebagai dikembalikan
    await pool.query(
        'UPDATE borrowed_books SET return_date = CURRENT_TIMESTAMP WHERE user_id = ? AND book_id = ? AND return_date IS NULL',
        [userId, bookId]
    );

    // Tambahkan kembali stok buku
    await pool.query('UPDATE books SET stock = stock + 1 WHERE id = ?', [bookId]);

    return rows[0].id;
};

// Fungsi untuk mendapatkan histori transaksi berdasarkan userId
const getTransactionsByUser = async (userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM borrowed_books WHERE user_id = ? ORDER BY borrow_date DESC',
        [userId]
    );
    return rows;
};

// Fungsi untuk mendapatkan seluruh histori transaksi
const getAllTransactions = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM borrowed_books ORDER BY borrow_date DESC'
    );
    return rows;
};

module.exports = {
    borrowBook,
    returnBook,
    getTransactionsByUser,
    getAllTransactions
};