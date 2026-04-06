
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en_json from './locales/en.json';
import ko_json from './locales/ko.json';

type Language = 'en' | 'ko';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const locale = language === 'ko' ? ko_json : en_json;
    const value = (locale as Record<string, string>)[key];
    
    if (value) return value;
    
    // Fallback exactly as before but with zero dependencies on external mapping
    const fallbackValue = (en_json as Record<string, string>)[key];
    return fallbackValue || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    // Return a default object to prevent crashing if called outside provider
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    };
  }
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return (
    <div className="flex items-center gap-0.5 bg-muted/60 border border-border/50 rounded-xl p-0.5">
      {(['en', 'ko'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            language === lang
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {lang === 'en' ? 'EN' : '한국어'}
        </button>
      ))}
    </div>
  );
}
