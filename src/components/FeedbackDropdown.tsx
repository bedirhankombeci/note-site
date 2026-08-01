import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquarePlus, 
  Send, 
  Star, 
  Heart, 
  Sparkles, 
  Bug, 
  CheckCircle2, 
  X, 
  ThumbsUp, 
  Lightbulb, 
  Rocket 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FeedbackDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onShowToast: (message: string) => void;
}

export interface FeedbackEntry {
  id: string;
  type: 'suggestion' | 'bug' | 'praise' | 'feature';
  rating: number;
  message: string;
  email: string;
  createdAt: number;
}

export const FeedbackDropdown: React.FC<FeedbackDropdownProps> = ({
  isOpen,
  onClose,
  userEmail = '',
  onShowToast,
}) => {
  const { t, language } = useLanguage();
  const [type, setType] = useState<'suggestion' | 'bug' | 'praise' | 'feature'>('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby4RCH1rn0h4Rxi-DVFUaw44IGUdUkMD1CA3Aupyt6v4eQJhHUVOKkhuF8T-N9TRFrJKA/exec';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      onShowToast(language === 'tr' ? 'Lütfen geri bildirim mesajınızı yazın.' : 'Please write your feedback message.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send data to Google Apps Script Web App URL
      const formData = new URLSearchParams();
      formData.append('name', name.trim() || (language === 'tr' ? 'Ziyaretçi' : 'Visitor'));
      formData.append('email', email.trim());
      formData.append('message', message.trim());
      formData.append('type', type);
      formData.append('rating', rating.toString());

      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      // 2. Save locally as backup / history
      const newFeedback: FeedbackEntry = {
        id: 'fb-' + Date.now(),
        type,
        rating,
        message,
        email,
        createdAt: Date.now(),
      };

      try {
        const existingStr = localStorage.getItem('app_user_feedback');
        const existing: FeedbackEntry[] = existingStr ? JSON.parse(existingStr) : [];
        existing.unshift(newFeedback);
        localStorage.setItem('app_user_feedback', JSON.stringify(existing));
      } catch (err) {
        console.error('Feedback save error', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      onShowToast(language === 'tr' ? 'Geri bildiriminiz Google Sheets & Mail sistemine iletildi! ❤️' : 'Feedback sent to Google Sheets & Email! ❤️');

      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
        setName('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      onShowToast(language === 'tr' ? 'Gönderilirken bir hata oluştu, lütfen tekrar deneyin.' : 'An error occurred, please try again.');
    }
  };

  const TYPES = [
    { id: 'suggestion', label: language === 'tr' ? 'Öneri' : 'Suggestion', icon: Lightbulb, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
    { id: 'feature', label: language === 'tr' ? 'Yeni Özellik' : 'New Feature', icon: Rocket, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' },
    { id: 'bug', label: language === 'tr' ? 'Hata Bildirimi' : 'Bug Report', icon: Bug, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' },
    { id: 'praise', label: language === 'tr' ? 'Teşekkür' : 'Praise', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800' },
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-5 text-white relative">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-3.5 right-3.5 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/15 backdrop-blur-md rounded-2xl">
                <MessageSquarePlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                  {t('feedbackTitle')}
                </h3>
                <p className="text-xs text-indigo-100/90 mt-0.5">
                  {t('feedbackSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Form / Success view */}
          {isSuccess ? (
            <div className="p-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('feedbackSent')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                {language === 'tr'
                  ? 'Değerli zamanınızı ayırıp görüşlerinizi paylaştığınız için çok teşekkür ederiz. 🚀'
                  : 'Thank you very much for taking the time to share your feedback. 🚀'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              {/* Type selector */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  {t('feedbackSubject')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id as any)}
                        className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                          isSelected
                            ? `${t.color} ring-2 ring-indigo-500 font-bold shadow-2xs scale-102`
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                  {t('howDoYouRate')}
                </label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoveredRating !== null ? hoveredRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                  {t('feedbackMessageLabel')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('feedbackPlaceholder')}
                  className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                    {language === 'tr' ? 'Adınız Soyadınız' : 'Your Name'} <span className="text-slate-400 font-normal">({t('optional')})</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'tr' ? 'Ahmet Yılmaz' : 'John Doe'}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                    {t('yourEmail')} <span className="text-slate-400 font-normal">({t('optional')})</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="feedback@example.com"
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('sendFeedback')}</span>
                  </>
                )}
              </button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

