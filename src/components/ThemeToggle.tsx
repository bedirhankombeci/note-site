import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles, Cloud } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  variant?: 'pill' | 'icon';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  onToggle,
  variant = 'pill',
  className = '',
}) => {
  if (variant === 'pill') {
    return (
      <button
        onClick={onToggle}
        type="button"
        id="theme-toggle-pill-btn"
        title={isDarkMode ? 'Aydınlık Moda Geç' : 'Koyu Moda Geç'}
        aria-label="Tema Değiştir"
        className={`relative w-16 h-8.5 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner overflow-hidden cursor-pointer select-none active:scale-[0.97] ${
          isDarkMode
            ? 'bg-slate-900 border border-slate-700/80 shadow-slate-950/80'
            : 'bg-sky-200 border border-sky-300/80 shadow-sky-200/50'
        } ${className}`}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Night Sky Stars */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-2 text-indigo-200 transition-opacity duration-300 ${
              isDarkMode ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-200/90 left-2 top-2 absolute" />
            <span className="w-1 h-1 bg-white rounded-full absolute right-3 top-2.5 opacity-75" />
            <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full absolute right-6 bottom-2 opacity-60" />
          </div>

          {/* Day Sky Clouds */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-1 text-white/90 transition-opacity duration-300 ${
              isDarkMode ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-white/80" />
            <span className="w-2 h-1 bg-white/70 rounded-full absolute right-7 bottom-2" />
          </div>
        </div>

        {/* Sliding Knob */}
        <motion.div
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          animate={{
            x: isDarkMode ? '1.85rem' : '0rem',
          }}
          className={`relative z-10 w-6.5 h-6.5 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-tr from-slate-800 to-indigo-900 text-amber-300 border border-amber-300/30 shadow-indigo-950'
              : 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900 border border-amber-200 shadow-amber-500/20'
          }`}
        >
          {isDarkMode ? (
            <Moon className="w-3.5 h-3.5 fill-amber-300/80 text-amber-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-900 fill-amber-400" />
          )}
        </motion.div>
      </button>
    );
  }

  // Icon Variant (Interactive rotating circular button)
  return (
    <button
      onClick={onToggle}
      type="button"
      id="theme-toggle-icon-btn"
      title={isDarkMode ? 'Aydınlık Moda Geç' : 'Koyu Moda Geç'}
      aria-label="Tema Değiştir"
      className={`relative p-2 rounded-xl transition-all duration-200 border flex items-center justify-center cursor-pointer select-none active:scale-95 ${
        isDarkMode
          ? 'bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border-slate-700 hover:border-amber-400/50 shadow-xs shadow-indigo-950'
          : 'bg-amber-50/90 hover:bg-amber-100/90 text-amber-600 border-amber-200 hover:border-amber-400 shadow-xs shadow-amber-200'
      } ${className}`}
    >
      <motion.div
        key={isDarkMode ? 'dark' : 'light'}
        initial={{ scale: 0.7, rotate: isDarkMode ? -30 : 30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="flex items-center justify-center relative"
      >
        {isDarkMode ? (
          <Moon className="w-4.5 h-4.5 fill-amber-300/30 text-amber-300" />
        ) : (
          <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-400" />
        )}
      </motion.div>
    </button>
  );
};
