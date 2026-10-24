import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { GraduationCap, ArrowRight, Award, Users, BookOpen } from 'lucide-react';

export const revalidate = 60;

export default async function ProdiPage() {
  const faculties = await prisma.faculty.findMany({
    include: {
      majors: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Fakultas & Program Studi
        </h1>
        <p className="text-base text-slate-600">
          Pilih jalur pendidikan yang tepat untuk meraih karir impian Anda. Seluruh kurikulum dirancang sinkron dengan kebutuhan industri digital & global.
        </p>
      </div>

      <div className="space-y-12">
        {faculties.length > 0 ? (
          faculties.map((faculty) => (
            <div key={faculty.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-6 mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Fakultas Terakreditasi
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {faculty.name} ({faculty.code})
                </h2>
                {faculty.description && (
                  <p className="text-sm text-slate-500 mt-1.5">{faculty.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {faculty.majors.map((major) => (
                  <div
                    key={major.id}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-extrabold">
                          {major.degree}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-bold">
                          Akreditasi {major.accreditation}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {major.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-3">
                        {major.description || 'Program studi berkualitas tinggi dengan dosen praktisi industri.'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Daya Tampung: {major.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Biaya Formulir</p>
                        <p className="text-sm font-extrabold text-slate-900">
                          {formatRupiah(major.registrationFee || 250000)}
                        </p>
                      </div>
                      <Link
                        href={`/pmb/daftar?prodi=${major.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                      >
                        Daftar PMB
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            Belum ada fakultas atau program studi yang terdaftar di database.
          </div>
        )}
      </div>
    </div>
  );
}
