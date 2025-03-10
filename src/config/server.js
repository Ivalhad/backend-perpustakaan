require('dotenv').config();

const Hapi = require('@hapi/hapi');
const bookRoutes = require('../routes/bookRoutes');
const adminRoutes = require('../routes/adminRoutes');
const userRoutes = require('../routes/userRoutes');
const bookTransactionRoutes = require('../routes/bookTransactionRoutes');
const transactionHistoryRoutes = require('../routes/transactionHistoryRoutes');

// Membuat instance server terlebih dahulu
const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
});

// Import dan daftarkan routes
server.route(bookRoutes);
server.route(adminRoutes);
server.route(userRoutes);
server.route(bookTransactionRoutes);
server.route(transactionHistoryRoutes);

// Route untuk halaman utama
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        try {
            return 'Server berjalan coy aman aja';
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return h.response('Server error').code(500);
        }
    }
});

module.exports = server;