import React from 'react';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Download, 
  Upload, 
  Trash2, 
  StickyNote, 
  Sun, 
  Moon, 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  Flame, 
  LogOut, 
  LogIn,
  MessageSquarePlus,
  ChevronDown
} from 'lucide-react';
import { ViewMode, User } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onNewNote: () => void;
  totalNotes: number;
  trashCount: number;
  onExportNotes: () => void;
  onImportNotes: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User;
  onOpenAuthModal: () => void;
  onOpenAdminPanel: () => void;
  onOpenStreakModal: () => void;
  onOpenFeedbackDropdown: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onNewNote,
  totalNotes,
  trashCount,
  onExportNotes,
  onImportNotes,
  activeFilter,
  setActiveFilter,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onOpenAuthModal,
  onOpenAdminPanel,
  onOpenStreakModal,
  onOpenFeedbackDropdown,
  onLogout,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-2.5 transition-colors overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Top Header Row on Mobile / Left Section on Desktop */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* Logo and title */}
          <button
            type="button"
            onClick={onOpenFeedbackDropdown}
            id="not-defteri-feedback-brand-btn"
            title={t('feedbackBtn')}
            className="flex items-center gap-2 text-left group cursor-pointer p-1 -m-1 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shrink-0"
          >
            <div className="w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <StickyNote className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none flex items-center gap-1.5">
                {t('appName')}
                <span className="text-[9px] sm:text-[10px] tracking-tight font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-1.5 sm:px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 flex items-center gap-0.5 sm:gap-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <MessageSquarePlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-500 group-hover:text-white" />
                  <span>{t('feedbackBtn')}</span>
                </span>
              </h1>
            </div>
          </button>

          {/* Top Right Mobile Quick Controls */}
          <div className="flex items-center gap-1.5 md:hidden shrink-0">
            <LanguageToggle />

            {/* Mobile Auth button */}
            {currentUser.role === 'guest' ? (
              <button
                onClick={onOpenAuthModal}
                id="mobile-login-btn"
                className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs font-bold"
                title={t('login')}
              >
                <LogIn className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onLogout}
                id="mobile-logout-btn"
                title={t('logout')}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar, Theme Toggle & New Note Button */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 justify-between md:justify-start">
          {/* Compact Search Bar */}
          <div className="relative flex-1 min-w-0 max-w-[170px] xs:max-w-[210px] sm:max-w-xs md:max-w-sm">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              id="search-notes-input"
              className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-100 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-transparent focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>

          {/* Theme Toggle (Aesthetically placed between Search and New Note) */}
          <div className="shrink-0 flex items-center">
            <ThemeToggle
              isDarkMode={isDarkMode}
              onToggle={onToggleDarkMode}
              variant="pill"
            />
          </div>

          {/* New Note Button */}
          <button
            onClick={onNewNote}
            id="main-new-note-btn"
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow transition-all shrink-0 whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('newNote')}</span>
          </button>
        </div>

        {/* Right Desktop Actions (Visible on md screens and above) */}
        <div className="hidden md:flex items-center gap-2 w-auto justify-end flex-wrap">

          {/* Language Selector */}
          <LanguageToggle />

          {/* User Profile / Auth State */}
          {currentUser.role === 'guest' ? (
            <button
              onClick={onOpenAuthModal}
              id="open-auth-modal-btn"
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="px-2 py-0.5 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={onLogout}
                id="logout-btn"
                title={t('logout')}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              id="view-grid-btn"
              title={t('gridView')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              id="view-list-btn"
              title={t('listView')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Import / Export */}
          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
            <button
              onClick={onExportNotes}
              id="export-notes-btn"
              title="Notları İndir (Yedekle)"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportNotes}
              accept=".json"
              className="hidden"
              id="import-file-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              id="import-notes-btn"
              title="Yedekten Not Yükle"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Trash shortcut if there are items */}
          {trashCount > 0 && (
            <button
              onClick={() => setActiveFilter(activeFilter === 'trash' ? 'all' : 'trash')}
              id="trash-shortcut-btn"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === 'trash'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Çöp Kutusu</span>
              <span className="bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-1.5 py-0.2 rounded-full text-[10px]">
                {trashCount}
              </span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

