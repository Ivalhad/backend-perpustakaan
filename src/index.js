// Muat variabel environment dari file .env
require('dotenv').config();

// Import konfigurasi server dari file server.js
const server = require('./config/server');

const startServer = async () => {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();
