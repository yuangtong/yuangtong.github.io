import { Languages } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-3 right-16 md:top-4 md:right-20 p-2.5 md:p-3 bg-white dark:bg-neutral-900 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
      aria-label="Toggle language"
    >
      <Languages className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}