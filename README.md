# Airline Voucher Seat Assignment

Aplikasi web untuk crew pesawat melakukan generate 3 kursi voucher promosi secara acak dan unik, berdasarkan layout kursi tiap tipe pesawat.

**Stack:** React (Vite + Tailwind CSS v4) + Laravel 13.x + SQLite

---

## 1. Prerequisites

Pastikan sudah terinstall di komputer kamu:

- **PHP 8.3+** (Laravel 13.x membutuhkan minimal PHP 8.3)
- **Composer** ([getcomposer.org](https://getcomposer.org))
- **Node.js 18+** dan **npm**
- **Git** (untuk clone repository)

Cek versi yang terinstall:

```bash
php -v
composer -v
node -v
npm -v
```

---

## 2. Clone repository

```bash
git clone <url-repository-kamu>
cd <nama-folder-project>
```

Struktur folder:

project/
├── frontend/
├── backend/
├── README.md
└── docker-compose.yml

---

## 3. Setup Backend (Laravel)

```bash
cd backend
composer install
```

### Konfigurasi environment

```bash
cp .env.example .env
php artisan key:generate
```

Buka file `.env`, pastikan konfigurasi database seperti ini:

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/backend/database/database.sqlite

> Ganti `/absolute/path/to/backend/` dengan path lengkap folder `backend/` di komputer kamu.
> Contoh Windows: `D:/project/backend/database/database.sqlite`.
> Contoh macOS/Linux: `/Users/nama/project/backend/database/database.sqlite`.

Buat file database SQLite-nya:

```bash
# macOS / Linux
touch database/database.sqlite

# Windows (PowerShell)
New-Item -ItemType File -Path database\database.sqlite
```

### Jalankan migration

```bash
php artisan migrate
```

### Setup CORS

Pastikan `config/cors.php` sudah ada (kalau belum, generate dengan `php artisan config:publish cors`), dan `allowed_origins` mengarah ke URL frontend (default Vite: `http://localhost:5173`).

### Jalankan server backend

```bash
php artisan serve
```

Backend akan berjalan di `http://127.0.0.1:8000`.

---

## 4. Setup Frontend (React)

Buka terminal baru:

```bash
cd frontend
npm install
```

### Konfigurasi environment

Buat file `.env` di folder `frontend/`:

VITE_API_URL=http://127.0.0.1:8000

### Jalankan server frontend

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

---

## 5. Menjalankan aplikasi

1. Pastikan backend jalan di `http://127.0.0.1:8000`
2. Pastikan frontend jalan di `http://localhost:5173`
3. Buka browser ke `http://localhost:5173`
4. Isi form crew, flight number, tanggal, dan pilih tipe pesawat
5. Klik **Generate Vouchers** untuk generate 3 kursi acak

---

## 6. Menjalankan Feature Tests (opsional, bonus)

```bash
cd backend
php artisan test
```

---

## 7. Menjalankan dengan Docker (opsional)

Sebagai alternatif setup manual di atas, jalankan seluruh aplikasi (backend + frontend) dengan satu command dari root folder project:

```bash
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint        | Deskripsi                                                  |
| ------ | --------------- | ---------------------------------------------------------- |
| POST   | `/api/check`    | Cek apakah voucher untuk flight+tanggal tertentu sudah ada |
| POST   | `/api/generate` | Generate 3 kursi unik dan simpan voucher baru              |

---

## Aircraft Seat Layout

| Aircraft       | Rows | Columns          |
| -------------- | ---- | ---------------- |
| ATR            | 1–18 | A, C, D, F       |
| Airbus 320     | 1–32 | A, B, C, D, E, F |
| Boeing 737 Max | 1–32 | A, B, C, D, E, F |
