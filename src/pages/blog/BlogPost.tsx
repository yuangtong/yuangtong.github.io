import React from 'react';
import { useParams } from 'react-router-dom';
import { ContentDetail } from '../../components/ui/ContentDetail';
import { useContent } from '../../hooks/useContent';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const BlogPost = () => {
  const { slug } = useParams();
  const { getItemBySlug, loading, error } = useContent<BlogPost>('blogs');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const post = getItemBySlug(slug || '');
  
  return <ContentDetail type="blog" item={post} />;
};