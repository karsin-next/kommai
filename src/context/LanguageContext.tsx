"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../lib/lang/en.json';
import ms from '../lib/lang/ms.json';
import zh from '../lib/lang/zh.json';

type Language = 'en' | 'ms' | 'zh';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => any;
}

const translations: Record<Language, any> = { en, ms, zh };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('kommai_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ms' || saved === 'zh')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kommai_lang', lang);
  };

  const t = (key: string, params?: Record<string, string>): any => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value[k] === undefined) return key;
      value = value[k];
    }

    if (typeof value !== 'string') return value;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = (value as string).replace(`{{${k}}}`, v);
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
