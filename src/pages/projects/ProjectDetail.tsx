// Archivo: ProjectDetail.tsx
// Propósito: Vista de detalle de proyecto (alias) unificada; usa useContent + ContentDetail.
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import { ContentDetail } from '../../components/ui/ContentDetail';

export const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getItemBySlug } = useContent<any>('projects');
  const project = slug ? getItemBySlug(slug) : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link to="/projects" className="text-pink-500 hover:text-pink-600">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return <ContentDetail type="project" item={project} />;
};