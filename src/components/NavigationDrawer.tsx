import React from 'react';
import {
  X,
  Home,
  Users,
  Calendar,
  ShieldAlert,
  Shield,
  BarChart3,
  Settings,
  Download,
  LogOut,
  ChevronRight,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { KemenimipasLogo } from './KemenimipasLogo';
import { useApp } from '../context/AppContext';

export const NavigationDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    currentUser,
    setActiveTab,
    setCurrentScreen,
    setIsLoginModalOpen,
    setIsApkModalOpen,
    logout,
  } = useApp();

  if (!isDrawerOpen) return null;

  const navigateTo = (action: () => void) => {
    action();
    setIsDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Body - Dark Navy (#0a223f) */}
      <div className="relative w-[85%] max-w-[340px] h-full bg-[#0b2444] text-white flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KemenimipasLogo className="w-11 h-11" size={44} />
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">
                SILAPASTAR
              </h2>
              <p className="text-[10px] font-semibold text-blue-200 tracking-wider">
                LAPAS KELAS IIA TARAKAN
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Tutup Menu"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 text-sm font-medium">
          <button
            onClick={() =>
              navigateTo(() => {
                setActiveTab('beranda');
                setCurrentScreen('main');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <Home className="w-5 h-5 text-blue-300" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() =>
              navigateTo(() => {
                setActiveTab('kondisi');
                setCurrentScreen('main');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <Users className="w-5 h-5 text-emerald-300" />
            <span>Kondisi WBP</span>
          </button>

          <button
            onClick={() =>
              navigateTo(() => {
                setActiveTab('jadwal');
                setCurrentScreen('main');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <Calendar className="w-5 h-5 text-amber-300" />
            <span>Jadwal</span>
          </button>

          <button
            onClick={() =>
              navigateTo(() => {
                setCurrentScreen('spreadsheet');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <FileSpreadsheet className="w-5 h-5 text-cyan-300" />
            <div className="flex-1 flex items-center justify-between">
              <span>Data Petugas Piket</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                Database
              </span>
            </div>
          </button>

          <button
            onClick={() =>
              navigateTo(() => {
                setCurrentScreen('detail_regu');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <Shield className="w-5 h-5 text-indigo-300" />
            <span>Data Regu</span>
          </button>

          <button
            onClick={() =>
              navigateTo(() => {
                setCurrentScreen('rekapitulasi');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <BarChart3 className="w-5 h-5 text-purple-300" />
            <span>Laporan & Rekapitulasi</span>
          </button>

          <button
            onClick={() =>
              navigateTo(() => {
                setCurrentScreen('users');
              })
            }
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left text-slate-100"
          >
            <Settings className="w-5 h-5 text-slate-300" />
            <span>Pengaturan & Akun</span>
          </button>

          <div className="pt-2 border-t border-white/10 mt-2">
            <button
              onClick={() =>
                navigateTo(() => {
                  setIsApkModalOpen(true);
                })
              }
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-400/20 transition text-left"
            >
              <Download className="w-5 h-5 text-blue-300" />
              <div className="flex-1">
                <p className="font-semibold text-white text-xs">Unduh APK / Pasang</p>
                <p className="text-[10px] text-blue-300">Android Release 2026</p>
              </div>
            </button>
          </div>
        </div>

        {/* Drawer User Footer matching Mockup */}
        <div className="p-3 bg-[#07192f] border-t border-white/10">
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-left"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-blue-300" />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-blue-200 truncate">
                  {currentUser.roleTitle}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </button>

          <div className="mt-2 flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="hover:text-blue-300 underline underline-offset-2"
            >
              Ganti Akun (5 Role)
            </button>
            <button
              onClick={() => {
                logout();
                setIsDrawerOpen(false);
              }}
              className="flex items-center gap-1 hover:text-red-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
