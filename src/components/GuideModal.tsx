import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  Repeat, 
  Flame, 
  CheckSquare, 
  Download, 
  Tag, 
  Palette, 
  Copy, 
  Check 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTag?: (tag: string) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onInsertTag,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'features'>('shortcuts');
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (pattern: string) => {
    navigator.clipboard.writeText(pattern);
    setCopiedPattern(pattern);
    if (onInsertTag) {
      onInsertTag(pattern.replace(/^#/, '').replace(/^@/, ''));
    }
    setTimeout(() => setCopiedPattern(null), 2000);
  };

  const PATTERNS = [
    {
      code: '@everyday',
      alias: '@hergun',
      title: language === 'tr' ? 'Her Gün Yapılacak İşler' : 'Daily Tasks',
      description: language === 'tr'
        ? 'Her gün düzenli olarak tekrarlanan günlük alışkanlıklar, rutinler veya görevler için kullanılır.'
        : 'Used for daily habits, routines, or recurring daily tasks.',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: '🔄'
    },
    {
      code: '@weekly',
      alias: '@haftalik',
      title: language === 'tr' ? 'Haftalık Yapılacak İşler' : 'Weekly Tasks',
      description: language === 'tr'
        ? 'Haftada bir kez yapılan planlar, toplantılar, haftalık raporlar ve incelemeler için idealdir.'
        : 'Ideal for weekly plans, meetings, weekly reports and reviews.',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      icon: '📅'
    },
    {
      code: '@monthly',
      alias: '@aylik',
      title: language === 'tr' ? 'Aylık Yapılacak İşler' : 'Monthly Tasks',
      description: language === 'tr'
        ? 'Aylık ödemeler, bütçe kontrolleri, faturalar veya ay sonu değerlendirme notları için kullanılır.'
        : 'Used for monthly payments, budget checks, bills, or end-of-month review notes.',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      icon: '🗓️'
    },
    {
      code: '@date:YYYY-MM-DD',
      alias: '@tarih:2026-08-15',
      title: language === 'tr' ? 'Belirli Bir Tarihteki İşler' : 'Specific Date Tasks',
      description: language === 'tr'
        ? 'Doğum günleri, teslim tarihleri, randevular ve özel etkinlikler gibi belirli bir gün zamanlanmış görevler içindir.'
        : 'For tasks scheduled on specific dates such as birthdays, deadlines, appointments, and special events.',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: '⏰'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/15 backdrop-blur-md rounded-xl text-white">
              <HelpCircle className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              {t('usageGuide')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'tr' ? 'Not Defteri Özellikleri & @Kalıpları' : 'Notebook Features & @Patterns'}
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1">
            {language === 'tr'
              ? 'Zamanlanmış görevler ekleyin, günlük serilerinizi koruyun ve tüm özellikleri keşfedin.'
              : 'Add scheduled tasks, maintain your daily streak, and explore all features.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'shortcuts'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Repeat className="w-4 h-4 text-amber-500" />
            <span>{language === 'tr' ? '@Zamanlama Kalıpları' : '@Schedule Patterns'}</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'features'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{language === 'tr' ? 'Genel Özellikler' : 'General Features'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">

          {/* TAB 1: RECURRENCE PATTERNS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>💡 {language === 'tr' ? 'Nasıl Kullanılır?' : 'How to Use?'}</strong> {language === 'tr'
                  ? 'Not oluştururken etiketler kısmına veya notun içerisine'
                  : 'When creating a note, add patterns like'} 
                <code className="mx-1 px-1.5 py-0.5 bg-amber-200/60 dark:bg-amber-900/60 rounded font-mono font-bold">@everyday</code> 
                {language === 'tr'
                  ? 'gibi hazır kalıpları eklediğinizde, not otomatik olarak zamanlanmış bir iş olarak işaretlenir.'
                  : 'in tags or content, and the note will automatically repeat on schedule.'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PATTERNS.map((item) => (
                  <div 
                    key={item.code}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 relative group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1 font-mono ${item.badgeBg}`}>
                        <span>{item.icon}</span>
                        <span>{item.code}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.code)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1 font-sans"
                        title={language === 'tr' ? 'Kalıbı kopyala' : 'Copy pattern'}
                      >
                        {copiedPattern === item.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedPattern === item.code ? (language === 'tr' ? 'Kopyalandı' : 'Copied') : (language === 'tr' ? 'Kopyala' : 'Copy')}</span>
                      </button>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <p className="text-[10px] text-slate-400 font-mono">
                      {language === 'tr' ? 'Alternatif Türkçe: ' : 'Turkish Alias: '}<span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.alias}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold">{language === 'tr' ? 'Örnek Kullanım Senaryosu:' : 'Example Usage Scenario:'}</span>
                <p className="opacity-90">
                  {language === 'tr' ? 'Not Başlığı: ' : 'Note Title: '}<em className="font-semibold">{language === 'tr' ? '"Spor ve Su İçme Rutini"' : '"Workout & Water Routine"'}</em> | {language === 'tr' ? 'Etiket: ' : 'Tag: '}<code className="bg-indigo-200/60 dark:bg-indigo-900/60 px-1 rounded">@everyday</code>
                  <br />
                  {language === 'tr' ? 'Not Başlığı: ' : 'Note Title: '}<em className="font-semibold">{language === 'tr' ? '"Proje Teslimi"' : '"Project Delivery"'}</em> | {language === 'tr' ? 'Etiket: ' : 'Tag: '}<code className="bg-indigo-200/60 dark:bg-indigo-900/60 px-1 rounded">@date:2026-08-15</code>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'tr' ? 'Günlük Giriş Serisi (Streak)' : 'Daily Login Streak'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {language === 'tr'
                      ? 'Her gün not defterinize girerek serinizi devam ettirin. Sağ üstteki 🔥 butonuna tıklayarak 7 günlük giriş takviminizi ve kazandığınız rozetleri görün.'
                      : 'Maintain your streak by opening your notebook every day. Click the 🔥 icon to view your 7-day calendar and earned badges.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'tr' ? 'Kontrol Listeleri ve İlerleme Çubuğu' : 'Checklists & Progress Bar'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {language === 'tr'
                      ? 'Metin notlarının yanı sıra tıklanabilir kontrol listeleri oluşturun. Kart üzerindeki tamamlama yüzdesi çubuğu ile ilerlemenizi anında takip edin.'
                      : 'Create interactive checklists alongside text notes. Track your progress live with completion percentage bars on each card.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'tr' ? 'Renk Temaları & Başa Tutturma' : 'Color Themes & Pinning'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {language === 'tr'
                      ? 'Notlarınıza 6 farklı pastel renk teması atayın ve sol menüdeki Renk Filtresi ile renklere göre gruplayın. Önemli notları en üste sabitleyin.'
                      : 'Assign 6 different pastel color themes to notes and filter them from the sidebar. Pin essential notes to top.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'tr' ? 'JSON İçe / Dışa Aktarma & Yedekleme' : 'JSON Export / Import & Backup'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {language === 'tr'
                      ? 'Üst menüdeki İndir / Yükle butonlarını kullanarak tüm notlarınızı JSON olarak bilgisayarınıza yedekleyebilir veya yedek dosyayı geri yükleyebilirsiniz.'
                      : 'Use the Export/Import buttons in top menu to backup all your notes as JSON or restore backup files anytime.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

