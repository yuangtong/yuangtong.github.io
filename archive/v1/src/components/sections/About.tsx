import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Globe, Coffee } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import AboutSkillCard from '../ui/AboutSkillCard';

const About = () => {
  const { language, translate } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState({
    title: 'About Me',
    paragraph1: "I'm a passionate developer and designer with over 2 years of experience in creating digital solutions that make a difference. My approach combines clean code with stunning design to deliver exceptional user experiences.",
    paragraph2: "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing.",
  });
  
  const initialSkills = [
    { icon: Code, label: 'Full Stack Development', desc: 'Building scalable web applications' },
    { icon: Palette, label: 'UI/UX Design', desc: 'Creating intuitive user experiences' },
    { icon: Globe, label: 'Web Performance', desc: 'Optimizing for speed and accessibility' },
    { icon: Coffee, label: 'Problem Solving', desc: 'Finding elegant solutions to complex problems' }
  ];
  
  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent({
          title: 'About Me',
          paragraph1: "I'm a passionate developer and designer with over 2 years of experience in creating digital solutions that make a difference. My approach combines clean code with stunning design to deliver exceptional user experiences.",
          paragraph2: "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing.",
        });
        setSkills(initialSkills);
        return;
      }

      const [title, p1, p2] = await Promise.all([
        translate('About Me'),
        translate("I'm a passionate developer and designer with over 2 years of experience in creating digital solutions that make a difference. My approach combines clean code with stunning design to deliver exceptional user experiences."),
        translate("When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing."),
      ]);

      setTranslatedContent({
        title,
        paragraph1: p1,
        paragraph2: p2,
      });

      // Translate skills
      const translatedSkills = await Promise.all(
        initialSkills.map(async (skill) => ({
          ...skill,
          label: await translate(skill.label),
          desc: await translate(skill.desc),
        }))
      );
      setSkills(translatedSkills);
    };

    translateContent();
  }, [language, translate]);

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-4xl font-bold mb-6 dark:text-white"
            >
              {translatedContent.title}
            </motion.h2>
            <p className="text-lg mb-6 font-mono dark:text-gray-300">
              {translatedContent.paragraph1}
            </p>
            <p className="text-lg mb-6 font-mono dark:text-gray-300">
              {translatedContent.paragraph2}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map(({ icon: Icon, label, desc }, index) => {
              // Colores y posición idénticos al ejemplo (variaciones por tarjeta)
              const bgVariants = ['bg-emerald-300', 'bg-indigo-300 sm:-translate-y-6', 'bg-red-300', 'bg-yellow-300 sm:-translate-y-6'];
              const extraClass = bgVariants[index % bgVariants.length];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.25 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                >
                  <AboutSkillCard title={label} subtitle={desc} Icon={Icon} className={extraClass} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;