import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Home as HomeIcon,
  Activity,
  User,
  Shield,
  ChevronRight,
  Clock,
  HeartPulse,
  Scale,
  Sprout,
  Edit3,
  Lock,
  PieChart as PieChartIcon,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KondisiWbpScreen: React.FC = () => {
  const {
    wbpSummary,
    wbpDiLuar,
    canEditKondisiWbp,
    updateWbpSummaryNumbers,
    setCurrentScreen,
    setSelectedWbpCategoryFilter,
    currentUser,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inputTotal, setInputTotal] = useState(wbpSummary.total_wbp);
  const [inputNapi, setInputNapi] = useState(wbpSummary.narapidana);
  const [inputTahanan, setInputTahanan] = useState(wbpSummary.tahanan);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const countRs = wbpDiLuar.filter((w) => w.kategori === 'rumah_sakit' && w.status !== 'Selesai').length;
  const countSidang = wbpDiLuar.filter((w) => w.kategori === 'persidangan' && w.status !== 'Selesai').length;
  const countKerja = wbpDiLuar.filter((w) => w.kategori === 'kerja_luar' && w.status !== 'Selesai').length;

  const handleOpenEdit = () => {
    setInputTotal(wbpSummary.total_wbp);
    setInputNapi(wbpSummary.narapidana);
    setInputTahanan(wbpSummary.tahanan);
    setFeedback(null);
    setIsEditModalOpen(true);
  };

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputNapi + inputTahanan !== inputTotal) {
      setFeedback({
        type: 'error',
        message: `Kalkulasi tidak seimbang! Narapidana (${inputNapi}) + Tahanan (${inputTahanan}) = ${
          inputNapi + inputTahanan
        }, berbeda dari Total WBP (${inputTotal}).`,
      });
      return;
    }

    const res = updateWbpSummaryNumbers(inputTotal, inputNapi, inputTahanan);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Pie chart geometry percentages
  const pctDiDalam = ((wbpSummary.di_dalam / wbpSummary.total_wbp) * 100).toFixed(1);
  const pctDiLuar = ((wbpSummary.di_luar / wbpSummary.total_wbp) * 100).toFixed(1);

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Row with Date Badge matching Mockup */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Kondisi WBP</h2>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{wbpSummary.updated_at}</span>
        </div>
      </div>

      {/* Big Total WBP Card matching Mockup */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Decorative background users watermark */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-10 text-blue-900 pointer-events-none">
          <Users className="w-24 h-24" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-blue-900 pointer-events-none">
          <Users className="w-24 h-24" />
        </div>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-1">
          <Users className="w-6 h-6" />
        </div>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Total WBP
        </p>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight my-1">
          {wbpSummary.total_wbp}
        </h1>
        <p className="text-[11px] text-slate-400 font-medium">Orang Warga Binaan</p>

        {/* Action Button: Edit Total WBP (Restricted to BINADIK & SUPER ADMIN) */}
        {canEditKondisiWbp() ? (
          <button
            onClick={handleOpenEdit}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Data WBP (Admin Binadik)</span>
          </button>
        ) : (
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-400 text-[10px] rounded-lg">
            <Lock className="w-3 h-3" />
            <span>Hanya Admin Binadik yang dapat mengubah Total WBP</span>
          </div>
        )}
      </div>

      {/* 2x2 Grid Stats Cards matching Mockup */}
      <div className="grid grid-cols-2 gap-3">
        {/* Di Dalam */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HomeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">
              {wbpSummary.di_dalam}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Di Dalam</p>
          </div>
        </div>

        {/* Di Luar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">
              {wbpSummary.di_luar}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Di Luar</p>
          </div>
        </div>

        {/* Narapidana */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">
              {wbpSummary.narapidana}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Narapidana</p>
          </div>
        </div>

        {/* Tahanan */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">
              {wbpSummary.tahanan}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Tahanan</p>
          </div>
        </div>
      </div>

      {/* Visual Chart Breakdown: Di Dalam vs Di Luar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <PieChartIcon className="w-4 h-4 text-[#0F3057]" />
            Distribusi Keberadaan WBP
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            {wbpSummary.total_wbp} Jiwa
          </span>
        </div>

        {/* Progress Bar Representation */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${pctDiDalam}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Di Dalam: ${wbpSummary.di_dalam} (${pctDiDalam}%)`}
          />
          <div
            style={{ width: `${pctDiLuar}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Di Luar: ${wbpSummary.di_luar} (${pctDiLuar}%)`}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">
              Di Dalam: <strong>{wbpSummary.di_dalam}</strong> ({pctDiDalam}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-600">
              Di Luar: <strong>{wbpSummary.di_luar}</strong> ({pctDiLuar}%)
            </span>
          </div>
        </div>
      </div>

      {/* WBP DI LUAR Section matching Mockup */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            WBP DI LUAR
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
            Total {wbpSummary.di_luar}
          </span>
        </div>

        <div className="space-y-2">
          {/* Rumah Sakit */}
          <div
            onClick={() => {
              setSelectedWbpCategoryFilter('rumah_sakit');
              setCurrentScreen('detail_wbp_di_luar');
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50/60 border border-slate-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Rumah Sakit</h4>
                <p className="text-[11px] text-slate-500">Pasien dirawat di rumah sakit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700">
                {countRs} Orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Persidangan */}
          <div
            onClick={() => {
              setSelectedWbpCategoryFilter('persidangan');
              setCurrentScreen('detail_wbp_di_luar');
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Persidangan</h4>
                <p className="text-[11px] text-slate-500">Mengikuti persidangan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800">
                {countSidang} Orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Kerja Luar */}
          <div
            onClick={() => {
              setSelectedWbpCategoryFilter('kerja_luar');
              setCurrentScreen('detail_wbp_di_luar');
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Kerja Luar</h4>
                <p className="text-[11px] text-slate-500">Program kemandirian</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                {countKerja} Orang
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Timestamp matching Mockup */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
        <Clock className="w-3.5 h-3.5" />
        <span>Terakhir diperbarui: {wbpSummary.updated_at}</span>
      </div>

      {/* Modal Form Edit Total WBP (Binadik / Superadmin) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10 p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Update Total WBP (Binadik)
                </h3>
                <p className="text-[11px] text-slate-500">Sumber data utama Lapas Tarakan</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl mb-3 text-xs flex items-start gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveSummary} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total WBP
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputTotal}
                  onChange={(e) => setInputTotal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Narapidana
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputNapi}
                    onChange={(e) => setInputNapi(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahanan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputTahanan}
                    onChange={(e) => setInputTahanan(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>WBP Di Luar Aktif:</span>
                  <span className="font-bold text-rose-600">{wbpSummary.di_luar} Orang</span>
                </div>
                <div className="flex justify-between">
                  <span>Otomatis Di Dalam:</span>
                  <span className="font-bold text-emerald-600">
                    {Math.max(0, inputTotal - wbpSummary.di_luar)} Orang
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Simpan & Sinkronkan Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
