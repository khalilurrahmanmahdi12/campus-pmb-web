'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  Printer,
  CreditCard,
  Building,
  User,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import MidtransSnapButton from '@/components/MidtransSnap';
import { formatRupiah, formatDateIndo } from '@/lib/utils';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const applicantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<any>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplicant = async () => {
    try {
      const res = await fetch(`/api/pmb/${applicantId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setApplicant(json.data);
      } else {
        setError(json.error || 'Data pendaftaran tidak ditemukan.');
      }
    } catch (err: any) {
      setError('Gagal memuat data pendaftaran.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (applicantId) {
      fetchApplicant();
    }
  }, [applicantId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-500">Memuat rincian pembayaran...</p>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="py-16 max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'Data tidak ditemukan'}</p>
        <Link
          href="/pmb/status"
          className="inline-flex px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold"
        >
          Cek Pendaftaran Lain
        </Link>
      </div>
    );
  }

  const isPaid = applicant.paymentStatus === 'PAID';
  const latestPayment = applicant.payments?.[0];
  const snapToken = latestPayment?.snapToken || '';
  const orderId = latestPayment?.orderId || `ORDER-PMB-${applicant.registrationNo}`;
  const amount = latestPayment?.amount || applicant.major?.registrationFee || 250000;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                Tagihan Pendaftaran PMB
              </span>
              <StatusBadge status={applicant.paymentStatus} type="payment" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              No. Registrasi: <span className="font-mono text-blue-600">{applicant.registrationNo}</span>
            </h1>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchApplicant();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg self-start sm:self-center transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Perbarui Status
          </button>
        </div>

        {/* If PAID -> Success Card */}
        {isPaid ? (
          <div className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-center">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950 mb-1">
              Pembayaran Berhasil Dikonfirmasi!
            </h2>
            <p className="text-sm text-emerald-800 max-w-md mx-auto mb-6">
              Terima kasih! Biaya pendaftaran Anda sebesar <strong>{formatRupiah(amount)}</strong> telah lunas otomatis via Midtrans.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/pmb/bukti/${applicant.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                Cetak Kartu Tanda Peserta PMB
              </Link>
              <Link
                href="/pmb/status"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-emerald-300 text-emerald-900 font-semibold text-sm rounded-xl hover:bg-emerald-50 transition-all"
              >
                Lihat Status Seleksi
              </Link>
            </div>
          </div>
        ) : (
          /* If PENDING -> Midtrans Payment Box */
          <div className="my-8 p-6 sm:p-8 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Total Tagihan Formulir</p>
                <p className="text-3xl font-black text-blue-900">{formatRupiah(amount)}</p>
                <p className="text-xs text-slate-500 mt-1">Order ID: <span className="font-mono font-medium">{orderId}</span></p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-white px-3 py-2 rounded-xl border border-blue-200 self-start sm:self-auto">
                <Clock className="w-4 h-4 text-blue-500" />
                Menunggu Pembayaran
              </div>
            </div>

            {/* Midtrans Snap Button Component */}
            <MidtransSnapButton
              snapToken={snapToken}
              orderId={orderId}
              amount={amount}
              applicantId={applicant.id}
              onSuccess={() => {
                fetchApplicant();
              }}
              onPending={() => {
                fetchApplicant();
              }}
            />

            {/* Supported payment channels */}
            <div className="mt-6 pt-5 border-t border-blue-200/80">
              <p className="text-xs font-bold text-slate-600 mb-2">Metode Pembayaran Otomatis yang Didukung:</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  QRIS (BCA, GoPay, OVO, ShopeePay)
                </span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  Virtual Account BCA
                </span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  Virtual Account Mandiri (Bill)
                </span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  Virtual Account BNI / BRI / Permata
                </span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  Indomaret / Alfamart
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Applicant Details */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Rincian Data Pendaftar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Nama Lengkap</span>
              <span className="font-bold text-slate-800">{applicant.fullName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">NIK</span>
              <span className="font-mono text-slate-800">{applicant.nik}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Program Studi Pilihan</span>
              <span className="font-bold text-blue-700">
                {applicant.major?.degree} {applicant.major?.name} ({applicant.major?.code})
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Fakultas</span>
              <span className="font-medium text-slate-700">{applicant.major?.faculty?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Asal Sekolah</span>
              <span className="font-medium text-slate-700">{applicant.schoolOrigin}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Email & WhatsApp</span>
              <span className="font-medium text-slate-700">
                {applicant.email} • {applicant.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
