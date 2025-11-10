/**
 * Componente UI: TimelineItem
 * Muestra un hito con fecha, icono, título, organización y descripción
 */
import React from 'react';
import { Briefcase, GraduationCap, Award, Code, Gauge } from 'lucide-react';
import type { CareerMilestone } from '../../types/cv';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface TimelineItemProps {
  milestone: CareerMilestone;
}

const iconMap = {
  briefcase: Briefcase,
  graduation: GraduationCap,
  award: Award,
  code: Code,
  management: Gauge,
  milestone: Briefcase,
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ milestone }) => {
  // Activación anticipada con offset de ~150px y umbral 0.2
  const { ref, isVisible } = useScrollReveal({ rootMargin: '0px 0px 150px 0px', threshold: 0.2 });
  const Icon = iconMap[milestone.iconKey || 'milestone'];

  return (
    <div ref={ref} className={`relative w-full max-w-3xl`}>      
      {/* Punto conectado a la línea central */}
      <span className="absolute left-1/2 -translate-x-1/2 -top-6 w-4 h-4 rounded-full bg-yellow-300 dark:bg-purple-600 border-4 border-black dark:border-gray-600 shadow" aria-hidden="true" />

      {/* Carta neobrutalista */}
      <div className={`transform-gpu will-change-[transform,opacity] transition-opacity transition-transform duration-300 md:duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <article className="bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-600 overflow-hidden group hover:bg-yellow-300 dark:hover:bg-purple-700 transition-colors">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-2">
              <Icon className="w-7 h-7 text-black dark:text-white" aria-hidden="true" />
              <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-mono">{milestone.dateRange}</div>
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">{milestone.title}</h3>
            {milestone.organization && (
              <div className="text-base md:text-lg text-gray-800 dark:text-gray-200 mb-2">{milestone.organization}</div>
            )}
            {milestone.description && (
              <p className="text-gray-700 dark:text-gray-300 font-mono leading-relaxed">{milestone.description}</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default TimelineItem;