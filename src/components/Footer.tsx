import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t-4 border-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            whileHover={{ scale: 1.05 }}
            className="font-mono mb-4 md:mb-0"
          >
            © {new Date().getFullYear()} Yuang Tong. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 font-mono"
          >
            <span>Made with</span>
            <Heart className="text-pink-500" size={20} />
            <span>in React</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;