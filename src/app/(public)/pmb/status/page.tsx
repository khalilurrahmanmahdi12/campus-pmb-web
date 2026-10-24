'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CreditCard,
  Printer,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatRupiah, formatDateIndo } from '@/lib/utils';

export default function CheckStatusPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/pmb/check?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Data pendaftar tidak ditemukan.');
      } else {
        setResult(json.data);
      }
    } catch (err) {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Portal Pelayanan Calon Mahasiswa
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          Cek Status Pendaftaran & Pembayaran
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Masukkan <strong>Nomor Pendaftaran</strong> (contoh: PMB2025...) atau <strong>16 digit NIK KTP</strong> Anda.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
        <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masukkan Nomor Pendaftaran atau NIK..."
            className="w-full px-5 py-4 text-sm sm:text-base outline-none text-slate-800 placeholder-slate-400 font-medium"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-70 shrink-0"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">Cari Data</span>
          </button>
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Nomor Registrasi</p>
              <h2 className="text-2xl font-black text-slate-900 font-mono text-blue-600">
                {result.registrationNo}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={result.paymentStatus} type="payment" />
              <StatusBadge status={result.admissionStatus} type="admission" />
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Nama Lengkap</span>
              <span className="font-bold text-slate-800 text-base">{result.fullName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">NIK</span>
              <span className="font-mono text-slate-800">{result.nik}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Program Studi</span>
              <span className="font-bold text-blue-700">
                {result.major?.degree} {result.major?.name}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Fakultas</span>
              <span className="text-slate-700">{result.major?.faculty?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Asal Sekolah</span>
              <span className="text-slate-700">{result.schoolOrigin}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Tanggal Terdaftar</span>
              <span className="text-slate-700">{formatDateIndo(result.createdAt)}</span>
            </div>
          </div>

          {/* Action buttons depending on paymentStatus */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            {result.paymentStatus === 'PAID' ? (
              <Link
                href={`/pmb/bukti/${result.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                Cetak Kartu Tanda Peserta PMB
              </Link>
            ) : (
              <Link
                href={`/pmb/bayar/${result.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Selesaikan Pembayaran Midtrans Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
