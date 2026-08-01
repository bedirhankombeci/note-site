import { Note } from '../types';

export function getTodayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getCurrentWeekStr(): string {
  const d = new Date();
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export interface RecurrenceInfo {
  isEveryday: boolean;
  isWeekly: boolean;
  isMonthly: boolean;
  isDateSpecific: boolean;
  dateValue?: string;
  recurrenceLabel: string;
}

export function getNoteRecurrenceInfo(note: Note): RecurrenceInfo {
  let isEveryday = false;
  let isWeekly = false;
  let isMonthly = false;
  let isDateSpecific = false;
  let dateValue: string | undefined = undefined;

  if (note.tags && Array.isArray(note.tags)) {
    for (const tag of note.tags) {
      const clean = tag.toLowerCase().trim().replace(/^@/, '');
      if (clean === 'everyday' || clean === 'hergun') {
        isEveryday = true;
      } else if (clean === 'weekly' || clean === 'haftalik') {
        isWeekly = true;
      } else if (clean === 'monthly' || clean === 'aylik') {
        isMonthly = true;
      } else if (clean.startsWith('date:') || clean.startsWith('tarih:')) {
        isDateSpecific = true;
        dateValue = tag.split(':')[1]?.trim();
      }
    }
  }

  let recurrenceLabel = '';
  if (isEveryday) recurrenceLabel = '🔄 Her Gün Tekrarlar';
  else if (isWeekly) recurrenceLabel = '📅 Her Hafta Başı Tekrarlar';
  else if (isMonthly) recurrenceLabel = '🗓️ Her Ay Başı Tekrarlar';
  else if (isDateSpecific) recurrenceLabel = `⏰ ${dateValue || 'Tarihli Görev'}`;

  return {
    isEveryday,
    isWeekly,
    isMonthly,
    isDateSpecific,
    dateValue,
    recurrenceLabel,
  };
}

/**
 * Checks all notes and automatically resets recurring checklists/tasks
 * when a new day, week, or month arrives!
 */
export function processRecurringNotes(notes: Note[]): { updatedNotes: Note[]; resetCount: number } {
  const todayStr = getTodayStr();
  const weekStr = getCurrentWeekStr();
  const monthStr = getCurrentMonthStr();
  let resetCount = 0;

  const updatedNotes = notes.map((note) => {
    if (note.isInTrash) return note;

    const { isEveryday, isWeekly, isMonthly } = getNoteRecurrenceInfo(note);
    if (!isEveryday && !isWeekly && !isMonthly) return note;

    let shouldReset = false;

    if (isEveryday && note.lastResetDate !== todayStr) {
      shouldReset = true;
    } else if (isWeekly && note.lastResetWeek !== weekStr) {
      shouldReset = true;
    } else if (isMonthly && note.lastResetMonth !== monthStr) {
      shouldReset = true;
    }

    if (shouldReset) {
      resetCount++;
      const resetChecklist = note.checklist ? note.checklist.map(item => ({ ...item, completed: false })) : [];
      return {
        ...note,
        checklist: resetChecklist,
        lastResetDate: isEveryday ? todayStr : note.lastResetDate,
        lastResetWeek: isWeekly ? weekStr : note.lastResetWeek,
        lastResetMonth: isMonthly ? monthStr : note.lastResetMonth,
        updatedAt: Date.now(),
      };
    }

    return note;
  });

  return { updatedNotes, resetCount };
}
