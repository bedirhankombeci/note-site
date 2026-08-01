import React from 'react';
import { X, Flame, Calendar, Award, CheckCircle2, TrendingUp, Sparkles, Clock, Target } from 'lucide-react';
import { User } from '../types';
import { AuthService } from '../services/authService';
import { useLanguage } from '../i18n/LanguageContext';

interface StreakTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  totalNotesCount: number;
  onUserUpdate: (updatedUser: User) => void;
}

export const StreakTrackerModal: React.FC<StreakTrackerModalProps> = ({
  isOpen,
  onClose,
  user,
  totalNotesCount,
  onUserUpdate,
}) => {
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  const streakInfo = AuthService.getStreakInfo(user, totalNotesCount);

  const handleClaimToday = () => {
    const updated = AuthService.processDailyCheckIn(user);
    const users = AuthService.getUsers();
    const updatedUsers = users.map(u => u.id === updated.id ? updated : u);
    AuthService.saveUsers(updatedUsers);
    AuthService.setCurrentUser(updated);
    onUserUpdate(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <Flame className="w-6 h-6 fill-amber-200 text-amber-100 animate-pulse" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              {language === 'tr' ? 'Günlük & Haftalık Takip' : 'Daily & Weekly Tracker'}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span>🔥 {user.streakCount} {language === 'tr' ? 'Günlük Giriş Serisi' : 'Day Streak'}</span>
          </h2>
          <p className="text-xs text-amber-100/90 mt-1">
            {language === 'tr'
              ? 'Her gün giriş yaparak serinizi koruyun ve haftalık ilerlemenizi takip edin.'
              : 'Log in daily to preserve your streak and track weekly progress.'}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Today Check-in Status Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
            streakInfo.todayCheckedIn
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                streakInfo.todayCheckedIn 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-amber-500 text-white animate-bounce'
              }`}>
                {streakInfo.todayCheckedIn ? <CheckCircle2 className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {streakInfo.todayCheckedIn
                    ? (language === 'tr' ? 'Bugünkü Giriş Tamamlandı!' : 'Today\'s Check-in Complete!')
                    : (language === 'tr' ? 'Bugünkü Girişinizi Onaylayın!' : 'Confirm Today\'s Check-in!')}
                </h4>
                <p className="text-xs opacity-90">
                  {streakInfo.todayCheckedIn 
                    ? (language === 'tr' ? 'Tebrikler! Seriniz devam ediyor. Yarın tekrar gelmeyi unutmayın.' : 'Congratulations! Streak active. See you tomorrow.')
                    : (language === 'tr' ? 'Serinizi kaybetmemek için gün sonuna kadar giriş yapın.' : 'Check in before the day ends to keep your streak.')}
                </p>
              </div>
            </div>

            {!streakInfo.todayCheckedIn && (
              <button
                type="button"
                onClick={handleClaimToday}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 whitespace-nowrap"
              >
                {language === 'tr' ? 'Girişi Onayla' : 'Confirm Check-in'}
              </button>
            )}
          </div>

          {/* Weekly Calendar Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'tr' ? 'Son 7 Günlük İlerleme Çizelgesi' : '7-Day Progress Chart'}</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                {language === 'tr' ? 'Hedef: 7/7 Gün' : 'Goal: 7/7 Days'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {streakInfo.weeklyHistory.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-2 sm:p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                    item.checkedIn
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {item.dayName}
                  </span>
                  
                  <div className="my-1.5">
                    {item.checkedIn ? (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs mx-auto">
                        ✓
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400 mx-auto">
                        •
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] font-medium opacity-70 truncate max-w-full">
                    {item.date.split('-').slice(1).join('/')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Stats & Achievements Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'tr' ? 'En Uzun Seri' : 'Best Streak'}
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {streakInfo.bestStreak} {language === 'tr' ? 'Gün' : 'Days'}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'tr' ? 'Kayıtlı Notlar' : 'Saved Notes'}
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {totalNotesCount} {language === 'tr' ? 'Not' : 'Notes'}
                </p>
              </div>
            </div>
          </div>

          {/* Badges unlocked */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'tr' ? 'Rozetler ve Başarılar' : 'Badges & Achievements'}</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-center space-y-1">
                <span className="text-lg">🔥</span>
                <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                  {language === 'tr' ? 'Giriş Tutkunu' : 'Streak Enthusiast'}
                </p>
                <p className="text-[9px] text-amber-700 dark:text-amber-400">{user.streakCount} {language === 'tr' ? 'Gün Seri' : 'Day Streak'}</p>
              </div>

              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-center space-y-1">
                <span className="text-lg">📝</span>
                <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200">
                  {language === 'tr' ? 'Not Yazarı' : 'Note Author'}
                </p>
                <p className="text-[9px] text-indigo-700 dark:text-indigo-400">{totalNotesCount} {language === 'tr' ? 'Oluşturuldu' : 'Created'}</p>
              </div>

              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-center space-y-1">
                <span className="text-lg">⭐</span>
                <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                  {language === 'tr' ? 'Sadık Üye' : 'Loyal Member'}
                </p>
                <p className="text-[9px] text-emerald-700 dark:text-emerald-400">{language === 'tr' ? 'Aktif Hesap' : 'Active Account'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

