/**
 * Tipos TypeScript para Contentful CMS
 * Define las interfaces para el contenido del CMS
 */

// Tipos base de Contentful
export interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface ContentfulEntry<T = any> {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: T;
}

// Tipos específicos del contenido
export interface ProjectFields {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  image?: ContentfulAsset;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'other';
  featured: boolean;
  order: number;
}

export interface BlogFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishDate: string;
  readTime: string;
  category: string;
  featuredImage?: ContentfulAsset;
  author: string;
  tags: string[];
  published: boolean;
}

export interface WorkFields {
  title: string;
  slug: string;
  category: string;
  description: string;
  image?: ContentfulAsset;
  awards?: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export interface SiteSettingsFields {
  siteName: string;
  siteDescription: string;
  author: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  seoSettings: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: ContentfulAsset;
  };
}

// Tipos de entrada completos
export type ProjectEntry = ContentfulEntry<ProjectFields>;
export type BlogEntry = ContentfulEntry<BlogFields>;
export type WorkEntry = ContentfulEntry<WorkFields>;
export type SiteSettingsEntry = ContentfulEntry<SiteSettingsFields>;

// Tipos transformados para el frontend (sin metadata de Contentful)
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  image?: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  author: string;
  tags: string[];
  published: boolean;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image?: string;
  awards?: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  author: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}