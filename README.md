# KasKu — Monthly Finance Tracker

**KasKu** adalah aplikasi web ringan untuk mencatat dan mengelola pengeluaran serta pemasukan keuangan bulanan secara simpel, cepat, dan terorganisir. Semua data disimpan secara lokal di peramban (browser) Anda tanpa memerlukan backend atau database server.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/tech-HTML%20%7C%20TailwindCSS%20%7C%20JS-brightgreen)

## Fitur Utama

- **Pencatatan Pemasukan & Pengeluaran:** Catat transaksi harian lengkap dengan tanggal dan keterangan.
- **Auto-Format Nominal:** Format angka otomatis menambahkan pemisah ribuan (contoh: `1.000.000`) saat mengetik.
- **Dasbor Ringkasan:** Menghitung total pemasukan, total pengeluaran, dan sisa saldo secara real-time.
- **Filter & Pencarian:** Cari transaksi berdasarkan kata kunci, filter berdasarkan jenis (pemasukan/pengeluaran), dan urutkan tanggal.
- **Export ke Excel:** Unduh laporan riwayat transaksi ke dalam format `.xlsx` hanya dengan satu klik.
- **Dark Mode Support:** Mode gelap dan terang yang nyaman di mata dan otomatis mengingat preferensi pengguna.
- **Penyimpanan Lokal (Offline-first):** Memanfaatkan HTML5 LocalStorage, data tetap tersimpan aman di browser Anda tanpa perlu *login*.

## Teknologi yang Digunakan

- **HTML5** & **Vanilla JavaScript (ES6+)**
- **Tailwind CSS** (via CDN / Utility classes)
- **SheetJS (xlsx.full.min.js)** untuk fitur ekspor spreadsheet

## Cara Penggunaan

1. Clone repositori ini atau unduh file zip:
   ```bash
   git clone [https://github.com/username-kamu/kasku.git](https://github.com/username-kamu/kasku.git)
