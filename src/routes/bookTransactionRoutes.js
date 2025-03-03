const Joi = require('joi');
const { borrowBook, returnBook } = require('../models/bookTransactionModel');
const { getUserById } = require('../models/userModel'); // Fungsi untuk validasi user

const bookTransactionRoutes = [
    // Endpoint untuk meminjam buku
    {
        method: 'POST',
        path: '/user/borrow',
        options: {
            auth: false, // Tanpa autentikasi
            description: 'Meminjam buku tanpa autentikasi',
            notes: 'Validasi user dari database, kurangi stok buku, dan catat transaksi peminjaman',
            tags: ['api', 'books'],
            validate: {
                payload: Joi.object({
                    userId: Joi.string().guid({ version: ['uuidv4'] }).required(),
                    bookId: Joi.string().guid({ version: ['uuidv4'] }).required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { userId, bookId } = request.payload;
                // Validasi user berdasarkan ID
                const user = await getUserById(userId);
                if (!user) {
                    return h.response({ message: 'User tidak ditemukan' }).code(404);
                }
                const borrowId = await borrowBook(userId, bookId);
                return h.response({ message: 'Buku berhasil dipinjam', borrowId }).code(201);
            } catch (error) {
                console.error('Error borrow book:', error.message);
                return h.response({ message: error.message }).code(400);
            }
        }
    },

    // Endpoint untuk mengembalikan buku
    {
        method: 'POST',
        path: '/user/return',
        options: {
            auth: false, // Tanpa autentikasi
            description: 'Mengembalikan buku tanpa autentikasi',
            notes: 'Validasi user dari database, update transaksi peminjaman, dan tambah stok buku',
            tags: ['api', 'books'],
            validate: {
                payload: Joi.object({
                    userId: Joi.string().guid({ version: ['uuidv4'] }).required(),
                    bookId: Joi.string().guid({ version: ['uuidv4'] }).required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { userId, bookId } = request.payload;
                // Validasi user
                const user = await getUserById(userId);
                if (!user) {
                    return h.response({ message: 'User tidak ditemukan' }).code(404);
                }
                const returnId = await returnBook(userId, bookId);
                return h.response({ message: 'Buku berhasil dikembalikan', returnId }).code(200);
            } catch (error) {
                console.error('Error return book:', error.message);
                return h.response({ message: error.message }).code(400);
            }
        }
    }
];

module.exports = bookTransactionRoutes;
