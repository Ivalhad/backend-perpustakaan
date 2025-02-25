const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
});

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
