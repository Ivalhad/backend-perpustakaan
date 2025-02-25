const Joi = require('joi');

const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require('../models/bookModel');

const bookRoutes = [
    // GET /books - Mengambil semua buku
    {
        method: 'GET',
        path: '/books',
        options: {
            description: 'Mengambil semua data buku',
            notes: 'Mengembalikan list semua buku yang ada di database',
            tags: ['api', 'books']
        },
        handler: async (request, h) => {
            try {
                const books = await getAllBooks();
                return h.response(books).code(200);
            } catch (error) {
                console.error('Error mengambil data buku:', error);
                return h.response({ message: 'Gagal mengambil data buku' }).code(500);
            }
        }
    },

    // GET /books/{id} - Mengambil data buku berdasarkan id
    {
        method: 'GET',
        path: '/books/{id}',
        options: {
            description: 'Mengambil data buku berdasarkan id',
            notes: 'Mengembalikan data buku jika id ditemukan',
            tags: ['api', 'books'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { id } = request.params;
                const book = await getBookById(id);
                if (!book) {
                    return h.response({ message: 'Buku tidak ditemukan' }).code(404);
                }
                return h.response(book).code(200);
            } catch (error) {
                console.error('Error mengambil data buku:', error);
                return h.response({ message: 'Gagal mengambil data buku' }).code(500);
            }
        }
    },

    // POST /books - Menambahkan buku (sudah ada sebelumnya)
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
            try {
                const bookData = request.payload;
                const id = await createBook(bookData);
                return h.response({ message: 'Buku berhasil ditambahkan', id }).code(201);
            } catch (error) {
                console.error('Error menambahkan buku:', error);
                return h.response({ message: 'Gagal menambahkan buku' }).code(500);
            }
        }
    },

    // PUT /books/{id} - Mengedit buku berdasarkan id
    {
        method: 'PUT',
        path: '/books/{id}',
        options: {
            description: 'Mengedit data buku berdasarkan id',
            notes: 'Mengupdate data buku yang sudah ada',
            tags: ['api', 'books'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    title: Joi.string().optional(),
                    author: Joi.string().optional(),
                    publication_year: Joi.number().integer().optional(),
                    isbn: Joi.string().optional(),
                    stock: Joi.number().integer().optional()
                }).min(1) // Pastikan setidaknya ada satu field yang diupdate
            }
        },
        handler: async (request, h) => {
            try {
                const { id } = request.params;
                const bookData = request.payload;
                const affectedRows = await updateBook(id, bookData);
                if (affectedRows === 0) {
                    return h.response({ message: 'Buku tidak ditemukan atau tidak ada perubahan data' }).code(404);
                }
                return h.response({ message: 'Buku berhasil diupdate' }).code(200);
            } catch (error) {
                console.error('Error mengupdate buku:', error);
                return h.response({ message: 'Gagal mengupdate buku' }).code(500);
            }
        }
    },

    // DELETE /books/{id} - Menghapus buku berdasarkan id
    {
        method: 'DELETE',
        path: '/books/{id}',
        options: {
            description: 'Menghapus data buku berdasarkan id',
            notes: 'Menghapus buku dari database',
            tags: ['api', 'books'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { id } = request.params;
                const affectedRows = await deleteBook(id);
                if (affectedRows === 0) {
                    return h.response({ message: 'Buku tidak ditemukan' }).code(404);
                }
                return h.response({ message: 'Buku berhasil dihapus' }).code(200);
            } catch (error) {
                console.error('Error menghapus buku:', error);
                return h.response({ message: 'Gagal menghapus buku' }).code(500);
            }
        }
    }
];

module.exports = bookRoutes;
