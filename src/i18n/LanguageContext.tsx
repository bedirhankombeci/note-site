import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    // Header
    appName: 'Not Defteri',
    feedbackBtn: 'Geri Bildirim',
    feedbackSub: 'Geliştirmemiz için tıklayın 💬',
    searchPlaceholder: 'Notlarda, etiketlerde veya içerikte ara... (Ctrl+K)',
    newNote: 'Yeni Not',
    streakTooltip: 'Günlük Seri',
    streakDays: 'gün seri',
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    adminPanel: 'Yönetici Paneli',
    exportData: 'Notları Dışa Aktar (JSON)',
    importData: 'Notları İçe Aktar',
    gridView: 'Izgara Görünümü',
    listView: 'Liste Görünümü',
    compactView: 'Sıkışık Görünüm',
    lightMode: 'Aydınlık Mod',
    darkMode: 'Koyu Mod',
    switchToLight: 'Aydınlık Moda Geç',
    switchToDark: 'Koyu Moda Geç',

    // Sidebar
    allNotes: 'Tüm Notlar',
    pinnedNotes: 'Sabitlenmiş Notlar',
    trash: 'Çöp Kutusu',
    categories: 'Kategoriler',
    addCategory: 'Kategori Ekle',
    newCategoryPlaceholder: 'Kategori adı...',
    usageGuide: 'Kullanım Kılavuzu & Kalıplar',
    activeNotesCount: 'not',
    trashEmpty: 'Çöp kutusu boş',
    clearTrash: 'Çöpü Temizle',

    // SortBar
    sortNewest: 'En Yeni',
    sortOldest: 'En Eski',
    sortUpdated: 'Son Güncellenen',
    sortAlphabetical: 'A-Z Alfabetik',
    filterAllColors: 'Tüm Renkler',
    filterCategory: 'Kategori',
    searchResultCount: 'not bulundu',

    // NoteCard & Note
    pin: 'Sabitle',
    unpin: 'Sabitlemeyi Kaldır',
    edit: 'Düzenle',
    delete: 'Çöpe At',
    restore: 'Geri Yükle',
    deletePermanently: 'Kalıcı Olarak Sil',
    copy: 'Notu Kopyala',
    copied: 'Kopyalandı!',
    typeChecklist: 'Yapılacaklar Listesi',
    typeText: 'Metin Notu',
    itemsCompleted: 'tamamlandı',

    // Recurrence
    everydayLabel: '🔄 Her Gün Tekrarlar',
    weeklyLabel: '📅 Her Hafta Başı Tekrarlar',
    monthlyLabel: '🗓️ Her Ay Başı Tekrarlar',
    continuousRepeat: 'Sürekli Tekrarlar',

    // NoteEditorModal
    createNoteTitle: 'Yeni Not Oluştur',
    editNoteTitle: 'Notu Düzenle',
    titlePlaceholder: 'Not Başlığı...',
    contentPlaceholder: 'Not içeriğini buraya yazın veya @everyday, @weekly, @monthly gibi zamanlama etiketleri ekleyin...',
    addChecklistItem: 'Listeye madde ekle...',
    addItemBtn: 'Ekle',
    selectCategory: 'Kategori Seçin',
    uncategorized: 'Kategorisiz',
    tagsLabel: 'Etiketler (Virgülle ayırın)',
    tagsPlaceholder: 'iş, kişisel, acil...',
    colorLabel: 'Renk Teması',
    saveNote: 'Notu Kaydet',
    cancel: 'İptal',
    aiSummarize: 'AI Özet Çıkar',

    // Feedback Modal
    feedbackTitle: 'Uygulama Geri Bildirimi',
    feedbackSubtitle: 'Geliştirmemiz için tıklayın 💬',
    feedbackDesc: "Not Defteri'ni birlikte geliştirelim. Görüşleriniz bizim için çok değerli!",
    feedbackSubject: 'Geri Bildirim Konusu',
    feedbackTopic: 'Geri Bildirim Konusu',
    suggestion: 'Öneri',
    featureReq: 'Yeni Özellik',
    bugReport: 'Hata Bildirimi',
    praise: 'Teşekkür',
    howDoYouRate: 'Uygulamayı Nasıl Değerlendirirsiniz?',
    rateApp: 'Uygulamayı Nasıl Değerlendirirsiniz?',
    feedbackMessageLabel: 'Mesajınız & Fikirleriniz',
    messageLabel: 'Mesajınız & Fikirleriniz',
    feedbackPlaceholder: 'Eklenmesini istediğiniz özellikler veya önerileriniz...',
    messagePlaceholder: 'Eklenmesini istediğiniz özellikler veya önerileriniz...',
    emailLabel: 'E-posta Adresiniz (İsteğe Bağlı)',
    yourEmail: 'E-posta Adresiniz',
    optional: 'İsteğe Bağlı',
    sendFeedback: 'Geri Bildirimi Gönder',
    feedbackSent: 'Geri Bildiriminiz Gönderildi!',
    feedbackSuccessTitle: 'Geri Bildiriminiz Gönderildi!',
    feedbackSuccessDesc: 'Değerli zamanınızı ayırıp görüşlerinizi paylaştığınız için teşekkür ederiz. 🚀',
    adminFeedbackTab: 'Geri Bildirimler',
    clearAllFeedbacks: 'Tümünü Temizle',
    noFeedbacksFound: 'Henüz kaydedilmiş geri bildirim bulunmuyor.',
    feedbackDeleted: 'Geri bildirim silindi.',
    allFeedbacksCleared: 'Tüm geri bildirimler temizlendi.',
    exportFeedbacks: 'Geri Bildirimleri İndir (JSON)',

    // Guide Modal
    guideTitle: 'Kullanım Kılavuzu & İpuçları',
    guideDesc: 'Zamanlanmış görevler ekleyin, günlük serilerinizi koruyun ve verimliliğinizi artırın.',
    tabShortcuts: 'Klavye Kısayolları',
    tabFeatures: 'Genel Özellikler',
    tabPatterns: 'Tekrarlayan Kalıplar (@)',
    insertPattern: 'Kalıbı Ekle',

    // Empty state
    emptyNotesTitle: 'Henüz not bulunmuyor',
    emptyNotesDesc: 'Fikirlerinizi, yapılacaklar listenizi veya zamanlanmış görevlerinizi kaydetmeye başlayın!',
    emptyTrashTitle: 'Çöp Kutusu Boş',
    emptyTrashDesc: 'Silinen notlar burada görünür.',

    // Toast Messages
    noteCreated: 'Yeni not oluşturuldu.',
    noteUpdated: 'Not güncellendi.',
    noteDeleted: 'Not çöp kutusuna taşındı.',
    noteRestored: 'Not geri yüklendi.',
    trashCleared: 'Çöp kutusu temizlendi.',
    recurringReset: '🔄 Tekrarlayan görevleriniz yeni dönem için otomatik yenilendi!',
  },
  en: {
    // Header
    appName: 'Notepad App',
    feedbackBtn: 'Feedback',
    feedbackSub: 'Click to help us improve 💬',
    searchPlaceholder: 'Search in notes, tags or content... (Ctrl+K)',
    newNote: 'New Note',
    streakTooltip: 'Daily Streak',
    streakDays: 'day streak',
    login: 'Log In',
    logout: 'Log Out',
    adminPanel: 'Admin Panel',
    exportData: 'Export Notes (JSON)',
    importData: 'Import Notes',
    gridView: 'Grid View',
    listView: 'List View',
    compactView: 'Compact View',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',

    // Sidebar
    allNotes: 'All Notes',
    pinnedNotes: 'Pinned Notes',
    trash: 'Trash Bin',
    categories: 'Categories',
    addCategory: 'Add Category',
    newCategoryPlaceholder: 'Category name...',
    usageGuide: 'Usage Guide & Patterns',
    activeNotesCount: 'notes',
    trashEmpty: 'Trash is empty',
    clearTrash: 'Clear Trash',

    // SortBar
    sortNewest: 'Newest First',
    sortOldest: 'Oldest First',
    sortUpdated: 'Recently Updated',
    sortAlphabetical: 'A-Z Alphabetical',
    filterAllColors: 'All Colors',
    filterCategory: 'Category',
    searchResultCount: 'notes found',

    // NoteCard & Note
    pin: 'Pin Note',
    unpin: 'Unpin Note',
    edit: 'Edit',
    delete: 'Move to Trash',
    restore: 'Restore Note',
    deletePermanently: 'Delete Permanently',
    copy: 'Copy Note',
    copied: 'Copied!',
    typeChecklist: 'Checklist',
    typeText: 'Text Note',
    itemsCompleted: 'completed',

    // Recurrence
    everydayLabel: '🔄 Repeats Every Day',
    weeklyLabel: '📅 Repeats Every Week',
    monthlyLabel: '🗓️ Repeats Every Month',
    continuousRepeat: 'Recurring Task',

    // NoteEditorModal
    createNoteTitle: 'Create New Note',
    editNoteTitle: 'Edit Note',
    titlePlaceholder: 'Note Title...',
    contentPlaceholder: 'Type your note content here or add recurring tags like @everyday, @weekly, @monthly...',
    addChecklistItem: 'Add checklist item...',
    addItemBtn: 'Add',
    selectCategory: 'Select Category',
    uncategorized: 'Uncategorized',
    tagsLabel: 'Tags (comma separated)',
    tagsPlaceholder: 'work, personal, urgent...',
    colorLabel: 'Color Theme',
    saveNote: 'Save Note',
    cancel: 'Cancel',
    aiSummarize: 'AI Summarize',

    // Feedback Modal
    feedbackTitle: 'App Feedback & Ideas',
    feedbackSubtitle: 'Click to help us improve 💬',
    feedbackDesc: 'Let us build a better Notepad together. Your thoughts mean a lot to us!',
    feedbackSubject: 'Feedback Category',
    feedbackTopic: 'Feedback Category',
    suggestion: 'Suggestion',
    featureReq: 'New Feature',
    bugReport: 'Bug Report',
    praise: 'Praise & Thanks',
    howDoYouRate: 'How would you rate the app?',
    rateApp: 'How would you rate the app?',
    feedbackMessageLabel: 'Your Feedback & Ideas',
    messageLabel: 'Your Feedback & Ideas',
    feedbackPlaceholder: 'Share feature requests, bug reports, or suggestions...',
    messagePlaceholder: 'Share feature requests, bug reports, or suggestions...',
    emailLabel: 'Your Email Address (Optional)',
    yourEmail: 'Your Email',
    optional: 'Optional',
    sendFeedback: 'Submit Feedback',
    feedbackSent: 'Feedback Received!',
    feedbackSuccessTitle: 'Feedback Received!',
    feedbackSuccessDesc: 'Thank you for taking the time to share your feedback with us! 🚀',
    adminFeedbackTab: 'Feedbacks',
    clearAllFeedbacks: 'Clear All',
    noFeedbacksFound: 'No feedback items saved yet.',
    feedbackDeleted: 'Feedback deleted.',
    allFeedbacksCleared: 'All feedbacks cleared.',
    exportFeedbacks: 'Export Feedbacks (JSON)',

    // Guide Modal
    guideTitle: 'Usage Guide & Helpful Tips',
    guideDesc: 'Add recurring tasks, maintain your daily streaks, and boost your productivity.',
    tabShortcuts: 'Keyboard Shortcuts',
    tabFeatures: 'Features',
    tabPatterns: 'Recurring Patterns (@)',
    insertPattern: 'Insert Pattern',

    // Empty state
    emptyNotesTitle: 'No notes found',
    emptyNotesDesc: 'Start capturing your thoughts, checklists, or recurring scheduled tasks!',
    emptyTrashTitle: 'Trash Bin is Empty',
    emptyTrashDesc: 'Deleted notes will appear here.',

    // Toast Messages
    noteCreated: 'New note created.',
    noteUpdated: 'Note updated.',
    noteDeleted: 'Note moved to trash.',
    noteRestored: 'Note restored.',
    trashCleared: 'Trash bin cleared.',
    recurringReset: '🔄 Your recurring tasks have been reset for the new period!',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['tr']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'en' || saved === 'tr') ? saved : 'tr';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'tr' ? 'en' : 'tr'));
  };

  const t = (key: keyof typeof translations['tr']): string => {
    return translations[language][key] || translations['tr'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
