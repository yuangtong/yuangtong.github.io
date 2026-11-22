/**
 * Hook para construir la línea de tiempo del CV
 * Usa datos estáticos, integra traducción y expone estado
 */
import { useEffect, useMemo, useState } from 'react';
import { timeline } from '../data/timeline';
import type { CareerMilestone } from '../types/cv';
import { useTranslation } from '../context/TranslationContext';

interface UseCVTimelineResult {
  milestones: CareerMilestone[];
  loading: boolean;
  error?: string;
  source: 'static';
}

export function useCVTimeline(): UseCVTimelineResult {
  const { language, translate } = useTranslation();
  const [milestones, setMilestones] = useState<CareerMilestone[]>([]);
  const [source, setSource] = useState<'static'>('static');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(undefined);

    (async () => {
      try {
        const rawMilestones = timeline;
        const translated = await Promise.all(
          rawMilestones.map(async (m) => {
            const title = language === 'en' ? m.title : await translate(m.title);
            const description = m.description
              ? language === 'en'
                ? m.description
                : await translate(m.description)
              : m.description;
            return { ...m, title, description };
          })
        );
        if (mounted) setMilestones(translated);
      } catch (err) {
        console.error('useCVTimeline error:', err);
        if (mounted) setError('No fue posible cargar los hitos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [language, translate]);

  const result = useMemo<UseCVTimelineResult>(() => ({
    milestones,
    loading,
    error,
    source,
  }), [milestones, loading, error, source]);

  return result;
}

export default useCVTimeline;