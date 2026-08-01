import React, { useState } from 'react';
import { 
  X, 
  Users, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  Search, 
  Trash2, 
  Plus, 
  Activity, 
  Download, 
  Settings, 
  CheckCircle2, 
  Flame,
  Shield,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { User, Note, SystemStats } from '../types';
import { AuthService } from '../services/authService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allNotes: Note[];
  onDeleteNoteByAdmin: (noteId: string) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  allNotes,
  onDeleteNoteByAdmin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'notes' | 'settings'>('stats');
  const [usersList, setUsersList] = useState<User[]>(() => AuthService.getUsers());
  const [userSearch, setUserSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const [allowRegistrations, setAllowRegistrations] = useState(true);

  // New User Form modal inside Admin
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');

  if (!isOpen) return null;

  // Calculate system stats
  const stats: SystemStats = {
    totalUsers: usersList.length,
    activeUsersToday: usersList.filter(u => u.lastCheckInDate === new Date().toISOString().split('T')[0]).length,
    totalNotes: allNotes.filter(n => !n.isInTrash).length,
    adminCount: usersList.filter(u => u.role === 'admin').length,
    suspendedUsers: usersList.filter(u => u.status === 'suspended').length,
  };

  // Filtered users list
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtered notes list
  const filteredNotes = allNotes.filter(n => 
    !n.isInTrash && (
      n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.category.toLowerCase().includes(noteSearch.toLowerCase())
    )
  );

  const handleToggleStatus = (userId: string) => {
    const updated = AuthService.toggleUserStatus(userId);
    setUsersList(updated);
    onShowToast('Kullanıcı durumu güncellendi.');
  };

  const handleToggleRole = (userId: string) => {
    const updated = AuthService.toggleUserRole(userId);
    setUsersList(updated);
    onShowToast('Kullanıcı rolü değiştirildi.');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      const updated = AuthService.deleteUser(userId);
      setUsersList(updated);
      onShowToast('Kullanıcı sistemden silindi.');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      onShowToast('Lütfen isim ve e-posta alanlarını doldurun.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      status: 'active',
      streakCount: 1,
      lastCheckInDate: todayStr,
      loginHistory: [todayStr]
    };

    const updatedUsers = [...usersList, newUser];
    AuthService.saveUsers(updatedUsers);
    setUsersList(updatedUsers);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    onShowToast('Yeni kullanıcı oluşturuldu.');
  };

  const handleExportSystemData = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      stats,
      users: usersList,
      notesCount: allNotes.length
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `not_defteri_sistem_raporu_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Sistem raporu JSON olarak indirildi.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Sistem Yönetim Paneli</h2>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Giriş Yapan: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 p-2 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Genel İstatistikler</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcı Yönetimi ({stats.totalUsers})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Not Denetimi ({stats.totalNotes})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Ayarlar & Rapor</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Toplam Kayıtlı Üye</span>
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {stats.totalUsers}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ücretsiz ve Yönetici hesapları dahil
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Bugün Aktif Üyeler</span>
                    <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {stats.activeUsersToday}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Günlük giriş yapmış kullanıcı sayısı
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Toplam Aktif Not</span>
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                    {stats.totalNotes}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Sistemde mevcut olan not sayısı
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Yöneticiler</span>
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                    {stats.adminCount}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tam sistem yetkisine sahip hesaplar
                  </p>
                </div>
              </div>

              {/* Activity & System Health overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Giriş Serisi Liderliği</span>
                  </h3>
                  <div className="space-y-2">
                    {usersList.sort((a, b) => (b.streakCount || 0) - (a.streakCount || 0)).slice(0, 3).map((u, i) => (
                      <div key={u.id} className="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                            #{i + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                        <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          🔥 {u.streakCount || 0} Gün
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Sistem Sağlık ve Durumu</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Açık Kayıt Modu</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Aktif</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Veri Saklama Mekanizması</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">LocalStorage Persist</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Askıdaki Kullanıcılar</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{stats.suspendedUsers} Hesap</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* Actions Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Kullanıcı adı veya e-posta ara..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddUserModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Kullanıcı Ekle</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">Kullanıcı</th>
                      <th className="p-3.5">Rol</th>
                      <th className="p-3.5">Giriş Serisi</th>
                      <th className="p-3.5">Durum</th>
                      <th className="p-3.5">Kayıt Tarihi</th>
                      <th className="p-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                          Aramaya uygun kullanıcı bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}>
                              {u.role === 'admin' ? '🛡️ Admin' : '👤 Kullanıcı'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              🔥 {u.streakCount || 1} Gün
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            }`}>
                              {u.status === 'active' ? 'Aktif' : 'Askıda'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            {u.id !== currentUser.id && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleRole(u.id)}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold"
                                  title="Rol Değiştir"
                                >
                                  {u.role === 'admin' ? 'User Yap' : 'Admin Yap'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(u.id)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                    u.status === 'active'
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  }`}
                                >
                                  {u.status === 'active' ? 'Askıya Al' : 'Aktifleştir'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                                  title="Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NOTE MODERATION */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Not başlığı veya içeriğinde ara..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredNotes.length === 0 ? (
                  <p className="col-span-full py-8 text-center text-slate-400 italic">
                    Gösterilecek not bulunamadı.
                  </p>
                ) : (
                  filteredNotes.map((n) => (
                    <div key={n.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">
                          {n.category}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm('Bu notu silmek istediğinize emin misiniz?')) {
                              onDeleteNoteByAdmin(n.id);
                              onShowToast('Not yönetici tarafından silindi.');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Notu Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {n.title || 'Başlıksız Not'}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {n.type === 'checklist' 
                          ? `${n.checklist?.length || 0} maddelik liste` 
                          : n.content}
                      </p>

                      <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                        <span>Oluşturulma: {new Date(n.createdAt).toLocaleDateString('tr-TR')}</span>
                        <span>Etiketler: #{n.tags.join(', #')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & EXPORT */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <span>Sistem Yapılandırmaları</span>
                </h3>

                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Açık Kayıt Modu</h4>
                    <p className="text-[11px] text-slate-500">Ziyaretçilerin kendi başlarına hesap oluşturmasına izin ver.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRegistrations}
                    onChange={(e) => {
                      setAllowRegistrations(e.target.checked);
                      onShowToast(`Kayıt modu ${e.target.checked ? 'açıldı' : 'kapatıldı'}.`);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Sistem Veri Yedeği Al</h4>
                    <p className="text-[11px] text-slate-500">Tüm üye listesi ve sistem metriklerini JSON raporu olarak indir.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportSystemData}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Raporu İndir</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Yeni Kullanıcı Ekle</h3>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Ad Soyad</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">E-Posta</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ahmet@example.com"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Rol</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'user' | 'admin')}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  <option value="user">Kullanıcı (Standart)</option>
                  <option value="admin">Yönetici (Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
