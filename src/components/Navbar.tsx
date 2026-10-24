'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X, Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                UNIVERSITAS <span className="text-blue-600">NUSANTARA</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                Penerimaan Mahasiswa Baru (PMB)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/prodi"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Program Studi
            </Link>
            <Link
              href="/#alur-pmb"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Alur Pendaftaran
            </Link>
            <Link
              href="/pmb/status"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400" />
              Cek Status PMB
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Portal Admin
            </Link>
            <Link
              href="/pmb/daftar"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg transition-all"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Beranda
          </Link>
          <Link
            href="/prodi"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Program Studi & Fakultas
          </Link>
          <Link
            href="/#alur-pmb"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Alur Pendaftaran
          </Link>
          <Link
            href="/pmb/status"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Cek Status Pendaftaran & Pembayaran
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/pmb/daftar"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl"
            >
              Daftar Mahasiswa Baru
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg"
            >
              Login Portal Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
