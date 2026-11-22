import React, { createContext, useContext, useState, useCallback } from 'react';
import { translateText } from '../services/translateService';
import type { TargetLanguageCode } from 'deepl-node';

type TranslationContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  const translate = useCallback(async (text: string) => {
    if (language === 'en') return text;
    return await translateText(text, language.toUpperCase() as TargetLanguageCode);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}