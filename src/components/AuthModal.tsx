import React, { useState } from 'react';
import { X, UserCheck, LogIn, UserPlus, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Lütfen adınızı girin.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Lütfen geçerli bir e-posta adresi girin.');
        return;
      }
      const res = AuthService.register(name.trim(), email.trim(), password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!email.trim()) {
        setErrorMsg('Lütfen e-posta adresinizi girin.');
        return;
      }
      const res = AuthService.login(email.trim(), password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleAdminQuickLogin = () => {
    const res = AuthService.loginAsAdmin();
    onSuccess(res.user);
    onClose();
  };

  const handleDemoUserQuickLogin = () => {
    const res = AuthService.login('ahmet@notlar.com');
    if (res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-amber-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/15 backdrop-blur-md rounded-xl text-white">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Kullanıcı Hesabı
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">
            {mode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Ücretsiz Hesap Oluşturun'}
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed">
            {mode === 'login' 
              ? 'Notlarınıza her cihazdan erişin, günlük giriş serilerinizi takip edin.' 
              : 'Hesap açarak notlarınızı güvenle saklayın ve kilitli özellikleri açın.'}
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">E-Posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@notlar.com"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol ve Başla'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider">
              Hızlı Test Girişi
            </p>

            <button
              type="button"
              onClick={handleDemoUserQuickLogin}
              className="w-full px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 rounded-xl text-indigo-800 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>⚡ Örnek Üye Girişi (Ahmet Yılmaz)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
