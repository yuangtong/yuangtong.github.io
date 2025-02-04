import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Zap, FileDown, Github } from 'lucide-react';
import BackgroundShapes from './BackgroundShapes';

const Hero = () => {
  return (
    <section className="min-h-screen pt-20 bg-gradient-to-br from-yellow-300 via-pink-500 to-purple-600 relative overflow-hidden">
      <BackgroundShapes />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hi, I'm Yuang Tong
            <br />
            <motion.span 
              className="text-pink-500"
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
              Designer & Developer
            </motion.span>
          </motion.h1>
          
          <p className="text-xl md:text-2xl mb-8 font-mono">
            I create bold, functional, and memorable digital experiences
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { Icon: Code2, text: 'Clean Code' },
              { Icon: Palette, text: 'Bold Design' },
              { Icon: Zap, text: 'Fast Performance' }
            ].map(({ Icon, text }, index) => (
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
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Icon size={20} />
                <span className="font-mono">{text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="/cv.pdf"
              download
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
              }}
              className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 border-2 border-black font-bold transition-all hover:bg-yellow-300 hover:text-black"
            >
              <FileDown size={20} />
              <span>Download my CV</span>
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
              className="flex items-center space-x-2 bg-white text-black px-6 py-3 border-2 border-black font-bold transition-all hover:bg-black hover:text-white"
            >
              <Github size={20} />
              <span>View on GitHub</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;