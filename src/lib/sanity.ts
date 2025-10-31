import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'sd7nr7vr', // Your existing Sanity project ID
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production', // or the name you chose in setup
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2022-06-01', // use compatible API version
});

// Image URL builder
const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

// GROQ queries for different content types
export const queries = {
  // Get all projects
  projects: `*[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    longDescription,
    image,
    technologies,
    liveUrl,
    githubUrl,
    category,
    featured,
    order
  }`,
  
  // Get project by slug
  projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    shortDescription,
    longDescription,
    image,
    technologies,
    liveUrl,
    githubUrl,
    category,
    featured,
    order
  }`,
  
  // Get all blog posts
  blogs: `*[_type == "blog"] | order(date desc) {
    _id,
    title,
    slug,
    excerpt,
    content,
    date,
    readTime,
    category,
    image,
    author,
    tags
  }`,
  
  // Get blog post by slug
  blogBySlug: `*[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    date,
    readTime,
    category,
    image,
    author,
    tags
  }`,
  
  // Get site settings
  // Get all work items
  works: `*[_type == "work"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    category,
    description,
    image,
    awards,
    tech,
    liveUrl,
    githubUrl,
    featured,
    order
  }`,

  // Get work by slug
  workBySlug: `*[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    description,
    image,
    awards,
    tech,
    liveUrl,
    githubUrl,
    featured,
    order
  }`,

  siteSettings: `*[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    author,
    social
  }`
};

// Helper function to fetch data
export const fetchData = async (query: string, params = {}) => {
  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error('Error fetching data from Sanity:', error);
    throw error;
  }
};