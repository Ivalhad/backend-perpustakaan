# Sistem Backend Perpustakaan

Sistem ini menggunakan **Node.js** dengan framework **Hapi.js** serta database **MySQL** untuk mengelola data buku dalam perpustakaan.

## Fitur

- Menambahkan Buku
- Mengedit Buku
- Menghapus Buku
- Mengambil daftar Buku
- Mengambil data Buku berdasarkan Id
- Admin Login dan Registrasi
- User Login dan Registrasi dengan JWT
- User Pinjam dan Kembalikan buku
- Melihat histori peminjaman buku salah satu user dan seluruh user

## File Configuration
**.env**
  ```json
  # Server Configuration
  PORT=
  HOST=

  # Database Configuration
  DB_HOST=
  DB_USER=
  DB_PASSWORD=
  DB_NAME=
  DB_PORT=

  # konfigurasi lainnya
  JWT_SECRET=
  ```


## API EndPoint

## Admin Kelola Buku
### Menambah Buku
**URL:**
`/books`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "title": "Buku Contoh",
  "author": "Penulis Contoh",
  "publication_year": 2023,
  "isbn": "9781234567890",
  "stock": 10
  }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Buku berhasil ditambahkan",
  "id": "uuid-generated-value"
  }
  ```
  
- **Failure Internal Error:**
  ```json
  {
    "message": "Gagal menambahkan buku"
  }
  ```

### Mengambil Seluruh Buku
**URL:**
`/books`
**Method:**
`GET`

**Response:**
- **Success:**
  ```json
  {
    "id": "uuid-1234-abcd-5678",
    "title": "Judul Buku",
    "author": "Nama Penulis",
    "publication_year": 2023,
    "isbn": "9781234567890",
    "stock": 5,
    "created_at": "2023-07-01T10:00:00.000Z",
    "updated_at": "2023-07-01T10:00:00.000Z"
  },
  {
    "id": "uuid-2345-bcde-6789",
    "title": "Buku Lainnya",
    "author": "Penulis Lain",
    "publication_year": 2021,
    "isbn": "9780987654321",
    "stock": 3,
    "created_at": "2023-07-01T11:00:00.000Z",
    "updated_at": "2023-07-01T11:00:00.000Z"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
    "message": "Gagal mengambil data buku"
  }
  ```

### Mengambil Buku Berdasarkan Id
**URL:**
`/books/{id}`
**Method:**
`GET`

**Response:**
- **Success:**
  ```json
  {
  "id": "uuid-1234-abcd-5678",
  "title": "Judul Buku",
  "author": "Nama Penulis",
  "publication_year": 2023,
  "isbn": "9781234567890",
  "stock": 5,
  "created_at": "2023-07-01T10:00:00.000Z",
  "updated_at": "2023-07-01T10:00:00.000Z"
  }
  ```
- **Failure:**
  ```json
  {
    "message": "Buku tidak ditemukan"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
    "message": "Gagal mengambil data buku"
  }
  ```

### Mengedit Data Buku Berdasarkan ID
**URL:**
`/books/{id}`
**Method:**
`PUT`

**Body Request**
  ```json
  {
  "title": "Judul Baru",
  "stock": 15
  }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Buku berhasil diupdate"
  }
  ```
- **Failure Not Found:**
  ```json
  {
    "message": "Buku tidak ditemukan atau tidak ada perubahan data"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
    "message": "Gagal mengupdate buku"
  }
  ```

### Menghapus Data Buku Berdasarkan ID
**URL:**
`/books/{id}`
**Method:**
`DELETE`

**Response:**
- **Success:**
  ```json
  {
  "message": "Buku berhasil dihapus"
  }
  ```
- **Failure Not Found:**
  ```json
  {
    "message": "Buku tidak ditemukan"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
    "message": "Gagal menghapus buku"
  }
  ```

## Admin Login dan Registrasi
### Admin Login
**URL:**
`/admin/login`
**Method:**
`POST`

**Body Request**
  ```json
{
  "username": "admin1",
  "password": "password"
}
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Login berhasil",
  "token": "jwt-token-string"
  }
  ```
- **Failure Not Found:**
  ```json
  {
  "message": "Username atau password salah"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
  "message": "Gagal login admin"
  }
  ```

### Admin Registrasi
**URL:**
`/admin/register`
**Method:**
`POST`

**Body Request**
  ```json
 {
  "username": "admin1",
  "password": "password"
 }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Admin berhasil diregistrasi",
  "adminId": "uuid-generated-value"
  }
  ```
- **Failure Already User:**
  ```json
  {
  "message": "Admin dengan username ini sudah terdaftar"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
  "message": "Gagal registrasi admin"
  }
  ```


## User Login Register
### User Login
**URL:**
`/user/login`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "username": "name",
  "password": "password"
  }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Login Berhasil",
  "Token": "JWT-token-string"
  }
  ```
- **Failure Not Found:**
  ```json
  {
  "message": "'Username atau password salah"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
  "message": "Gagal login user"
  }
  ```

### User Registrasi
**URL:**
`/user/register`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "username": "name",
  "password": "password"
  }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "User berhasil diregistrasi",
  "adminId": "uuid-generated-value"
  }
  ```
- **Failure Already User:**
  ```json
  {
  "message": "Username ini sudah terdaftar"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
  "message": "Gagal registrasi user"
  }
  ```

## User Pinjam dan Kembalikan Buku
### User Meminjam Buku
**URL:**
`/user/borrow`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "userId": "uuid-generated-value",
  "bookId": "uuid-generated-value"
  }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Buku berhasil dipinjam",
  "borrowId": 1
  }
  ```
- **Failure Buku Not found:**
  ```json
  {
  "message": "Buku tidak ditemukan"
  }
  ```
- **Failure Buku Habis:**
  ```json
  {
  "message": "Stok buku habis"
  }
  ```
- **Failure Sudah Pinjam:**
  ```json
  {
  "message": "Anda sudah meminjam buku ini"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
  "message": "Gagal meminjam buku"
  }
  ```

### User Kembalikan Buku
**URL:**
`/user/return`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "userId": "uuid-generated-value",
  "bookId": "uuid-generated-value"
  }
  ```

**Response:**
- **Success:**
  ```json
  {
  "message": "Buku berhasil dikembalikan",
  "returnId": 1
  }
  ```
- **Failure Tidak Ada Data Peminjaman:**
  ```json
  {
  "message": "Buku tidak ditemukan dalam peminjaman Anda"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
  "message": "Gagal mengembalikan buku"
  }
  ```

## Histori Transaksi
### Histori User
**URL:**
`/user/transactions/{userId}`
**Method:**
`GET`

**Response:**
- **Success:**
  ```json
  {
    "id": 1,
    "user_id": "uuid-user-generated-value",
    "book_id": "uuid-book-generated-value",
    "book_title": "Judul Buku Contoh",
    "borrow_date": "2023-07-01T10:00:00.000Z",
    "return_date": null
  },
  {
    "id": 2,
    "user_id": "uuid-user-generated-value",
    "book_id": "uuid-book-generated-value",
    "book_title": "Judul Buku Lainnya",
    "borrow_date": "2023-06-30T09:00:00.000Z",
    "return_date": "2023-07-01T08:30:00.000Z"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
   "message": "Gagal mengambil histori transaksi"
  }
  ```

## Histori Transaksi
### Histori Seluruh User
**URL:**
`/user/transactions`
**Method:**
`GET`

**Response:**
- **Success:**
  ```json
  {
    "id": 1,
    "user_id": "uuid-user-generated-value",
    "book_id": "uuid-book-generated-value",
    "book_title": "Judul Buku Contoh",
    "borrow_date": "2023-07-01T10:00:00.000Z",
    "return_date": null
  },
  {
    "id": 2,
    "user_id": "uuid-user-generated-value",
    "book_id": "uuid-book-generated-value",
    "book_title": "Judul Buku Lainnya",
    "borrow_date": "2023-06-30T09:00:00.000Z",
    "return_date": "2023-07-01T08:30:00.000Z"
  }
  ```
- **Failure Internal Error:**
  ```json
  {
   "message": "Gagal mengambil histori transaksi"
  }
  ```