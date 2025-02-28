const Joi = require('joi');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt'); // Gunakan plugin @hapi/jwt
const { getUserByUsername, createUser } = require('../models/userModel');

const userRoutes = [
    // REGISTER
    {
        method: 'POST',
        path: '/user/register',
        options: {
            auth: false, // Tidak butuh token JWT untuk register
            description: 'Register new user',
            notes: 'Mendaftarkan user baru dengan ID random (UUID) & password ter-hash',
            tags: ['api', 'user'],
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { username, password } = request.payload;

                // Cek apakah user sudah ada
                const existingUser = await getUserByUsername(username);
                if (existingUser) {
                    return h.response({ message: 'Username sudah terdaftar' }).code(400);
                }

                // Buat user baru
                const newUserId = await createUser(username, password);
                return h.response({
                    message: 'User berhasil diregistrasi',
                    userId: newUserId
                }).code(201);

            } catch (error) {
                console.error('Error register user:', error);
                return h.response({ message: 'Gagal register user' }).code(500);
            }
        }
    },

    // LOGIN
    {
        method: 'POST',
        path: '/user/login',
        options: {
            auth: false, // Tidak butuh token JWT untuk login
            description: 'User login',
            notes: 'Login user dengan username & password, kembalikan JWT token',
            tags: ['api', 'user'],
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { username, password } = request.payload;

                // Ambil user dari DB
                const user = await getUserByUsername(username);
                if (!user) {
                    return h.response({ message: 'Username atau password salah' }).code(401);
                }

                // Cek password
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return h.response({ message: 'Username atau password salah' }).code(401);
                }

                // Generate token JWT (1 jam)
                const token = Jwt.token.generate(
                    { id: user.id, username: user.username },
                    { key: process.env.JWT_SECRET, algorithm: 'HS256' },
                    { ttlSec: 3600 } // token berlaku 1 jam
                );

                return h.response({
                    message: 'Login berhasil',
                    token
                }).code(200);

            } catch (error) {
                console.error('Error login user:', error);
                return h.response({ message: 'Gagal login user' }).code(500);
            }
        }
    }
];

module.exports = userRoutes;