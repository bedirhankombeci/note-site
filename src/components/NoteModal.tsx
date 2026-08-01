import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Trash2, 
  Pin, 
  Tag, 
  FolderKanban, 
  Palette, 
  CheckSquare, 
  FileText,
  Type,
  List,
  Bold,
  Italic,
  Sparkles
} from 'lucide-react';
import { Note, NoteColor, ChecklistItem } from '../types';
import { COLOR_THEMES } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface NoteModalProps {

  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isInTrash'> & { id?: string }) => void;
  noteToEdit?: Note | null;
  categories: string[];
  onAddCategory: (cat: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  noteToEdit,
  categories,
  onAddCategory,
}) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'text' | 'checklist'>('text');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [category, setCategory] = useState(language === 'tr' ? 'Kişisel' : 'Personal');
  const [customCatInput, setCustomCatInput] = useState('');
  const [showCustomCat, setShowCustomCat] = useState(false);
  const [color, setColor] = useState<NoteColor>('slate');
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setType(noteToEdit.type || 'text');
      setChecklist(noteToEdit.checklist || []);
      setCategory(noteToEdit.category || (language === 'tr' ? 'Kişisel' : 'Personal'));
      setColor(noteToEdit.color || 'slate');
      setIsPinned(noteToEdit.isPinned || false);
      setTags(noteToEdit.tags || []);
    } else {
      // Reset for new note
      setTitle('');
      setContent('');
      setType('text');
      setChecklist([]);
      setCategory(categories[1] || 'Kişisel');
      setColor('slate');
      setIsPinned(false);
      setTags([]);
    }
    setTagInput('');
    setNewChecklistText('');
    setShowCustomCat(false);
  }, [noteToEdit, isOpen, categories]);

  if (!isOpen) return null;

  // Add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Checklist actions
  const handleAddChecklistItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newChecklistText.trim()) {
      setChecklist([
        ...checklist,
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
          text: newChecklistText.trim(),
          completed: false,
        }
      ]);
      setNewChecklistText('');
    }
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist(
      checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleChecklistTextChange = (id: string, newText: string) => {
    setChecklist(
      checklist.map(item => item.id === id ? { ...item, text: newText } : item)
    );
  };

  // Text formatting helpers
  const handleInsertText = (prefix: string, suffix: string = '') => {
    setContent(prev => prev + `${prefix}${suffix}`);
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = category;
    if (showCustomCat && customCatInput.trim()) {
      finalCategory = customCatInput.trim();
      onAddCategory(finalCategory);
    }

    onSave({
      id: noteToEdit?.id,
      title: title.trim(),
      content: content.trim(),
      type,
      checklist,
      category: finalCategory,
      color,
      isPinned,
      tags,
    });
    onClose();
  };

  const activeTheme = COLOR_THEMES[color] || COLOR_THEMES.slate;

  // Word & character count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border ${activeTheme.border} dark:border-slate-800 overflow-hidden transition-all flex flex-col max-h-[90vh]`}
      >
        
        {/* Header Bar */}
        <div className={`p-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 ${activeTheme.bg}`}>
          
          {/* Note Type Selector */}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setType('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                type === 'text'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('textNote')}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('checklist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                type === 'checklist'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{t('checklist')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Pin Action */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? t('unpin') : t('pin')}
              className={`p-2 rounded-xl transition-all ${
                isPinned
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'rotate-45 fill-amber-600 dark:fill-amber-400' : ''}`} />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Note Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('noteTitlePlaceholder')}
              id="modal-note-title"
              className="w-full text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 dark:placeholder-slate-500 outline-none border-b border-transparent focus:border-indigo-500 pb-1.5 transition-colors"
            />
          </div>

          {/* Type Specific Input: Text or Checklist */}
          {type === 'text' ? (
            <div className="space-y-2">
              {/* Quick Format Tools */}
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => handleInsertText('**', '**')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs flex items-center gap-1"
                  title={language === 'tr' ? 'Kalın' : 'Bold'}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertText('*', '*')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs flex items-center gap-1"
                  title={language === 'tr' ? 'İtalik' : 'Italic'}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertText('• ')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs flex items-center gap-1"
                  title={language === 'tr' ? 'Madde İşareti' : 'Bullet List'}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  {wordCount} {t('wordCount')} • {charCount} {t('charCount')}
                </span>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('noteContentPlaceholder')}
                rows={7}
                id="modal-note-content"
                className="w-full text-sm text-slate-800 dark:text-slate-100 bg-transparent placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-none leading-relaxed p-2 rounded-xl focus:bg-slate-50/50 dark:focus:bg-slate-800/50"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Checklist Add Item */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  placeholder={language === 'tr' ? "Madde ekle ve Enter'a bas..." : "Add item and press Enter..."}
                  id="modal-checklist-item-input"
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addChecklistItem')}</span>
                </button>
              </div>

              {/* Items list */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {checklist.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic py-3 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    {language === 'tr'
                      ? 'Henüz madde eklenmedi. Yukarıdaki alandan yeni madde ekleyebilirsiniz.'
                      : 'No items added yet. You can add items using the field above.'}
                  </p>
                ) : (
                  checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 p-2 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(item.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleChecklistTextChange(item.id, e.target.value)}
                        className={`flex-1 text-xs sm:text-sm bg-transparent outline-none ${
                          item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t('categoryLabel')}</span>
              </label>
              
              {!showCustomCat ? (
                <div className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    id="modal-category-select"
                    className="flex-1 text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                  >
                    {categories.filter(c => c !== 'Tümü').map((cat) => (
                      <option key={cat} value={cat} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomCat(true)}
                    className="px-2.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
                    title={t('addCategory')}
                  >
                    + {language === 'tr' ? 'Yeni' : 'New'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCatInput}
                    onChange={(e) => setCustomCatInput(e.target.value)}
                    placeholder={t('newCategoryPlaceholder')}
                    className="flex-1 text-xs sm:text-sm px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-indigo-400 dark:border-indigo-500 rounded-xl outline-none placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomCat(false)}
                    className="px-2.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl"
                  >
                    {t('cancel')}
                  </button>
                </div>
              )}
            </div>

            {/* Tag Input & Quick Patterns */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'tr' ? 'Etiketler (Enter ile ekleyin)' : 'Tags (Press Enter to add)'}</span>
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={t('tagsPlaceholder')}
                id="modal-tags-input"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
              />

              {/* Quick Preset Pattern Chips */}
              <div className="flex items-center flex-wrap gap-1 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Hızlı Zamanlama:</span>
                
                <button
                  type="button"
                  onClick={() => {
                    if (!tags.includes('everyday')) setTags([...tags, 'everyday']);
                  }}
                  className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-amber-100 transition-colors"
                >
                  <span>🔄</span>
                  <span>+ @everyday</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!tags.includes('weekly')) setTags([...tags, 'weekly']);
                  }}
                  className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                >
                  <span>📅</span>
                  <span>+ @weekly</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!tags.includes('monthly')) setTags([...tags, 'monthly']);
                  }}
                  className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-purple-100 transition-colors"
                >
                  <span>🗓️</span>
                  <span>+ @monthly</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const dateTag = `date:${todayStr}`;
                    if (!tags.includes(dateTag)) setTags([...tags, dateTag]);
                  }}
                  className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                >
                  <span>⏰</span>
                  <span>+ @date:Bugün</span>
                </button>
              </div>
            </div>

          </div>

          {/* Active Tags Badge Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Color Palette Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('noteThemeAndColor')}</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(COLOR_THEMES) as NoteColor[]).map((cKey) => {
                const th = COLOR_THEMES[cKey];
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${th.bg} ${th.border} ${
                      color === cKey ? `ring-2 ${th.ring} font-semibold scale-105 shadow-2xs` : 'hover:scale-102 opacity-80'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${th.dot}`} />
                    <span className="text-slate-800 dark:text-slate-100">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save & Actions Bar */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              id="save-note-modal-btn"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{noteToEdit ? t('updateNote') : t('save')}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
