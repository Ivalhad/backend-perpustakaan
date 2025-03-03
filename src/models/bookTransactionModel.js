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

    // Kurangi stok buku
    await pool.query('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId]);

    // Catat transaksi peminjaman di tabel borrowed_books
    const [result] = await pool.query(
        'INSERT INTO borrowed_books (user_id, book_id) VALUES (?, ?)',
        [userId, bookId]
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

module.exports = { borrowBook, returnBook };
