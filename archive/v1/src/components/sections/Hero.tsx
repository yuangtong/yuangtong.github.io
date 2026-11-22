import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Zap, FileDown, Github, ExternalLink, Calendar } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition, IconLookup } from '@fortawesome/fontawesome-svg-core';
import { useTranslation } from '../../context/TranslationContext';
import { TypeAnimation } from 'react-type-animation';
import CVDownloadModal from '../Feature/CVDownloadModal';
import WhatsAppConsultationModal from '../Feature/WhatsAppConsultationModal';
import AuroraBackground from '../ui/AuroraBackground';
import MagnetButton from '../ui/MagnetButton';

const Hero = () => {
  const { language, translate } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState({
    greeting: "hey! i'm yuang tong",
    role: "designer & developer",
    tagline: "I create bold, functional, and memorable digital experiences",
    downloadCV: "Download my CV",
    viewGithub: "View on GitHub",
    hireUpwork: "Hire me on Upwork",
    scheduleCall: "Schedule a free consultation"
  });

  // Estado para el modal de descarga del CV
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  // Estado para el modal de consulta por WhatsApp
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Referencia para la sección hero
  const heroRef = useRef<HTMLElement | null>(null);
  // Estado para la posición del cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Efecto para seguir el cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Secuencias de animación para diferentes idiomas
  const [animationSequence, setAnimationSequence] = useState([
    'a web designer',
    1000,
    'a web developer',
    1000,
    'a cat lover',
    1000,
  ]);

  const initialFeatures = [
    { Icon: Code2, text: 'Clean Code' },
    { Icon: Palette, text: 'Bold Design' },
    { Icon: Zap, text: 'Fast Performance' }
  ];
  
  const [features, setFeatures] = useState(initialFeatures);

  // --- Mobile typing container height fix ---
  const typeContainerRef = useRef<HTMLSpanElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : true);
  const [typeMaxHeight, setTypeMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setTypeMaxHeight(undefined);
      return;
    }
    const container = typeContainerRef.current;
    if (!container) return;

    // Create a hidden measurer inside the same container to match width and styles
    const measurer = document.createElement('span');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'normal';
    measurer.className = 'inline-block';
    container.appendChild(measurer);

    // Extract strings from sequence and measure their rendered height
    const strings = animationSequence.filter((v) => typeof v === 'string') as string[];
    let max = 0;
    for (const s of strings) {
      measurer.textContent = s;
      const h = measurer.offsetHeight;
      if (h > max) max = h;
    }

    container.removeChild(measurer);
    // Add a small buffer to avoid clipping due to font rendering nuances
    setTypeMaxHeight(max > 0 ? max + 2 : undefined);
  }, [animationSequence, isMobile]);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent({
          greeting: "hey! i'm yuang tong",
          role: "designer & developer",
          tagline: "I create bold, functional, and memorable digital experiences",
          downloadCV: "Download my CV",
          viewGithub: "View my GitHub",
          hireUpwork: "Hire me on Upwork",
          scheduleCall: "Schedule a free consultation"
        });
        setFeatures(initialFeatures);
        
        // Secuencia en inglés
        setAnimationSequence([
          'a web designer',
          1000,
          'a web developer',
          1000,
          'a cat lover',
          1000,
        ]);
        return;
      }

      const [greeting, role, tagline, downloadCV, viewGithub, hireUpwork, scheduleCall] = await Promise.all([
        translate("hey! i'm yuang tong"),
        translate("designer & developer"),
        translate("I create bold, functional, and memorable digital experiences"),
        translate("Download my CV"),
        translate("View my GitHub"),
        translate("Hire me on Upwork"),
        translate("Schedule a free consultation")
      ]);

      setTranslatedContent({
        greeting,
        role,
        tagline,
        downloadCV,
        viewGithub,
        hireUpwork,
        scheduleCall
      });

      // Traducir la secuencia de animación
      const [webDesigner, webDeveloper, catLover] = await Promise.all([
        translate("web designer"),
        translate("web developer"),
        translate("a cat lover")
      ]);

      // Actualizar la secuencia con las traducciones
      setAnimationSequence([
        webDesigner,
        1000,
        webDeveloper,
        1000,
        catLover,
        1000,
      ]);

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

  // Blob-like gradient animation variants
  const gradientVariants = {
    initial: {
      backgroundPosition: "0% 0%",
    },
    animate: {
      backgroundPosition: [
        "0% 0%",
        "100% 0%", 
        "100% 100%", 
        "0% 100%", 
        "0% 0%"
      ],
      transition: {
        duration: 20,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="min-h-screen pt-20 relative overflow-hidden bg-gray-950 dark:bg-gray-900"
    >
      {/* Fondo "techy" tipo mesh gradient + estrellas */}
      <AuroraBackground />
      {/* Patrón de puntos halftone */}
      {/* <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, black 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
            backgroundPosition: '0 0',
          }}
        />
      </div> */}
      
      {/* Eliminado: Blob que sigue al cursor */}
      {/* El siguiente bloque ha sido eliminado para quitar el efecto "halo" del cursor
      <motion.div
        className="absolute pointer-events-none blur-[80px] opacity-70 bg-yellow-300 dark:bg-purple-500 rounded-full"
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 100,
          mass: 3
        }}
        style={{
          width: "300px",
          height: "300px",
        }}
      />
      */}
      
      {/* Magnet Button (Schedule) */}
      <div className="absolute right-8 bottom-12 z-20 md:right-16 lg:right-24">
        <MagnetButton onClick={() => setIsConsultationOpen(true)} />
      </div>

      {/* WhatsApp Consultation Modal */}
      <WhatsAppConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 shadow-[8px_8px_0_#0B1220] dark:shadow-[8px_8px_0_rgba(76,29,149,0.8)] p-8 md:p-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-black dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {translatedContent.greeting}
            <br />
            <span className="text-blue-500 dark:text-purple-400">
              <span
                ref={typeContainerRef}
                className="inline-block"
                style={{
                  height: isMobile && typeMaxHeight ? `${typeMaxHeight}px` : undefined,
                  overflow: isMobile ? 'hidden' as const : undefined,
                }}
              >
                <TypeAnimation
                  sequence={animationSequence}
                  speed={50}
                  repeat={Infinity}
                  className="inline-block"
                />
              </span>
            </span>
          </motion.h1>
          
          <p className="text-xl md:text-2xl mb-8 font-mono text-gray-700 dark:text-gray-200">
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
                className="flex items-center space-x-2 bg-zinc-900 text-white/90 dark:bg-purple-600 px-4 py-2 shadow-[4px_4px_0_#0B1220] dark:shadow-[4px_4px_0_rgba(76,29,149,0.6)]"
              >
                <Icon size={20} />
                <span className="font-mono">{text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-nowrap md:flex-wrap items-center gap-3 md:gap-4 w-full">
            <motion.button
              onClick={() => setIsCVModalOpen(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
              }}
              aria-label={translatedContent.downloadCV}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 dark:bg-purple-600 text-white px-3 md:px-6 py-2 md:py-3 border-2 border-black dark:border-gray-600 font-bold transition-all hover:bg-yellow-300 dark:hover:bg-indigo-500 hover:text-black dark:hover:text-white active:scale-[0.98]"
            >
              <FileDown size={20} />
              <span className="hidden md:inline">{translatedContent.downloadCV}</span>
            </motion.button>

            <motion.a
              href="https://github.com/yuangtong"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
              }}
              aria-label={translatedContent.viewGithub}
              className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 text-black dark:text-white px-3 md:px-6 py-2 md:py-3 border-2 border-black/80 dark:border-gray-600 font-bold transition-all hover:bg-neutral-900 hover:text-white dark:hover:bg-gray-900 active:scale-[0.98]"
            >
              <Github size={20} />
              <span className="hidden md:inline">{translatedContent.viewGithub}</span>
            </motion.a>
            
            <motion.a
              href="https://www.upwork.com/freelancers/yuangt" 
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
              }}
              aria-label={translatedContent.hireUpwork}
              className="flex-1 flex items-center justify-center space-x-2 bg-[#14a800] text-white px-3 md:px-6 py-2 md:py-3 border-2 border-black dark:border-gray-600 font-bold transition-all hover:bg-[#0e8600] active:scale-[0.98]"
            >
              {(() => {
                const upworkLookup: IconLookup = { prefix: 'fab', iconName: 'square-upwork' as any };
                const icon = findIconDefinition(upworkLookup) || findIconDefinition({ prefix: 'fab', iconName: 'upwork' as any });
                return <FontAwesomeIcon icon={icon} className="text-white" />;
              })()}
              <span className="hidden md:inline">{translatedContent.hireUpwork}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Modal de descarga del CV */}
      <CVDownloadModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;