import { User, StreakInfo } from '../types';

const USERS_KEY = 'not_defteri_users_v1';
const CURRENT_USER_KEY = 'not_defteri_current_user_v1';

// Initial default users
const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Sistem Yöneticisi',
    email: 'admin@notlar.com',
    role: 'admin',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastLoginAt: Date.now(),
    status: 'active',
    streakCount: 7,
    lastCheckInDate: new Date().toISOString().split('T')[0],
    loginHistory: [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    ]
  },
  {
    id: 'user_demo_1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@notlar.com',
    role: 'user',
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    lastLoginAt: Date.now() - 12 * 60 * 60 * 1000,
    status: 'active',
    streakCount: 3,
    lastCheckInDate: new Date().toISOString().split('T')[0],
    loginHistory: [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    ]
  },
  {
    id: 'user_demo_2',
    name: 'Zeynep Kaya',
    email: 'zeynep@notlar.com',
    role: 'user',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastLoginAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'active',
    streakCount: 1,
    lastCheckInDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    loginHistory: [
      new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
    ]
  }
];

export const GUEST_USER: User = {
  id: 'guest',
  name: 'Misafir Kullanıcı',
  email: 'misafir@local',
  role: 'guest',
  createdAt: Date.now(),
  lastLoginAt: Date.now(),
  status: 'active',
  streakCount: 1,
  lastCheckInDate: new Date().toISOString().split('T')[0],
  loginHistory: [new Date().toISOString().split('T')[0]]
};

export class AuthService {
  static getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getCurrentUser(): User {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) {
      return GUEST_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return GUEST_USER;
    }
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  static register(name: string, email: string, password?: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Bu e-posta adresi ile zaten kayıtlı bir hesap var.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: 'user',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      status: 'active',
      streakCount: 1,
      lastCheckInDate: todayStr,
      loginHistory: [todayStr]
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, message: 'Kayıt başarılı! Hesabınız oluşturuldu.', user: newUser };
  }

  static login(email: string, password?: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'E-posta veya şifre hatalı.' };
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'Bu hesap askıya alınmıştır. Lütfen yönetici ile iletişime geçin.' };
    }

    // Process daily streak and login
    const updatedUser = this.processDailyCheckIn(user);
    
    // Save updated user in users list
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    this.saveUsers(updatedUsers);
    this.setCurrentUser(updatedUser);

    return { success: true, message: `Hoş geldiniz, ${updatedUser.name}!`, user: updatedUser };
  }

  static loginAsAdmin(): { success: boolean; message: string; user: User } {
    const users = this.getUsers();
    let admin = users.find(u => u.role === 'admin');
    if (!admin) {
      admin = INITIAL_USERS[0];
      users.push(admin);
      this.saveUsers(users);
    }

    const updatedAdmin = this.processDailyCheckIn(admin);
    const updatedUsers = users.map(u => u.id === updatedAdmin.id ? updatedAdmin : u);
    this.saveUsers(updatedUsers);
    this.setCurrentUser(updatedAdmin);

    return { success: true, message: 'Yönetici olarak giriş yapıldı.', user: updatedAdmin };
  }

  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  static processDailyCheckIn(user: User): User {
    if (user.role === 'guest') return user;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastCheckIn = user.lastCheckInDate;

    let newStreak = user.streakCount || 0;
    const history = user.loginHistory ? [...user.loginHistory] : [];

    if (!history.includes(todayStr)) {
      history.push(todayStr);
    }

    if (!lastCheckIn) {
      newStreak = 1;
    } else if (lastCheckIn === todayStr) {
      // Already checked in today
    } else {
      const lastDate = new Date(lastCheckIn);
      const todayDate = new Date(todayStr);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Broken streak
        newStreak = 1;
      }
    }

    return {
      ...user,
      lastLoginAt: Date.now(),
      streakCount: newStreak,
      lastCheckInDate: todayStr,
      loginHistory: history
    };
  }

  // Admin Operations
  static toggleUserStatus(userId: string): User[] {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u.id === userId && u.role !== 'admin') {
        return { ...u, status: u.status === 'active' ? ('suspended' as const) : ('active' as const) };
      }
      return u;
    });
    this.saveUsers(updated);
    return updated;
  }

  static toggleUserRole(userId: string): User[] {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? ('user' as const) : ('admin' as const);
        return { ...u, role: newRole };
      }
      return u;
    });
    this.saveUsers(updated);
    return updated;
  }

  static deleteUser(userId: string): User[] {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
    return users;
  }

  static getStreakInfo(user: User, userNotesCount: number = 0): StreakInfo {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheckedIn = user.lastCheckInDate === todayStr;
    const currentStreak = user.streakCount || 0;

    // Calculate last 7 days history
    const weeklyHistory = [];
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      const isChecked = user.loginHistory ? user.loginHistory.includes(dateStr) : false;

      weeklyHistory.push({
        date: dateStr,
        dayName,
        checkedIn: isChecked,
        notesCount: isChecked ? Math.floor(Math.random() * 3) + 1 : 0
      });
    }

    return {
      currentStreak,
      bestStreak: Math.max(currentStreak, 7),
      lastCheckInDate: user.lastCheckInDate || todayStr,
      todayCheckedIn,
      weeklyHistory
    };
  }
}
