# 📘 Design System Guide — Admin Dashboard (Connecteam Style)

## 🎯 Core Principles
- Minimal & clean (hapus yang tidak penting)
- Fast scanning (< 3 detik)
- Visual-first (fokus ke gambar)
- Konsisten di semua halaman
- Tanpa istilah teknis

---

## 🎨 Color System

| Element | Color |
|--------|------|
| Primary | #2563EB |
| Background | #F8FAFC |
| Card | #FFFFFF |
| Border | #E2E8F0 |
| Text Primary | #0F172A |
| Text Secondary | #64748B |
| Dark Mode | #0F172A / #000000 |

---

## 🔤 Typography

- Font: Inter (atau sans-serif modern)
- Title: 20–24px (bold)
- Section: 16–18px (semi-bold)
- Body: 14–16px
- Subtext: 12–14px (abu)
- Label: max 1–3 kata

---

## 📐 Layout & Spacing

- Gunakan sistem 8px (8, 16, 24, 32)
- Banyak whitespace
- Grid konsisten
- Hindari layout padat

---

## 🧩 Card Design

- Background: putih
- Radius: 10–12px
- Shadow: ringan
- Padding: 16–20px

---

## 🔘 Button

- Primary: biru + putih
- Secondary: outline / soft
- Radius: 8–10px
- Hover: sedikit gelap

---

## 🖼️ Image Handling

- Gambar harus dominan
- Rounded: 8–12px
- Support multiple image (gallery)
- Klik → fullscreen viewer

---

## 🌫️ Shadow System

- Gunakan shadow ringan
- Contoh:
```css
box-shadow: 0 2px 8px rgba(0,0,0,0.05);
```

---

## ⚡ Interaction

- Hover state wajib
- Cursor pointer untuk klik
- Animasi halus (fade/slide)
- Klik → masuk detail

---

## ❌ Do & Don't

### ✅ Do:
- Keep simple
- Fokus data penting
- UI clean

### ❌ Don't:
- Jangan tampilkan data teknis
- Jangan over-design
- Jangan terlalu banyak fitur

---

## 🎯 Final Goal

UI harus terasa:
- Cepat
- Bersih
- Mudah dipahami
- Profesional (SaaS level)
