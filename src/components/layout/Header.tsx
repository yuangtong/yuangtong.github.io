import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Menu, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from '../../context/TranslationContext';
import { Link, useLocation } from 'react-router-dom';
import FlyoutNav from './FlyoutNav';
// Back/Home removidos del Header; ahora se muestran solo en vistas de detalle

const Header = () => {
  const { language, setLanguage, translate } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  // Definición de navegación con rutas relativas y anchors
  const navLinks = [
    { key: 'home', label: 'home', to: { pathname: '/' }, title: 'Go to Home' },
    { key: 'about', label: 'about', to: { pathname: '/', hash: '#about' }, title: 'Go to About section' },
    { key: 'works', label: 'works', to: { pathname: '/work' }, title: 'View all works' },
    { key: 'projects', label: 'projects', to: { pathname: '/projects' }, title: 'View all projects' },
    { key: 'blog', label: 'blog', to: { pathname: '/blog' }, title: 'View all blog posts' },
    { key: 'contact', label: 'contact', to: { pathname: '/', hash: '#contact' }, title: 'Go to Contact section' },
  ];
  const [translatedNavItems, setTranslatedNavItems] = useState(navLinks.map(n => n.label));
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const translateNavItems = async () => {
      if (language === 'en') {
        setTranslatedNavItems(navLinks.map(n => n.label));
        return;
      }
      const translated = await Promise.all(
        navLinks.map(item => translate(item.label))
      );
      setTranslatedNavItems(translated);
    };

    translateNavItems();
  }, [language, translate]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsLangMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Medir altura del header y exponerla como CSS var para sticky offsets
  useLayoutEffect(() => {
    const updateHeaderHeightVar = () => {
      const el = headerRef.current;
      if (!el) return;
      const h = el.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    };
    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar);
    return () => window.removeEventListener('resize', updateHeaderHeightVar);
  }, []);

  const handleLangButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  // Language options with their display names
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'pt-BR', label: 'Português' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '简体中文' },
  ];

  // Get current language display name
  const getCurrentLanguageLabel = () => {
    const currentLang = languageOptions.find(option => option.value === language);
    return currentLang ? currentLang.label : 'English';
  };

  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header ref={headerRef} className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isHome && (
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <Link
                to="/"
                aria-label="Go to home"
                className="text-2xl font-bold cursor-pointer dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                YT
              </Link>
            </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {translatedNavItems.map((label, idx) => {
              const link = navLinks[idx];
              return (
                <motion.div key={link.key} whileHover={{ scale: 1.1, rotate: -2 }}>
                  <Link
                    to={link.to as any}
                    title={link.title}
                    className="text-black dark:text-white hover:text-pink-500 font-mono text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 lowercase"
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {[
              { Icon: Github, href: 'https://github.com/yuangtong' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/yuangtong' },
              { Icon: Mail, href: 'mailto:yuang.tong@outlook.com' }
            ].map(({ Icon, href }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 15 }}
                className="hover:text-pink-500 dark:text-white"
              >
                <Icon size={24} />
              </motion.a>
            ))}

            {/* Home icon removido para evitar duplicar navegación principal */}
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={handleLangButtonClick}
                className="flex items-center space-x-1 text-black dark:text-white hover:text-pink-500 focus:outline-none"
                aria-label="Select language"
                title="Language selector"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
                  <path d="m5 8 6 6"></path>
                  <path d="m4 14 6-6 2-3"></path>
                  <path d="M2 5h12"></path>
                  <path d="M7 2h1"></path>
                  <path d="m22 22-5-10-5 10"></path>
                  <path d="M14 18h6"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setLanguage(option.value);
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        language === option.value 
                          ? 'text-pink-500 font-medium' 
                          : 'text-gray-700 dark:text-gray-300'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden dark:text-white p-2"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          </div>
        )}

        {isHome && (
          <div className="relative">
            <FlyoutNav />
          </div>
        )}

        {/* Mobile Menu */}
        {!isHome && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            {/* Acciones rápidas móviles eliminadas (Back/Home ahora viven en vistas de detalle) */}
            <nav className="py-4 space-y-2">
              {translatedNavItems.map((label, index) => {
                const link = navLinks[index];
                return (
                  <React.Fragment key={link.key}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to={link.to as any}
                        title={link.title}
                        className="block text-black dark:text-white hover:text-pink-500 font-mono text-lg px-4 py-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 lowercase"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </motion.div>
                    {index < translatedNavItems.length - 1 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 mx-8 my-1"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
            
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-center space-x-6">
                <ThemeToggle />
                {[
                  { Icon: Github, href: 'https://github.com/yuangtong' },
                  { Icon: Linkedin, href: 'https://linkedin.com/in/yuangtong' },
                  { Icon: Mail, href: 'mailto:yuang.tong@outlook.com' }
                ].map(({ Icon, href }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="hover:text-pink-500 dark:text-white"
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
              
              {/* Mobile Language Selector */}
              <div className="relative">
                <button 
                  onClick={handleLangButtonClick}
                  className="flex items-center justify-between w-full px-3 py-2 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
                      <path d="m5 8 6 6"></path>
                      <path d="m4 14 6-6 2-3"></path>
                      <path d="M2 5h12"></path>
                      <path d="M7 2h1"></path>
                      <path d="m22 22-5-10-5 10"></path>
                      <path d="M14 18h6"></path>
                    </svg>
                    <span>{getCurrentLanguageLabel()}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLanguage(option.value);
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          language === option.value 
                            ? 'text-pink-500 font-medium' 
                            : 'text-gray-700 dark:text-gray-300'
                        } hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
