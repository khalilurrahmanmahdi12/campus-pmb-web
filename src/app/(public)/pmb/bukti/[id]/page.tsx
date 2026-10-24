'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft, GraduationCap, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatRupiah, formatDateIndo } from '@/lib/utils';

export default function BuktiPendaftaranPage() {
  const params = useParams();
  const applicantId = params.id as string;
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/pmb/${applicantId}`);
        const json = await res.json();
        if (json.success) {
          setApplicant(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [applicantId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Memuat kartu peserta...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="py-20 text-center">
        <p className="text-base text-slate-600">Data pendaftar tidak ditemukan.</p>
        <Link href="/" className="text-blue-600 font-bold mt-2 inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Top action bar - Hidden during print */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link
          href={`/pmb/bayar/${applicant.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Printer className="w-4 h-4" />
          Cetak / Download PDF
        </button>
      </div>

      {/* Printable Card Container */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-xl text-slate-900 print:shadow-none print:border-slate-800 print:p-6 print:m-0">
        {/* Header Kop Kampus */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-white print:bg-black">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                Universitas Nusantara Teknologi
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                PANITIA PENERIMAAN MAHASISWA BARU (PMB) TAHUN AKADEMIK 2025/2026
              </p>
              <p className="text-[11px] text-slate-500">
                Website: www.kampus.ac.id • Email: pmb@kampus.ac.id • Hotline: 021-88997700
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-block px-3 py-1 border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-black rounded uppercase">
              LUNAS (MIDTRANS)
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-base font-black uppercase tracking-wider underline">
            KARTU TANDA PESERTA SELEKSI PMB
          </h2>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start mb-8">
          {/* Photo Placeholder */}
          <div className="sm:col-span-1 flex flex-col items-center">
            <div className="w-32 h-40 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center p-3 text-center text-slate-400">
              <span className="text-xs font-bold">Pasfoto</span>
              <span className="text-[10px]">3 x 4 cm</span>
            </div>
            <div className="mt-3 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">STATUS BERKAS</span>
              <span className="text-xs font-bold text-slate-800">{applicant.admissionStatus}</span>
            </div>
          </div>

          {/* Table Data */}
          <div className="sm:col-span-3">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 font-bold text-slate-500 w-40">Nomor Registrasi</td>
                  <td className="py-2 font-black text-sm text-blue-700 font-mono">
                    {applicant.registrationNo}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">Nama Lengkap</td>
                  <td className="py-2 font-extrabold uppercase">{applicant.fullName}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">NIK (KTP)</td>
                  <td className="py-2 font-mono">{applicant.nik}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">Program Studi Pilihan</td>
                  <td className="py-2 font-black text-slate-900">
                    {applicant.major?.degree} {applicant.major?.name} ({applicant.major?.code})
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">Fakultas</td>
                  <td className="py-2">{applicant.major?.faculty?.name}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">Asal Sekolah</td>
                  <td className="py-2">{applicant.schoolOrigin} ({applicant.graduationYear})</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">Biaya Formulir</td>
                  <td className="py-2 font-semibold">
                    {formatRupiah(applicant.payments?.[0]?.amount || 250000)} (LUNAS via Midtrans)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-500">Tanggal Pendaftaran</td>
                  <td className="py-2">{formatDateIndo(applicant.createdAt)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-8">
          <p className="font-bold text-slate-800">Petunjuk Penting:</p>
          <p>1. Kartu Tanda Peserta ini wajib dicetak dan dibawa saat pelaksanaan ujian seleksi / registrasi ulang.</p>
          <p>2. Pastikan pasfoto terbaru ukuran 3x4 ditempel pada kolom pasfoto yang telah disediakan.</p>
          <p>3. Pantau status pengumuman kelulusan secara berkala di menu <strong>Cek Status PMB</strong> pada website resmi.</p>
        </div>

        {/* Signature Box */}
        <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
          <div className="text-center w-48">
            <p className="text-[10px] text-slate-500">Tanda Tangan Peserta</p>
            <div className="h-16"></div>
            <p className="font-bold underline uppercase">{applicant.fullName}</p>
          </div>

          <div className="text-center w-52">
            <p className="text-[10px] text-slate-500">Panitia PMB Kampus</p>
            <div className="h-16 flex items-center justify-center">
              <span className="px-2 py-0.5 border border-blue-600 text-blue-700 text-[10px] font-bold rounded">
                CAP DIGITAL PMB
              </span>
            </div>
            <p className="font-bold underline">Prof. Dr. Ir. Administrator, M.T.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
