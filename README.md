# Campus PMB — Website Kampus & Sistem Penerimaan Mahasiswa Baru Terintegrasi Midtrans Payment Gateway 🎓

**Campus PMB** adalah aplikasi web fullstack modern yang dirancang dan dibangun oleh **KHALILURRAHMAN MAHDI** sesuai dengan standar kompetensi sertifikasi **BNSP (Badan Nasional Sertifikasi Profesi): "Junior Web Programmer"** pada bidang pekerjaan **Pengembangan Perangkat Lunak / Software Development**.

Aplikasi ini menyediakan sistem **Penerimaan Mahasiswa Baru (PMB) end-to-end** dengan pendaftaran online multi-step, **pembayaran formulir otomatis terintegrasi Midtrans Snap** (QRIS, Virtual Account, E-Wallet), **Dashboard Admin** untuk mengelola seluruh data pendaftar, program studi, pengumuman, dan pengaturan website, serta **database cloud PostgreSQL via Supabase** yang di-deploy secara production-ready ke **Vercel**.

---

## 🚀 Live Demo & Kode Sumber

📜 **Sertifikat Kompetensi BNSP**: No. 62019 2513 4 00008866 2026 — *Junior Web Programmer*

💻 **Local Host**: [http://localhost:3000](http://localhost:3000)

📁 **Repository**: [https://github.com/khalilurrahmanmahdi12/campus-pmb-web](https://github.com/khalilurrahmanmahdi12/campus-pmb-web)

💼 **Portofolio**: [https://khalildev.web.id/](https://khalildev.web.id/)

---

## 📜 Sertifikat Kompetensi BNSP

<table>
  <tr>
    <td><strong>Lembaga</strong></td>
    <td>Badan Nasional Sertifikasi Profesi (BNSP) — <em>Indonesian Professional Certification Authority</em></td>
  </tr>
  <tr>
    <td><strong>No. Sertifikat</strong></td>
    <td>62019 2513 4 00008866 2026</td>
  </tr>
  <tr>
    <td><strong>Pemegang Sertifikat</strong></td>
    <td>Khalilurrahman Mahdi</td>
  </tr>
  <tr>
    <td><strong>Kompetensi</strong></td>
    <td><strong>JUNIOR WEB PROGRAMMER</strong></td>
  </tr>
  <tr>
    <td><strong>Bidang Pekerjaan</strong></td>
    <td>Pengembangan Perangkat Lunak / <em>Software Development</em></td>
  </tr>
  <tr>
    <td><strong>Tanggal Penerbitan</strong></td>
    <td>Samarinda, 24 Juni 2026</td>
  </tr>
  <tr>
    <td><strong>Masa Berlaku</strong></td>
    <td>3 (tiga) tahun</td>
  </tr>
  <tr>
    <td><strong>LSP Penerbit</strong></td>
    <td>Lembaga Sertifikasi Profesi Politeknik Negeri Samarinda</td>
  </tr>
</table>

### 🛠️ Unit Kompetensi

Sertifikat kompetensi **Junior Web Programmer** ini mencakup 7 unit kompetensi berikut:

- ✅ **Menggunakan Data Struktur** (*Using the Data Structure*)
- ✅ **Melaksanakan Interface Pengguna** (*Implementing the Software User Interface*)
- ✅ **Menginstalasi Pemrograman Perangkat Lunak** (*Installing the Software Tools Programming*)
- ✅ **Menulis Kode Sesuai Panduan dan Pengalaman Terbaik yang Ada**
- ✅ **Melaksanakan Pemrograman Terstruktur** (*Implementing the Structured Programming*)
- ✅ **Menggunakan Library atau Komponen yang Sudah Ada Sebelumnya** (*Using Pre-existing Library or Components*)
- ✅ **Membuat Dokumen Kode Program** (*Producing a Program Code Document*)
- ✅ **Melakukan Debugging** (*Conducting Debugging*)

---

## ✨ Fitur Utama

### 🌐 1. Portal Publik & Website Kampus
Tampilan website kampus profesional yang informatif dan menarik:

- **Landing Page Kampus**: Profil universitas, keunggulan institusi, akreditasi, statistik mahasiswa & mitra industri.
- **Katalog Fakultas & Program Studi**: Daftar jenjang (S1/D3/D4), deskripsi kurikulum, akreditasi, daya tampung, dan tarif pendaftaran per program studi.
- **Informasi & Alur PMB**: Panduan 4 langkah mudah pendaftaran online yang jelas dan informatif.
- **Pengumuman & Berita Terkini**: Jadwal gelombang PMB, jalur beasiswa, dan info akademik terbaru.

### 📝 2. Pendaftaran Mahasiswa Baru (PMB) & Pembayaran Midtrans
Sistem pendaftaran end-to-end dengan pembayaran otomatis real-time:

- **Formulir Online Bertahap (Multi-step Wizard)**:
  - 🧑 **Langkah 1 — Data Diri**: Identitas Calon Mahasiswa (Nama Lengkap, NIK 16 digit, Email, WhatsApp, Jenis Kelamin, Tanggal Lahir, Alamat Lengkap).
  - 🏫 **Langkah 2 — Riwayat Pendidikan**: Asal Sekolah SMA/SMK/MA, Tahun Lulus, Rata-rata Nilai Rapor.
  - 🎯 **Langkah 3 — Pilihan Program Studi**: Pemilihan fakultas & program studi beserta rincian biaya formulir pendaftaran.

- **Integrasi Pembayaran Otomatis Midtrans Snap**:
  - 💳 Popup pembayaran langsung di website — mendukung **QRIS** (GoPay, ShopeePay, DANA, OVO), **Virtual Account** (BCA, Mandiri, BNI, BRI, Permata), dan **Indomaret/Alfamart**.
  - 🔔 **Webhook Notification Otomatis**: Ketika calon mahasiswa menyelesaikan pembayaran (transfer/scan QRIS), Midtrans mengirim sinyal ke `/api/payment/notification`, status pendaftaran otomatis berubah menjadi **Lunas (PAID)** secara *real-time* tanpa perlu cek mutasi manual.
  - 🧪 Mode **Simulasi Sandbox** bawaan untuk kemudahan pengujian lokal.

- **Cek Status Pendaftaran & Pembayaran**: Cukup masukkan Nomor Pendaftaran atau NIK.
- **Cetak Kartu Tanda Peserta PMB**: Dilengkapi cap digital, data peserta, dan format siap cetak/simpan PDF (`Ctrl + P`).

### 🛡️ 3. Dashboard & Portal Admin (`/admin`)
Panel administrasi lengkap untuk mengelola seluruh aspek PMB:

- **Autentikasi Aman**: Login berbasis **JWT (JSON Web Token)** dan enkripsi password **bcrypt** dengan HTTP-only cookie.
- **Ringkasan Eksekutif (KPIs Dashboard)**: Total pendaftar, total pendapatan formulir (Rp), jumlah lunas/menunggu bayar, dan grafik statistik pendaftar per program studi.
- **Kelola Pendaftar**:
  - 📊 Tabel interaktif dengan pencarian cepat nama/NIK/nomor HP.
  - 🔍 Filter status pembayaran (Lunas, Menunggu Bayar, Expired, Gagal) dan status seleksi (Verifikasi, Lulus, Tidak Lulus).
  - 📋 Modal detail pendaftar lengkap dengan tautan langsung ke WhatsApp calon mahasiswa.
  - ✏️ Ubah status seleksi (Verifikasi Berkas, Lulus, Tidak Lulus) atau tandai lunas manual.
  - 📥 **Ekspor Data ke CSV / Excel**.
- **Kelola Program Studi & Biaya**: Tambah, edit, hapus program studi — atur kuota, akreditasi, dan ubah biaya pendaftaran formulir.
- **Kelola Pengumuman**: Publikasikan berita dan pengumuman PMB terbaru.
- **Pengaturan Website & Midtrans**: Atur identitas kampus, kontak narahubung, serta konfigurasi kunci Midtrans.

---

## 🏗️ Visualisasi Arsitektur Sistem & Integrasi API

Alur orkestrasi pemrosesan pendaftaran, pembayaran, dan manajemen admin:

```
[1. Calon Mahasiswa / Browser]
         │
         ├─────────────────────────────────────────────────┐
         ↓ (Formulir Pendaftaran)                          ↓ (Pembayaran)
[2. Next.js App Router (Frontend)]            [3. Midtrans Snap Popup]
         │                                                 │
         ↓                                                 ↓
[4. API Routes (Backend)]                    [5. Midtrans Server API]
         │                                                 │
         ├── POST /api/pmb/register                        │
         ├── POST /api/payment/snap-token                  │
         ├── POST /api/payment/notification  ◄─────────────┘
         ├── GET  /api/pmb/check                  (Webhook Callback)
         ├── GET  /api/admin/stats
         ├── CRUD /api/admin/applicants
         ├── CRUD /api/admin/prodi
         ├── CRUD /api/admin/announcements
         └── CRUD /api/admin/settings
                  │
                  ↓
[6. Prisma ORM (Query Builder)]
                  │
                  ↓
[7. Supabase PostgreSQL (Cloud Database)]
                  │
                  ↓
[8. Response → UI Rendering (React Components)]
```

---

## 📱 Desain Responsif & Modern UI

Aplikasi ini mengadopsi prinsip desain modern standar aplikasi web profesional:

- 🎨 **Estetika Minimalis & Fokus**: Tema modern dengan palet warna institusional (biru, putih, abu-abu) yang profesional dan bersih.
- 🔤 **Tipografi Bersih**: Tipografi sans-serif modern yang dipadukan dengan hierarki visual yang jelas.
- 📱 **Tata Letak Mobile-First**:
  - Formulir pendaftaran multi-step responsif di semua ukuran layar.
  - Dashboard admin dengan sidebar yang auto-collapse pada perangkat mobile.
  - Tabel data pendaftar dengan horizontal scroll pada layar kecil.
- 🖨️ **Print-Ready**: Kartu tanda peserta PMB dengan layout cetak yang rapi dan profesional.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Fungsi |
|-----------|--------|
| **React 18** | Library UI berbasis komponen |
| **Next.js 14 (App Router)** | Framework fullstack (SSR, API Routes, Routing) |
| **Tailwind CSS** | Utility-First CSS Framework |
| **Lucide Icons** | Ikon SVG modern dan ringan |
| **PostgreSQL (Supabase)** | Database cloud relasional |
| **Prisma ORM v5** | Object-Relational Mapping & Query Builder |
| **Midtrans Snap API** | Payment Gateway (QRIS, VA, E-Wallet) |
| **JWT (jsonwebtoken)** | Autentikasi berbasis token |
| **Bcryptjs** | Enkripsi & hashing password |
| **Vercel** | Platform deployment & hosting |
| **Git + GitHub** | Version control & kolaborasi |

---

## 🚀 Menjalankan Project

### 1. Clone Repositori

```bash
git clone https://github.com/khalilurrahmanmahdi12/campus-pmb-web.git
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

### 4. Generate Prisma Client & Buat Tabel Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed Data Awal (Admin, Fakultas, Program Studi, Pengumuman)

```bash
node prisma/seed.js
```

> **Akun Login Admin Default:**  
> 📧 Email: `admin@kampus.ac.id`  
> 🔑 Password: `admin123`

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser pada:
- 🌐 **Website Publik & PMB**: [http://localhost:3000](http://localhost:3000)
- 🛡️ **Portal Login Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 7. Build untuk Production

```bash
npm run build
```

---

## ☁️ Deployment ke Vercel + Supabase

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

### 3. Set Environment Variables di Vercel Dashboard

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

## 💳 Konfigurasi Midtrans Webhook Otomatis

1. Daftar akun di [Midtrans](https://dashboard.midtrans.com) (pilih **Sandbox** untuk pengujian gratis).
2. Di Dashboard Midtrans, buka menu **Settings → Access Keys**:
   - Salin **Server Key** & **Client Key** ke file `.env`.
3. Buka menu **Settings → Configuration**:
   - Isi **Payment Notification URL** dengan:
     ```
     https://domain-anda.vercel.app/api/payment/notification
     ```
   - Untuk pengujian lokal, gunakan tunneling ([ngrok](https://ngrok.com/)) atau tombol **Simulasi Sandbox** bawaan di halaman pembayaran.
4. Selesai! Pembayaran mahasiswa akan terverifikasi secara otomatis tanpa perlu cek mutasi manual.

---

## 📂 Struktur Utama Project

```
campus-pmb-web/
├── prisma/
│   ├── schema.prisma              # Skema database PostgreSQL (Supabase)
│   └── seed.js                    # Script data awal (admin, fakultas, prodi)
├── src/
│   ├── app/
│   │   ├── (public)/              # Halaman publik
│   │   │   ├── page.tsx           #   └── Landing page kampus
│   │   │   ├── prodi/page.tsx     #   └── Katalog program studi
│   │   │   └── pmb/               #   └── Pendaftaran, pembayaran, status
│   │   │       ├── daftar/page.tsx
│   │   │       ├── bayar/[id]/page.tsx
│   │   │       ├── status/page.tsx
│   │   │       └── cetak/[id]/page.tsx
│   │   ├── admin/                 # Halaman admin
│   │   │   ├── page.tsx           #   └── Dashboard KPI & statistik
│   │   │   ├── login/page.tsx     #   └── Halaman login admin
│   │   │   ├── pendaftar/page.tsx #   └── Kelola pendaftar
│   │   │   ├── prodi/page.tsx     #   └── Kelola program studi
│   │   │   ├── pengumuman/page.tsx#   └── Kelola pengumuman
│   │   │   └── pengaturan/page.tsx#   └── Pengaturan website
│   │   ├── api/                   # API Routes (Backend)
│   │   │   ├── auth/              #   └── Login, logout, session check
│   │   │   ├── pmb/               #   └── Register, check status
│   │   │   ├── payment/           #   └── Snap token, webhook notification
│   │   │   └── admin/             #   └── Stats, applicants, prodi, settings
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles & Tailwind
│   ├── components/                # Komponen reusable
│   │   ├── Navbar.tsx             #   └── Navigasi publik responsif
│   │   ├── Footer.tsx             #   └── Footer website
│   │   ├── StatusBadge.tsx        #   └── Badge status pembayaran/seleksi
│   │   ├── MidtransSnap.tsx       #   └── Tombol pembayaran Midtrans
│   │   ├── AdminSidebar.tsx       #   └── Sidebar navigasi admin
│   │   └── AdminHeader.tsx        #   └── Header panel admin
│   └── lib/                       # Utility & konfigurasi
│       ├── prisma.ts              #   └── Prisma client singleton
│       ├── midtrans.ts            #   └── Midtrans Snap & signature verify
│       ├── auth.ts                #   └── JWT sign, verify, middleware
│       └── utils.ts               #   └── Format rupiah, tanggal, ID generator
├── .env.example                   # Template environment variables
├── .gitignore                     # File yang diabaikan Git
├── tailwind.config.ts             # Konfigurasi Tailwind CSS
├── next.config.mjs                # Konfigurasi Next.js
├── package.json                   # Metadata & dependensi proyek
└── README.md                      # Dokumentasi teknis proyek
```

---

## 📌 Status Project

- ✅ Landing Page Kampus dengan Hero, Statistik, dan Program Studi Unggulan
- ✅ Formulir Pendaftaran Online Multi-Step (Data Diri → Pendidikan → Prodi)
- ✅ Integrasi Pembayaran Otomatis Midtrans Snap (QRIS, VA, E-Wallet)
- ✅ Webhook Notification Real-Time untuk Verifikasi Pembayaran Otomatis
- ✅ Cek Status Pendaftaran & Pembayaran via Nomor Registrasi / NIK
- ✅ Cetak Kartu Tanda Peserta PMB (Format Print-Ready)
- ✅ Dashboard Admin dengan KPI, Grafik, dan Statistik Pendaftar
- ✅ CRUD Pendaftar dengan Filter, Pencarian, dan Ekspor CSV
- ✅ CRUD Program Studi & Fakultas (Tambah, Edit, Hapus)
- ✅ CRUD Pengumuman & Berita PMB
- ✅ Pengaturan Website & Konfigurasi Midtrans
- ✅ Autentikasi Admin Aman (JWT + Bcrypt + HTTP-only Cookie)
- ✅ Database Cloud PostgreSQL via Supabase
- ✅ Deployment Production-Ready ke Vercel
- ✅ 100% Responsif di Layar Desktop, Tablet, & Smartphone
- ✅ Verifikasi dan Kepatuhan Standar Kompetensi BNSP Junior Web Programmer

---

## 👨‍💻 Developer & Creator

**KHALILURRAHMAN MAHDI**  
*Software Engineer — Full Stack Developer*  
*BNSP Certified: Junior Web Programmer*

📜 **No. Sertifikat BNSP**: 62019 2513 4 00008866 2026

🔗 **GitHub**: [github.com/khalilurrahmanmahdi12](https://github.com/khalilurrahmanmahdi12)

💼 **Portofolio**: [https://khalildev.web.id/](https://khalildev.web.id/)

📁 **Project Repository**: [campus-pmb-web](https://github.com/khalilurrahmanmahdi12/campus-pmb-web)

---

## 📄 Lisensi & Dukungan

Proyek ini dibuat sebagai pemenuhan kompetensi sertifikasi **BNSP — Junior Web Programmer** melalui Lembaga Sertifikasi Profesi **Politeknik Negeri Samarinda**.

Dilisensikan di bawah **MIT License**.

Jika proyek ini bermanfaat, jangan lupa berikan ⭐ pada repositori ini!

---

<p align="center">
  Dibuat dengan ❤️ oleh <strong>Khalilurrahman Mahdi</strong><br/>
  menggunakan <strong>Next.js 14</strong> · <strong>Supabase</strong> · <strong>Midtrans</strong> · <strong>Vercel</strong>
</p>
