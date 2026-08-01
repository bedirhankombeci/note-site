import React from 'react';
import { ArrowUpDown, FileText, Pin, Trash2, Tag, FolderKanban } from 'lucide-react';
import { SortOption } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface SortBarProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filteredCount: number;
  activeFilterTitle: string;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const SortBar: React.FC<SortBarProps> = ({
  sortOption,
  setSortOption,
  filteredCount,
  activeFilterTitle,
  onClearFilters,
  hasActiveFilters,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:px-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
      
      {/* Title / Filter Info */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="font-bold text-slate-800 dark:text-slate-100">{activeFilterTitle}</span>
        <span className="text-slate-400 font-medium">•</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {filteredCount} {t('searchResultCount')}
        </span>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            id="clear-filters-btn"
            className="ml-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2 py-0.5 rounded-lg transition-colors"
          >
            {language === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
          </button>
        )}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">
          {language === 'tr' ? 'Sırala:' : 'Sort:'}
        </span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          id="sort-notes-select"
          className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="newest">{t('sortNewest')}</option>
          <option value="updated">{t('sortUpdated')}</option>
          <option value="oldest">{t('sortOldest')}</option>
          <option value="alphabetical">{t('sortAlphabetical')}</option>
        </select>
      </div>

    </div>
  );
};

