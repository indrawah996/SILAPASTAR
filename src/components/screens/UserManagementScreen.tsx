import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const UserManagementScreen: React.FC = () => {
  const { users, currentUser, canManageUsers, addUser, deleteUser, switchRoleQuick } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('klinik');
  const [formPassword, setFormPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleOpenAdd = () => {
    setFormName('');
    setFormUsername('');
    setFormRole('klinik');
    setFormPassword('');
    setFeedback(null);
    setIsAddModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formPassword.trim()) {
      setFeedback({ type: 'error', message: 'Username dan Password wajib diisi!' });
      return;
    }

    const roleTitles: Record<UserRole, { title: string; color: string }> = {
      superadmin: { title: 'SUPER ADMIN (Kamtib)', color: 'bg-emerald-600' },
      klinik: { title: 'ADMIN KLINIK', color: 'bg-rose-600' },
      binadik: { title: 'ADMIN BINADIK', color: 'bg-blue-600' },
      kamtib: { title: 'ADMIN KAMTIB', color: 'bg-indigo-600' },
      giatja: { title: 'ADMIN GIATJA', color: 'bg-amber-600' },
      user: { title: 'USER BIASA (Hanya Lihat Info)', color: 'bg-slate-600' },
    };

    const res = addUser(
      {
        username: formUsername.trim().toLowerCase(),
        name: formName,
        role: formRole,
        roleTitle: roleTitles[formRole].title,
        badgeColor: roleTitles[formRole].color,
      },
      formPassword
    );

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => setIsAddModalOpen(false), 700);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleDelete = (uid: string, name: string) => {
    if (window.confirm(`Yakin ingin menonaktifkan akun admin ${name}?`)) {
      const res = deleteUser(uid);
      alert(res.message);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            Manajemen Akun Admin
          </h2>
          <p className="text-[11px] text-slate-500">
            Pengelolaan 5 Role Pengguna SILAPASTAR
          </p>
        </div>

        {canManageUsers() ? (
          <button
            onClick={handleOpenAdd}
            className="py-1.5 px-3 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Admin</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
            <Lock className="w-3 h-3" /> Super Admin Only
          </span>
        )}
      </div>

      {!canManageUsers() && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2.5">
          <Shield className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            Halaman ini hanya dapat diubah oleh <strong>SUPER ADMIN</strong>. Anda dapat melihat
            daftar akun atau beralih ke Super Admin via menu Ganti Akun.
          </span>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-2.5">
        {users.map((u) => {
          const isCurrent = u.uid === currentUser.uid;

          return (
            <div
              key={u.uid}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 ${u.badgeColor}`}
                >
                  {u.role.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">{u.name}</h3>
                    {isCurrent && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Anda
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{u.roleTitle}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    User: @{u.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => switchRoleQuick(u.role)}
                  className="text-xs font-semibold px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-[#0F3057] rounded-lg transition"
                >
                  Pakai Akun
                </button>

                {canManageUsers() && !isCurrent && (
                  <button
                    onClick={() => handleDelete(u.uid, u.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Akun"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10 p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Tambah Admin Baru</h3>
                <p className="text-[11px] text-slate-500">Super Admin Kamtib Lapas Tarakan</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Petugas
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Budi Prasetyo, S.H."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Login
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Contoh: budi_kamtib"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peran / Role Akses
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                >
                  <option value="superadmin">SUPER ADMIN (Full Access Kamtib)</option>
                  <option value="klinik">ADMIN KLINIK (Modul Rumah Sakit)</option>
                  <option value="binadik">ADMIN BINADIK (Modul Total WBP)</option>
                  <option value="kamtib">ADMIN KAMTIB (Modul Jadwal & Regu)</option>
                  <option value="giatja">ADMIN GIATJA (Modul Kerja Luar)</option>
                  <option value="user">USER BIASA (Hanya Lihat Info Tanpa Kontak)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3057]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F3057] hover:bg-[#0a2340] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Daftarkan Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
