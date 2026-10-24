'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface ProdiOption {
  id: string;
  name: string;
  degree: string;
  code: string;
  registrationFee: number;
  faculty: { name: string };
}

function PmbRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProdi = searchParams.get('prodi') || '';

  const [step, setStep] = useState(1);
  const [prodis, setProdis] = useState<ProdiOption[]>([]);
  const [loadingProdis, setLoadingProdis] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Data Diri
    fullName: '',
    nik: '',
    email: '',
    phone: '',
    gender: 'LAKI_LAKI',
    birthPlace: '',
    birthDate: '',
    address: '',
    // Step 2: Pendidikan
    schoolOrigin: '',
    graduationYear: new Date().getFullYear().toString(),
    averageScore: '',
    // Step 3: Pilihan Prodi
    majorId: preselectedProdi,
  });

  useEffect(() => {
    async function fetchProdis() {
      try {
        const res = await fetch('/api/admin/prodi');
        const json = await res.json();
        if (json.success && json.data?.prodis) {
          setProdis(json.data.prodis);
          if (!formData.majorId && json.data.prodis.length > 0) {
            setFormData((prev) => ({ ...prev, majorId: preselectedProdi || json.data.prodis[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to load prodis', err);
      } finally {
        setLoadingProdis(false);
      }
    }
    fetchProdis();
  }, [preselectedProdi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const selectedMajor = prodis.find((p) => p.id === formData.majorId);
  const registrationFee = selectedMajor?.registrationFee || 250000;

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Nama lengkap wajib diisi.';
    if (!formData.nik.trim() || formData.nik.length < 16) return 'NIK wajib 16 digit angka.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Email valid wajib diisi.';
    if (!formData.phone.trim()) return 'Nomor WhatsApp / HP wajib diisi.';
    if (!formData.birthDate) return 'Tanggal lahir wajib diisi.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.schoolOrigin.trim()) return 'Nama asal sekolah SMA/SMK/MA wajib diisi.';
    if (!formData.graduationYear) return 'Tahun lulus wajib diisi.';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.majorId) {
      setErrorMessage('Pilih salah satu program studi.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/pmb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || 'Pendaftaran gagal. Periksa kembali isian formulir.');
        setSubmitting(false);
        return;
      }

      // Success -> Redirect to payment page with Midtrans Snap
      const applicantId = result.data.applicantId;
      router.push(`/pmb/bayar/${applicantId}`);
    } catch (err: any) {
      setErrorMessage('Gagal menghubungi server. Pastikan server backend sedang berjalan.');
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Penerimaan Mahasiswa Baru
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          Formulir Pendaftaran Online
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Isi data diri calon mahasiswa dengan teliti dan benar sesuai dokumen kependudukan (KTP/KK).
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-10">
        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
              step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'bg-slate-200 text-slate-600'
            }`}
          >
            1
          </div>
          <span className="text-xs">Data Diri</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
              step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'bg-slate-200 text-slate-600'
            }`}
          >
            2
          </div>
          <span className="text-xs">Asal Sekolah</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
              step >= 3 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'bg-slate-200 text-slate-600'
            }`}
          >
            3
          </div>
          <span className="text-xs">Pilihan Prodi & Biaya</span>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: DATA DIRI */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Identitas Calon Mahasiswa
                </h2>
                <p className="text-xs text-slate-500">Pastikan NIK sesuai dengan KTP atau Kartu Keluarga Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Nama Lengkap (Sesuai Ijazah) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Contoh: Muhammad Rizky Pratama"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    NIK (Nomor Induk Kependudukan) *
                  </label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="16 digit NIK"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Jenis Kelamin *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white transition-all"
                  >
                    <option value="LAKI_LAKI">Laki-Laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Tempat Lahir (Kota/Kabupaten)
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    placeholder="Contoh: Bandung"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Alamat Domisili Lengkap
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Jl. Merdeka No. 12, RT/RW, Kelurahan, Kecamatan, Kota"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Lanjut ke Data Pendidikan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PENDIDIKAN ASAL */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Pendidikan Sebelumnya (Asal Sekolah)
                </h2>
                <p className="text-xs text-slate-500">Informasi sekolah asal SMA / SMK / MA / Sederajat.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Nama Asal Sekolah (SMA / SMK / MA) *
                  </label>
                  <input
                    type="text"
                    name="schoolOrigin"
                    value={formData.schoolOrigin}
                    onChange={handleChange}
                    placeholder="Contoh: SMAN 1 Jakarta / SMKN 2 Bandung"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Tahun Lulus *
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    min={2015}
                    max={2030}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Nilai Rata-rata Ujian / Rapor (Skala 0-100)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="averageScore"
                    value={formData.averageScore}
                    onChange={handleChange}
                    placeholder="Contoh: 85.50"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Lanjut ke Pilihan Prodi
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PILIHAN PRODI & PEMBAYARAN */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Pilihan Program Studi & Pembayaran
                </h2>
                <p className="text-xs text-slate-500">Pilih program studi yang Anda minati.</p>
              </div>

              {loadingProdis ? (
                <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  Memuat daftar program studi...
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Pilih Program Studi *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {prodis.map((p) => {
                      const isSelected = formData.majorId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setFormData({ ...formData, majorId: p.id })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {p.degree} {p.name}
                              </p>
                              <p className="text-xs text-slate-500">{p.faculty?.name || 'Fakultas'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-blue-700">
                              {formatRupiah(p.registrationFee || 250000)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payment Summary Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Biaya Formulir Pendaftaran</span>
                  <span className="text-sm font-black text-slate-900">
                    {formatRupiah(registrationFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
                  <span>Metode Pembayaran</span>
                  <span className="font-bold text-blue-700">Midtrans Otomatis (QRIS / VA / GoPay)</span>
                </div>
                <div className="pt-3 border-t border-blue-200/80 flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Setelah klik tombol di bawah, Anda akan diarahkan ke halaman pembayaran otomatis Midtrans.
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Mendaftarkan & Membuat Tagihan...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Daftar & Lanjut Bayar Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function PmbRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Memuat Formulir Pendaftaran...
          </div>
        </div>
      }
    >
      <PmbRegisterContent />
    </Suspense>
  );
}

