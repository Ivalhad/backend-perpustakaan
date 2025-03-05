const Joi = require('joi');
const { getTransactionsByUser, getAllTransactions } = require('../models/bookTransactionModel');

const transactionHistoryRoutes = [
    // Endpoint untuk melihat histori transaksi user tertentu
    {
        method: 'GET',
        path: '/user/transactions/{userId}',
        options: {
            auth: false, // Sesuaikan dengan kebutuhan; idealnya, endpoint ini dilindungi token jika digunakan di produksi.
            description: 'Melihat histori transaksi peminjaman dan pengembalian buku untuk user tertentu',
            notes: 'Mengembalikan daftar transaksi berdasarkan userId',
            tags: ['api', 'transactions'],
            validate: {
                params: Joi.object({
                    userId: Joi.string().guid({ version: ['uuidv4'] }).required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { userId } = request.params;
                const transactions = await getTransactionsByUser(userId);
                return h.response(transactions).code(200);
            } catch (error) {
                console.error('Error fetching user transactions:', error);
                return h.response({ message: 'Gagal mengambil histori transaksi' }).code(500);
            }
        }
    },

    // Endpoint untuk melihat seluruh histori transaksi (biasanya untuk admin)
    {
        method: 'GET',
        path: '/transactions',
        options: {
            auth: false, // Untuk produksi, endpoint ini sebaiknya dilindungi autentikasi admin.
            description: 'Melihat seluruh histori transaksi peminjaman dan pengembalian buku',
            notes: 'Mengembalikan daftar semua transaksi yang tercatat di perpustakaan',
            tags: ['api', 'transactions']
        },
        handler: async (request, h) => {
            try {
                const transactions = await getAllTransactions();
                return h.response(transactions).code(200);
            } catch (error) {
                console.error('Error fetching all transactions:', error);
                return h.response({ message: 'Gagal mengambil histori transaksi' }).code(500);
            }
        }
    }
];

module.exports = transactionHistoryRoutes;
