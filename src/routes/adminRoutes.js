'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt'); // Gunakan @hapi/jwt
const { getAdminByUsername, createAdmin } = require('../models/adminModel');

const adminRoutes = [
    // Endpoint untuk registrasi admin
    {
        method: 'POST',
        path: '/admin/register',
        options: {
            description: 'Registrasi admin',
            notes: 'Mendaftarkan akun admin baru',
            tags: ['api', 'admin'],
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
                const existingAdmin = await getAdminByUsername(username);
                if (existingAdmin) {
                    return h.response({ message: 'Admin dengan username ini sudah terdaftar' }).code(400);
                }
                const adminId = await createAdmin({ username, password });
                return h.response({ message: 'Admin berhasil diregistrasi', adminId }).code(201);
            } catch (error) {
                console.error('Error registrasi admin:', error);
                return h.response({ message: 'Gagal registrasi admin' }).code(500);
            }
        }
    },

    // Endpoint untuk login admin
    {
        method: 'POST',
        path: '/admin/login',
        options: {
            description: 'Login admin',
            notes: 'Melakukan login admin menggunakan username dan password',
            tags: ['api', 'admin'],
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
                const admin = await getAdminByUsername(username);
                if (!admin) {
                    return h.response({ message: 'Username atau password salah' }).code(401);
                }
                const isValid = await bcrypt.compare(password, admin.password);
                if (!isValid) {
                    return h.response({ message: 'Username atau password salah' }).code(401);
                }

                // Buat JWT token menggunakan @hapi/jwt
                const token = Jwt.token.generate(
                    { id: admin.id, username: admin.username },
                    { key: process.env.JWT_SECRET, algorithm: 'HS256' },
                    { ttlSec: 3600 } // Token berlaku selama 1 jam
                );

                return h.response({ message: 'Login berhasil', token }).code(200);
            } catch (error) {
                console.error('Error saat login admin:', error);
                return h.response({ message: 'Gagal login admin' }).code(500);
            }
        }
    }
];

module.exports = adminRoutes;