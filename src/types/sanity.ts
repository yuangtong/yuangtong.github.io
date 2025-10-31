// Sanity content type interfaces

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface Project {
  _id: string;
  _type: 'project';
  title: string;
  slug: Slug;
  description: string;
  fullDescription: string;
  image: SanityImage | string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured?: boolean;
  _createdAt: string;
  _updatedAt: string;
}

export interface BlogPost {
  _id: string;
  _type: 'blog';
  title: string;
  slug: Slug;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: SanityImage | string;
  author: string;
  tags: string[];
  _createdAt: string;
  _updatedAt: string;
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  title: string;
  description: string;
  author: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// Legacy interfaces for backward compatibility
export interface LegacyProject {
  id?: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  slug: string;
  category: string;
  featured?: boolean;
}

export interface LegacyBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: string;
  tags: string[];
}