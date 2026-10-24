import React from 'react';

interface Props {
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED' | 'MENUNGGU_VERIFIKASI' | 'DIVERIFIKASI' | 'LULUS' | 'TIDAK_LULUS' | string;
  type?: 'payment' | 'admission';
}

export default function StatusBadge({ status, type = 'payment' }: Props) {
  if (type === 'payment') {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Lunas
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
            Menunggu Bayar
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
            Kedaluwarsa
          </span>
        );
      case 'FAILED':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            Gagal / Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  }

  // Admission status
  switch (status) {
    case 'LULUS':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          🎉 Lulus Seleksi
        </span>
      );
    case 'TIDAK_LULUS':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
          Tidak Lulus
        </span>
      );
    case 'DIVERIFIKASI':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
          Berkas Diverifikasi
        </span>
      );
    case 'MENUNGGU_VERIFIKASI':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
          Menunggu Verifikasi
        </span>
      );
  }
}
