# 📘 Product Requirements Document (PRD)
## Secure Work Report System (MVP)

---

# 1. 📌 Ringkasan Produk

## 1.1 Tujuan
Sistem ini digunakan untuk:
- Mengumpulkan laporan kerja berbasis foto dari karyawan lapangan
- Memungkinkan atasan memantau aktivitas kerja secara cepat dan sederhana

## 1.2 Karakteristik Produk
- Mobile-first (untuk karyawan)
- Web dashboard (untuk atasan)
- Fokus pada kecepatan dan kemudahan penggunaan
- Tanpa kompleksitas teknis di UI

## 1.3 Target Pengguna

### Karyawan (Mobile)
- Mengambil dan mengirim laporan kerja

### Atasan / Admin (Web)
- Melihat laporan kerja tim
- Memantau aktivitas harian

---

# 2. 🧠 Prinsip Desain

- Action-first
- Minimal teks
- Tanpa istilah teknis
- Mudah dipahami < 3 detik
- Fokus ke MVP

---

# 3. 🧩 Terminologi

| Istilah | Definisi |
|--------|---------|
| Laporan | Data kerja berupa foto dan informasi |
| Kirim | Proses mengirim laporan ke server |
| Berhasil | Laporan sukses dikirim |
| Gagal | Laporan gagal dikirim |
| Riwayat | Daftar laporan yang sudah dibuat |

---

# 4. 📱 Mobile App (Karyawan)

## 4.1 Fitur

### Login
- Username / password

### Ambil Laporan
- Foto Before
- Foto After
- Waktu otomatis
- Lokasi otomatis

### Kirim Laporan
Ambil foto → Kirim → Hasil

### Status
- Berhasil
- Gagal (dengan tombol Coba Lagi)

---

# 5. ⏱️ Shift Logic

Shift otomatis berdasarkan waktu:

| Shift | Jam |
|------|-----|
| Pagi | 08:00 – 16:00 |
| Sore | 16:00 – 00:00 |
| Malam | 00:00 – 08:00 |

---

# 6. 💻 Admin Dashboard

## Navigasi
- Dashboard
- Laporan
- Karyawan

---

# 7. Dashboard

- Laporan (jumlah hari ini)
- Karyawan (aktif)

Tabel:
Nama | Waktu | Lokasi

---

# 8. Halaman Laporan

Filter:
- Tanggal
- Karyawan

Tabel:
Nama | Waktu | Lokasi

---

# 9. Detail Laporan

- Foto Before
- Foto After
- Lokasi
- Waktu
- Checklist
- Catatan

---

# 10. Halaman Karyawan

- Nama
- Jumlah laporan

---

# 11. UI/UX Guidelines

- Maksimal 1–3 kata per label
- Tanpa teks panjang
- Fokus scan cepat
- Clean & minimal

---

# 12. Flow

User:
Ambil Foto → Kirim → (Berhasil / Gagal)

Admin:
Dashboard → Laporan → Detail

---

# 13. Scope MVP

Termasuk:
- Laporan
- Dashboard
- Monitoring

Tidak termasuk:
- Validasi
- Notifikasi
- Shift management

---

# 14. Kesimpulan

Sistem laporan kerja sederhana, cepat, dan mudah digunakan.
