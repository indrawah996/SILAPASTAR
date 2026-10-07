import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Shield,
  Star,
  UserCheck,
  ChevronRight,
  Phone,
  MessageCircle,
  Clock,
  Edit3,
  Lock,
  Plus,
  DoorClosed,
  HeartPulse,
  Wrench,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JadwalScreen: React.FC = () => {
  const {
    pejabatPiket,
    reguJaga,
    selectedDate,
    setSelectedDate,
    setSelectedReguId,
    setCurrentScreen,
    canEditJadwal,
    updatePejabatPiket,
    spreadsheetDuties,
    canContactOfficers,
  } = useApp();

  const [isEditPejabatOpen, setIsEditPejabatOpen] = useState(false);
  const [pengawasNama, setPengawasNama] = useState(pejabatPiket.pengawas.nama);
  const [pengawasWa, setPengawasWa] = useState(pejabatPiket.pengawas.no_wa);
  const [perwiraNama, setPerwiraNama] = useState(pejabatPiket.perwira.nama);
  const [perwiraWa, setPerwiraWa] = useState(pejabatPiket.perwira.no_wa);

  // Available dates from spreadsheet
  const availableDates = Array.from(new Set(spreadsheetDuties.map((d) => d.tanggal))).sort();

  // Find duties on selected date
  const dutiesToday = spreadsheetDuties.filter((d) => d.tanggal === selectedDate);
  const pengawasToday = dutiesToday.find((d) => d.jenis_piket.includes('PENGAWAS'));
  const perwiraToday = dutiesToday.find((d) => d.jenis_piket.includes('PERWIRA PIKET'));

  const activePengawasNama = pengawasToday?.nama || pejabatPiket.pengawas.nama;
  const activePengawasWa = pengawasToday?.no_wa || pejabatPiket.pengawas.no_wa;
  const activePerwiraNama = perwiraToday?.nama || pejabatPiket.perwira.nama;
  const activePerwiraWa = perwiraToday?.no_wa || pejabatPiket.perwira.no_wa;

  const handleOpenReguDetail = (reguId: string) => {
    setSelectedReguId(reguId);
    setCurrentScreen('detail_regu');
  };

  const handleSavePejabat = (e: React.FormEvent) => {
    e.preventDefault();
    updatePejabatPiket(
      {
        ...pejabatPiket.pengawas,
        nama: pengawasNama,
        no_wa: pengawasWa,
      },
      {
        ...pejabatPiket.perwira,
        nama: perwiraNama,
        no_wa: perwiraWa,
      }
    );
    setIsEditPejabatOpen(false);
  };

  const formatDateIndo = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
    } catch {
      return dateStr;
    }
  };

  const reguPagi = reguJaga.find((r) => r.id === 'pagi') || reguJaga[0];
  const reguSiang = reguJaga.find((r) => r.id === 'siang') || reguJaga[1];
  const reguMalam = reguJaga.find((r) => r.id === 'malam') || reguJaga[2];
  const reguPortir = reguJaga.find((r) => r.id === 'portir') || reguJaga[3];
  const reguKesehatan = reguJaga.find((r) => r.id === 'kesehatan') || reguJaga[4];
  const reguBlokWanita =
    reguJaga.find((r) => r.id === 'blok_wanita') ||
    reguJaga.find((r) => r.id === 'sarpras') ||
    reguJaga[5];

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header with Date Switcher matching Mockup */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">Jadwal Hari Ini</h2>
          <p className="text-[11px] text-slate-500">Piket Layanan & Pengamanan Lapas</p>
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#0F3057]" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-[11px] font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            {availableDates.map((dt) => (
              <option key={dt} value={dt}>
                {formatDateIndo(dt)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button to open full spreadsheet view */}
      <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/60 rounded-xl p-2.5">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#0F3057]" />
          <span className="text-xs font-semibold text-slate-700">
            Jadwal Lengkap Spreadsheet (WhatsApp Direct)
          </span>
        </div>
        <button
          onClick={() => setCurrentScreen('spreadsheet')}
          className="text-xs font-bold text-[#0F3057] hover:underline flex items-center gap-0.5"
        >
          <span>Buka Data</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION 1: Pejabat Piket matching Mockup */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-50/80 px-4 py-2.5 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0F3057] font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Pejabat Piket</span>
          </div>

          {canEditJadwal() ? (
            <button
              onClick={() => {
                setPengawasNama(activePengawasNama);
                setPengawasWa(activePengawasWa);
                setPerwiraNama(activePerwiraNama);
                setPerwiraWa(activePerwiraWa);
                setIsEditPejabatOpen(true);
              }}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-blue-200"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit (Kamtib)</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Hanya Admin Kamtib
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {/* Pengawas Piket */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F3057] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Pengawas Piket</p>
                <h4 className="text-xs font-bold text-slate-800">{activePengawasNama}</h4>
                <p className="text-[10px] text-slate-500 font-mono">WA: {activePengawasWa}</p>
              </div>
            </div>

            {canContactOfficers() ? (
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${activePengawasWa}`}
                  title="Panggilan Telepon Langsung"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-[#0F3057] flex items-center justify-center transition active:scale-90"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${activePengawasWa}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Kirim Pesan WhatsApp"
                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition active:scale-90"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Lihat Saja</span>
              </span>
            )}
          </div>

          {/* Perwira Piket */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Perwira Piket</p>
                <h4 className="text-xs font-bold text-slate-800">{activePerwiraNama}</h4>
                <p className="text-[10px] text-slate-500 font-mono">WA: {activePerwiraWa}</p>
              </div>
            </div>

            {canContactOfficers() ? (
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${activePerwiraWa}`}
                  title="Panggilan Telepon Langsung"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-[#0F3057] flex items-center justify-center transition active:scale-90"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${activePerwiraWa}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Kirim Pesan WhatsApp"
                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition active:scale-90"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Lihat Saja</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Regu Pengamanan matching Mockup */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-emerald-50/80 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Regu Pengamanan</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
            3 Shift 24 Jam
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Regu Pagi */}
          <div
            onClick={() => handleOpenReguDetail('pagi')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Regu Pagi</h4>
                <p className="text-[11px] text-slate-500">{reguPagi.shift}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Komandan:{' '}
                  <strong className="text-slate-800">{reguPagi.komandan.nama}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {reguPagi.anggota.length} orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Regu Siang */}
          <div
            onClick={() => handleOpenReguDetail('siang')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Regu Siang</h4>
                <p className="text-[11px] text-slate-500">{reguSiang.shift}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Komandan:{' '}
                  <strong className="text-slate-800">{reguSiang.komandan.nama}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {reguSiang.anggota.length} orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Regu Malam */}
          <div
            onClick={() => handleOpenReguDetail('malam')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Regu Malam</h4>
                <p className="text-[11px] text-slate-500">{reguMalam.shift}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Komandan:{' '}
                  <strong className="text-slate-800">{reguMalam.komandan.nama}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {reguMalam.anggota.length} orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Regu Pendukung matching Mockup */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-purple-50/80 px-4 py-2.5 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Regu Pendukung</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Regu Portir */}
          <div
            onClick={() => handleOpenReguDetail('portir')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <DoorClosed className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Regu Portir</h4>
                <p className="text-[11px] text-slate-500">P2U / Pintu Utama</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {reguPortir.anggota.length} orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Regu Kesehatan */}
          <div
            onClick={() => handleOpenReguDetail('kesehatan')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Regu Kesehatan</h4>
                <p className="text-[11px] text-slate-500">Poliklinik & RS</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {reguKesehatan.anggota.length} orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Regu Penjagaan Blok Wanita */}
          <div
            onClick={() => handleOpenReguDetail('blok_wanita')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Regu Penjagaan Blok Wanita</h4>
                <p className="text-[11px] text-slate-500">Pengamanan Khusus Blok Wanita</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {reguBlokWanita.anggota.length} orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Pejabat Piket */}
      {isEditPejabatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsEditPejabatOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10 p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Edit Pejabat Piket (Kamtib)</h3>
                <p className="text-[11px] text-slate-500">Update Pengawas & Perwira Piket</p>
              </div>
              <button
                onClick={() => setIsEditPejabatOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePejabat} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pengawas Piket
                </label>
                <input
                  type="text"
                  value={pengawasNama}
                  onChange={(e) => setPengawasNama(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp Pengawas
                </label>
                <input
                  type="text"
                  value={pengawasWa}
                  onChange={(e) => setPengawasWa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Perwira Piket
                </label>
                <input
                  type="text"
                  value={perwiraNama}
                  onChange={(e) => setPerwiraNama(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp Perwira
                </label>
                <input
                  type="text"
                  value={perwiraWa}
                  onChange={(e) => setPerwiraWa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Simpan Perubahan Jadwal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
