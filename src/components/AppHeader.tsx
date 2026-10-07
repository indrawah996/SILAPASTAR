import React from 'react';
import { Menu, ArrowLeft, Shield, Wifi, BatteryCharging } from 'lucide-react';
import { KemenimipasLogo } from './KemenimipasLogo';
import { useApp } from '../context/AppContext';

interface AppHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showBack = false,
  onBack,
  title = 'SILAPASTAR',
  subtitle = 'LAPAS KELAS IIA TARAKAN',
}) => {
  const { setIsDrawerOpen, currentUser } = useApp();

  return (
    <header className="bg-[#0F3057] text-white shadow-md sticky top-0 z-30 select-none">
      {/* Android Mini Status Bar */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-medium text-slate-300/90 tracking-wide">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold tracking-tight">4G</span>
          <Wifi className="w-3.5 h-3.5" />
          <BatteryCharging className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-1.5 -ml-1 text-white hover:bg-white/10 rounded-xl transition active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex items-center">
              <KemenimipasLogo className="w-10 h-10 drop-shadow-md" size={40} />
            </div>
          )}

          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-tight flex items-center gap-1.5 text-white">
              {title}
            </h1>
            <p className="text-[10px] tracking-wider font-semibold text-blue-200/90">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right side controls: Hamburger Menu & Active Role Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Menu Navigasi"
            className="p-2 text-white hover:bg-white/10 rounded-xl transition active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Role Banner Indicator (Subtle bar showing which account is active) */}
      <div className="bg-[#0b2442] px-4 py-1 text-[11px] flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-1.5 truncate">
          <span className={`w-2 h-2 rounded-full ${currentUser.badgeColor}`}></span>
          <span className="text-slate-300 font-medium truncate">
            Login: <span className="text-white font-semibold">{currentUser.roleTitle}</span>
          </span>
        </div>
        <span className="text-blue-300/80 text-[10px] font-mono shrink-0">
          @{currentUser.username}
        </span>
      </div>
    </header>
  );
};
