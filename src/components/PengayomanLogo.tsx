import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const PengayomanLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Golden/Yellow Gear Ring */}
      <circle cx="50" cy="50" r="46" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" fill="#0F3057" stroke="#FBBF24" strokeWidth="1.5" />

      {/* Inner Decorative Golden Rays / Starburst */}
      <g stroke="#FBBF24" strokeWidth="1" opacity="0.6">
        <line x1="50" y1="12" x2="50" y2="88" />
        <line x1="12" y1="50" x2="88" y2="50" />
        <line x1="23" y1="23" x2="77" y2="77" />
        <line x1="23" y1="77" x2="77" y2="23" />
      </g>

      {/* Golden Shield Background */}
      <path
        d="M50 20 L74 30 V56 C74 70 50 82 50 82 C50 82 26 70 26 56 V30 L50 20 Z"
        fill="#1E3A8A"
        stroke="#FCD34D"
        strokeWidth="2.5"
      />

      {/* Beringin Tree / Bintang Emas */}
      {/* Star at top */}
      <polygon
        points="50,26 52.5,31.5 58,32 54,36 55.5,41.5 50,38.5 44.5,41.5 46,36 42,32 47.5,31.5"
        fill="#FBBF24"
      />

      {/* Beringin Tree Canopy / Pengayoman Core */}
      <path
        d="M50 38 C42 38 40 45 42 49 C38 50 37 54 41 57 C38 60 41 64 46 64 C47 64 48 63 48.5 62 L48.5 67 L51.5 67 L51.5 62 C52 63 53 64 54 64 C59 64 62 60 59 57 C63 54 62 50 58 49 C60 45 58 38 50 38 Z"
        fill="#34D399"
        stroke="#065F46"
        strokeWidth="1"
      />

      {/* Padi & Kapas Wreath around shield */}
      <path
        d="M32 60 C30 50 32 40 37 34"
        stroke="#FDE047"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M68 60 C70 50 68 40 63 34"
        stroke="#FDE047"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Red White Ribbon at Bottom */}
      <path
        d="M32 70 Q50 78 68 70 L65 75 Q50 82 35 75 Z"
        fill="#EF4444"
        stroke="#B91C1C"
        strokeWidth="1"
      />
      <path
        d="M35 75 Q50 82 65 75 L63 78 Q50 84 37 78 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="0.8"
      />
    </svg>
  );
};
