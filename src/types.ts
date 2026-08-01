export type NoteColor = 'slate' | 'amber' | 'emerald' | 'sky' | 'rose' | 'violet' | 'orange';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  color: NoteColor;
  isPinned: boolean;
  isInTrash: boolean;
  createdAt: number;
  updatedAt: number;
  checklist?: ChecklistItem[];
  type: 'text' | 'checklist';
  userId?: string; // Associated user ID (or 'guest')
  lastResetDate?: string; // YYYY-MM-DD for @everyday
  lastResetWeek?: string; // YYYY-Www for @weekly
  lastResetMonth?: string; // YYYY-MM for @monthly
}

export type SortOption = 'newest' | 'oldest' | 'updated' | 'alphabetical';
export type ViewMode = 'grid' | 'list';
export type FilterType = 'all' | 'pinned' | 'category' | 'tag' | 'trash';

export interface ColorTheme {
  id: NoteColor;
  name: string;
  bg: string;
  border: string;
  badge: string;
  ring: string;
  dot: string;
}

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
  lastLoginAt: number;
  status: 'active' | 'suspended';
  streakCount: number;
  lastCheckInDate?: string; // Format: YYYY-MM-DD
  loginHistory: string[]; // List of YYYY-MM-DD string dates logged in
  notesCount?: number;
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastCheckInDate: string;
  todayCheckedIn: boolean;
  weeklyHistory: { date: string; dayName: string; checkedIn: boolean; notesCount: number }[];
}

export interface SystemStats {
  totalUsers: number;
  activeUsersToday: number;
  totalNotes: number;
  adminCount: number;
  suspendedUsers: number;
}

