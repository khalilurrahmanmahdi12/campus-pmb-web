'use client';

import React from 'react';
import { User, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Props {
  adminName?: string;
  adminEmail?: string;
}

export default function AdminHeader({ adminName = 'Administrator', adminEmail = 'admin@kampus.ac.id' }: Props) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-bold text-slate-600">Sistem PMB & Website Aktif</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Lihat Website
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-4 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{adminName}</p>
            <p className="text-[10px] text-slate-400 font-medium">{adminEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
