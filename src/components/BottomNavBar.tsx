import React from 'react';
import { Home, Users, Calendar, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, setCurrentScreen } = useApp();

  const handleTabClick = (tab: 'beranda' | 'kondisi' | 'jadwal' | 'lainnya') => {
    setActiveTab(tab);
    if (currentScreen !== 'main') {
      setCurrentScreen('main');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-t-2xl z-30 select-none">
      <div className="grid grid-cols-4 py-2 px-1">
        <button
          onClick={() => handleTabClick('beranda')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'beranda' && currentScreen === 'main'
              ? 'text-[#0F3057] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeTab === 'beranda' && currentScreen === 'main' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F3057] rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Beranda</span>
        </button>

        <button
          onClick={() => handleTabClick('kondisi')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'kondisi' && currentScreen === 'main'
              ? 'text-[#0F3057] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {activeTab === 'kondisi' && currentScreen === 'main' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F3057] rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Kondisi WBP</span>
        </button>

        <button
          onClick={() => handleTabClick('jadwal')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'jadwal' && currentScreen === 'main'
              ? 'text-[#0F3057] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5" />
            {activeTab === 'jadwal' && currentScreen === 'main' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F3057] rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Jadwal</span>
        </button>

        <button
          onClick={() => handleTabClick('lainnya')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'lainnya' || currentScreen !== 'main'
              ? 'text-[#0F3057] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5" />
            {(activeTab === 'lainnya' || currentScreen !== 'main') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F3057] rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Lainnya</span>
        </button>
      </div>
    </nav>
  );
};
