# 🎓 Website Kampus & Portal PMB Terintegrasi Pembayaran Otomatis Midtrans

Website kampus/universitas modern lengkap dengan sistem Penerimaan Mahasiswa Baru (PMB), pembayaran formulir pendaftaran otomatis terintegrasi **Midtrans Snap (QRIS, VA BCA, Mandiri, BNI, BRI, E-Wallet)**, serta **Dashboard Admin** untuk mengelola pendaftar, program studi, pengumuman, dan pengaturan web.

---

## 📜 Sertifikat Kompetensi

> **JUNIOR WEB PROGRAMMER**
>
> Proyek ini dibuat sebagai bagian dari pemenuhan kompetensi **Junior Web Programmer**. Mencakup kemampuan:
>
> - Merancang dan membangun aplikasi web fullstack (frontend & backend)
> - Mengimplementasikan sistem database relasional (PostgreSQL / Supabase)
> - Mengintegrasikan API pihak ketiga (Payment Gateway – Midtrans)
> - Menerapkan autentikasi dan otorisasi pengguna (JWT & bcrypt)
> - Membuat antarmuka pengguna (UI) yang responsif dan modern
> - Melakukan deployment aplikasi ke cloud (Vercel)
> - Mengelola version control menggunakan Git & GitHub

---

## 🚀 Fitur Utama

### 1. 🌐 Portal Publik & Website Kampus
- **Landing Page Kampus**: Profil universitas, keunggulan institusi, akreditasi, statistik mahasiswa & mitra industri.
- **Katalog Fakultas & Program Studi**: Daftar jenjang (S1/D3/D4), deskripsi kurikulum, akreditasi, daya tampung, dan tarif pendaftaran.
- **Informasi & Alur PMB**: Panduan 4 langkah mudah pendaftaran online.
- **Pengumuman & Berita Terkini**: Jadwal gelombang PMB, jalur beasiswa, dan info akademik.

### 2. 📝 Pendaftaran Mahasiswa Baru (PMB) & Pembayaran Midtrans
- **Formulir Online Bertahap (Multi-step)**:
  - Langkah 1: Identitas Calon Mahasiswa (Nama, NIK 16 digit, Email, WhatsApp, Tanggal Lahir, Alamat).
  - Langkah 2: Riwayat Pendidikan (Nama Asal Sekolah SMA/SMK/MA, Tahun Lulus, Nilai Rapor).
  - Langkah 3: Pilihan Program Studi & Rincian Biaya Formulir.
- **Integrasi Pembayaran Otomatis Midtrans Snap**:
  - Popup pembayaran langsung di website (QRIS GoPay/ShopeePay, Virtual Account Bank BCA, Mandiri, BNI, BRI, Permata, Indomaret).
  - **Webhook Notification Otomatis**: Ketika calon mahasiswa menyelesaikan transfer/scan QRIS, Midtrans mengirim sinyal ke `/api/payment/notification`, status pendaftaran otomatis berubah menjadi **Lunas (PAID)** secara *real-time*.
  - Mode simulasi sandbox dev bawaan untuk kemudahan pengujian lokal.
- **Cek Status Pendaftaran & Pembayaran**: Cukup masukkan Nomor Pendaftaran atau NIK.
- **Cetak Kartu Tanda Peserta PMB**: Dilengkapi cap digital, pasfoto, data peserta, dan format siap cetak/simpan PDF (`Ctrl + P`).

### 3. 🛡️ Dashboard & Portal Admin (`/admin`)
- **Autentikasi Aman**: Login berbasis JWT dan enkripsi password `bcrypt`.
- **Ringkasan Eksekutif (KPIs)**: Total pendaftar, total pendapatan formulir (Rp), jumlah lunas/menunggu bayar, dan grafik pendaftar per program studi.
- **Kelola Pendaftar**:
  - Tabel interaktif dengan pencarian cepat nama/NIK/nomor HP.
  - Filter status pembayaran (Lunas, Menunggu Bayar, Expired, Gagal) dan status seleksi.
  - Modal detail pendaftar lengkap dengan tautan langsung ke WhatsApp calon mahasiswa.
  - Ubah status seleksi (Verifikasi Berkas, Lulus, Tidak Lulus) atau tandai lunas manual.
  - **Ekspor Data ke CSV / Excel**.
- **Kelola Program Studi & Biaya**: Tambah, edit kuota, akreditasi, dan ubah biaya pendaftaran formulir.
- **Kelola Pengumuman**: Publikasikan berita dan pengumuman PMB terbaru.
- **Pengaturan Website & Midtrans**: Atur identitas kampus, kontak narahubung, serta panduan konfigurasi kunci Midtrans.

---

## 🛠️ Tech Stack

| Teknologi | Keterangan |
|-----------|------------|
| **React 18 + Next.js 14** | Frontend & Backend (App Router) |
| **Tailwind CSS + Lucide Icons** | Styling & Ikon |
| **PostgreSQL (Supabase)** | Database Cloud |
| **Prisma ORM** | Object-Relational Mapping |
| **Midtrans Snap** | Payment Gateway (Client & Webhook) |
| **JWT + Bcryptjs** | Autentikasi & Enkripsi Password |
| **Vercel** | Hosting & Deployment |
| **Git + GitHub** | Version Control |

---

## 📦 Panduan Instalasi & Menjalankan (Lokal)

### 1. Clone Repository
```bash
git clone https://github.com/<USERNAME>/campus-pmb-web.git
cd campus-pmb-web
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi File `.env`
Salin template environment dan sesuaikan:
```bash
copy .env.example .env
```

Buka file `.env` dan isi variabel berikut:
```env
# Database – Supabase (PostgreSQL)
DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT-ID>.supabase.co:5432/postgres"

# Midtrans Sandbox (Dapatkan di dashboard.midtrans.com → Settings → Access Keys)
MIDTRANS_SERVER_KEY="SB-Mid-server-YOUR_SANDBOX_SERVER_KEY"
MIDTRANS_CLIENT_KEY="SB-Mid-client-YOUR_SANDBOX_CLIENT_KEY"
MIDTRANS_IS_PRODUCTION=false

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-YOUR_SANDBOX_CLIENT_KEY"
NEXT_PUBLIC_MIDTRANS_SNAP_URL="https://app.sandbox.midtrans.com/snap/snap.js"

# Security & Auth
JWT_SECRET="super-secret-jwt-key-campus-pmb-2025"
REGISTRATION_FEE=250000
```

### 4. Generate Prisma Client & Buat Tabel
```bash
npx prisma generate
npx prisma db push
```

### 5. Seed Data Awal
```bash
node prisma/seed.js
```

> **Akun Login Admin Default:**
> - 📧 Email: `admin@kampus.ac.id`
> - 🔑 Password: `admin123`

### 6. Jalankan Server Development
```bash
npm run dev
```

Buka browser di:
- 🌐 **Website Publik & PMB**: [http://localhost:3000](http://localhost:3000)
- 🛡️ **Portal Login Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## ☁️ Deployment ke Vercel

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit - Campus PMB"
git remote add origin https://github.com/<USERNAME>/campus-pmb-web.git
git branch -M main
git push -u origin main
```

### 2. Import di Vercel
1. Buka [vercel.com](https://vercel.com) → **New Project** → Import repo `campus-pmb-web`.
2. Framework otomatis terdeteksi sebagai **Next.js**.

### 3. Set Environment Variables di Vercel
Tambahkan variabel berikut di **Settings → Environment Variables**:

| Variable | Contoh Value |
|----------|--------------|
| `DATABASE_URL` | `postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres` |
| `MIDTRANS_SERVER_KEY` | `SB-Mid-server-xxx` |
| `MIDTRANS_CLIENT_KEY` | `SB-Mid-client-xxx` |
| `MIDTRANS_IS_PRODUCTION` | `false` |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | `SB-Mid-client-xxx` |
| `NEXT_PUBLIC_MIDTRANS_SNAP_URL` | `https://app.sandbox.midtrans.com/snap/snap.js` |
| `JWT_SECRET` | `your-secret-key` |
| `REGISTRATION_FEE` | `250000` |
| `NEXT_PUBLIC_APP_URL` | `https://campus-pmb-web.vercel.app` |

### 4. Deploy
Klik **Deploy** → tunggu build selesai → website live! 🚀

---

## 💳 Konfigurasi Midtrans Webhook

1. Daftar akun di [Midtrans](https://dashboard.midtrans.com) (pilih **Sandbox** untuk pengujian gratis).
2. Di Dashboard Midtrans, buka **Settings → Access Keys**:
   - Salin **Server Key** & **Client Key** ke file `.env`.
3. Buka **Settings → Configuration**:
   - Isi **Payment Notification URL** dengan:
     ```
     https://domain-anda.vercel.app/api/payment/notification
     ```
   - Untuk pengujian lokal, gunakan tunneling ([ngrok](https://ngrok.com/)) atau tombol **Simulasi Sandbox** bawaan di halaman pembayaran.
4. Selesai! Pembayaran mahasiswa akan terverifikasi secara otomatis tanpa perlu cek mutasi manual.

---

## 📁 Struktur Proyek

```
campus-pmb-web/
├── prisma/
│   ├── schema.prisma          # Skema database (PostgreSQL)
│   └── seed.js                # Script data awal
├── src/
│   ├── app/
│   │   ├── (public)/          # Halaman publik (home, prodi, pmb)
│   │   ├── admin/             # Halaman admin (dashboard, pendaftar, prodi, dll)
│   │   ├── api/               # API routes (auth, pmb, payment, admin)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Komponen reusable (Navbar, Footer, StatusBadge, dll)
│   └── lib/                   # Utility (prisma, midtrans, auth, utils)
├── .env.example               # Template environment variables
├── tailwind.config.ts         # Konfigurasi Tailwind CSS
├── next.config.mjs            # Konfigurasi Next.js
├── package.json
└── README.md
```

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan **Sertifikasi Kompetensi Junior Web Programmer**.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan <strong>Next.js</strong>, <strong>Supabase</strong>, dan <strong>Midtrans</strong>
</p>
