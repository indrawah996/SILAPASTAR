import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  UserRole,
  WbpSummary,
  WbpDiLuarItem,
  ReguJaga,
  SpreadsheetDutyRecord,
  LogActivity,
  WbpKategori,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PASSWORDS,
  INITIAL_WBP_SUMMARY,
  INITIAL_WBP_DI_LUAR,
  INITIAL_REGU_JAGA,
  SPREADSHEET_DUTIES,
  INITIAL_LOGS,
} from '../data/initialData';

interface PejabatPiketInfo {
  pengawas: {
    nama: string;
    jabatan: string;
    nip: string;
    no_wa: string;
  };
  perwira: {
    nama: string;
    jabatan: string;
    nip: string;
    no_wa: string;
  };
}

interface AppContextType {
  currentUser: UserAccount;
  users: UserAccount[];
  wbpSummary: WbpSummary;
  wbpDiLuar: WbpDiLuarItem[];
  reguJaga: ReguJaga[];
  pejabatPiket: PejabatPiketInfo;
  spreadsheetDuties: SpreadsheetDutyRecord[];
  logs: LogActivity[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeTab: 'beranda' | 'kondisi' | 'jadwal' | 'lainnya';
  setActiveTab: (tab: 'beranda' | 'kondisi' | 'jadwal' | 'lainnya') => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;
  
  // Navigation for screens
  currentScreen: 'main' | 'detail_wbp_di_luar' | 'detail_regu' | 'rekapitulasi' | 'spreadsheet' | 'users';
  setCurrentScreen: (screen: 'main' | 'detail_wbp_di_luar' | 'detail_regu' | 'rekapitulasi' | 'spreadsheet' | 'users') => void;
  selectedReguId: string | null;
  setSelectedReguId: (id: string | null) => void;
  selectedWbpCategoryFilter: WbpKategori | 'all';
  setSelectedWbpCategoryFilter: (cat: WbpKategori | 'all') => void;

  // Notification Banner
  recentNotification: string | null;
  setRecentNotification: (msg: string | null) => void;

  // Actions
  login: (username: string, pass: string) => { success: boolean; message: string };
  switchRoleQuick: (role: UserRole) => void;
  logout: () => void;
  
  // Role checks
  canEditKondisiWbp: () => boolean;
  canEditRumahSakit: () => boolean;
  canEditKerjaLuar: () => boolean;
  canEditPersidangan: () => boolean;
  canEditJadwal: () => boolean;
  canManageUsers: () => boolean;
  canContactOfficers: () => boolean;

  // Data mutation methods
  updateWbpSummaryNumbers: (total: number, napi: number, tahanan: number) => { success: boolean; message: string };
  addWbpDiLuar: (item: Omit<WbpDiLuarItem, 'id' | 'created_by_role' | 'updated_at'>) => { success: boolean; message: string };
  updateWbpDiLuar: (id: string, item: Partial<WbpDiLuarItem>) => { success: boolean; message: string };
  deleteWbpDiLuar: (id: string) => { success: boolean; message: string };
  updatePejabatPiket: (pengawas: PejabatPiketInfo['pengawas'], perwira: PejabatPiketInfo['perwira']) => { success: boolean; message: string };
  updateReguAnggota: (reguId: string, anggota: ReguJaga['anggota']) => { success: boolean; message: string };
  addUser: (user: Omit<UserAccount, 'uid'>, pass: string) => { success: boolean; message: string };
  deleteUser: (uid: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state initialization with fallbacks
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('silapastar_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const savedRole = localStorage.getItem('silapastar_current_role');
    const found = INITIAL_USERS.find((u) => u.role === savedRole);
    return found || INITIAL_USERS[0]; // Defaults to Super Admin for immediate testing
  });

  const [wbpDiLuar, setWbpDiLuar] = useState<WbpDiLuarItem[]>(() => {
    const saved = localStorage.getItem('silapastar_wbp_di_luar');
    return saved ? JSON.parse(saved) : INITIAL_WBP_DI_LUAR;
  });

  const [wbpSummary, setWbpSummary] = useState<WbpSummary>(() => {
    const saved = localStorage.getItem('silapastar_wbp_summary');
    return saved ? JSON.parse(saved) : INITIAL_WBP_SUMMARY;
  });

  const [reguJaga, setReguJaga] = useState<ReguJaga[]>(() => {
    const saved = localStorage.getItem('silapastar_regu_jaga');
    return saved ? JSON.parse(saved) : INITIAL_REGU_JAGA;
  });

  const [pejabatPiket, setPejabatPiket] = useState<PejabatPiketInfo>(() => {
    const saved = localStorage.getItem('silapastar_pejabat_piket');
    return saved ? JSON.parse(saved) : {
      pengawas: {
        nama: 'Ahmad Rifai, S.H.',
        jabatan: 'Pengawas Piket & Koordinator Kunjungan',
        nip: '198709142011011001',
        no_wa: '6281378988855',
      },
      perwira: {
        nama: 'Budi Santoso',
        jabatan: 'Perwira Piket & Subkoordinator Kunjungan',
        nip: '199003122016031001',
        no_wa: '6282311861834',
      },
    };
  });

  const [spreadsheetDuties] = useState<SpreadsheetDutyRecord[]>(SPREADSHEET_DUTIES);

  const [logs, setLogs] = useState<LogActivity[]>(() => {
    const saved = localStorage.getItem('silapastar_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-03');
  const [activeTab, setActiveTab] = useState<'beranda' | 'kondisi' | 'jadwal' | 'lainnya'>('beranda');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'detail_wbp_di_luar' | 'detail_regu' | 'rekapitulasi' | 'spreadsheet' | 'users'>('main');
  const [selectedReguId, setSelectedReguId] = useState<string | null>('pagi');
  const [selectedWbpCategoryFilter, setSelectedWbpCategoryFilter] = useState<WbpKategori | 'all'>('all');
  const [recentNotification, setRecentNotification] = useState<string | null>(
    'Diperbarui: 3 Oktober 2026, 22.34 oleh Admin Binadik'
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('silapastar_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('silapastar_current_role', currentUser.role);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('silapastar_wbp_di_luar', JSON.stringify(wbpDiLuar));
  }, [wbpDiLuar]);

  useEffect(() => {
    localStorage.setItem('silapastar_wbp_summary', JSON.stringify(wbpSummary));
  }, [wbpSummary]);

  useEffect(() => {
    localStorage.setItem('silapastar_regu_jaga', JSON.stringify(reguJaga));
  }, [reguJaga]);

  useEffect(() => {
    localStorage.setItem('silapastar_pejabat_piket', JSON.stringify(pejabatPiket));
  }, [pejabatPiket]);

  useEffect(() => {
    localStorage.setItem('silapastar_logs', JSON.stringify(logs));
  }, [logs]);

  // Format Indonesian date timestamp
  const getFormattedNow = () => {
    const now = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = now.getDate();
    const m = months[now.getMonth()];
    const y = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${d} ${m} ${y}, ${hh}.${mm}`;
  };

  const addLog = (activity: string, details?: string) => {
    const timeStr = getFormattedNow();
    const newLog: LogActivity = {
      id: `log-${Date.now()}`,
      activity,
      user_role: currentUser.role,
      user_name: `${currentUser.roleTitle} (${currentUser.name})`,
      timestamp: timeStr,
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
    const notifMsg = `Diperbarui: ${timeStr} oleh ${currentUser.roleTitle}`;
    setRecentNotification(notifMsg);
  };

  // Role permissions
  const canEditKondisiWbp = () => currentUser.role === 'binadik' || currentUser.role === 'superadmin';
  const canEditRumahSakit = () => currentUser.role === 'klinik' || currentUser.role === 'superadmin';
  const canEditKerjaLuar = () => currentUser.role === 'giatja' || currentUser.role === 'superadmin';
  const canEditPersidangan = () => currentUser.role === 'superadmin';
  const canEditJadwal = () => currentUser.role === 'kamtib' || currentUser.role === 'superadmin';
  const canManageUsers = () => currentUser.role === 'superadmin';
  const canContactOfficers = () => currentUser.role !== 'user';

  // Login handler
  const login = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const user = users.find((u) => u.username.toLowerCase() === cleanUser);
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan di sistem Lapas Tarakan.' };
    }
    const storedPass = INITIAL_PASSWORDS[cleanUser] || 'silapastar2026';
    if (pass !== storedPass) {
      return { success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
    }
    setCurrentUser(user);
    addLog('User Login Berhasil', `Login sebagai ${user.roleTitle}`);
    setIsLoginModalOpen(false);
    return { success: true, message: `Selamat datang, ${user.name} (${user.roleTitle})` };
  };

  const switchRoleQuick = (role: UserRole) => {
    const target = users.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      addLog('Beralih Role Akun', `Beralih ke akun ${target.roleTitle}`);
    }
  };

  const logout = () => {
    // Default back to Binadik or keep as is with warning
    setCurrentUser(INITIAL_USERS[0]);
    addLog('Pengguna Logout', 'Kembali ke sesi awal');
  };

  // Recalculate WBP Di Luar and Di Dalam automatically
  const syncWbpCalculations = (newDiLuarList: WbpDiLuarItem[]) => {
    const activeDiLuarCount = newDiLuarList.filter((item) => item.status !== 'Selesai').length;
    setWbpSummary((prev) => {
      const diDalam = Math.max(0, prev.total_wbp - activeDiLuarCount);
      return {
        ...prev,
        di_luar: activeDiLuarCount,
        di_dalam: diDalam,
        updated_by: currentUser.name,
        updated_role: currentUser.role,
        updated_at: getFormattedNow(),
      };
    });
  };

  // Mutation: BINADIK updates total WBP
  const updateWbpSummaryNumbers = (total: number, napi: number, tahanan: number) => {
    if (!canEditKondisiWbp()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin BINADIK dan Super Admin yang berhak memperbarui Total WBP.' };
    }
    const currentActiveDiLuar = wbpDiLuar.filter((item) => item.status !== 'Selesai').length;
    const diDalam = Math.max(0, total - currentActiveDiLuar);

    const timeStr = getFormattedNow();
    setWbpSummary({
      total_wbp: total,
      narapidana: napi,
      tahanan: tahanan,
      di_luar: currentActiveDiLuar,
      di_dalam: diDalam,
      updated_by: currentUser.name,
      updated_role: currentUser.role,
      updated_at: timeStr,
    });

    addLog(
      'Pembaruan Total WBP Lapas',
      `Total: ${total} (Napi: ${napi}, Tahanan: ${tahanan}, Di Dalam: ${diDalam}, Di Luar: ${currentActiveDiLuar})`
    );
    return { success: true, message: 'Data Total WBP berhasil diperbarui dan disinkronkan ke seluruh sistem!' };
  };

  // Mutation: WBP Di Luar
  const addWbpDiLuar = (item: Omit<WbpDiLuarItem, 'id' | 'created_by_role' | 'updated_at'>) => {
    if (item.kategori === 'rumah_sakit' && !canEditRumahSakit()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin KLINIK dan Super Admin yang berhak menambah pasien Rumah Sakit.' };
    }
    if (item.kategori === 'kerja_luar' && !canEditKerjaLuar()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin GIATJA dan Super Admin yang berhak menambah WBP Kerja Luar.' };
    }
    if (item.kategori === 'persidangan' && !canEditPersidangan()) {
      return { success: false, message: 'Akses ditolak: Hanya Super Admin (Kamtib) yang berhak menambah jadwal persidangan.' };
    }

    const newItem: WbpDiLuarItem = {
      ...item,
      id: `wbp-${item.kategori}-${Date.now()}`,
      created_by_role: currentUser.role,
      updated_at: getFormattedNow(),
    };

    const nextList = [newItem, ...wbpDiLuar];
    setWbpDiLuar(nextList);
    syncWbpCalculations(nextList);

    const katTitle = item.kategori === 'rumah_sakit' ? 'Rumah Sakit' : item.kategori === 'kerja_luar' ? 'Kerja Luar' : 'Persidangan';
    addLog(`Penambahan WBP Di Luar (${katTitle})`, `${item.nama_wbp} - ${item.lokasi} (${item.keperluan})`);
    return { success: true, message: `Data WBP di luar (${katTitle}) berhasil ditambahkan!` };
  };

  const updateWbpDiLuar = (id: string, updatedFields: Partial<WbpDiLuarItem>) => {
    const existing = wbpDiLuar.find((i) => i.id === id);
    if (!existing) return { success: false, message: 'Data WBP tidak ditemukan.' };

    if (existing.kategori === 'rumah_sakit' && !canEditRumahSakit()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin KLINIK dan Super Admin yang dapat mengubah data Rumah Sakit.' };
    }
    if (existing.kategori === 'kerja_luar' && !canEditKerjaLuar()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin GIATJA dan Super Admin yang dapat mengubah data Kerja Luar.' };
    }
    if (existing.kategori === 'persidangan' && !canEditPersidangan()) {
      return { success: false, message: 'Akses ditolak: Hanya Super Admin yang dapat mengubah data Persidangan.' };
    }

    const nextList = wbpDiLuar.map((item) =>
      item.id === id ? { ...item, ...updatedFields, updated_at: getFormattedNow() } : item
    );
    setWbpDiLuar(nextList);
    syncWbpCalculations(nextList);

    addLog(`Perubahan Data WBP Di Luar`, `${existing.nama_wbp} (${existing.kategori}) diperbarui`);
    return { success: true, message: 'Data WBP berhasil diperbarui!' };
  };

  const deleteWbpDiLuar = (id: string) => {
    const existing = wbpDiLuar.find((i) => i.id === id);
    if (!existing) return { success: false, message: 'Data WBP tidak ditemukan.' };

    if (existing.kategori === 'rumah_sakit' && !canEditRumahSakit()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin KLINIK yang dapat menghapus data Rumah Sakit.' };
    }
    if (existing.kategori === 'kerja_luar' && !canEditKerjaLuar()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin GIATJA yang dapat menghapus data Kerja Luar.' };
    }
    if (existing.kategori === 'persidangan' && !canEditPersidangan()) {
      return { success: false, message: 'Akses ditolak: Hanya Super Admin yang dapat menghapus data Persidangan.' };
    }

    const nextList = wbpDiLuar.filter((item) => item.id !== id);
    setWbpDiLuar(nextList);
    syncWbpCalculations(nextList);

    addLog(`Penghapusan WBP Di Luar`, `${existing.nama_wbp} telah kembali ke dalam lapas / selesai.`);
    return { success: true, message: 'Data WBP berhasil dihapus / selesai pengawalan.' };
  };

  // Mutation: Jadwal & Piket
  const updatePejabatPiket = (pengawas: PejabatPiketInfo['pengawas'], perwira: PejabatPiketInfo['perwira']) => {
    if (!canEditJadwal()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin KAMTIB dan Super Admin yang berhak mengubah Jadwal Pejabat Piket.' };
    }
    setPejabatPiket({ pengawas, perwira });
    addLog('Pembaruan Pejabat Piket', `Pengawas: ${pengawas.nama}, Perwira: ${perwira.nama}`);
    return { success: true, message: 'Jadwal Pejabat Piket berhasil diperbarui!' };
  };

  const updateReguAnggota = (reguId: string, anggota: ReguJaga['anggota']) => {
    if (!canEditJadwal()) {
      return { success: false, message: 'Akses ditolak: Hanya Admin KAMTIB dan Super Admin yang berhak mengubah Personel Regu Jaga.' };
    }
    setReguJaga((prev) =>
      prev.map((regu) => (regu.id === reguId ? { ...regu, anggota } : regu))
    );
    const targetRegu = reguJaga.find((r) => r.id === reguId);
    addLog('Pembaruan Personel Regu Jaga', `${targetRegu?.nama_regu || reguId} (${anggota.length} personil)`);
    return { success: true, message: 'Personel Regu Jaga berhasil diperbarui!' };
  };

  // Mutation: User Management (Super Admin only)
  const addUser = (newUser: Omit<UserAccount, 'uid'>, pass: string) => {
    if (!canManageUsers()) {
      return { success: false, message: 'Akses ditolak: Hanya Super Admin yang dapat menambah admin baru.' };
    }
    const created: UserAccount = {
      ...newUser,
      uid: `u-${Date.now()}`,
    };
    setUsers((prev) => [...prev, created]);
    INITIAL_PASSWORDS[newUser.username.toLowerCase()] = pass;
    addLog('Penambahan Admin Baru', `${created.name} sebagai ${created.roleTitle}`);
    return { success: true, message: `Admin ${created.name} berhasil didaftarkan!` };
  };

  const deleteUser = (uid: string) => {
    if (!canManageUsers()) {
      return { success: false, message: 'Akses ditolak: Hanya Super Admin yang dapat menghapus admin.' };
    }
    if (uid === currentUser.uid) {
      return { success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.' };
    }
    const target = users.find((u) => u.uid === uid);
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
    if (target) {
      addLog('Penghapusan Akun Admin', `Akun ${target.name} (${target.username}) telah dinonaktifkan.`);
    }
    return { success: true, message: 'Akun admin berhasil dihapus.' };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        wbpSummary,
        wbpDiLuar,
        reguJaga,
        pejabatPiket,
        spreadsheetDuties,
        logs,
        selectedDate,
        setSelectedDate,
        activeTab,
        setActiveTab,
        isDrawerOpen,
        setIsDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isApkModalOpen,
        setIsApkModalOpen,
        currentScreen,
        setCurrentScreen,
        selectedReguId,
        setSelectedReguId,
        selectedWbpCategoryFilter,
        setSelectedWbpCategoryFilter,
        recentNotification,
        setRecentNotification,
        login,
        switchRoleQuick,
        logout,
        canEditKondisiWbp,
        canEditRumahSakit,
        canEditKerjaLuar,
        canEditPersidangan,
        canEditJadwal,
        canManageUsers,
        canContactOfficers,
        updateWbpSummaryNumbers,
        addWbpDiLuar,
        updateWbpDiLuar,
        deleteWbpDiLuar,
        updatePejabatPiket,
        updateReguAnggota,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
