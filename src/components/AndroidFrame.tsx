import React, { useState } from 'react';
import { Smartphone, Monitor, Shield, LogIn, Download, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const { currentUser, switchRoleQuick, setIsLoginModalOpen, setIsApkModalOpen } = useApp();

  const roles: Array<{ role: UserRole; label: string; short: string; color: string }> = [
    { role: 'superadmin', label: 'Super Admin', short: 'SA', color: 'bg-emerald-600' },
    { role: 'klinik', label: 'Admin Klinik', short: 'KL', color: 'bg-rose-600' },
    { role: 'binadik', label: 'Admin Binadik', short: 'BN', color: 'bg-blue-600' },
    { role: 'kamtib', label: 'Admin Kamtib', short: 'KM', color: 'bg-indigo-600' },
    { role: 'giatja', label: 'Admin Giatja', short: 'GJ', color: 'bg-amber-600' },
    { role: 'user', label: 'User Biasa', short: 'UB', color: 'bg-slate-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-0 sm:p-4 text-slate-800">
      {/* Top Testing Control Toolbar */}
      <header className="w-full max-w-4xl py-2 px-3 mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white tracking-wide">SILAPASTAR</span>
          <span className="text-slate-400 hidden sm:inline">| Lapas Kelas IIA Tarakan</span>
        </div>

        {/* 1-Click Role Switcher Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden md:inline">
            Role Cepat:
          </span>
          {roles.map((r) => {
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRoleQuick(r.role)}
                title={`Beralih ke ${r.label}`}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  isActive
                    ? `${r.color} text-white shadow-sm ring-1 ring-white/30`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{r.short}</span>
                <span className="hidden sm:inline">{r.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
          >
            <LogIn className="w-3 h-3" />
            <span className="hidden sm:inline">Login</span>
          </button>

          <button
            onClick={() => setIsApkModalOpen(true)}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
          >
            <Download className="w-3 h-3" />
            <span>APK</span>
          </button>

          {/* Toggle Device Frame / Full Width */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title={isPhoneFrame ? 'Ubah ke Layar Penuh' : 'Ubah ke Simulasi HP Android'}
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[430px] rounded-none sm:rounded-[36px] border-0 sm:border-[8px] sm:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden min-h-screen sm:min-h-[860px] bg-[#F5F7FB] relative flex flex-col'
            : 'max-w-2xl rounded-2xl shadow-xl overflow-hidden min-h-screen bg-[#F5F7FB] relative flex flex-col'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
