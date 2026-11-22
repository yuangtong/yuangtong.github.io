import { useEffect, useState } from 'react';
import contentData from '../data/content.json';

type ContentType = 'blogs' | 'projects' | 'works' | 'testimonials';

export function useContent<T>(type: ContentType): {
  items: T[];
  getItemBySlug: (slug: string) => T | undefined;
  loading: boolean;
  error: string | null;
} {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = contentData[type] as T[];
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load content');
      setLoading(false);
    }
  }, [type]);

  const getItemBySlug = (slug: string) => {
    return items.find((item: any) => item.slug === slug);
  };

  return { items, getItemBySlug, loading, error };
}