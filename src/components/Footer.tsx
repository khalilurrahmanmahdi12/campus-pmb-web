import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                UNT KAMPUS
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Universitas Nusantara Teknologi berdedikasi mendidik talenta digital berdaya saing global dengan kurikulum berbasis industri dan teknologi mutakhir.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Terakreditasi UNGGUL BAN-PT
            </div>
          </div>

          {/* Col 2: Program Studi */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Fakultas & Prodi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/prodi" className="hover:text-white transition-colors">
                  S1 Teknik Informatika
                </Link>
              </li>
              <li>
                <Link href="/prodi" className="hover:text-white transition-colors">
                  S1 Sistem Informasi
                </Link>
              </li>
              <li>
                <Link href="/prodi" className="hover:text-white transition-colors">
                  S1 Manajemen Bisnis Digital
                </Link>
              </li>
              <li>
                <Link href="/prodi" className="hover:text-white transition-colors">
                  S1 Akuntansi & Keuangan
                </Link>
              </li>
              <li>
                <Link href="/prodi" className="hover:text-white transition-colors">
                  S1 Desain Komunikasi Visual
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: PMB Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Layanan PMB
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pmb/daftar" className="hover:text-white transition-colors">
                  Formulir Pendaftaran
                </Link>
              </li>
              <li>
                <Link href="/pmb/status" className="hover:text-white transition-colors">
                  Cek Status & Pembayaran
                </Link>
              </li>
              <li>
                <Link href="/#alur-pmb" className="hover:text-white transition-colors">
                  Panduan & Syarat Masuk
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Login Admin PMB
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Alamat */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Sekretariat PMB
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>Jl. Pendidikan Luhur No. 88, Kawasan Pendidikan Terpadu, Jakarta</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+62 21 8899 7700 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>pmb@kampus.ac.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Universitas Nusantara Teknologi. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Terintegrasi Pembayaran Otomatis <span className="font-bold text-blue-400">Midtrans Snap</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
