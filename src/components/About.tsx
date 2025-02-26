import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Globe, Coffee } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

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
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-4xl font-bold mb-6 dark:text-white">{translatedContent.title}</h2>
            <p className="text-lg mb-6 font-mono dark:text-gray-300">
              {translatedContent.paragraph1}
            </p>
            <p className="text-lg mb-6 font-mono dark:text-gray-300">
              {translatedContent.paragraph2}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                className="p-6 border-4 border-black dark:border-white bg-yellow-300 dark:bg-purple-600"
              >
                <Icon className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">{label}</h3>
                <p className="font-mono text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;