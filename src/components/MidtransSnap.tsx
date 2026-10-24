'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface Props {
  snapToken: string;
  orderId: string;
  amount: number;
  applicantId: string;
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    snap?: any;
  }
}

export default function MidtransSnapButton({
  snapToken,
  orderId,
  amount,
  applicantId,
  onSuccess,
  onPending,
  onError,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-demo';
  const snapScriptUrl =
    process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
    'https://app.sandbox.midtrans.com/snap/snap.js';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.snap) {
      setSnapReady(true);
    }
  }, []);

  const handlePay = () => {
    setLoading(true);

    // If snapToken is valid and snap.pay is available
    if (window.snap && snapToken && !snapToken.startsWith('dummy-snap-token')) {
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log('Payment Success:', result);
          setLoading(false);
          if (onSuccess) onSuccess();
        },
        onPending: function (result: any) {
          console.log('Payment Pending:', result);
          setLoading(false);
          if (onPending) onPending();
        },
        onError: function (result: any) {
          console.error('Payment Error:', result);
          setLoading(false);
          if (onError) onError();
        },
        onClose: function () {
          console.log('Payment popup closed by customer');
          setLoading(false);
        },
      });
    } else {
      // Fallback Simulator: Useful for sandbox testing or when sandbox keys are not yet filled
      setIsSimulating(true);
      setLoading(false);
    }
  };

  const simulateSuccessWebhook = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          status_code: '200',
          gross_amount: amount.toString(),
          transaction_status: 'settlement',
          fraud_status: 'accept',
          payment_type: 'qris_simulator',
        }),
      });

      if (res.ok) {
        setIsSimulating(false);
        if (onSuccess) onSuccess();
      } else {
        alert('Gagal mensimulasikan pembayaran.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src={snapScriptUrl}
        data-client-key={clientKey}
        strategy="lazyOnload"
        onLoad={() => setSnapReady(true)}
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Menghubungkan ke Midtrans...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Bayar Sekarang via Midtrans ({formatRupiah(amount)})
            </>
          )}
        </button>

        {isSimulating && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-left">
            <div className="flex items-start gap-2.5 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Mode Simulasi Sandbox Midtrans
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Kredensial Server Key Midtrans di `.env` masih default sandbox dummy. Anda dapat langsung menguji alur otomatis dengan tombol simulasi di bawah:
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={simulateSuccessWebhook}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Simulasi Sukses / Bayar Lunas (Webhook)
              </button>
              <button
                onClick={() => setIsSimulating(false)}
                className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
