const { createBook } = require('../models/bookModel');
const Joi = require('joi');

const bookRoutes = [
    {
        method: 'POST',
        path: '/books',
        options: {
            description: 'Menambahkan data buku',
            notes: 'Menerima data buku dan menyimpannya ke database',
            tags: ['api', 'books'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    author: Joi.string().required(),
                    publication_year: Joi.number().integer().required(),
                    isbn: Joi.string().optional(),
                    stock: Joi.number().integer().optional().default(0)
                })
            }
        },
        handler: async (request, h) => {
            const bookData = request.payload;
            try {
                const insertId = await createBook(bookData);
                return h
                    .response({ message: 'Buku berhasil ditambahkan', id: insertId })
                    .code(201);
            } catch (error) {
                console.error('Error menambahkan buku:', error);
                return h
                    .response({ message: 'Gagal menambahkan buku' })
                    .code(500);
            }
        }
    }
];

module.exports = bookRoutes;
