import React from 'react';
import { motion } from 'motion/react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      type="button"
      id="language-toggle-btn"
      title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
      aria-label="Change Language"
      className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer select-none ${
        language === 'tr'
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
          : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400'
      } ${className}`}
    >
      <Languages className="w-3.5 h-3.5 text-indigo-500" />
      <span className="uppercase tracking-wider font-extrabold text-[11px]">
        {language === 'tr' ? 'TR' : 'EN'}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500">
        {language === 'tr' ? '🇹🇷' : '🇬🇧'}
      </span>
    </motion.button>
  );
};
