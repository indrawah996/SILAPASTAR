import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  History,
  Shield,
  Calendar,
  Users,
  Activity,
  Download,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RekapitulasiScreen: React.FC = () => {
  const { wbpSummary, logs, wbpDiLuar } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('Okt 2026');

  // Monthly historical trend data for 2026
  const monthlyData = [
    { month: 'Mei', total: 92, napi: 72, tahanan: 20, diLuar: 3 },
    { month: 'Jun', total: 95, napi: 74, tahanan: 21, diLuar: 4 },
    { month: 'Jul', total: 97, napi: 76, tahanan: 21, diLuar: 4 },
    { month: 'Agu', total: 99, napi: 78, tahanan: 21, diLuar: 5 },
    { month: 'Sep', total: 100, napi: 79, tahanan: 21, diLuar: 4 },
    { month: 'Okt', total: wbpSummary.total_wbp, napi: wbpSummary.narapidana, tahanan: wbpSummary.tahanan, diLuar: wbpSummary.di_luar },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.total));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            Rekapitulasi & Audit Trail
          </h2>
          <p className="text-[11px] text-slate-500">
            Laporan bulanan satu data & catatan log aktivitas
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Laporan</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total WBP</p>
          <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
            {wbpSummary.total_wbp}
          </h3>
          <span className="text-[9px] text-emerald-600 font-bold">100% Terdata</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Di Dalam</p>
          <h3 className="text-xl font-extrabold text-emerald-600 mt-0.5">
            {wbpSummary.di_dalam}
          </h3>
          <span className="text-[9px] text-slate-400">Dalam Blok</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Di Luar</p>
          <h3 className="text-xl font-extrabold text-rose-600 mt-0.5">
            {wbpSummary.di_luar}
          </h3>
          <span className="text-[9px] text-slate-400">RS / Sidang / Kerja</span>
        </div>
      </div>

      {/* Monthly Chart Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0F3057]" />
            <h3 className="text-xs font-bold text-slate-800">
              Grafik Tren Bulanan WBP Lapas Tarakan
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Tahun 2026</span>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
          {monthlyData.map((d) => {
            const heightPercent = Math.round((d.total / maxVal) * 85);
            const isCurrent = d.month === 'Okt';

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                  {d.total}
                </span>

                <div className="w-full max-w-[28px] h-32 flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 relative ${
                      isCurrent
                        ? 'bg-[#0F3057] shadow-md ring-2 ring-blue-300'
                        : 'bg-slate-300 group-hover:bg-blue-400'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] bg-blue-100 text-blue-900 font-bold px-1 rounded whitespace-nowrap">
                        {d.total}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold ${
                    isCurrent ? 'text-[#0F3057] font-bold' : 'text-slate-400'
                  }`}
                >
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F3057]"></span>
            <span>Bulan Berjalan (Okt 2026)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span>Bulan Sebelumnya</span>
          </div>
        </div>
      </div>

      {/* Audit Trail Logs Collection */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#0F3057]" />
            <h3 className="text-xs font-bold text-slate-800">
              Audit Trail (Riwayat Pembaruan Data)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {logs.length} Log Aktivitas
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {logs.map((log) => {
            const isKlinik = log.user_role === 'klinik';
            const isBinadik = log.user_role === 'binadik';
            const isKamtib = log.user_role === 'kamtib';
            const isGiatja = log.user_role === 'giatja';

            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 hover:border-slate-200 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">
                    {log.activity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {log.timestamp}
                  </span>
                </div>

                {log.details && (
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {log.details}
                  </p>
                )}

                <div className="pt-1 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-medium truncate">
                    Oleh: <strong className="text-slate-700">{log.user_name}</strong>
                  </span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      isKlinik
                        ? 'bg-rose-100 text-rose-700'
                        : isBinadik
                        ? 'bg-blue-100 text-blue-700'
                        : isKamtib
                        ? 'bg-indigo-100 text-indigo-700'
                        : isGiatja
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {log.user_role.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
