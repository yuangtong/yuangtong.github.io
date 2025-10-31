import { useState, useEffect } from 'react';
import { fetchData, queries, urlFor } from '../lib/sanity';
import { Project, BlogPost, SiteSettings, LegacyProject, LegacyBlogPost } from '../types/sanity';

// Hook to fetch projects
export const useProjects = () => {
  const [projects, setProjects] = useState<LegacyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data: Project[] = await fetchData(queries.projects);
        
        // Transform Sanity data to legacy format for compatibility
        const transformedProjects: LegacyProject[] = data.map(project => ({
          id: project._id,
          title: project.title,
          description: project.description,
          fullDescription: project.fullDescription,
          image: typeof project.image === 'string' ? project.image : urlFor(project.image).url(),
          tech: project.tech,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          slug: project.slug.current,
          category: project.category,
          featured: project.featured
        }));
        
        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects');
        // Fallback to empty array or static data if needed
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

// Hook to fetch a single project by slug
export const useProject = (slug: string) => {
  const [project, setProject] = useState<LegacyProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const data: Project = await fetchData(queries.projectBySlug, { slug });
        
        if (data) {
          const transformedProject: LegacyProject = {
            id: data._id,
            title: data.title,
            description: data.description,
            fullDescription: data.fullDescription,
            image: typeof data.image === 'string' ? data.image : urlFor(data.image).url(),
            tech: data.tech,
            liveUrl: data.liveUrl,
            githubUrl: data.githubUrl,
            slug: data.slug.current,
            category: data.category,
            featured: data.featured
          };
          setProject(transformedProject);
        } else {
          setProject(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to fetch project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  return { project, loading, error };
};

// Hook to fetch blog posts
export const useBlogs = () => {
  const [blogs, setBlogs] = useState<LegacyBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data: BlogPost[] = await fetchData(queries.blogs);
        
        // Transform Sanity data to legacy format for compatibility
        const transformedBlogs: LegacyBlogPost[] = data.map(blog => ({
          id: blog._id,
          slug: blog.slug.current,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          date: blog.date,
          readTime: blog.readTime,
          category: blog.category,
          image: typeof blog.image === 'string' ? blog.image : urlFor(blog.image).url(),
          author: blog.author,
          tags: blog.tags
        }));
        
        setBlogs(transformedBlogs);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs');
        // Fallback to empty array or static data if needed
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { blogs, loading, error };
};

// Hook to fetch a single blog post by slug
export const useBlog = (slug: string) => {
  const [blog, setBlog] = useState<LegacyBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data: BlogPost = await fetchData(queries.blogBySlug, { slug });
        
        if (data) {
          const transformedBlog: LegacyBlogPost = {
            id: data._id,
            slug: data.slug.current,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            date: data.date,
            readTime: data.readTime,
            category: data.category,
            image: typeof data.image === 'string' ? data.image : urlFor(data.image).url(),
            author: data.author,
            tags: data.tags
          };
          setBlog(transformedBlog);
        } else {
          setBlog(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to fetch blog');
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  return { blog, loading, error };
};

// Hook to fetch site settings
export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data: SiteSettings = await fetchData(queries.siteSettings);
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching site settings:', err);
        setError('Failed to fetch site settings');
        setSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};