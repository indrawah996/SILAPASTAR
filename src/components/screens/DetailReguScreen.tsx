import React, { useState } from 'react';
import {
  Shield,
  Award,
  Users,
  Phone,
  MessageCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReguMember } from '../../types';

export const DetailReguScreen: React.FC = () => {
  const {
    reguJaga,
    selectedReguId,
    canEditJadwal,
    updateReguAnggota,
    currentUser,
    canContactOfficers,
  } = useApp();

  const regu = reguJaga.find((r) => r.id === selectedReguId) || reguJaga[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ReguMember | null>(null);

  const [formNama, setFormNama] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formWa, setFormWa] = useState('');

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormNama('');
    setFormNip('199' + Math.floor(1000000000000 + Math.random() * 900000000000));
    setFormJabatan('Anggota Jaga Blok');
    setFormWa('628' + Math.floor(100000000 + Math.random() * 900000000));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: ReguMember) => {
    setEditingMember(m);
    setFormNama(m.nama);
    setFormNip(m.nip);
    setFormJabatan(m.jabatan);
    setFormWa(m.no_wa);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Hapus personel regu ini?')) {
      const updated = regu.anggota.filter((a) => a.id !== id);
      updateReguAnggota(regu.id, updated);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      const updated = regu.anggota.map((a) =>
        a.id === editingMember.id
          ? {
              ...a,
              nama: formNama,
              nip: formNip,
              jabatan: formJabatan,
              no_wa: formWa,
            }
          : a
      );
      updateReguAnggota(regu.id, updated);
    } else {
      const newMember: ReguMember = {
        id: `ang-${Date.now()}`,
        nomor: regu.anggota.length + 1,
        nama: formNama,
        nip: formNip,
        jabatan: formJabatan,
        no_wa: formWa,
      };
      updateReguAnggota(regu.id, [...regu.anggota, newMember]);
    }
    setIsModalOpen(false);
  };

  const dotColor =
    regu.id === 'pagi'
      ? 'bg-emerald-500'
      : regu.id === 'siang'
      ? 'bg-amber-500'
      : regu.id === 'malam'
      ? 'bg-blue-500'
      : 'bg-indigo-500';

  return (
    <div className="space-y-4 pb-24">
      {/* Title with Dot matching Mockup */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">
              {regu.nama_regu}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{regu.shift}</p>
          </div>
        </div>

        {canEditJadwal() ? (
          <button
            onClick={handleOpenAdd}
            className="py-1.5 px-3 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Personel</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
            <Lock className="w-3 h-3" /> Hanya Admin Kamtib
          </span>
        )}
      </div>

      {/* Komandan Regu Card matching Mockup */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Komandan Regu
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{regu.komandan.nama}</h3>
              <p className="text-[11px] text-slate-500 font-mono">NIP. {regu.komandan.nip}</p>
              {regu.komandan.pangkat && (
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                  {regu.komandan.pangkat}
                </p>
              )}
            </div>
          </div>

          {canContactOfficers() ? (
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${regu.komandan.tel || regu.komandan.no_wa}`}
                title="Panggilan Telepon"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-[#0F3057] flex items-center justify-center transition active:scale-90"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${regu.komandan.no_wa}`}
                target="_blank"
                rel="noreferrer"
                title="Pesan WhatsApp"
                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition active:scale-90"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Lihat Saja</span>
            </span>
          )}
        </div>
      </div>

      {/* Anggota Regu List matching Mockup */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700">
            Anggota Regu ({regu.anggota.length} orang)
          </h3>
          <span className="text-[11px] text-slate-400">Siap Siaga di Pos Lapas</span>
        </div>

        <div className="space-y-2">
          {regu.anggota.map((ang, idx) => (
            <div
              key={ang.id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">{ang.nama}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">NIP. {ang.nip}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{ang.jabatan}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {canContactOfficers() && (
                  <>
                    <a
                      href={`tel:${ang.no_wa}`}
                      title="Telepon Personel"
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`https://wa.me/${ang.no_wa}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Kirim WhatsApp"
                      className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}

                {canEditJadwal() && (
                  <button
                    onClick={() => handleOpenEdit(ang)}
                    className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {canEditJadwal() && regu.anggota.length > 4 && (
                  <button
                    onClick={() => handleDeleteMember(ang.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Anggota */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10 p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingMember ? 'Edit Personel Regu' : 'Tambah Personel Regu'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Petugas
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Petugas
                </label>
                <input
                  type="text"
                  value={formNip}
                  onChange={(e) => setFormNip(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pos / Jabatan Jaga
                </label>
                <input
                  type="text"
                  value={formJabatan}
                  onChange={(e) => setFormJabatan(e.target.value)}
                  placeholder="Contoh: Jaga Blok A / Pos Menara 1"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={formWa}
                  onChange={(e) => setFormWa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Simpan Personel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
