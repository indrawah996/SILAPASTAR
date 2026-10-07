export type UserRole = 'superadmin' | 'klinik' | 'binadik' | 'kamtib' | 'giatja' | 'user';

export interface UserAccount {
  uid: string;
  username: string;
  role: UserRole;
  name: string;
  nip?: string;
  roleTitle: string;
  badgeColor: string;
}

export interface WbpSummary {
  total_wbp: number;
  di_dalam: number;
  di_luar: number;
  narapidana: number;
  tahanan: number;
  updated_by: string;
  updated_role: UserRole;
  updated_at: string;
}

export type WbpKategori = 'rumah_sakit' | 'persidangan' | 'kerja_luar';

export interface WbpDiLuarItem {
  id: string;
  kategori: WbpKategori;
  nama_wbp: string;
  keperluan: string;
  lokasi: string;
  tanggal_masuk: string;
  status: 'Aktif' | 'Selesai' | 'Dalam Pengawalan';
  no_reg?: string;
  pengawal?: string;
  keterangan?: string;
  created_by_role: UserRole;
  updated_at: string;
}

export interface ReguMember {
  id: string;
  nomor: number;
  nama: string;
  nip: string;
  pangkat?: string;
  jabatan: string;
  no_wa: string;
  tel?: string;
}

export interface ReguJaga {
  id: 'pagi' | 'siang' | 'malam' | 'portir' | 'kesehatan' | 'blok_wanita' | 'sarpras';
  nama_regu: string;
  shift: string;
  warna: string;
  komandan: {
    nama: string;
    nip: string;
    pangkat?: string;
    no_wa: string;
    tel?: string;
  };
  anggota: ReguMember[];
}

export interface SpreadsheetDutyRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  nama: string;
  jenis_piket: string;
  no_wa: string;
  status_pasien?: string;
}

export interface LogActivity {
  id: string;
  activity: string;
  user_role: UserRole;
  user_name: string;
  timestamp: string;
  details?: string;
}
