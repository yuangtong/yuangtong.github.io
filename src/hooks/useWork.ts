import { useState, useEffect } from 'react';
import { client, queries, urlFor } from '../lib/sanity';

export interface Work {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  category: string;
  description: string;
  image: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  awards?: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export const useWork = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(queries.works);
        
        // Always set the data, even if empty
        setWorks(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching works:', err);
        setError('Failed to fetch works');
        setWorks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  const getImageUrl = (image: Work['image'], workTitle?: string) => {
    if (!image?.asset?._ref) {
      return '';
    }
    return urlFor(image).width(800).height(500).url();
  };

  return {
    works,
    loading,
    error,
    getImageUrl
  };
};