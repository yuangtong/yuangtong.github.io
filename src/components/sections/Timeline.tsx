/**
 * Sección: Timeline
 * Línea de tiempo vertical con hitos estáticos y traducción
 */
import React from 'react';
import { useCVTimeline } from '../../hooks/useCVTimeline';
import TimelineItem from '../ui/TimelineItem';
import { useTranslation } from '../../context/TranslationContext';

const Timeline: React.FC = () => {
  const { milestones, loading, error } = useCVTimeline();
  const { language, translate } = useTranslation();
  const [title, setTitle] = React.useState('Professional Timeline');

  React.useEffect(() => {
    (async () => {
      if (language === 'en') {
        setTitle('Professional Timeline');
      } else {
        setTitle(await translate('Professional Timeline'));
      }
    })();
  }, [language, translate]);

  return (
    <section id="timeline" className="bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-left mb-12">
          <h2 className="text-4xl font-bold mb-4 border-b-4 border-black dark:border-gray-600 dark:text-white pb-4">
            {title}
          </h2>
        </header>

        {loading && (
          <div className="text-gray-600 dark:text-gray-300">Loading timeline...</div>
        )}
        {error && (
          <div className="text-red-600">{error}</div>
        )}

        {!loading && !error && (
          <div className="relative">
            {/* Línea vertical centrada */}
            <span
              className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-black dark:bg-gray-600"
              aria-hidden="true"
            />
            <div className="space-y-24 md:space-y-28 flex flex-col items-center">
              {milestones.map((m) => (
                <TimelineItem key={m.id} milestone={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(Timeline);