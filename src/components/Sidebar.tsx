import React, { useState } from 'react';
import { 
  FolderKanban, 
  Pin, 
  Tag, 
  Plus, 
  CheckSquare, 
  FileText, 
  Trash2, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  Palette,
  Repeat,
  Calendar,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { NoteColor } from '../types';
import { COLOR_THEMES } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface SidebarProps {

  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  allTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedColor: NoteColor | 'all';
  setSelectedColor: (color: NoteColor | 'all') => void;
  onAddCategory: (categoryName: string) => void;
  pinnedCount: number;
  totalNotesCount: number;
  trashCount: number;
  onOpenGuideModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  activeFilter,
  setActiveFilter,
  allTags,
  selectedTag,
  setSelectedTag,
  selectedColor,
  setSelectedColor,
  onAddCategory,
  pinnedCount,
  totalNotesCount,
  trashCount,
  onOpenGuideModal,
}) => {
  const { t, language } = useLanguage();
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isColorFilterOpen, setIsColorFilterOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);

  const handleAddCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setSelectedCategory(newCatInput.trim());
      setNewCatInput('');
      setShowAddCat(false);
    }
  };

  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  const SCHEDULE_PATTERNS = [
    { tag: 'everyday', label: language === 'tr' ? 'Her Gün' : 'Everyday', pattern: '@everyday', icon: '🔄', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
    { tag: 'weekly', label: language === 'tr' ? 'Haftalık' : 'Weekly', pattern: '@weekly', icon: '📅', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' },
    { tag: 'monthly', label: language === 'tr' ? 'Aylık' : 'Monthly', pattern: '@monthly', icon: '🗓️', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800' },
    { tag: 'date', label: language === 'tr' ? 'Tarihli İşler' : 'Scheduled Tasks', pattern: '@date', icon: '⏰', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
  ];

  const isAllSelected = activeFilter === 'all' && (selectedCategory === 'Tümü' || selectedCategory === 'All') && !selectedTag && selectedColor === 'all';

  return (
    <aside className="w-full lg:w-64 bg-slate-50/70 dark:bg-slate-900/60 border-r border-slate-200/80 dark:border-slate-800 p-4 flex flex-col gap-6 shrink-0 transition-colors">
      
      {/* Primary Filters */}
      <div className="space-y-1">
        <h3 className="px-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          {language === 'tr' ? 'Görünüm & Filtreler' : 'Views & Filters'}
        </h3>

        <button
          onClick={() => {
            setActiveFilter('all');
            setSelectedCategory(language === 'tr' ? 'Tümü' : 'All');
            setSelectedTag(null);
            setSelectedColor('all');
          }}
          id="filter-all-notes"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            isAllSelected
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4" />
            <span>{t('allNotes')}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            isAllSelected
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}>
            {totalNotesCount}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveFilter('pinned');
            setSelectedCategory(language === 'tr' ? 'Tümü' : 'All');
            setSelectedTag(null);
          }}
          id="filter-pinned-notes"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeFilter === 'pinned'
              ? 'bg-amber-500 text-white shadow-xs font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Pin className="w-4 h-4 rotate-45" />
            <span>{t('pinnedNotes')}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            activeFilter === 'pinned'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}>
            {pinnedCount}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveFilter('trash');
          }}
          id="filter-trash-notes"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeFilter === 'trash'
              ? 'bg-rose-600 text-white shadow-xs font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4" />
            <span>{t('trash')}</span>
          </div>
          {trashCount > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeFilter === 'trash' ? 'bg-rose-700 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}>
              {trashCount}
            </span>
          )}
        </button>
      </div>

      {/* Recurrence & Schedule Quick Filters */}
      <div className="space-y-2">
        <button
          onClick={() => setIsScheduleOpen(!isScheduleOpen)}
          id="toggle-schedule-collapse-btn"
          className="w-full flex items-center justify-between px-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === 'tr' ? 'Zamanlama Kalıpları' : 'Recurring Patterns'}</span>
          </div>
          {isScheduleOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {isScheduleOpen && (
          <div className="grid grid-cols-2 gap-1.5 px-1">
            {SCHEDULE_PATTERNS.map((item) => {
              const isSelected = selectedTag === item.tag || selectedTag === item.pattern;
              return (
                <button
                  key={item.tag}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTag(null);
                    } else {
                      setSelectedTag(item.tag);
                      setActiveFilter('tag');
                    }
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all text-left ${item.color} ${
                    isSelected ? 'ring-2 ring-indigo-500 font-bold shadow-2xs scale-102' : 'hover:opacity-90'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] leading-tight">{item.label}</p>
                    <p className="text-[9px] opacity-70 font-mono leading-tight">{item.pattern}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            id="toggle-categories-collapse-btn"
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer select-none"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>{t('categories')}</span>
            {isCategoriesOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCategoriesOpen) setIsCategoriesOpen(true);
              setShowAddCat(!showAddCat);
            }}
            id="toggle-add-category-btn"
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md transition-colors"
            title={t('addCategory')}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {isCategoriesOpen && (
          <>
            {showAddCat && (
              <form onSubmit={handleAddCatSubmit} className="mb-2 px-1">
                <input
                  type="text"
                  placeholder={t('newCategoryPlaceholder')}
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  autoFocus
                  id="new-category-input"
                  className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                />
              </form>
            )}

            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const displayCat = cat === 'Tümü' && language === 'en' ? 'All' : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveFilter('category');
                    }}
                    id={`category-item-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === 'category' && selectedCategory === cat
                        ? 'bg-slate-900 dark:bg-indigo-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{displayCat}</span>
                    {selectedCategory === cat && activeFilter === 'category' && (
                      <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Color Filter */}
      <div className="space-y-2">
        <button
          onClick={() => setIsColorFilterOpen(!isColorFilterOpen)}
          id="toggle-color-filter-collapse-btn"
          className="w-full flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Renk Filtresi' : 'Color Filter'}</span>
          </div>
          {isColorFilterOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {isColorFilterOpen && (
          <div className="flex items-center flex-wrap gap-1.5 px-2">
            <button
              onClick={() => setSelectedColor('all')}
              id="color-filter-all"
              title={t('filterAllColors')}
              className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                selectedColor === 'all'
                  ? 'border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {language === 'tr' ? 'Tümü' : 'All'}
            </button>
            {(Object.keys(COLOR_THEMES) as NoteColor[]).map((colKey) => {
              const theme = COLOR_THEMES[colKey];
              return (
                <button
                  key={colKey}
                  onClick={() => setSelectedColor(selectedColor === colKey ? 'all' : colKey)}
                  id={`color-filter-${colKey}`}
                  title={theme.name}
                  className={`w-6 h-6 rounded-full border ${theme.border} ${theme.bg} transition-all ${
                    selectedColor === colKey ? `ring-2 ${theme.ring} scale-110` : 'hover:scale-105'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Tags Section */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            id="toggle-tags-collapse-btn"
            className="w-full flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Popüler Etiketler' : 'Popular Tags'}</span>
            </div>
            {isTagsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isTagsOpen && (
            <div className="flex flex-wrap gap-1.5 px-1 max-h-36 overflow-y-auto">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTag === tag) {
                      setSelectedTag(null);
                    } else {
                      setSelectedTag(tag);
                      setActiveFilter('tag');
                    }
                  }}
                  id={`tag-filter-${tag}`}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Usage Guide & Tips Card */}
      <div className="mt-auto p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50/80 dark:from-indigo-950/60 dark:to-purple-950/50 border border-indigo-200/80 dark:border-indigo-800/80 rounded-2xl text-indigo-950 dark:text-indigo-100 text-xs space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200 text-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('usageGuide')}</span>
          </div>
          <span className="text-[10px] bg-indigo-200/70 dark:bg-indigo-800/70 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded-md font-semibold">
            v2.0
          </span>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          {language === 'tr'
            ? 'Notlarınıza zamanlama eklemek için etiket olarak @everyday, @weekly, @monthly veya @date:2026-08-15 kullanabilirsiniz.'
            : 'Add recurring tags like @everyday, @weekly, @monthly or @date:2026-08-15 to automatically schedule your tasks.'}
        </p>

        <button
          onClick={onOpenGuideModal}
          id="open-guide-modal-sidebar-btn"
          className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{language === 'tr' ? 'Tüm Rehberi & Kalıpları Aç' : 'Open Full Guide & Patterns'}</span>
        </button>
      </div>

    </aside>
  );
};
