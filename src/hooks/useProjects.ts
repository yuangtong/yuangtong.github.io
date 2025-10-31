import { useState, useEffect } from 'react';
import { client, queries, urlFor } from '../lib/sanity';

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  shortDescription: string;
  longDescription?: string;
  image: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'other';
  featured: boolean;
  awards?: string[];
  order: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(queries.projects);
        
        // Always set the data, even if empty
        setProjects(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getImageUrl = (image: Project['image']) => {
    if (!image?.asset) return '';
    return urlFor(image).width(800).height(500).url();
  };

  const getCategoryLabel = (category: Project['category']) => {
    const labels = {
      web: 'Web Development',
      mobile: 'Mobile App',
      desktop: 'Desktop App',
      other: 'Other'
    };
    return labels[category] || 'Other';
  };

  return {
    projects,
    loading,
    error,
    getImageUrl,
    getCategoryLabel
  };
};