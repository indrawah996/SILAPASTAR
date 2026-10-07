import React, { useEffect, useState } from 'react';
import { KemenimipasLogo } from './KemenimipasLogo';

interface SplashScreenProps {
  onFinish?: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, forceShow = false }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(60), 300);
    const timer2 = setTimeout(() => setProgress(100), 750);
    const timer3 = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  if (!visible && !forceShow) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F3057] text-white flex flex-col items-center justify-between p-8 select-none animate-in fade-in duration-300">
      <div className="w-full flex justify-end">
        <span className="text-[10px] text-blue-300 font-mono tracking-wider">v1.0.0</span>
      </div>

      <div className="flex flex-col items-center text-center max-w-xs">
        {/* Animated Glow Emblem */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-32 h-32 bg-[#163f6e] border border-amber-400/30 rounded-3xl p-3 shadow-2xl flex items-center justify-center">
            <KemenimipasLogo size={96} className="w-24 h-24 drop-shadow-lg" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
          SILAPASTAR
        </h1>
        <p className="text-xs font-bold tracking-wider text-amber-400 mt-1 uppercase">
          SISTEM INFORMASI LAPAS TARAKAN
        </p>
        <p className="text-[11px] text-blue-200 mt-2 font-medium leading-relaxed">
          Satu Data Pemasyarakatan
          <br />
          Lapas Kelas IIA Tarakan
        </p>

        {/* Progress bar */}
        <div className="w-48 bg-white/10 rounded-full h-1.5 mt-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-blue-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-blue-300/80 mt-2 font-mono">
          Sinkronisasi Satu Data Pemasyarakatan...
        </p>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-amber-300 font-bold tracking-wider">
          KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
        </p>
        <p className="text-[9px] text-blue-200/80 mt-0.5 tracking-wide">
          REPUBLIK INDONESIA
        </p>
      </div>
    </div>
  );
};
