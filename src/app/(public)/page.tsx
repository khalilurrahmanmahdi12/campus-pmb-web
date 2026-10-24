import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  Users,
  Award,
  Building2,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';

export const revalidate = 60; // revalidate every minute

async function getData() {
  try {
    const [majors, announcements] = await Promise.all([
      prisma.studyProgram.findMany({
        take: 6,
        include: { faculty: true },
      }),
      prisma.announcement.findMany({
        where: { isPublished: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { majors, announcements };
  } catch (error) {
    return { majors: [], announcements: [] };
  }
}

export default async function HomePage() {
  const { majors, announcements } = await getData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              Penerimaan Mahasiswa Baru Tahun Akademik 2025/2026 Dibuka!
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]">
              Wujudkan Masa Depan Cemerlang di{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Kampus Unggulan
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Daftar kuliah kini lebih mudah, cepat, dan transparan. Pengisian formulir online dengan metode pembayaran otomatis terintegrasi langsung dengan <strong>Midtrans (QRIS, VA Bank, E-Wallet)</strong>.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pmb/daftar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-extrabold text-blue-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
              >
                Daftar Mahasiswa Baru Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pmb/status"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl transition-all"
              >
                Cek Status Pendaftaran
              </Link>
            </div>

            {/* Badges */}
            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Terakreditasi UNGGUL
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Pembayaran Real-Time Midtrans
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Kartu Ujian Langsung Terbit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
          <div className="p-2">
            <p className="text-3xl sm:text-4xl font-black text-blue-600">15.000+</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Mahasiswa & Alumni</p>
          </div>
          <div className="p-2 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-blue-600">96%</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Lulusan Bekerja & Wirausaha</p>
          </div>
          <div className="p-2 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-blue-600">100+</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Mitra Industri & BUMN</p>
          </div>
          <div className="p-2 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-blue-600">Unggul</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Akreditasi Institusi</p>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section id="alur-pmb" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-widest">
            Alur Pendaftaran Mudah
          </h2>
          <h3 className="text-3xl font-black text-slate-900">
            4 Langkah Mudah Jadi Mahasiswa Baru
          </h3>
          <p className="text-sm text-slate-500">
            Seluruh proses dilakukan secara online dari mana saja tanpa perlu mengantri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Isi Data Diri</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lengkapi formulir pendaftaran online berupa data diri, asal sekolah, dan program studi impian Anda.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-blue-300 shadow-md relative ring-2 ring-blue-500/10">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-blue-500/30">
              02
            </div>
            <div className="inline-block px-2 py-0.5 mb-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
              OTOMATIS MIDTRANS
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Bayar Pendaftaran</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lakukan pembayaran otomatis via QRIS (GoPay/ShopeePay/BCA), Virtual Account Bank, atau Indomaret.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Cetak Kartu Ujian</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Begitu pembayaran lunas, sistem otomatis mengaktifkan status dan mencetak Kartu Tanda Peserta PMB.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-4">
              04
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Pengumuman & Kuliah</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pantau status kelulusan di portal PMB dan siap memulai perkuliahan semester ganjil!
            </p>
          </div>
        </div>
      </section>

      {/* Program Studi Pilihan */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-widest">
                Fakultas & Jurusan
              </h2>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                Pilihan Program Studi Unggulan
              </h3>
            </div>
            <Link
              href="/prodi"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              Lihat Semua Program Studi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {majors.length > 0 ? (
              majors.map((major) => (
                <div
                  key={major.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {major.degree} - {major.code}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Akreditasi {major.accreditation}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {major.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mb-3">
                      {major.faculty?.name || 'Fakultas Terpadu'}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                      {major.description || 'Program studi berorientasi pada kompetensi industri masa depan.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Biaya Formulir</p>
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatRupiah(major.registrationFee || 250000)}
                      </p>
                    </div>
                    <Link
                      href={`/pmb/daftar?prodi=${major.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                    >
                      Pilih Prodi
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-slate-500 text-sm">
                Belum ada data program studi. Jalankan `npm run prisma:seed` untuk mengisi contoh data.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pengumuman & Berita */}
      {announcements.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-widest">
              Informasi Terkini
            </h2>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              Pengumuman & Berita PMB
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-700 mb-3">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2 hover:text-blue-600">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {item.content}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Bottom Banner */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Siap Menjadi Bagian dari Universitas Unggulan?
          </h2>
          <p className="text-base text-blue-100 max-w-2xl mx-auto">
            Kuota penerimaan mahasiswa baru terbatas untuk tiap program studi. Daftarkan diri Anda sekarang juga sebelum gelombang ditutup.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pmb/daftar"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-blue-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20"
            >
              Mulai Pendaftaran Online
            </Link>
            <Link
              href="/pmb/status"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20"
            >
              Lanjutkan Pembayaran
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
