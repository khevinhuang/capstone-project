# Product Module README (`features/product`)

Dokumen ini fokus pada implementasi modul **Product Management** di project ini.

## Source Code Repository

- Repository: `<isi-link-repository-Anda-di-sini>`
- Module utama: `src/features/product`

## Setup Instructions

### Prasyarat

- Node.js `>=20`
- pnpm `>=9`

### Instalasi dan Menjalankan Project

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Buka aplikasi di `http://localhost:5173`, lalu akses modul produk:

- List product: `/product`
- Add product: `/product/add`
- Product detail: `/product/:id`

### Environment Variables

Gunakan file `.env` (contoh dari `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEVTOOLS=true
```

### Script yang dipakai saat development

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm test:run
```

## Feature Explanation (Product Module)

### 1. Product List

- Menampilkan daftar produk dalam tabel (`ProductTable`)
- Search produk
- Pagination
- Filter kategori (dropdown)
- Empty state + tombol retry

### 2. Create Product

- Halaman tambah produk (`/product/add`)
- Validasi field wajib: name, category, description, price, stock, date
- Validasi batas nilai (min/max) untuk price dan stock
- Draft form disimpan di store agar input tidak hilang saat navigasi

### 3. Product Detail

- Halaman detail berdasarkan id (`/product/:id`)
- Menampilkan informasi lengkap: name, price, stock, category, description, avatar, created date
- Error handling untuk id invalid / data tidak ditemukan

### 4. Update Product

- Update data melalui dialog (`UpdateProductDialog`)
- Validasi field sama seperti create
- Draft per product id disimpan di store saat dialog terbuka

### 5. Delete Product

- Hapus data melalui dialog konfirmasi (`DeleteProductDialog`)
- Setelah sukses, tabel ter-update dan menampilkan feedback toast

### 6. UX States

- Loading state saat fetch data
- Error state + retry action
- Success/error toast saat create/update/delete
- Optimistic update untuk mutation agar UI terasa cepat

## Architectural Decisions (Product Module)

### 1. Feature-First Modularization

Semua concern produk dipusatkan di `src/features/product`:

- `components/` untuk UI khusus product
- `hooks/` untuk query/mutation logic
- `services/` untuk akses data
- `store/` untuk draft dan local product state
- `types/` untuk kontrak data

Alasan: boundary modul jelas dan maintainability lebih baik.

### 2. Server State dengan TanStack Query

- `useProducts` untuk list
- `useProductDetail` untuk detail
- `useProductMutations` untuk create/update/delete

Alasan: caching, retry/invalidation, dan sinkronisasi data lebih aman dibanding fetch manual.

### 3. Optimistic Mutation Strategy

Pada create/update/delete, cache di-update dulu sebelum response final.
Jika gagal, data di-rollback ke snapshot sebelumnya.

Alasan: respons UI lebih cepat dan tetap aman saat request gagal.

### 4. Service Layer Abstraction

Operasi data dipusatkan di `product.service.ts`.
Saat ini memakai in-memory mock database (`mockProduct`) untuk simulasi backend.

Alasan: UI layer tidak bergantung langsung ke detail data source, sehingga migrasi ke API real lebih mudah.

### 5. Kombinasi State Management

- TanStack Query: server state
- Zustand (`product.store.ts`): draft form dan state lokal lintas komponen
- `useReducer` di halaman list: kontrol state UI dialog (open/close + selected product)

Alasan: setiap jenis state dikelola oleh tool yang paling sesuai, tanpa over-engineering.

## Short Demo Walkthrough (Live/Recorded, 3-5 menit)

Urutan demo yang disarankan:

1. Jalankan project dengan `pnpm dev`
2. Buka `/product` dan jelaskan struktur tabel + filter + search
3. Klik **Add Product**, isi form valid, submit, lalu tunjukkan data masuk ke list
4. Buka salah satu baris ke halaman detail (`/product/:id`)
5. Kembali ke list, lakukan **Update** lewat dialog, tunjukkan perubahan data
6. Lakukan **Delete** pada 1 item, tunjukkan dialog konfirmasi dan hasil akhir
7. Tutup dengan penjelasan singkat arsitektur `components/hooks/services/store/types`

Checklist saat submit demo:

- setup dapat dijalankan
- seluruh alur CRUD product berjalan
- keputusan arsitektur product dijelaskan ringkas

## Catatan Implementasi

- Data produk saat ini bersumber dari mock/in-memory store pada service.
- Data tidak persisten antar refresh penuh jika service kembali ke seed awal.
- Untuk produksi, `ProductService` dapat diarahkan ke backend API tanpa mengubah banyak komponen UI.
