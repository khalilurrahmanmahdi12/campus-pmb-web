'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, ShieldCheck, CreditCard, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    CAMPUS_NAME: '',
    CAMPUS_TAGLINE: '',
    CAMPUS_PHONE: '',
    CAMPUS_EMAIL: '',
    REGISTRATION_FEE: '250000',
  });
  const [midtransStatus, setMidtransStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        if (json.success) {
          setSettings((prev) => ({ ...prev, ...json.data }));
          setMidtransStatus(json.midtransStatus);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Gagal menyimpan pengaturan');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        Memuat konfigurasi...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Website & Midtrans Payment
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi identitas kampus, kontak narahubung PMB, dan panduan integrasi payment gateway Midtrans.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Pengaturan website berhasil disimpan ke database!
        </div>
      )}

      {/* Midtrans Status Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Integrasi Gateway Midtrans Snap</h2>
              <p className="text-xs text-slate-500">Koneksi pembayaran otomatis (QRIS, VA Bank, E-Wallet)</p>
            </div>
          </div>
          <a
            href="https://dashboard.midtrans.com"
            target="_blank"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Dashboard Midtrans
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block">Mode Lingkungan</span>
            <span className="font-bold text-slate-900 mt-1 inline-block">
              {midtransStatus?.isProduction ? '🔴 PRODUCTION (Live)' : '🟢 SANDBOX (Testing)'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block">Status Kredensial API</span>
            <span className={`font-bold mt-1 inline-block ${midtransStatus?.isConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
              {midtransStatus?.isConfigured ? '✅ Kunci Terkonfigurasi' : '⚠️ Masih Kunci Default Sandbox'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block">Webhook Notification URL</span>
            <span className="font-mono text-[11px] text-blue-700 font-bold mt-1 inline-block break-all">
              /api/payment/notification
            </span>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-blue-900">Cara Menghubungkan Midtrans ke Website Ini:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Buka <strong>dashboard.midtrans.com</strong> dan login ke akun Midtrans Anda.</li>
            <li>Buka menu <strong>Settings → Access Keys</strong>.</li>
            <li>Salin <strong>Server Key</strong> dan <strong>Client Key</strong> ke file <code>.env</code> project ini.</li>
            <li>Buka menu <strong>Settings → Configuration</strong> di Midtrans, lalu masukkan URL Notification Webhook: <code className="bg-white px-2 py-0.5 rounded border border-blue-200 font-mono text-[11px]">https://domain-anda.com/api/payment/notification</code></li>
            <li>Status pembayaran calon mahasiswa akan langsung ter-update otomatis secara real-time!</li>
          </ol>
        </div>
      </div>

      {/* Campus Identity Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-600" />
          Identitas & Narahubung Kampus
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Nama Resmi Kampus / Universitas</label>
            <input
              type="text"
              value={settings.CAMPUS_NAME || ''}
              onChange={(e) => setSettings({ ...settings, CAMPUS_NAME: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
              placeholder="Contoh: Universitas Nusantara Teknologi"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Slogan / Tagline Kampus</label>
            <input
              type="text"
              value={settings.CAMPUS_TAGLINE || ''}
              onChange={(e) => setSettings({ ...settings, CAMPUS_TAGLINE: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
              placeholder="Contoh: Unggul, Berkarakter, Berdaya Saing Global"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Hotline / WhatsApp PMB</label>
              <input
                type="text"
                value={settings.CAMPUS_PHONE || ''}
                onChange={(e) => setSettings({ ...settings, CAMPUS_PHONE: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
                placeholder="081234567890"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Email Resmi PMB</label>
              <input
                type="email"
                value={settings.CAMPUS_EMAIL || ''}
                onChange={(e) => setSettings({ ...settings, CAMPUS_EMAIL: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
                placeholder="pmb@kampus.ac.id"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Tarif Biaya Formulir Default (Rp)</label>
            <input
              type="number"
              step="10000"
              value={settings.REGISTRATION_FEE || '250000'}
              onChange={(e) => setSettings({ ...settings, REGISTRATION_FEE: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs font-mono font-bold"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
