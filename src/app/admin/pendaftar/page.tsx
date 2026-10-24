'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  RefreshCw,
  Phone,
  Mail,
  Printer,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import Link from 'next/link';

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (paymentFilter) params.append('paymentStatus', paymentFilter);
      if (admissionFilter) params.append('admissionStatus', admissionFilter);

      const res = await fetch(`/api/admin/applicants?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setApplicants(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [paymentFilter, admissionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplicants();
  };

  const updateStatus = async (id: string, paymentStatus?: string, admissionStatus?: string) => {
    if (!confirm('Yakin ingin memperbarui status pendaftar ini?')) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/applicants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, paymentStatus, admissionStatus }),
      });
      if (res.ok) {
        fetchApplicants();
        if (selectedApplicant?.id === id) {
          const updated = await res.json();
          setSelectedApplicant(updated.data);
        }
      }
    } catch (err) {
      alert('Gagal memperbarui status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteApplicant = async (id: string) => {
    if (!confirm('PERINGATAN: Apakah Anda yakin ingin menghapus data pendaftar ini beserta riwayat pembayarannya?')) return;
    try {
      const res = await fetch(`/api/admin/applicants?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchApplicants();
        if (selectedApplicant?.id === id) setSelectedApplicant(null);
      }
    } catch (err) {
      alert('Gagal menghapus pendaftar');
    }
  };

  const exportCSV = () => {
    if (applicants.length === 0) return alert('Tidak ada data untuk diekspor');

    const headers = [
      'No. Registrasi',
      'Nama Lengkap',
      'NIK',
      'Email',
      'No HP',
      'Program Studi',
      'Asal Sekolah',
      'Tahun Lulus',
      'Nilai Rapor',
      'Status Bayar',
      'Status Seleksi',
      'Tanggal Daftar',
    ];

    const rows = applicants.map((a) => [
      a.registrationNo,
      `"${a.fullName}"`,
      `'${a.nik}`,
      a.email,
      `'${a.phone}`,
      `"${a.major?.degree} ${a.major?.name}"`,
      `"${a.schoolOrigin}"`,
      a.graduationYear,
      a.averageScore,
      a.paymentStatus,
      a.admissionStatus,
      new Date(a.createdAt).toISOString().split('T')[0],
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pendaftar_PMB_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Pendaftar Mahasiswa Baru
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verifikasi berkas calon mahasiswa, periksa transaksi Midtrans, dan tentukan status seleksi.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Ekspor CSV / Excel
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, No. Registrasi, NIK, atau nomor HP..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
          >
            <option value="">Semua Pembayaran</option>
            <option value="PAID">Lunas</option>
            <option value="PENDING">Menunggu Bayar</option>
            <option value="EXPIRED">Kedaluwarsa</option>
            <option value="FAILED">Gagal</option>
          </select>

          {/* Admission filter */}
          <select
            value={admissionFilter}
            onChange={(e) => setAdmissionFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
          >
            <option value="">Semua Status Seleksi</option>
            <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
            <option value="DIVERIFIKASI">Diverifikasi</option>
            <option value="LULUS">Lulus</option>
            <option value="TIDAK_LULUS">Tidak Lulus</option>
          </select>

          <button
            onClick={fetchApplicants}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Muat Ulang"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">No. Registrasi</th>
                <th className="px-5 py-3.5">Nama & Kontak</th>
                <th className="px-5 py-3.5">Program Studi</th>
                <th className="px-5 py-3.5">Pembayaran Midtrans</th>
                <th className="px-5 py-3.5">Status Seleksi</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat data pendaftar...
                  </td>
                </tr>
              ) : applicants.length > 0 ? (
                applicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-blue-700">
                      {a.registrationNo}
                      <span className="block font-sans text-[10px] text-slate-400 font-normal">
                        NIK: {a.nik}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-sm">{a.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{a.phone}</span>
                        <span>•</span>
                        <span>{a.schoolOrigin}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800">
                        {a.major?.degree} {a.major?.name}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {a.major?.faculty?.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={a.paymentStatus} type="payment" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={a.admissionStatus} type="admission" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedApplicant(a)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                        <button
                          onClick={() => deleteApplicant(a.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data pendaftar yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {selectedApplicant.registrationNo}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedApplicant.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Information Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium block">NIK</span>
                <span className="font-bold text-slate-800 text-sm">{selectedApplicant.nik}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Email</span>
                <span className="font-bold text-slate-800">{selectedApplicant.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Nomor WhatsApp / HP</span>
                <a
                  href={`https://wa.me/${selectedApplicant.phone.replace(/^0/, '62')}`}
                  target="_blank"
                  className="font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {selectedApplicant.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Jenis Kelamin</span>
                <span className="font-bold text-slate-800">{selectedApplicant.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Asal Sekolah</span>
                <span className="font-bold text-slate-800">
                  {selectedApplicant.schoolOrigin} ({selectedApplicant.graduationYear})
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Rata-rata Nilai</span>
                <span className="font-bold text-slate-800">{selectedApplicant.averageScore || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-medium block">Alamat</span>
                <span className="text-slate-700">{selectedApplicant.address || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-medium block">Program Studi Pilihan</span>
                <span className="font-bold text-blue-700 text-sm">
                  {selectedApplicant.major?.degree} {selectedApplicant.major?.name} ({selectedApplicant.major?.code})
                </span>
              </div>
            </div>

            {/* Status Change Control Actions */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase">Ubah Status Pendaftar</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(selectedApplicant.id, undefined, 'DIVERIFIKASI')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Verifikasi Berkas
                </button>
                <button
                  onClick={() => updateStatus(selectedApplicant.id, undefined, 'LULUS')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Nyatakan Lulus
                </button>
                <button
                  onClick={() => updateStatus(selectedApplicant.id, undefined, 'TIDAK_LULUS')}
                  disabled={updating}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Nyatakan Tidak Lulus
                </button>
                {selectedApplicant.paymentStatus !== 'PAID' && (
                  <button
                    onClick={() => updateStatus(selectedApplicant.id, 'PAID', undefined)}
                    disabled={updating}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Tandai Lunas Manual
                  </button>
                )}
              </div>
            </div>

            {/* Printable Card Shortcut */}
            <div className="flex justify-between items-center pt-2">
              <Link
                href={`/pmb/bukti/${selectedApplicant.id}`}
                target="_blank"
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                Buka / Cetak Kartu Peserta
              </Link>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
