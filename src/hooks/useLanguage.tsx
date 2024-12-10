import { create } from 'zustand';

type Language = 'en' | 'es';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));