import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const Footer = () => {
  const { language, translate } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState({
    rights: `© ${new Date().getFullYear()} Yuang Tong. All rights reserved.`,
    madeWith: 'Made with',
    inReact: 'in React'
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent({
          rights: `© ${new Date().getFullYear()} Yuang Tong. All rights reserved.`,
          madeWith: 'Made with',
          inReact: 'in React'
        });
        return;
      }

      const [rights, madeWith, inReact] = await Promise.all([
        translate(`© ${new Date().getFullYear()} Yuang Tong. All rights reserved.`),
        translate('Made with'),
        translate('in React')
      ]);

      setTranslatedContent({
        rights,
        madeWith,
        inReact
      });
    };

    translateContent();
  }, [language, translate]);

  return (
    <footer className="bg-white dark:bg-gray-800 border-t-4 border-black dark:border-gray-600 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            whileHover={{ scale: 1.05 }}
            className="font-mono mb-4 md:mb-0 text-center md:text-left dark:text-white"
          >
            {translatedContent.rights}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 font-mono dark:text-white"
          >
            <span>{translatedContent.madeWith}</span>
            <Heart className="text-pink-500 dark:text-pink-400" size={20} />
            <span>{translatedContent.inReact}</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;