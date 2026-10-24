'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, RefreshCw, CheckCircle, Users } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AdminProdiPage() {
  const [prodis, setProdis] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    id: '',
    name: '',
    degree: 'S1',
    code: '',
    facultyId: '',
    accreditation: 'Unggul',
    capacity: 100,
    registrationFee: 250000,
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/prodi');
      const json = await res.json();
      if (json.success) {
        setProdis(json.data.prodis);
        setFaculties(json.data.faculties);
        if (!form.facultyId && json.data.faculties.length > 0) {
          setForm((f) => ({ ...f, facultyId: json.data.faculties[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm({
      id: '',
      name: '',
      degree: 'S1',
      code: '',
      facultyId: faculties[0]?.id || '',
      accreditation: 'Unggul',
      capacity: 100,
      registrationFee: 250000,
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setForm({
      id: p.id,
      name: p.name,
      degree: p.degree,
      code: p.code,
      facultyId: p.facultyId,
      accreditation: p.accreditation,
      capacity: p.capacity,
      registrationFee: p.registrationFee,
      description: p.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/prodi', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const json = await res.json();
        alert(json.error || 'Gagal menyimpan program studi');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus program studi ini?')) return;
    try {
      const res = await fetch(`/api/admin/prodi?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Gagal menghapus prodi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Program Studi & Biaya PMB
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Atur jurusan, jenjang, akreditasi, kuota pendaftaran, dan tarif biaya formulir Midtrans.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Program Studi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Jenjang & Nama Prodi</th>
                <th className="px-5 py-3.5">Fakultas</th>
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Akreditasi</th>
                <th className="px-5 py-3.5">Daya Tampung</th>
                <th className="px-5 py-3.5">Biaya Formulir</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat program studi...
                  </td>
                </tr>
              ) : prodis.length > 0 ? (
                prodis.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {p.degree} {p.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium">
                      {p.faculty?.name || '-'}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-blue-600">
                      {p.code}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                        {p.accreditation}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {p._count?.applicants || 0} / {p.capacity}
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      {formatRupiah(p.registrationFee)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Belum ada program studi. Klik Tambah Program Studi untuk membuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD / EDIT */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {form.id ? 'Edit Program Studi' : 'Tambah Program Studi Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nama Program Studi *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Teknik Informatika"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Jenjang *</label>
                  <select
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none text-xs bg-white"
                  >
                    <option value="S1">S1 (Sarjana)</option>
                    <option value="D3">D3 (Diploma)</option>
                    <option value="D4">D4 (Sarjana Terapan)</option>
                    <option value="S2">S2 (Magister)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Kode Prodi *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Contoh: TI-S1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Fakultas *</label>
                <select
                  value={form.facultyId}
                  onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none text-xs bg-white"
                  required
                >
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Akreditasi</label>
                  <select
                    value={form.accreditation}
                    onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none text-xs bg-white"
                  >
                    <option value="Unggul">Unggul</option>
                    <option value="Baik Sekali">Baik Sekali</option>
                    <option value="Baik">Baik</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Daya Tampung</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Biaya Formulir PMB (Rp) *</label>
                <input
                  type="number"
                  step="10000"
                  value={form.registrationFee}
                  onChange={(e) => setForm({ ...form, registrationFee: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Keterangan kurikulum atau fokus studi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Program Studi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
