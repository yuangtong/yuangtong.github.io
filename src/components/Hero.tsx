import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Zap, FileDown, Github } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const Hero = () => {
  const { language, translate } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState({
    greeting: "hey, i'm yuang tong",
    role: "designer & developer",
    tagline: "I create bold, functional, and memorable digital experiences",
    downloadCV: "Download my CV",
    viewGithub: "View on GitHub"
  });

  const initialFeatures = [
    { Icon: Code2, text: 'Clean Code' },
    { Icon: Palette, text: 'Bold Design' },
    { Icon: Zap, text: 'Fast Performance' }
  ];
  
  const [features, setFeatures] = useState(initialFeatures);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent({
          greeting: "hey, i'm yuang tong",
          role: "designer & developer",
          tagline: "I create bold, functional, and memorable digital experiences",
          downloadCV: "Download my CV",
          viewGithub: "View on GitHub"
        });
        setFeatures(initialFeatures);
        return;
      }

      const [greeting, role, tagline, downloadCV, viewGithub] = await Promise.all([
        translate("hey, i'm yuang tong"),
        translate("designer & developer"),
        translate("I create bold, functional, and memorable digital experiences"),
        translate("Download my CV"),
        translate("View on GitHub")
      ]);

      setTranslatedContent({
        greeting,
        role,
        tagline,
        downloadCV,
        viewGithub
      });

      // Translate features
      const translatedFeatures = await Promise.all(
        initialFeatures.map(async (feature) => ({
          ...feature,
          text: await translate(feature.text)
        }))
      );
      setFeatures(translatedFeatures);
    };

    translateContent();
  }, [language, translate]);

  return (
    <section className="min-h-screen pt-20 bg-gradient-to-br from-yellow-300 via-green-500 to-blue-600 dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(76,29,149,1)] p-8 md:p-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {translatedContent.greeting}
            <br />
            <motion.span 
              className="text-blue-500 dark:text-purple-400"
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [-1, 1, -1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {translatedContent.role}
            </motion.span>
          </motion.h1>
          
          <p className="text-xl md:text-2xl mb-8 font-mono dark:text-gray-300">
            {translatedContent.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {features.map(({ Icon, text }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: -2,
                  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                }}
                className="flex items-center space-x-2 bg-black text-white dark:bg-purple-700 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(76,29,149,0.8)]"
              >
                <Icon size={20} />
                <span className="font-mono">{text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="/Yuang-Tong-CV.pdf"
              download
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
              }}
              className="flex items-center space-x-2 bg-blue-500 dark:bg-purple-600 text-white px-6 py-3 border-2 border-black dark:border-gray-600 font-bold transition-all hover:bg-yellow-300 dark:hover:bg-indigo-500 hover:text-black dark:hover:text-white"
            >
              <FileDown size={20} />
              <span>{translatedContent.downloadCV}</span>
            </motion.a>

            <motion.a
              href="https://github.com/yuangtong/yuangtong.github.io"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
              }}
              className="flex items-center space-x-2 bg-white dark:bg-gray-700 text-black dark:text-white px-6 py-3 border-2 border-black dark:border-gray-600 font-bold transition-all hover:bg-black hover:text-white dark:hover:bg-gray-900"
            >
              <Github size={20} />
              <span>{translatedContent.viewGithub}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;