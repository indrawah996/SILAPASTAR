import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Calendar,
  MessageCircle,
  Phone,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SpreadsheetPiketScreen: React.FC = () => {
  const { spreadsheetDuties, selectedDate, setSelectedDate, canContactOfficers } = useApp();
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [filterDutyType, setFilterDutyType] = useState<string>('all');

  // Unique dates and duty types
  const allDates = Array.from(new Set(spreadsheetDuties.map((d) => d.tanggal))).sort();
  const allDutyTypes = Array.from(new Set(spreadsheetDuties.map((d) => d.jenis_piket))).sort();

  const filteredDuties = spreadsheetDuties.filter((row) => {
    const matchDate = filterDate === 'all' || row.tanggal === filterDate;
    const matchDuty = filterDutyType === 'all' || row.jenis_piket === filterDutyType;
    const matchSearch =
      row.nama.toLowerCase().includes(search.toLowerCase()) ||
      row.jenis_piket.toLowerCase().includes(search.toLowerCase()) ||
      row.no_wa.includes(search);
    return matchDate && matchDuty && matchSearch;
  });

  const sendWhatsAppMsg = (row: typeof spreadsheetDuties[0]) => {
    const text = encodeURIComponent(
      `Yth. Bapak/Ibu ${row.nama},\n\nKonfirmasi Jadwal Piket Lapas Kelas IIA Tarakan:\n📌 Tanggal: ${row.tanggal}\n🛡️ Tugas: ${row.jenis_piket}\n\nMohon kehadirannya tepat waktu sesuai SOP Pengamanan Kamtib. Terima kasih.`
    );
    window.open(`https://wa.me/${row.no_wa}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#0F3057]" />
          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            Database Jadwal Piket
          </h2>
        </div>
        <p className="text-[11px] text-slate-500">
          Data resmi jadwal petugas layanan kunjungan, pemeriksaan makanan & jaga RS
        </p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama petugas atau jenis piket..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
          />
        </div>

        {/* Date and Type selectors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Filter Tanggal:
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">Semua Tanggal ({allDates.length} Hari)</option>
              {allDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Jenis Tugas Piket:
            </label>
            <select
              value={filterDutyType}
              onChange={(e) => setFilterDutyType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 truncate"
            >
              <option value="all">Semua Jenis Piket</option>
              {allDutyTypes.map((t) => (
                <option key={t} value={t}>
                  {t.length > 25 ? t.substring(0, 25) + '...' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <span>
            Menampilkan <strong>{filteredDuties.length}</strong> data petugas
          </span>
          {(filterDate !== 'all' || filterDutyType !== 'all' || search) && (
            <button
              onClick={() => {
                setFilterDate('all');
                setFilterDutyType('all');
                setSearch('');
              }}
              className="text-[#0F3057] font-semibold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Roster Cards List */}
      <div className="space-y-2.5">
        {filteredDuties.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <p className="text-xs font-bold text-slate-600">Tidak ada jadwal ditemukan</p>
            <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci atau tanggal.</p>
          </div>
        ) : (
          filteredDuties.map((duty, idx) => {
            const isRS = duty.jenis_piket.includes('JAGA RS');
            const isPengawas = duty.jenis_piket.includes('PENGAWAS');
            const isPerwira = duty.jenis_piket.includes('PERWIRA');
            const isMakanan = duty.jenis_piket.includes('MAKANAN');

            return (
              <div
                key={duty.id + idx}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 space-y-2 transition hover:border-blue-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      📅 {duty.tanggal}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                      {duty.nama}
                    </h3>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isPengawas
                        ? 'bg-blue-100 text-blue-800'
                        : isPerwira
                        ? 'bg-amber-100 text-amber-800'
                        : isRS
                        ? 'bg-rose-100 text-rose-800'
                        : isMakanan
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isPengawas
                      ? 'Pengawas'
                      : isPerwira
                      ? 'Perwira'
                      : isRS
                      ? 'Jaga RS'
                      : isMakanan
                      ? 'Makanan'
                      : 'Petugas'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="font-semibold text-slate-800 text-[11px] leading-snug">
                    {duty.jenis_piket}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                    <span>No. WA: {duty.no_wa}</span>
                    {duty.status_pasien && (
                      <span className="text-rose-600 font-sans font-bold">
                        Status Pasien: {duty.status_pasien} Orang
                      </span>
                    )}
                  </div>
                </div>

                {/* 1-Click WhatsApp Button matching Spreadsheet's "📲 KIRIM PESAN" */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {canContactOfficers() ? (
                    <>
                      <a
                        href={`tel:${duty.no_wa}`}
                        className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Telepon</span>
                      </a>

                      <button
                        onClick={() => sendWhatsAppMsg(duty)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95"
                      >
                        <span>📲 KIRIM PESAN</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      Mode Lihat Saja (Kontak Terkunci)
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
