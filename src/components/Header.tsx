import React from 'react';
import { Menu, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navItems = ['Home', 'About', 'Work', 'Projects', 'Blog', 'Contact'];

  return (
    <header className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.a 
            href="#"
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold cursor-pointer dark:text-white"
          >
            YUANG TONG
          </motion.a>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="text-black dark:text-white hover:text-pink-500 font-mono text-lg"
                href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {[
              { Icon: Github, href: 'https://github.com' },
              { Icon: Linkedin, href: 'https://linkedin.com' },
              { Icon: Mail, href: 'mailto:hello@example.com' }
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
          </div>

          <div className="md:hidden dark:text-white">
            <Menu size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;