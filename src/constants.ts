import { ColorTheme, Note, NoteColor } from './types';

export const COLOR_THEMES: Record<NoteColor, ColorTheme> = {
  slate: {
    id: 'slate',
    name: 'Klasik Beyaz',
    bg: 'bg-white hover:bg-slate-50/80 dark:bg-slate-900 dark:hover:bg-slate-850',
    border: 'border-slate-200/80 dark:border-slate-800',
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    ring: 'ring-slate-400',
    dot: 'bg-slate-400'
  },
  amber: {
    id: 'amber',
    name: 'Sıcak Sarı',
    bg: 'bg-amber-50/70 hover:bg-amber-50 dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
    border: 'border-amber-200/80 dark:border-amber-900/60',
    badge: 'bg-amber-100/80 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300/50 dark:border-amber-800',
    ring: 'ring-amber-400',
    dot: 'bg-amber-400'
  },
  emerald: {
    id: 'emerald',
    name: 'Fıstık Yeşili',
    bg: 'bg-emerald-50/70 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50',
    border: 'border-emerald-200/80 dark:border-emerald-900/60',
    badge: 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-300/50 dark:border-emerald-800',
    ring: 'ring-emerald-400',
    dot: 'bg-emerald-400'
  },
  sky: {
    id: 'sky',
    name: 'Gök Mavisi',
    bg: 'bg-sky-50/70 hover:bg-sky-50 dark:bg-sky-950/30 dark:hover:bg-sky-950/50',
    border: 'border-sky-200/80 dark:border-sky-900/60',
    badge: 'bg-sky-100/80 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 border-sky-300/50 dark:border-sky-800',
    ring: 'ring-sky-400',
    dot: 'bg-sky-400'
  },
  rose: {
    id: 'rose',
    name: 'Gül Pembesi',
    bg: 'bg-rose-50/70 hover:bg-rose-50 dark:bg-rose-950/30 dark:hover:bg-rose-950/50',
    border: 'border-rose-200/80 dark:border-rose-900/60',
    badge: 'bg-rose-100/80 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border-rose-300/50 dark:border-rose-800',
    ring: 'ring-rose-400',
    dot: 'bg-rose-400'
  },
  violet: {
    id: 'violet',
    name: 'Zarif Mor',
    bg: 'bg-violet-50/70 hover:bg-violet-50 dark:bg-violet-950/30 dark:hover:bg-violet-950/50',
    border: 'border-violet-200/80 dark:border-violet-900/60',
    badge: 'bg-violet-100/80 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 border-violet-300/50 dark:border-violet-800',
    ring: 'ring-violet-400',
    dot: 'bg-violet-400'
  },
  orange: {
    id: 'orange',
    name: 'Tatlı Turuncu',
    bg: 'bg-orange-50/70 hover:bg-orange-50 dark:bg-orange-950/30 dark:hover:bg-orange-950/50',
    border: 'border-orange-200/80 dark:border-orange-900/60',
    badge: 'bg-orange-100/80 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-300/50 dark:border-orange-800',
    ring: 'ring-orange-400',
    dot: 'bg-orange-400'
  }
};

export const DEFAULT_CATEGORIES = [
  'Tümü',
  'Kişisel',
  'İş & Projeler',
  'Fikirler',
  'Yapılacaklar',
  'Alışveriş Listesi',
  'Öğrenim & Notlar'
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'sample-1',
    title: '🚀 Not Defterim Uygulamasına Hoş Geldiniz!',
    content: 'Bu modern not alma uygulaması ile tüm fikirlerinizi, yapılacak işlerinizi ve günlük notlarınızı kolayca organize edebilirsiniz.\n\n✨ Özellikler:\n• Hızlı arama ve filtreleme\n• Renk kodları ve kategoriler\n• Kontrol listeleri (Checklist) oluşturma\n• Önemli notları başa tutturma\n• Yerel depolama (Notlarınız tarayıcınızda güvende kalır)',
    category: 'Kişisel',
    tags: ['rehber', 'başlangıç', 'ipucu'],
    color: 'sky',
    isPinned: true,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 24 * 2,
    updatedAt: Date.now() - 3600000 * 5,
    type: 'text'
  },
  {
    id: 'sample-2',
    title: '🛒 Haftalık Market Alışverişi',
    content: 'Hafta sonu için alınacaklar ve mutfak ihtiyaçları.',
    category: 'Alışveriş Listesi',
    tags: ['market', 'mutfak'],
    color: 'emerald',
    isPinned: true,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 2,
    type: 'checklist',
    checklist: [
      { id: 'c1', text: 'Organik Süt & Yoğurt', completed: true },
      { id: 'c2', text: 'Taze Tam Buğday Ekmeği', completed: true },
      { id: 'c3', text: 'Sızma Zeytinyağı', completed: false },
      { id: 'c4', text: 'Mevsim Meyveleri (Elma, Portakal)', completed: false },
      { id: 'c5', text: 'Filtre Kahve Çekirdeği', completed: false }
    ]
  },
  {
    id: 'sample-3',
    title: '💡 Yeni Web Projesi Fikirleri',
    content: 'Gelecek ay geliştirmeyi düşündüğüm projeler:\n1. AI destekli içerik özetleyici\n2. Kişisel finans ve bütçe takip uygulaması\n3. Minimalist alışkanlık (habit) takipçisi',
    category: 'Fikirler',
    tags: ['yazılım', 'proje', 'tasarım'],
    color: 'amber',
    isPinned: false,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 20,
    type: 'text'
  },
  {
    id: 'sample-4',
    title: '📚 Yazılım Mimarısı Okuma Listesi',
    content: 'Bu ay bitirilmesi hedeflenen teknik kitaplar ve makaleler:\n• Clean Architecture - Robert C. Martin\n• Designing Data-Intensive Applications - Martin Kleppmann\n• Microservices Patterns - Chris Richardson',
    category: 'Öğrenim & Notlar',
    tags: ['kitap', 'mimari'],
    color: 'violet',
    isPinned: false,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 30,
    type: 'text'
  },
  {
    id: 'sample-5',
    title: '💧 Günlük Su ve Egzersiz Rutini',
    content: 'Her gün tekrarlanacak sağlıklı yaşam hedefleri:\n• En az 2.5 Litre su içilecek\n• 30 Dakika tempolu yürüyüş yapılcak\n• Kitap okuma & Günlük tutma',
    category: 'Yapılacaklar',
    tags: ['everyday', 'sağlık', 'rutin'],
    color: 'emerald',
    isPinned: false,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 10,
    updatedAt: Date.now() - 3600000 * 1,
    type: 'checklist',
    checklist: [
      { id: 'sc1', text: 'Sabah 1 Bardak ılık su + Limon', completed: true },
      { id: 'sc2', text: '30 dk Yürüyüş veya Egzersiz', completed: true },
      { id: 'sc3', text: 'Günlük kodlama / okuma çalışması', completed: false }
    ]
  },
  {
    id: 'sample-6',
    title: '📊 Haftalık Proje ve Bütçe Gözden Geçirme',
    content: 'Her Pazar günü yapılacak haftalık değerlendirmeler ve gelecek hafta planlaması.',
    category: 'İş & Projeler',
    tags: ['weekly', 'planlama'],
    color: 'sky',
    isPinned: false,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 15,
    updatedAt: Date.now() - 3600000 * 4,
    type: 'text'
  },
  {
    id: 'sample-7',
    title: '🎯 Ay Sonu Fatura ve Birikim Kontrolü',
    content: 'Aylık bütçe analizi, fatura ödemeleri ve birikim hesabına aktarım işlemleri.',
    category: 'Kişisel',
    tags: ['monthly', 'finans'],
    color: 'rose',
    isPinned: false,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 25,
    updatedAt: Date.now() - 3600000 * 6,
    type: 'text'
  },
  {
    id: 'sample-8',
    title: '🗓️ Yıl Ortası Sunum ve Ekip Toplantısı',
    content: 'Belirlenen tarihte yıl ortası hedeflerinin sunumu ve değerlendirmesi yapılacaktır.',
    category: 'İş & Projeler',
    tags: ['date:2026-08-15', 'toplantı'],
    color: 'orange',
    isPinned: false,
    isInTrash: false,
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 2,
    type: 'text'
  }
];
