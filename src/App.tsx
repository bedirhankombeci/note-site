import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { NoteModal } from './components/NoteModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { StreakTrackerModal } from './components/StreakTrackerModal';
import { SecretAdminModal } from './components/SecretAdminModal';
import { GuideModal } from './components/GuideModal';
import { FeedbackDropdown } from './components/FeedbackDropdown';
import { SortBar } from './components/SortBar';
import { Note, SortOption, ViewMode, NoteColor, User } from './types';
import { INITIAL_NOTES, DEFAULT_CATEGORIES } from './constants';
import { AuthService } from './services/authService';
import { processRecurringNotes } from './utils/recurrence';
import { Plus, StickyNote, Trash2, Sparkles, Pin } from 'lucide-react';

export default function App() {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const user = AuthService.getCurrentUser();
    return AuthService.processDailyCheckIn(user);
  });

  // LocalStorage state initialization
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('not_defteri_notes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load notes from localStorage', err);
    }
    return INITIAL_NOTES;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('not_defteri_categories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
    return DEFAULT_CATEGORIES;
  });

  // New Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Check and process recurring tasks (@everyday, @weekly, @monthly) on load
  useEffect(() => {
    const { updatedNotes, resetCount } = processRecurringNotes(notes);
    if (resetCount > 0) {
      setNotes(updatedNotes);
      showToast(`🔄 Tekrarlayan ${resetCount} göreviniz yeni dönem için otomatik yenilendi!`);
    }
  }, []);

  // Global Keyboard Shortcut: Ctrl + Shift + E for Secret Admin Access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        setIsSecretAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSecretAdminSuccess = () => {
    const res = AuthService.loginAsAdmin();
    setCurrentUser(res.user);
    setIsAdminPanelOpen(true);
    showToast('Yönetici kimliği doğrulandı. Admin paneli açıldı.');
  };

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('not_defteri_darkmode');
      if (saved !== null) return JSON.parse(saved);
    } catch (err) {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('not_defteri_darkmode', JSON.stringify(isDarkMode));
    } catch (err) {}
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // User auth handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Hoş geldiniz, ${user.name}!`);
  };

  const handleLogout = () => {
    AuthService.logout();
    const guest = AuthService.getCurrentUser();
    setCurrentUser(guest);
    showToast('Çıkış yapıldı. Misafir modundasınız.');
  };

  const handleDeleteNoteByAdmin = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };


  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<NoteColor | 'all'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isConfirmTrashOpen, setIsConfirmTrashOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('not_defteri_notes', JSON.stringify(notes));
    } catch (err) {
      console.error('Failed to save notes', err);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('not_defteri_categories', JSON.stringify(categories));
    } catch (err) {
      console.error('Failed to save categories', err);
    }
  }, [categories]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      if (!note.isInTrash && note.tags) {
        note.tags.forEach(t => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [notes]);

  // Add a new category
  const handleAddCategory = (newCat: string) => {
    if (newCat && !categories.includes(newCat)) {
      setCategories(prev => [...prev, newCat]);
      showToast(`"${newCat}" kategorisi eklendi.`);
    }
  };

  // Create or Update Note
  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isInTrash'> & { id?: string }) => {
    const now = Date.now();
    if (noteData.id) {
      // Update
      setNotes(prev =>
        prev.map(note =>
          note.id === noteData.id
            ? {
                ...note,
                ...noteData,
                updatedAt: now,
              }
            : note
        )
      );
      showToast('Not güncellendi.');
    } else {
      // Create
      const newNote: Note = {
        ...noteData,
        id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        createdAt: now,
        updatedAt: now,
        isInTrash: false,
      };
      setNotes(prev => [newNote, ...prev]);
      showToast('Yeni not oluşturuldu.');
    }
  };

  // Pin Toggle
  const handleTogglePin = (id: string) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, isPinned: !note.isPinned } : note))
    );
  };

  // Move to Trash
  const handleMoveToTrash = (id: string) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, isInTrash: true, isPinned: false } : note))
    );
    showToast('Not çöp kutusuna taşındı.');
  };

  // Restore from Trash
  const handleRestoreFromTrash = (id: string) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, isInTrash: false } : note))
    );
    showToast('Not geri yüklendi.');
  };

  // Delete Permanently
  const handleDeletePermanently = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    showToast('Not kalıcı olarak silindi.');
  };

  // Empty Trash
  const handleEmptyTrash = () => {
    setIsConfirmTrashOpen(true);
  };

  const executeEmptyTrash = () => {
    setNotes(prev => prev.filter(note => !note.isInTrash));
    showToast('Çöp kutusu başarıyla boşaltıldı.');
  };

  // Toggle Checklist item directly on card
  const handleToggleChecklistItem = (noteId: string, itemId: string) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id === noteId && note.checklist) {
          const updatedList = note.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          return { ...note, checklist: updatedList, updatedAt: Date.now() };
        }
        return note;
      })
    );
  };

  // Change Color
  const handleChangeColor = (noteId: string, newColor: NoteColor) => {
    setNotes(prev =>
      prev.map(note => (note.id === noteId ? { ...note, color: newColor } : note))
    );
  };

  // Export Notes JSON
  const handleExportNotes = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `not_defteri_yedek_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Notlarınız JSON yedek dosyası olarak indirildi.');
  };

  // Import Notes JSON
  const handleImportNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedData)) {
            setNotes(importedData);
            showToast(`${importedData.length} adet not başarıyla yüklendi.`);
          } else {
            showToast('Geçersiz dosya formatı.');
          }
        } catch (err) {
          showToast('JSON dosyası okunamadı.');
        }
      };
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // Open New Modal
  const handleOpenNew = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setSelectedCategory('Tümü');
    setSelectedTag(null);
    setSelectedColor('all');
  };

  const hasActiveFilters = Boolean(
    searchQuery || activeFilter !== 'all' || selectedCategory !== 'Tümü' || selectedTag || selectedColor !== 'all'
  );

  // Filter & Sort Logic
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Trash filter check
      if (activeFilter === 'trash') {
        if (!note.isInTrash) return false;
      } else {
        if (note.isInTrash) return false;
      }

      // Filter by Pinned
      if (activeFilter === 'pinned' && !note.isPinned) {
        return false;
      }

      // Filter by Category
      if (activeFilter === 'category' && selectedCategory !== 'Tümü') {
        if (note.category !== selectedCategory) return false;
      }

      // Filter by Tag
      if (activeFilter === 'tag' && selectedTag) {
        if (!note.tags || note.tags.length === 0) return false;
        const targetClean = selectedTag.toLowerCase().replace(/^@/, '');
        const matchesTag = note.tags.some(t => {
          const cleanT = t.toLowerCase().replace(/^@/, '');
          if (cleanT === targetClean) return true;
          if (targetClean === 'everyday' && (cleanT === 'hergun' || cleanT === 'everyday')) return true;
          if (targetClean === 'weekly' && (cleanT === 'haftalik' || cleanT === 'weekly')) return true;
          if (targetClean === 'monthly' && (cleanT === 'aylik' || cleanT === 'monthly')) return true;
          if (targetClean === 'date' && (cleanT.startsWith('date:') || cleanT.startsWith('tarih:'))) return true;
          return false;
        });
        if (!matchesTag) return false;
      }

      // Filter by Color
      if (selectedColor !== 'all' && note.color !== selectedColor) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = note.title.toLowerCase().includes(q);
        const matchContent = note.content.toLowerCase().includes(q);
        const matchTags = note.tags?.some(t => t.toLowerCase().includes(q));
        const matchCategory = note.category.toLowerCase().includes(q);
        const matchChecklist = note.checklist?.some(c => c.text.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags && !matchCategory && !matchChecklist) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'newest') return b.createdAt - a.createdAt;
      if (sortOption === 'oldest') return a.createdAt - b.createdAt;
      if (sortOption === 'updated') return b.updatedAt - a.updatedAt;
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title, 'tr');
      return 0;
    });
  }, [notes, activeFilter, selectedCategory, selectedTag, selectedColor, searchQuery, sortOption]);

  // Separate pinned and unpinned notes for standard view
  const pinnedNotes = useMemo(() => {
    return filteredNotes.filter(n => n.isPinned);
  }, [filteredNotes]);

  const unpinnedNotes = useMemo(() => {
    return filteredNotes.filter(n => !n.isPinned);
  }, [filteredNotes]);

  // Header stats
  const activeNotesCount = notes.filter(n => !n.isInTrash).length;
  const trashNotesCount = notes.filter(n => n.isInTrash).length;
  const pinnedNotesCount = notes.filter(n => !n.isInTrash && n.isPinned).length;

  // Title for filter bar
  const getFilterTitle = () => {
    if (activeFilter === 'trash') return 'Çöp Kutusu';
    if (activeFilter === 'pinned') return 'Başa Tutturulan Notlar';
    if (activeFilter === 'category' && selectedCategory !== 'Tümü') return `Kategori: ${selectedCategory}`;
    if (activeFilter === 'tag' && selectedTag) return `Etiket: #${selectedTag}`;
    if (selectedColor !== 'all') return `Renk Filtresi`;
    return 'Tüm Notlar';
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors overflow-x-hidden">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}



      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onNewNote={handleOpenNew}
        totalNotes={activeNotesCount}
        trashCount={trashNotesCount}
        onExportNotes={handleExportNotes}
        onImportNotes={handleImportNotes}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenFeedbackDropdown={() => setIsFeedbackModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row">
        
        {/* Left Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          onAddCategory={handleAddCategory}
          pinnedCount={pinnedNotesCount}
          totalNotesCount={activeNotesCount}
          trashCount={trashNotesCount}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />

        {/* Notes Grid / Content Panel */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Trash Banner if in Trash mode */}
          {activeFilter === 'trash' && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Çöp Kutusundasınız</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">Silinen notları geri yükleyebilir veya kalıcı olarak temizleyebilirsiniz.</p>
                </div>
              </div>
              {trashNotesCount > 0 && (
                <button
                  onClick={handleEmptyTrash}
                  id="empty-trash-btn"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors shadow-2xs"
                >
                  Çöp Kutusunu Boşalt
                </button>
              )}
            </div>
          )}

          {/* Sort & Info Bar */}
          <SortBar
            sortOption={sortOption}
            setSortOption={setSortOption}
            filteredCount={filteredNotes.length}
            activeFilterTitle={getFilterTitle()}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Notes Grid / List Display */}
          {filteredNotes.length === 0 ? (
            /* Empty state */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 my-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <StickyNote className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {searchQuery ? 'Aramanıza uygun not bulunamadı' : 'Henüz not bulunmuyor'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                {searchQuery
                  ? 'Farklı bir kelime aramayı deneyin veya filtreleri temizleyin.'
                  : 'Yeni bir fikir, yapılacak iş listesi veya günlük not almak için aşağıdaki butona tıklayın.'}
              </p>
              {activeFilter !== 'trash' && (
                <button
                  onClick={handleOpenNew}
                  id="empty-state-new-note-btn"
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>İlk Notunuzu Oluşturun</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Pinned Section (Show only if not explicitly filtering by pinned, and when pinned notes exist) */}
              {activeFilter !== 'pinned' && pinnedNotes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider px-1">
                    <Pin className="w-3.5 h-3.5 rotate-45 text-amber-600" />
                    <span>Başa Tutturulanlar ({pinnedNotes.length})</span>
                  </div>

                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
                      : 'flex flex-col gap-3'
                  }>
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        viewMode={viewMode}
                        onEdit={handleOpenEdit}
                        onTogglePin={handleTogglePin}
                        onMoveToTrash={handleMoveToTrash}
                        onRestoreFromTrash={handleRestoreFromTrash}
                        onDeletePermanently={handleDeletePermanently}
                        onToggleChecklistItem={handleToggleChecklistItem}
                        onChangeColor={handleChangeColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Notes Section */}
              <div className="space-y-3">
                {activeFilter !== 'pinned' && pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    <span>Diğer Notlar ({unpinnedNotes.length})</span>
                  </div>
                )}

                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
                    : 'flex flex-col gap-3'
                }>
                  {(activeFilter !== 'pinned' && pinnedNotes.length > 0 ? unpinnedNotes : filteredNotes).map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      onEdit={handleOpenEdit}
                      onTogglePin={handleTogglePin}
                      onMoveToTrash={handleMoveToTrash}
                      onRestoreFromTrash={handleRestoreFromTrash}
                      onDeletePermanently={handleDeletePermanently}
                      onToggleChecklistItem={handleToggleChecklistItem}
                      onChangeColor={handleChangeColor}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={handleOpenNew}
        id="fab-new-note-btn"
        className="md:hidden fixed bottom-6 right-6 z-40 w-13 h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all"
        title="Yeni Not Ekle"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Note Creation / Editing Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        noteToEdit={editingNote}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Confirm Empty Trash Modal */}
      <ConfirmModal
        isOpen={isConfirmTrashOpen}
        onClose={() => setIsConfirmTrashOpen(false)}
        onConfirm={executeEmptyTrash}
        title="Çöp Kutusunu Boşalt"
        description="Çöp kutusundaki tüm notlar kalıcı olarak silinecektir. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?"
        confirmText="Çöpü Boşalt"
        cancelText="İptal"
        isDanger={true}
      />

      {/* Auth Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={currentUser}
        allNotes={notes}
        onDeleteNoteByAdmin={handleDeleteNoteByAdmin}
        onShowToast={showToast}
      />

      {/* Daily/Weekly Streak & Progress Tracker Modal */}
      <StreakTrackerModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        user={currentUser}
        totalNotesCount={notes.filter(n => !n.isInTrash).length}
        onUserUpdate={(updatedUser) => setCurrentUser(updatedUser)}
      />

      {/* Secret Admin Shortcut Password Modal (Ctrl + Shift + E) */}
      <SecretAdminModal
        isOpen={isSecretAdminModalOpen}
        onClose={() => setIsSecretAdminModalOpen(false)}
        onSuccess={handleSecretAdminSuccess}
      />

      {/* Usage Guide & Shortcut Patterns Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onInsertTag={(tagPattern) => {
          setIsGuideModalOpen(false);
          handleOpenNew();
        }}
      />

      {/* User Feedback & Suggestion Dropdown Panel */}
      <FeedbackDropdown
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        userEmail={currentUser.email}
        onShowToast={showToast}
      />

    </div>
  );
}
