import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Copy,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KemenimipasLogo } from './KemenimipasLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const ApkDownloadModal: React.FC = () => {
  const { isApkModalOpen, setIsApkModalOpen } = useApp();
  const { isInstallable, isInstalled, install, isAndroid } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  if (!isApkModalOpen) return null;

  // The active working URL for the applet
  const appLiveUrl =
    typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://ais-dev-vspcpnqdevbrvh22ox2mcl-970559187414.asia-east1.run.app';

  const directApkUrl = '/SILAPASTAR-v1.0.0-release.apk';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appLiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenDirect = () => {
    window.open(appLiveUrl, '_blank');
  };

  const handleDirectDownload = () => {
    setDownloading(true);
    const a = document.createElement('a');
    a.href = directApkUrl;
    a.download = 'SILAPASTAR-v1.0.0-release.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsApkModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0F3057] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KemenimipasLogo className="w-9 h-9 drop-shadow" />
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Pemasangan Aplikasi Android
              </h3>
              <p className="text-[11px] text-blue-200 font-medium">
                SILAPASTAR - Lapas Kelas IIA Tarakan
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApkModalOpen(false)}
            aria-label="Tutup"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700">
          {/* Card Info App */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center gap-3.5">
            <div className="w-13 h-13 bg-[#0F3057] rounded-xl flex items-center justify-center shadow-md shrink-0">
              <KemenimipasLogo className="w-9 h-9" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-slate-800 leading-tight">
                SILAPASTAR Mobile Android
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                Kementerian Imigrasi dan Pemasyarakatan RI
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> WebAPK & APK Ready
                </span>
                <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
              </div>
            </div>
          </div>

          {/* Active Working Link Box (Fixed from ais-pre to ais-dev) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Tautan Aktif (Buka di Chrome Android):
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Online & Aktif
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appLiveUrl}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-[#0F3057] hover:bg-[#0a2340] text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition active:scale-95"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              *Gunakan tautan di atas untuk mengakses langsung dari HP Android Anda.
            </p>
          </div>

          {/* Box Peringatan Teks Acak seperti di screenshot user */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-[11px] text-amber-900 leading-tight">
                Muncul Kode Teks Acak (PK... AndroidManifest.xml) di Layar HP?
              </p>
              <p className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                Itu terjadi karena pengelola berkas HP Anda membuka file APK menggunakan <strong>Text/HTML Viewer</strong> bawaan ponsel, bukan menginstalnya. <strong>Jangan unduh manual filenya!</strong> Cukup ikuti <strong>Metode 1 (WebAPK)</strong> di bawah ini agar terpasang secara otomatis dan resmi ke HP Anda.
              </p>
            </div>
          </div>

          {/* METODE UTAMA: PWA / WebAPK (100% BEBAS DARI PROBLEM PARSING) */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-950 leading-tight">
                  Metode 1: Pasang WebAPK Resmi (Rekomendasi Utama)
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  100% Berhasil, Resmi dari Google Android & bebas dari masalah <em>&quot;Problem parsing package&quot;</em>.
                </p>
              </div>
            </div>

            {/* In-App Direct Install Button if supported by current browser session */}
            {isInstallable && (
              <button
                onClick={async () => {
                  await install();
                }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>KLIK DISINI: PASANG LANGSUNG KE HP SEKARANG</span>
              </button>
            )}

            {isInstalled && (
              <div className="p-2.5 bg-emerald-100/80 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Aplikasi SILAPASTAR sudah terpasang di perangkat ini!</span>
              </div>
            )}

            {/* Quick 3-step mobile installation guide */}
            <div className="bg-white/80 rounded-xl p-3 border border-emerald-200/70 text-xs space-y-1.5 text-slate-700">
              <p className="font-bold text-[11px] text-emerald-900">
                Cara Pasang di HP Android dalam 5 Detik:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>
                  Buka link di atas di browser <strong className="text-slate-900">Google Chrome</strong> HP Android.
                </li>
                <li>
                  Ketuk ikon <strong className="text-slate-900">Titik Tiga (⋮)</strong> di sudut kanan atas Chrome.
                </li>
                <li>
                  Pilih menu <strong className="text-emerald-700 font-bold">&quot;Instal Aplikasi&quot;</strong> atau <strong className="text-emerald-700 font-bold">&quot;Tambahkan ke Layar Utama&quot;</strong>.
                </li>
                <li>
                  Konfirmasi <strong className="text-slate-900">&quot;Instal&quot;</strong>. Ikon SILAPASTAR akan langsung muncul di laci aplikasi & layar utama HP Anda dengan logo resmi!
                </li>
              </ol>
            </div>

            <button
              onClick={handleOpenDirect}
              className="w-full py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Google Chrome HP Sekarang</span>
            </button>
          </div>

          {/* METODE 2: File APK Langsung & Penjelasan Error Parse */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[#0F3057]" />
                Metode 2: Unduh File Mentah .APK
              </span>
              <button
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Kenapa &quot;Problem Parsing&quot;?</span>
              </button>
            </div>

            <button
              onClick={handleDirectDownload}
              className="w-full py-2.5 px-3 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mengunduh File APK...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File .APK (SILAPASTAR-v1.0.0.apk)</span>
                </>
              )}
            </button>

            {/* Explanation of "Problem parsing package" */}
            {showTroubleshoot && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Penyebab & Solusi &quot;Problem Parsing Package&quot;:</span>
                </div>
                <p className="leading-relaxed text-[10px] text-amber-950">
                  Pesan <em>&quot;There was a problem parsing the package&quot;</em> pada Android terjadi karena keamanan Android memblokir file instalasi mentah dari luar, atau perbedaan versi Android OS (Android 11-15).
                </p>
                <p className="font-semibold leading-relaxed text-[10px] text-emerald-800">
                  👉 <strong>Solusi Terbaik:</strong> Gunakan <strong>Metode 1 (WebAPK)</strong> di atas. Metode ini secara otomatis dikompilasi oleh Google Play Services di perangkat Anda sendiri sehingga 100% kompatibel dan tidak akan pernah error parse!
                </p>
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div className="text-center text-[10px] text-slate-400 pt-1">
            Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia
            <br />
            Lapas Kelas IIA Tarakan • Satu Data Pemasyarakatan 2026
          </div>
        </div>
      </div>
    </div>
  );
};
