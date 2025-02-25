# Sistem Backend Admin Perpustakaan

Sistem ini menggunakan **Node.js** dengan framework **Hapi.js** serta database **MySQL** untuk mengelola data buku dalam perpustakaan.

## Fitur

- Menambahkan Buku
- Mengedit Buku
- Menghapus Buku
- Mengambil daftar Buku
- Mengambil data Buku berdasarkan Id


## API EndPoint

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
- **Failure:**
  ```json
  {
    "message": "Gagal mengambil data buku"
  }
  ```
