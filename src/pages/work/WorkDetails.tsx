import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import { ContentDetail } from '../../components/ui';

export const WorkDetails = () => {
  const { slug } = useParams();
  const { getItemBySlug } = useContent('works');
  const work = slug ? getItemBySlug(slug) : null;

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Work not found</h1>
          <Link to="/work" className="text-pink-500 hover:text-pink-600">
            Back to Work
          </Link>
        </div>
      </div>
    );
  }

  return <ContentDetail type="work" item={work} />;
};