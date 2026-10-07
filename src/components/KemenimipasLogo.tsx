import React from 'react';
import logoImg from '../assets/images/logo_kemenimipas_clean.png';

interface LogoProps {
  className?: string;
  size?: number;
}

export const KemenimipasLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <img
      src={logoImg}
      alt="Logo Kementerian Imigrasi dan Pemasyarakatan"
      width={size}
      height={size}
      className={`object-contain select-none shrink-0 drop-shadow-sm ${className}`}
      loading="eager"
    />
  );
};
