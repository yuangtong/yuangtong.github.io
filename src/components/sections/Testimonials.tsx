import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { useContent } from '../../hooks/useContent';
import { Testimonial } from '../../types';
import HorizontalScrollControls from '../ui/HorizontalScrollControls';
import { useEqualHeights } from '../../hooks/useEqualHeights';
/**
 * Datos de Testimonials ahora se consumen desde content.json a través del hook useContent.
 * Tipado con la interfaz Testimonial para preparar futura integración con Contentful.
 */

const Testimonials = () => {
  const { language, translate } = useTranslation();
  const { items, loading, error } = useContent<Testimonial>('testimonials');
  const [translatedTestimonials, setTranslatedTestimonials] = React.useState<Testimonial[]>([]);
  const [translatedSectionContent, setTranslatedSectionContent] = React.useState({
    title: 'Client Testimonials',
    subtitle: 'What people are saying about working with me'
  });

  React.useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedTestimonials(items);
        setTranslatedSectionContent({
          title: 'Client Testimonials',
          subtitle: 'What people are saying about working with me'
        });
        return;
      }

      // Translate section headers
      const [translatedTitle, translatedSubtitle] = await Promise.all([
        translate('Client Testimonials'),
        translate('What people are saying about working with me')
      ]);

      // Translate testimonials
      const translated = await Promise.all(
        items.map(async (testimonial) => ({
          ...testimonial,
          quote: await translate(testimonial.quote),
          role: await translate(testimonial.role),
          company: await translate(testimonial.company)
        }))
      );

      setTranslatedSectionContent({
        title: translatedTitle,
        subtitle: translatedSubtitle
      });
      setTranslatedTestimonials(translated);
    };

    translateContent();
  }, [language, translate, items]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Igualar alturas al mayor contenido visible
  useEqualHeights(scrollRef, '[data-equalize="card"]', [translatedTestimonials.length]);
  if (loading) return null;
  if (error) return null;

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{translatedSectionContent.title}</h2>
          <p className="text-lg font-mono text-gray-400">
            {translatedSectionContent.subtitle}
          </p>
        </motion.div>

        {/* Flex con overflow en móviles; grid 3 columnas en desktop sin controles */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-stretch overflow-x-auto horizontal-scroll-touch pb-6 gap-8 pl-12 pr-12 sm:px-6 scrollbar-hide snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-8 lg:px-0 lg:overflow-visible"
            style={{ scrollPaddingLeft: '3rem', scrollPaddingRight: '3rem' }}
          >
          {translatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-900 p-6 rounded-none border-4 border-pink-500 relative group flex-shrink-0 w-[76vw] sm:w-[68vw] md:w-[55vw] lg:w-auto snap-start h-full"
              data-equalize="card"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -top-6 left-6"
              >
                {/* <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-none border-4 border-black object-cover"
                />  */}
              </motion.div>

              <Quote 
                size={40} 
                className="text-pink-500 mb-4 transform -scale-x-100" 
              />

              <p className="text-lg mb-6 font-mono">
                "{testimonial.quote}"
              </p>

              <div className="border-t-2 border-gray-800 pt-4">
                <p className="font-bold text-lg">{testimonial.name}</p>
                <p className="text-pink-500 font-mono">{testimonial.role}</p>
                <p className="text-gray-400 font-mono text-sm">{testimonial.company}</p>
              </div>

              <motion.div
                className="absolute -bottom-2 -right-2 w-full h-full border-4 border-yellow-300 -z-10"
                initial={false}
                whileHover={{ 
                  x: 8,
                  y: 8,
                  transition: { duration: 0.2 }
                }}
              />
            </motion.div>
          ))}
          </div>
          {/* Ocultar controles en desktop y recalcular según cantidad */}
          <HorizontalScrollControls targetRef={scrollRef} className="lg:hidden" deps={[translatedTestimonials.length]} />
        </div>
        
        {/* Optional: Add scroll indicators for mobile */}
        <div className="flex justify-center mt-6 gap-2 lg:hidden">
          {translatedTestimonials.map((_, index) => (
            <div 
              key={index} 
              className="w-2 h-2 rounded-full bg-gray-600"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;