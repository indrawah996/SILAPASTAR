import React, { useState } from 'react';
import {
  HeartPulse,
  Scale,
  Sprout,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Calendar,
  MapPin,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WbpDiLuarItem, WbpKategori } from '../../types';

export const DetailWbpDiLuarScreen: React.FC = () => {
  const {
    wbpDiLuar,
    currentUser,
    canEditRumahSakit,
    canEditKerjaLuar,
    canEditPersidangan,
    addWbpDiLuar,
    updateWbpDiLuar,
    deleteWbpDiLuar,
    selectedWbpCategoryFilter,
    setSelectedWbpCategoryFilter,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WbpDiLuarItem | null>(null);

  // Form states
  const [formKategori, setFormKategori] = useState<WbpKategori>('rumah_sakit');
  const [formNama, setFormNama] = useState('');
  const [formKeperluan, setFormKeperluan] = useState('');
  const [formLokasi, setFormLokasi] = useState('RSUD dr. H. Jusuf SK Tarakan');
  const [formTanggal, setFormTanggal] = useState('2026-10-03');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Selesai' | 'Dalam Pengawalan'>('Aktif');
  const [formNoReg, setFormNoReg] = useState('');
  const [formPengawal, setFormPengawal] = useState('');
  const [formKeterangan, setFormKeterangan] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered items
  const filteredList = wbpDiLuar.filter((item) => {
    const matchCategory =
      selectedWbpCategoryFilter === 'all' || item.kategori === selectedWbpCategoryFilter;
    const matchSearch =
      item.nama_wbp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keperluan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const countRs = wbpDiLuar.filter((w) => w.kategori === 'rumah_sakit' && w.status !== 'Selesai').length;
  const countSidang = wbpDiLuar.filter((w) => w.kategori === 'persidangan' && w.status !== 'Selesai').length;
  const countKerja = wbpDiLuar.filter((w) => w.kategori === 'kerja_luar' && w.status !== 'Selesai').length;

  const canUserAddCategory = (kat: WbpKategori) => {
    if (kat === 'rumah_sakit') return canEditRumahSakit();
    if (kat === 'kerja_luar') return canEditKerjaLuar();
    if (kat === 'persidangan') return canEditPersidangan();
    return false;
  };

  const handleOpenAdd = (preferredKat?: WbpKategori) => {
    const kat = preferredKat || (selectedWbpCategoryFilter !== 'all' ? selectedWbpCategoryFilter : 'rumah_sakit');
    setEditingItem(null);
    setFormKategori(kat);
    setFormNama('');
    setFormKeperluan(
      kat === 'rumah_sakit'
        ? 'Perawatan medis rawat inap luka/penyakit'
        : kat === 'kerja_luar'
        ? 'Asimilasi kerja luar kebersihan'
        : 'Sidang perkara di Pengadilan Negeri'
    );
    setFormLokasi(
      kat === 'rumah_sakit'
        ? 'RSUD dr. H. Jusuf SK Tarakan'
        : kat === 'kerja_luar'
        ? 'Area Sarana Asimilasi Luar Lapas'
        : 'Pengadilan Negeri Tarakan'
    );
    setFormTanggal('2026-10-03');
    setFormStatus('Aktif');
    setFormNoReg('BI/0' + Math.floor(10 + Math.random() * 90) + '/TRK/2026');
    setFormPengawal('Petugas Piket Pengawalan Lapas');
    setFormKeterangan('');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WbpDiLuarItem) => {
    setEditingItem(item);
    setFormKategori(item.kategori);
    setFormNama(item.nama_wbp);
    setFormKeperluan(item.keperluan);
    setFormLokasi(item.lokasi);
    setFormTanggal(item.tanggal_masuk);
    setFormStatus(item.status);
    setFormNoReg(item.no_reg || '');
    setFormPengawal(item.pengawal || '');
    setFormKeterangan(item.keterangan || '');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleDelete = (item: WbpDiLuarItem) => {
    if (window.confirm(`Yakin ingin menyelesaikan pengawalan / menghapus WBP ${item.nama_wbp}? Angka WBP Di Luar akan otomatis berkurang.`)) {
      deleteWbpDiLuar(item.id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) {
      setFeedback({ type: 'error', message: 'Nama WBP wajib diisi!' });
      return;
    }

    if (editingItem) {
      const res = updateWbpDiLuar(editingItem.id, {
        kategori: formKategori,
        nama_wbp: formNama,
        keperluan: formKeperluan,
        lokasi: formLokasi,
        tanggal_masuk: formTanggal,
        status: formStatus,
        no_reg: formNoReg,
        pengawal: formPengawal,
        keterangan: formKeterangan,
      });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTimeout(() => setIsModalOpen(false), 700);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else {
      const res = addWbpDiLuar({
        kategori: formKategori,
        nama_wbp: formNama,
        keperluan: formKeperluan,
        lokasi: formLokasi,
        tanggal_masuk: formTanggal,
        status: formStatus,
        no_reg: formNoReg,
        pengawal: formPengawal,
        keterangan: formKeterangan,
      });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTimeout(() => setIsModalOpen(false), 700);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Title & Total Badge matching Mockup */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">WBP DI LUAR</h2>
          <p className="text-[11px] text-slate-500">Monitoring WBP di luar tembok Lapas</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-200/80 text-slate-700 rounded-full">
          Total {countRs + countSidang + countKerja}
        </span>
      </div>

      {/* 3 Categories Summary Cards matching Mockup */}
      <div className="space-y-2">
        {/* Rumah Sakit */}
        <div
          onClick={() => setSelectedWbpCategoryFilter(selectedWbpCategoryFilter === 'rumah_sakit' ? 'all' : 'rumah_sakit')}
          className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
            selectedWbpCategoryFilter === 'rumah_sakit'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-sm'
              : 'bg-white border-slate-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-800">Rumah Sakit</h4>
                {canEditRumahSakit() && (
                  <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                    Akses Anda (Klinik)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Pasien dirawat di rumah sakit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700">
              {countRs} Orang
            </span>
          </div>
        </div>

        {/* Persidangan */}
        <div
          onClick={() => setSelectedWbpCategoryFilter(selectedWbpCategoryFilter === 'persidangan' ? 'all' : 'persidangan')}
          className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
            selectedWbpCategoryFilter === 'persidangan'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200 shadow-sm'
              : 'bg-white border-slate-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-800">Persidangan</h4>
                {canEditPersidangan() && (
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                    Super Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Mengikuti persidangan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800">
              {countSidang} Orang
            </span>
          </div>
        </div>

        {/* Kerja Luar */}
        <div
          onClick={() => setSelectedWbpCategoryFilter(selectedWbpCategoryFilter === 'kerja_luar' ? 'all' : 'kerja_luar')}
          className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
            selectedWbpCategoryFilter === 'kerja_luar'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200 shadow-sm'
              : 'bg-white border-slate-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-800">Kerja Luar</h4>
                {canEditKerjaLuar() && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    Akses Anda (Giatja)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Program kemandirian</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
              {countKerja} Orang
            </span>
          </div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama WBP, RS, atau lokasi..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
          />
        </div>

        {/* Conditional Add Button */}
        {selectedWbpCategoryFilter === 'rumah_sakit' && canEditRumahSakit() && (
          <button
            onClick={() => handleOpenAdd('rumah_sakit')}
            className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pasien RS</span>
          </button>
        )}

        {selectedWbpCategoryFilter === 'kerja_luar' && canEditKerjaLuar() && (
          <button
            onClick={() => handleOpenAdd('kerja_luar')}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kerja Luar</span>
          </button>
        )}

        {(selectedWbpCategoryFilter === 'all' || selectedWbpCategoryFilter === 'persidangan') && currentUser.role === 'superadmin' && (
          <button
            onClick={() => handleOpenAdd()}
            className="py-2 px-3 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah WBP</span>
          </button>
        )}
      </div>

      {/* List of WBP Records */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Daftar WBP Di Luar ({filteredList.length})</span>
          {selectedWbpCategoryFilter !== 'all' && (
            <button
              onClick={() => setSelectedWbpCategoryFilter('all')}
              className="text-[#0F3057] hover:underline text-[11px]"
            >
              Tampilkan Semua
            </button>
          )}
        </div>

        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Tidak ada data WBP ditemukan</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Silakan periksa filter atau tambahkan data baru.
            </p>
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const isRs = item.kategori === 'rumah_sakit';
            const isSidang = item.kategori === 'persidangan';
            const isKerja = item.kategori === 'kerja_luar';

            const canUserEditThis =
              (isRs && canEditRumahSakit()) ||
              (isKerja && canEditKerjaLuar()) ||
              (isSidang && canEditPersidangan());

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5 transition hover:shadow-md"
              >
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">
                        {item.nama_wbp}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        No. Reg: {item.no_reg || '-'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isRs
                        ? 'bg-rose-100 text-rose-700'
                        : isSidang
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isRs ? 'Rumah Sakit' : isSidang ? 'Persidangan' : 'Kerja Luar'}
                  </span>
                </div>

                {/* Details grid */}
                <div className="p-3 bg-slate-50/80 rounded-xl text-xs space-y-1.5 border border-slate-100/80">
                  <div className="flex items-start gap-2 text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Keperluan:</span>
                      <span className="font-semibold text-slate-800">{item.keperluan}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Lokasi:</span>
                      <span className="font-semibold text-slate-800">{item.lokasi}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Masuk: {item.tanggal_masuk}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Shield className="w-3 h-3 text-slate-400" />
                      <span className="truncate">Kawal: {item.pengawal || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions / Permissions Guard */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-slate-400">
                    Update: {item.updated_at}
                  </span>

                  {canUserEditThis ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                        title="Edit Data WBP"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Kembali ke Lapas / Selesai"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3" />
                      Hanya {isRs ? 'Admin Klinik' : isKerja ? 'Admin Giatja' : 'Super Admin'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 p-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {editingItem ? 'Edit Data WBP Di Luar' : 'Tambah WBP Di Luar'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Modul:{' '}
                  {formKategori === 'rumah_sakit'
                    ? 'Rumah Sakit (Admin Klinik)'
                    : formKategori === 'kerja_luar'
                    ? 'Kerja Luar (Admin Giatja)'
                    : 'Persidangan (Super Admin)'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSave} className="space-y-3">
              {currentUser.role === 'superadmin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori WBP Di Luar
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value as WbpKategori)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  >
                    <option value="rumah_sakit">Rumah Sakit (Rawat Inap)</option>
                    <option value="persidangan">Persidangan (PN Tarakan)</option>
                    <option value="kerja_luar">Kerja Luar (Asimilasi Kebersihan)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama WBP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso bin Ahmad"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keperluan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formKeperluan}
                  onChange={(e) => setFormKeperluan(e.target.value)}
                  placeholder="Contoh: Perawatan luka post-op / Kontrol rutin asma"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formLokasi}
                  onChange={(e) => setFormLokasi(e.target.value)}
                  placeholder="Contoh: RSUD dr. H. Jusuf SK Tarakan / RSAL Tarakan"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Masuk / Keluar
                  </label>
                  <input
                    type="date"
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  >
                    <option value="Aktif">Aktif (Sedang di luar)</option>
                    <option value="Dalam Pengawalan">Dalam Pengawalan</option>
                    <option value="Selesai">Selesai (Sudah kembali)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Petugas Pengawal / Piket Jaga RS
                </label>
                <input
                  type="text"
                  value={formPengawal}
                  onChange={(e) => setFormPengawal(e.target.value)}
                  placeholder="Contoh: Habibie / Yogaswara"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                {editingItem ? 'Simpan Perubahan' : 'Tambahkan Data WBP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
