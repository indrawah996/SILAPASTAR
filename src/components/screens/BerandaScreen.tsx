import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  ChevronRight,
  Clock,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  UserCheck,
  Star,
  Utensils,
  Shield,
  Award,
  Lock,
  Eye,
  Info,
  Download,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import lapasFacadeImg from '../../assets/images/lapas_tarakan_asli_1791299745920.jpg';

export const BerandaScreen: React.FC = () => {
  const {
    wbpSummary,
    pejabatPiket,
    reguJaga,
    spreadsheetDuties,
    selectedDate,
    setSelectedDate,
    setActiveTab,
    setCurrentScreen,
    setSelectedReguId,
    recentNotification,
    currentUser,
    canContactOfficers,
    setIsApkModalOpen,
  } = useApp();

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Function to determine current active shift according to Indonesian Central Time (WITA - UTC+8)
  const getActiveShiftId = (): 'pagi' | 'siang' | 'malam' => {
    const now = new Date();
    // Tarakan uses WITA (UTC+8)
    const utcHour = now.getUTCHours();
    const witaHour = (utcHour + 8) % 24;

    if (witaHour >= 6 && witaHour < 14) {
      return 'pagi';
    } else if (witaHour >= 14 && witaHour < 22) {
      return 'siang';
    } else {
      return 'malam';
    }
  };

  const currentAutoShift = getActiveShiftId();
  const [selectedShiftId, setSelectedShiftId] = useState<'pagi' | 'siang' | 'malam'>(currentAutoShift);

  // Keep shift in sync or allow manual inspection
  useEffect(() => {
    setSelectedShiftId(currentAutoShift);
  }, [currentAutoShift]);

  // Current displayed Regu
  const currentRegu = reguJaga.find((r) => r.id === selectedShiftId) || reguJaga[0];

  // Find duties on current selected date
  const dutiesToday = spreadsheetDuties.filter((d) => d.tanggal === selectedDate);
  const pengawasToday = dutiesToday.find((d) => d.jenis_piket.includes('PENGAWAS'));
  const perwiraToday = dutiesToday.find((d) => d.jenis_piket.includes('PERWIRA PIKET'));
  const stafPerbantuanToday = dutiesToday.find((d) => d.jenis_piket.includes('STAF PIKET PERBANTUAN'));
  const makananToday = dutiesToday.filter((d) => d.jenis_piket.includes('PEMERIKSAAN MAKANAN'));

  // Fallbacks if not found on selectedDate
  const pengawasNama = pengawasToday?.nama || pejabatPiket.pengawas.nama;
  const pengawasWa = pengawasToday?.no_wa || pejabatPiket.pengawas.no_wa;
  const perwiraNama = perwiraToday?.nama || pejabatPiket.perwira.nama;
  const perwiraWa = perwiraToday?.no_wa || pejabatPiket.perwira.no_wa;
  const stafNama = stafPerbantuanToday?.nama || 'NUR FADLIL ADLHA';
  const stafWa = stafPerbantuanToday?.no_wa || '6282352846910';

  const defaultMakanan = [
    { nama: 'RIZKY PAMULA', no_wa: '6282255149420', label: 'Piket Pemeriksaan Makanan 1' },
    { nama: 'YOGASWARA', no_wa: '6282391666777', label: 'Piket Pemeriksaan Makanan 2' },
  ];

  const makananList =
    makananToday.length > 0
      ? makananToday.map((m, idx) => ({
          nama: m.nama,
          no_wa: m.no_wa,
          label: `Piket Pemeriksaan Makanan ${idx + 1}`,
        }))
      : defaultMakanan;

  const availableDates = Array.from(new Set(spreadsheetDuties.map((d) => d.tanggal))).sort();

  const formatDateIndo = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
    } catch {
      return dateStr;
    }
  };

  const sendWaMessage = (nama: string, tugas: string, noWa: string) => {
    if (!canContactOfficers()) return;
    const text = encodeURIComponent(
      `Yth. Bapak/Ibu ${nama},\n\nKonfirmasi Jadwal Petugas Lapas Kelas IIA Tarakan:\n📌 Tanggal: ${selectedDate}\n🛡️ Tugas: ${tugas}\n\nMohon kehadirannya tepat waktu sesuai SOP Pengamanan Kamtib. Terima kasih.`
    );
    window.open(`https://wa.me/${noWa}?text=${text}`, '_blank');
  };

  const isUserBiasa = currentUser.role === 'user';

  return (
    <div className="space-y-4 pb-24">
      {/* Dynamic Update Notification pill if present */}
      {recentNotification && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-blue-900 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-medium truncate">{recentNotification}</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-md shrink-0">
            Realtime
          </span>
        </div>
      )}

      {/* Guest/User Biasa Notice Banner */}
      {isUserBiasa && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
          <Eye className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] leading-tight">
              Akses Pengunjung / User Biasa Aktif
            </p>
            <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
              Anda memiliki hak akses untuk melihat seluruh monitoring satu data Lapas Tarakan. Tombol ubah data dan kontak telepon/pesan dinonaktifkan untuk keamanan.
            </p>
          </div>
        </div>
      )}

      {/* Hero Card: Lapas Front Photo with User Requested Texts */}
      <div className="relative rounded-2xl overflow-hidden shadow-md group">
        <div className="w-full h-48 sm:h-56 bg-slate-800 relative">
          <img
            src={lapasFacadeImg}
            alt="Lapas Kelas IIA Tarakan"
            className="w-full h-full object-cover brightness-[0.88] transition duration-500 group-hover:scale-105"
            loading="eager"
          />
          {/* Gradient Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F3057]/95 via-[#0F3057]/45 to-transparent flex flex-col justify-end p-4">
            <p className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase opacity-90 drop-shadow-sm">
              SELAMAT DATANG DI
            </p>
            <h2 className="text-white text-xl sm:text-2xl font-black leading-tight tracking-tight drop-shadow-md">
              SILAPASTAR
            </h2>
            <p className="text-amber-300 text-xs sm:text-sm font-bold drop-shadow-sm mt-0.5">
              (Sistem Informasi Lapas Tarakan)
            </p>
            <p className="text-blue-200 text-[11px] sm:text-xs font-semibold tracking-wider drop-shadow-sm uppercase mt-0.5">
              LAPAS KELAS IIA TARAKAN
            </p>
          </div>
        </div>
      </div>

      {/* Prominent APK Download Banner for Android users */}
      <div className="bg-gradient-to-r from-[#0F3057] to-[#1a4b82] rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between border border-blue-900/30">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            {isInstallable ? (
              <Smartphone className="w-5 h-5 text-emerald-300" />
            ) : (
              <Download className="w-5 h-5 text-amber-300" />
            )}
          </div>
          <div className="min-w-0 truncate">
            <p className="text-xs font-bold leading-tight flex items-center gap-1.5 truncate">
              <span>Aplikasi Android SILAPASTAR</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] px-1.5 py-0.2 rounded-full font-mono shrink-0">
                Resmi v1.0
              </span>
            </p>
            <p className="text-[10px] text-blue-200 mt-0.5 truncate">
              {isInstalled
                ? 'Terpasang di perangkat Android Anda'
                : 'Pasang langsung di HP Android tanpa error parse'}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            if (isInstallable) {
              const res = await install();
              if (!res) setIsApkModalOpen(true);
            } else {
              setIsApkModalOpen(true);
            }
          }}
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {isInstallable ? (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pasang ke HP</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Pasang APK</span>
            </>
          )}
        </button>
      </div>

      {/* 2 Quick Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Kondisi WBP */}
        <div
          onClick={() => {
            setActiveTab('kondisi');
            setCurrentScreen('main');
          }}
          className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 hover:border-blue-200 transition active:scale-[0.98] cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>

            <p className="text-[11px] font-semibold text-slate-500">Kondisi WBP</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-800 leading-none">
                {wbpSummary.total_wbp}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Total WBP</span>
            </div>
          </div>

          {/* Sub Stats 2x2 */}
          <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-700">{wbpSummary.di_dalam}</span>
              <span className="text-slate-400 text-[9px]">Di Dalam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="font-bold text-slate-700">{wbpSummary.di_luar}</span>
              <span className="text-slate-400 text-[9px]">Di Luar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="font-bold text-slate-700">{wbpSummary.narapidana}</span>
              <span className="text-slate-400 text-[9px]">Napi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="font-bold text-slate-700">{wbpSummary.tahanan}</span>
              <span className="text-slate-400 text-[9px]">Tahanan</span>
            </div>
          </div>
        </div>

        {/* Card 2: Jadwal Hari Ini */}
        <div
          onClick={() => {
            setActiveTab('jadwal');
            setCurrentScreen('main');
          }}
          className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 hover:border-blue-200 transition active:scale-[0.98] cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>

            <p className="text-[11px] font-semibold text-slate-500">Jadwal Hari Ini</p>
            <div className="mt-0.5">
              <span className="text-lg font-extrabold text-slate-800 leading-tight block">
                {formatDateIndo(selectedDate)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Layanan & Pengamanan</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Pengawas:</span>
              <span className="font-bold truncate max-w-[85px]">{pengawasNama.split(',')[0]}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Perwira:</span>
              <span className="font-bold truncate max-w-[85px]">{perwiraNama.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SECTION BARU: INFORMASI REGU PENGAMANAN SESUAI JAM (PAGI / SIANG / MALAM) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0F3057]">
                REGU PENGAMANAN AKTIF
              </h3>
              <p className="text-[10px] text-slate-400">
                Otomatis Menyesuaikan Waktu Tugas (24 Jam)
              </p>
            </div>
          </div>

          {/* Realtime Shift Status Pill */}
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{currentAutoShift === 'pagi' ? 'Shift Pagi' : currentAutoShift === 'siang' ? 'Shift Siang' : 'Shift Malam'}</span>
          </div>
        </div>

        {/* Shift Selector Tabs: Pagi, Siang, Malam */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl text-center text-xs">
          <button
            onClick={() => setSelectedShiftId('pagi')}
            className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
              selectedShiftId === 'pagi'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pagi (06-14)</span>
            {currentAutoShift === 'pagi' && (
              <span className="block text-[8px] font-normal text-emerald-600">● Saat Ini</span>
            )}
          </button>

          <button
            onClick={() => setSelectedShiftId('siang')}
            className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
              selectedShiftId === 'siang'
                ? 'bg-white text-amber-700 shadow-xs ring-1 ring-amber-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Siang (14-22)</span>
            {currentAutoShift === 'siang' && (
              <span className="block text-[8px] font-normal text-amber-600">● Saat Ini</span>
            )}
          </button>

          <button
            onClick={() => setSelectedShiftId('malam')}
            className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
              selectedShiftId === 'malam'
                ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Malam (22-06)</span>
            {currentAutoShift === 'malam' && (
              <span className="block text-[8px] font-normal text-blue-600">● Saat Ini</span>
            )}
          </button>
        </div>

        {/* Active Regu Card Content */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2.5">
          {/* Header of Shift */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Penugasan Saat Ini
              </span>
              <h4 className="text-sm font-extrabold text-slate-800 leading-tight">
                {currentRegu.nama_regu}
              </h4>
              <p className="text-[11px] text-slate-500">{currentRegu.shift}</p>
            </div>

            <button
              onClick={() => {
                setSelectedReguId(currentRegu.id);
                setCurrentScreen('detail_regu');
              }}
              className="text-xs font-bold text-[#0F3057] bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-2xs"
            >
              <span>Detail Personel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Komandan Regu */}
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-amber-700 uppercase">
                  Komandan Regu
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentRegu.komandan.nama}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  NIP. {currentRegu.komandan.nip}
                </p>
              </div>
            </div>

            {/* Contact buttons only if authorized (non-user) */}
            {canContactOfficers() ? (
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`tel:${currentRegu.komandan.tel || currentRegu.komandan.no_wa}`}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                  title="Telepon Komandan"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/${currentRegu.komandan.no_wa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition"
                  title="WhatsApp Komandan"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Lihat Saja</span>
              </span>
            )}
          </div>

          {/* Quick List of 4 sample anggota currently on post */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1 px-1">
              <span>Personil Anggota ({currentRegu.anggota.length} Orang Siaga):</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {currentRegu.anggota.slice(0, 4).map((ang, idx) => (
                <div
                  key={ang.id}
                  className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-1">
                    <span className="font-bold text-slate-800 truncate block text-[11px]">
                      {idx + 1}. {ang.nama.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate block">
                      {ang.jabatan.split('(')[0]}
                    </span>
                  </div>
                  {canContactOfficers() && (
                    <a
                      href={`tel:${ang.no_wa}`}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="Hubungi"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: INFO PEJABAT PIKET & STAFF PIKET (Sesuai Spreadsheet) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0F3057] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#0F3057]" />
              PEJABAT & STAF PIKET HARI INI
            </h3>
            <p className="text-[10px] text-slate-400">
              Jadwal Layanan Kunjungan & Pemeriksaan Lapas
            </p>
          </div>

          {/* Quick Date Switcher */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl px-2 py-1 text-[10px] font-bold text-slate-700">
            <Calendar className="w-3 h-3 text-[#0F3057]" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-[10px] font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {availableDates.map((dt) => (
                <option key={dt} value={dt}>
                  {formatDateIndo(dt)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. PEJABAT PIKET SUB-SECTION */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Pejabat Piket
          </span>

          {/* Pengawas Piket */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100 hover:border-blue-200 transition">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-[#0F3057] text-white flex items-center justify-center shrink-0 shadow-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded uppercase">
                  Pengawas Piket
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {pengawasNama}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Koordinator Layanan Kunjungan
                </p>
              </div>
            </div>

            {canContactOfficers() ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${pengawasWa}`}
                  title="Panggilan Telepon"
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 transition active:scale-95 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() =>
                    sendWaMessage(
                      pengawasNama,
                      'PENGAWAS PIKET & KOORDINATOR LAYANAN KUNJUNGAN',
                      pengawasWa
                    )
                  }
                  title="Kirim Pesan WhatsApp"
                  className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition active:scale-95 shadow-2xs"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WA</span>
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200">
                <Lock className="w-3 h-3" />
                <span>Lihat Saja</span>
              </span>
            )}
          </div>

          {/* Perwira Piket */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100 hover:border-amber-200 transition">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Star className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded uppercase">
                  Perwira Piket
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {perwiraNama}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Subkoordinator Layanan Kunjungan
                </p>
              </div>
            </div>

            {canContactOfficers() ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${perwiraWa}`}
                  title="Panggilan Telepon"
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 transition active:scale-95 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() =>
                    sendWaMessage(
                      perwiraNama,
                      'PERWIRA PIKET & SUBKOORDINATOR LAYANAN KUNJUNGAN',
                      perwiraWa
                    )
                  }
                  title="Kirim Pesan WhatsApp"
                  className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition active:scale-95 shadow-2xs"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WA</span>
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200">
                <Lock className="w-3 h-3" />
                <span>Lihat Saja</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. STAFF PIKET SUB-SECTION (Staf Perbantuan & Pemeriksaan Makanan) */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Staff Piket
          </span>

          {/* Staf Piket Perbantuan */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150 hover:bg-slate-100/80 transition">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded uppercase">
                  Staf Perbantuan
                </span>
                <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                  {stafNama}
                </h4>
              </div>
            </div>

            {canContactOfficers() ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${stafWa}`}
                  className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center border border-slate-200 transition hover:bg-slate-50"
                >
                  <Phone className="w-3 h-3" />
                </a>
                <button
                  onClick={() =>
                    sendWaMessage(stafNama, 'STAF PIKET PERBANTUAN LAYANAN', stafWa)
                  }
                  className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WA</span>
                </button>
              </div>
            ) : (
              <span className="text-[9px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                Lihat Saja
              </span>
            )}
          </div>

          {/* Piket Pemeriksaan Makanan */}
          {makananList.map((m, idx) => (
            <div
              key={m.nama + idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded uppercase">
                    {m.label}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {m.nama}
                  </h4>
                </div>
              </div>

              {canContactOfficers() ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${m.no_wa}`}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center border border-slate-200 transition hover:bg-slate-50"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => sendWaMessage(m.nama, m.label, m.no_wa)}
                    className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WA</span>
                  </button>
                </div>
              ) : (
                <span className="text-[9px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Lihat Saja
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Quick Link to Full Roster */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('spreadsheet')}
            className="text-[11px] font-bold text-[#0F3057] hover:underline flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Lihat Semua Jadwal Spreadsheet (Layanan & RS)</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Role Action Guide Banner */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600 truncate">
          <Shield className="w-4 h-4 text-[#0F3057] shrink-0" />
          <span className="truncate">
            Peran Aktif:{' '}
            <strong className="text-slate-800">{currentUser.roleTitle}</strong>
          </span>
        </div>
        <span className="text-[10px] text-slate-500 shrink-0 font-semibold">
          {isUserBiasa ? 'Akses Terbatas' : 'RBAC Petugas'}
        </span>
      </div>

      {/* Footer Timestamp */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
        <Clock className="w-3.5 h-3.5" />
        <span>Terakhir diperbarui: {wbpSummary.updated_at}</span>
      </div>
    </div>
  );
};
