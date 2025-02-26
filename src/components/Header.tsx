import React, { useState, useEffect } from 'react';
import { Menu, Github, Linkedin, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from '../context/TranslationContext';

const Header = () => {
  const { language, setLanguage, translate } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['home', 'about', 'work', 'projects', 'blog', 'contact'];
  const [translatedNavItems, setTranslatedNavItems] = useState(navItems);

  useEffect(() => {
    const translateNavItems = async () => {
      if (language === 'en') {
        setTranslatedNavItems(navItems);
        return;
      }
      
      const translated = await Promise.all(
        navItems.map(item => translate(item))
      );
      setTranslatedNavItems(translated);
    };

    translateNavItems();
  }, [language, translate]);

  return (
    <header className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.a 
            href="#"
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold cursor-pointer dark:text-white"
          >
            YT
          </motion.a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {translatedNavItems.map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="text-black dark:text-white hover:text-pink-500 font-mono text-lg"
                href={`#${navItems[translatedNavItems.indexOf(item)].toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
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
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm dark:text-white"
              aria-label="Select language"
              title="Language selector"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="zh">中文</option>
            </select>
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  whileTap={{ scale: 0.95 }}
                  className="block text-black dark:text-white hover:text-pink-500 font-mono text-lg px-4 py-2"
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center space-x-4">
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
              
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm dark:text-white"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;