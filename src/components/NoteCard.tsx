import React, { useState } from 'react';
import { 
  Pin, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  RotateCcw, 
  CheckSquare, 
  Tag, 
  Clock, 
  MoreVertical,
  Palette
} from 'lucide-react';
import { Note, ViewMode, NoteColor } from '../types';
import { COLOR_THEMES } from '../constants';
import { getNoteRecurrenceInfo } from '../utils/recurrence';
import { useLanguage } from '../i18n/LanguageContext';

interface NoteCardProps {

  note: Note;
  viewMode: ViewMode;
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onMoveToTrash: (id: string) => void;
  onRestoreFromTrash: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onToggleChecklistItem: (noteId: string, itemId: string) => void;
  onChangeColor: (noteId: string, color: NoteColor) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  viewMode,
  onEdit,
  onTogglePin,
  onMoveToTrash,
  onRestoreFromTrash,
  onDeletePermanently,
  onToggleChecklistItem,
  onChangeColor,
}) => {
  const [copied, setCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const theme = COLOR_THEMES[note.color] || COLOR_THEMES.slate;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    let textToCopy = `${note.title}\n\n${note.content}`;
    if (note.type === 'checklist' && note.checklist) {
      const itemsText = note.checklist
        .map(i => `${i.completed ? '✓' : '☐'} ${i.text}`)
        .join('\n');
      textToCopy += `\n\n${itemsText}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { t, language } = useLanguage();

  const formattedDate = new Date(note.updatedAt).toLocaleDateString(
    language === 'tr' ? 'tr-TR' : 'en-US',
    {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }
  );

  const recurrenceInfo = getNoteRecurrenceInfo(note);

  const completedChecklistCount = note.checklist
    ? note.checklist.filter(i => i.completed).length
    : 0;
  const totalChecklistCount = note.checklist ? note.checklist.length : 0;
  const checklistProgress = totalChecklistCount > 0
    ? Math.round((completedChecklistCount / totalChecklistCount) * 100)
    : 0;

  return (
    <div
      onClick={() => !note.isInTrash && onEdit(note)}
      id={`note-card-${note.id}`}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${theme.bg} ${theme.border} hover:shadow-md ${
        viewMode === 'list' ? 'p-4 flex-col md:flex-row md:items-center gap-4' : 'p-5'
      }`}
    >
      
      {/* Top Banner Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.dot}`} />

      {/* Main Content Area */}
      <div className="space-y-3 flex-1 min-w-0">
        
        {/* Title and Pin */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {note.type === 'checklist' && (
              <CheckSquare className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
            )}
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug truncate">
              {note.title || (language === 'tr' ? 'İsimsiz Not' : 'Untitled Note')}
            </h3>
          </div>

          {!note.isInTrash && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              id={`pin-note-btn-${note.id}`}
              title={note.isPinned ? t('unpin') : t('pin')}
              className={`p-1.5 rounded-lg transition-all shrink-0 ${
                note.isPinned
                  ? 'text-amber-600 bg-amber-100/80 dark:bg-amber-900/60 dark:text-amber-300 hover:bg-amber-200'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'rotate-45 fill-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Recurrence Status Banner */}
        {recurrenceInfo.recurrenceLabel && (
          <div className="flex items-center justify-between gap-1.5 px-2.5 py-1 bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
            <div className="flex items-center gap-1.5 min-w-0">
              <RotateCcw className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">{recurrenceInfo.recurrenceLabel}</span>
            </div>
            <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-normal shrink-0">
              {t('continuousRepeat')}
            </span>
          </div>
        )}

        {/* Note Body or Checklist */}
        {note.type === 'checklist' && note.checklist && note.checklist.length > 0 ? (
          <div className="space-y-2">
            
            {/* Progress bar */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex-1 bg-slate-200/80 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
              <span className="text-[11px] shrink-0">
                {completedChecklistCount}/{totalChecklistCount} (%{checklistProgress})
              </span>
            </div>

            {/* Checklist items scrollable container */}
            <div 
              className="space-y-1.5 pt-1 max-h-36 overflow-y-auto pr-1"
              onClick={(e) => e.stopPropagation()}
            >
              {note.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!note.isInTrash) {
                      onToggleChecklistItem(note.id, item.id);
                    }
                  }}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group/item cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-400 cursor-pointer shrink-0"
                  />
                  <span className={`truncate ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
            {note.content || <span className="italic text-slate-400 dark:text-slate-500">İçerik yok...</span>}
          </p>
        )}

        {/* Tags & Category */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {note.category && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.badge}`}>
              {note.category}
            </span>
          )}
          {note.tags.map((tag) => {
            const cleanTag = tag.toLowerCase().replace(/^@/, '');
            
            if (cleanTag === 'everyday' || cleanTag === 'hergun') {
              return (
                <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <span>🔄</span> Her Gün
                </span>
              );
            }
            if (cleanTag === 'weekly' || cleanTag === 'haftalik') {
              return (
                <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <span>📅</span> Haftalık
                </span>
              );
            }
            if (cleanTag === 'monthly' || cleanTag === 'aylik') {
              return (
                <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                  <span>🗓️</span> Aylık
                </span>
              );
            }
            if (cleanTag.startsWith('date:') || cleanTag.startsWith('tarih:')) {
              const dateVal = tag.split(':')[1] || '';
              return (
                <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-mono">
                  <span>⏰</span> {dateVal || 'Tarihli'}
                </span>
              );
            }

            return (
              <span
                key={tag}
                className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            );
          })}
        </div>

      </div>

      {/* Footer / Card Action Toolbar */}
      <div className={`pt-3 mt-3 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-400 ${
        viewMode === 'list' ? 'md:pt-0 md:mt-0 md:border-t-0 md:justify-end md:gap-4 shrink-0' : ''
      }`}>
        
        <div className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1">
          {note.isInTrash ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestoreFromTrash(note.id);
                }}
                id={`restore-note-btn-${note.id}`}
                title="Geri Yükle"
                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePermanently(note.id);
                }}
                id={`delete-permanent-btn-${note.id}`}
                title="Kalıcı Olarak Sil"
                className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              {/* Color picker quick menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker(!showColorPicker);
                  }}
                  title="Renk Değiştir"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>

                {showColorPicker && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 bottom-full mb-2 z-20 bg-white border border-slate-200 p-1.5 rounded-xl shadow-lg flex gap-1 animate-in fade-in zoom-in-95"
                  >
                    {(Object.keys(COLOR_THEMES) as NoteColor[]).map((cKey) => (
                      <button
                        key={cKey}
                        onClick={() => {
                          onChangeColor(note.id, cKey);
                          setShowColorPicker(false);
                        }}
                        className={`w-5 h-5 rounded-full ${COLOR_THEMES[cKey].bg} border ${COLOR_THEMES[cKey].border} hover:scale-110 transition-transform`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                id={`copy-note-btn-${note.id}`}
                title="Panoya Kopyala"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                id={`edit-note-btn-${note.id}`}
                title="Düzenle"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Trash Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToTrash(note.id);
                }}
                id={`trash-note-btn-${note.id}`}
                title="Çöp Kutusuna Taşı"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
