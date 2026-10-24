'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  GraduationCap,
  Clock,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatRupiah, formatDateIndo } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500 uppercase">Memuat statistik pendaftaran...</p>
      </div>
    );
  }

  const {
    totalApplicants = 0,
    paidApplicants = 0,
    pendingApplicants = 0,
    acceptedApplicants = 0,
    totalRevenue = 0,
    prodiStats = [],
    recentApplicants = [],
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Penerimaan Mahasiswa Baru
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau arus pendaftaran, verifikasi seleksi, dan status pembayaran otomatis Midtrans secara langsung.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pendaftar"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Users className="w-4 h-4" />
            Kelola Semua Pendaftar
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Applicants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendaftar</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalApplicants}</p>
            <p className="text-[11px] text-slate-500 mt-1">Akun formulir masuk</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendapatan Formulir</p>
            <p className="text-xl font-black text-emerald-700 mt-1">{formatRupiah(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">{paidApplicants} Pembayaran Lunas</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Payment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu Bayar</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingApplicants}</p>
            <p className="text-[11px] text-slate-500 mt-1">Belum transfer via Midtrans</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Accepted Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lulus Seleksi</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{acceptedApplicants}</p>
            <p className="text-[11px] text-slate-500 mt-1">Calon mahasiswa resmi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Row: Prodi Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Distribusi Pendaftar per Program Studi</h2>
            <p className="text-xs text-slate-500">Perbandingan kuota daya tampung dengan jumlah pendaftar saat ini.</p>
          </div>
          <Link
            href="/admin/prodi"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Atur Prodi & Kuota
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prodiStats.map((item: any) => {
            const percentage = item.capacity > 0 ? Math.min(100, Math.round((item.applicantCount / item.capacity) * 100)) : 0;
            return (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-600">{item.applicantCount} / {item.capacity}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                  <span>Terisi {percentage}%</span>
                  <span>Kode: {item.code}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pendaftaran Terbaru</h2>
            <p className="text-xs text-slate-500">5 pendaftar terbaru yang masuk ke sistem PMB.</p>
          </div>
          <Link
            href="/admin/pendaftar"
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Lihat Semua Pendaftar →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3.5">No. Registrasi</th>
                <th className="px-6 py-3.5">Nama Pendaftar</th>
                <th className="px-6 py-3.5">Program Studi</th>
                <th className="px-6 py-3.5">Status Pembayaran</th>
                <th className="px-6 py-3.5">Status Seleksi</th>
                <th className="px-6 py-3.5">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplicants.length > 0 ? (
                recentApplicants.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700">
                      {app.registrationNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="text-[11px] text-slate-400">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {app.major?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.paymentStatus} type="payment" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.admissionStatus} type="admission" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDateIndo(app.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Belum ada data pendaftar masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
