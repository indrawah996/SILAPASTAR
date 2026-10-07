import React, { useState } from 'react';
import { X, Lock, User, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { KemenimipasLogo } from './KemenimipasLogo';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, switchRoleQuick, currentUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsLoginModalOpen(false);
      }, 700);
    }
  };

  const handleQuickSwitch = (role: UserRole) => {
    switchRoleQuick(role);
    setSuccessMsg(`Berhasil beralih ke role ${role.toUpperCase()}`);
    setTimeout(() => {
      setIsLoginModalOpen(false);
    }, 500);
  };

  const roleProfiles: Array<{
    role: UserRole;
    user: string;
    pass: string;
    title: string;
    dept: string;
    allowed: string;
    color: string;
  }> = [
    {
      role: 'superadmin',
      user: 'superadmin',
      pass: 'silapastar2026',
      title: 'SUPER ADMIN (Kamtib)',
      dept: 'Seksi Kamtib Lapas Tarakan',
      allowed: 'FULL ACCESS (Semua data, pengguna, audit trail)',
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    },
    {
      role: 'klinik',
      user: 'klinik',
      pass: 'klinik123',
      title: 'ADMIN KLINIK',
      dept: 'Poliklinik Kesehatan Lapas Tarakan',
      allowed: 'Hanya edit modul WBP Rumah Sakit (Rawat Inap)',
      color: 'bg-rose-500/10 text-rose-700 border-rose-300',
    },
    {
      role: 'binadik',
      user: 'binadik',
      pass: 'binadik123',
      title: 'ADMIN BINADIK',
      dept: 'Seksi Pembinaan Narapidana & Anak Didik',
      allowed: 'Hanya edit TOTAL WBP (Napi, Tahanan, Di Dalam)',
      color: 'bg-blue-500/10 text-blue-700 border-blue-300',
    },
    {
      role: 'kamtib',
      user: 'kamtib',
      pass: 'kamtib123',
      title: 'ADMIN KAMTIB',
      dept: 'Seksi Keamanan dan Ketertiban',
      allowed: 'Hanya edit Jadwal Petugas & Regu Jaga Pengamanan',
      color: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
    },
    {
      role: 'giatja',
      user: 'giatja',
      pass: 'giatja123',
      title: 'ADMIN GIATJA',
      dept: 'Seksi Kegiatan Kerja (Kemandirian)',
      allowed: 'Hanya edit WBP Kerja Luar Asimilasi & Kebersihan',
      color: 'bg-amber-500/10 text-amber-700 border-amber-300',
    },
    {
      role: 'user',
      user: 'user',
      pass: 'user123',
      title: 'USER BIASA (Masyarakat / Tamu)',
      dept: 'Pengunjung / Pegawai Non-Admin',
      allowed: 'Hanya melihat info (Tanpa edit & tanpa akses kontak)',
      color: 'bg-slate-500/10 text-slate-700 border-slate-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsLoginModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0F3057] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KemenimipasLogo className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-base leading-tight">Autentikasi Akun Lapas</h3>
              <p className="text-[11px] text-blue-200">Sistem Berbasis Peran (RBAC)</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Currently logged in alert */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-500">Sesi Aktif Saat Ini:</span>
              <p className="font-bold text-slate-800">{currentUser.name}</p>
              <span className="text-[11px] text-[#0F3057] font-semibold">
                {currentUser.roleTitle}
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${currentUser.badgeColor}`}>
              Aktif
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin / klinik / binadik / kamtib / giatja"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3057] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3057] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F3057] hover:bg-[#0a2340] text-white font-semibold text-xs rounded-xl shadow-md transition active:scale-[0.99]"
            >
              Masuk dengan Kredensial
            </button>
          </form>

          {/* 1-Click Fast Role Switcher (For easy inspection & testing) */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0F3057]" />
                1-Klik Uji Coba Cepat (5 Role Akun):
              </span>
              <span className="text-[10px] text-slate-400">Pilih untuk simulasi</span>
            </div>

            <div className="space-y-2">
              {roleProfiles.map((p) => {
                const isActive = currentUser.role === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickSwitch(p.role)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      isActive
                        ? 'border-[#0F3057] bg-blue-50/50 shadow-xs ring-1 ring-[#0F3057]'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{p.title}</span>
                        {isActive && (
                          <span className="text-[9px] bg-[#0F3057] text-white px-1.5 py-0.2 rounded font-semibold">
                            Sedang Dipakai
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.allowed}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        User: <span className="text-slate-600 font-semibold">{p.user}</span> | Pass:{' '}
                        <span className="text-slate-600 font-semibold">{p.pass}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[11px] font-semibold text-[#0F3057] bg-blue-100/70 hover:bg-blue-200/80 px-2 py-1 rounded-lg">
                        Gunakan
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
