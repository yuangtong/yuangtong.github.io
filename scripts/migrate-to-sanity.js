/**
 * Migration script to help convert static data to Sanity format
 * This script generates JSON that can be imported into Sanity Studio
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Import static data
const contentData = require('../src/data/content.json');

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Convert projects to Sanity format
function convertProjects() {
  const projects = contentData.projects || [];
  
  return projects.map((project, index) => ({
    _type: 'project',
    _id: `project-${index + 1}`,
    title: project.title,
    slug: {
      _type: 'slug',
      current: project.slug || generateSlug(project.title)
    },
    shortDescription: project.description,
    longDescription: project.fullDescription,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: `image-${index + 1}` // You'll need to upload images separately
      },
      alt: project.title
    },
    technologies: project.tech || [],
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    category: project.category || 'Web Development',
    featured: project.featured || false,
    order: index
  }));
}

// Convert blog posts to Sanity format
function convertBlogs() {
  const blogs = contentData.blogs || [];
  
  return blogs.map((blog, index) => ({
    _type: 'blog',
    _id: `blog-${blog.id || index + 1}`,
    title: blog.title,
    slug: {
      _type: 'slug',
      current: blog.slug || generateSlug(blog.title)
    },
    excerpt: blog.excerpt,
    content: blog.content,
    date: blog.date,
    readTime: blog.readTime,
    category: blog.category,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: `blog-image-${index + 1}` // You'll need to upload images separately
      },
      alt: blog.title
    },
    author: blog.author,
    tags: blog.tags || [],
    published: true
  }));
}

// Create site settings
function createSiteSettings() {
  return {
    _type: 'siteSettings',
    _id: 'site-settings',
    title: 'Yuang Tong Portfolio',
    description: 'Full-stack developer and software engineer portfolio',
    author: 'Yuang Tong',
    social: {
      github: 'https://github.com/yuangtong',
      linkedin: 'https://linkedin.com/in/yuangtong',
      email: 'contact@yuangtong.dev'
    },
    seo: {
      metaTitle: 'Yuang Tong - Full Stack Developer',
      metaDescription: 'Portfolio of Yuang Tong, a full-stack developer specializing in React, Node.js, and modern web technologies.'
    }
  };
}

// Generate migration data
function generateMigrationData() {
  const migrationData = {
    projects: convertProjects(),
    blogs: convertBlogs(),
    siteSettings: createSiteSettings()
  };

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../sanity-migration');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write individual files for each content type
  fs.writeFileSync(
    path.join(outputDir, 'projects.json'),
    JSON.stringify(migrationData.projects, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'blogs.json'),
    JSON.stringify(migrationData.blogs, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'site-settings.json'),
    JSON.stringify(migrationData.siteSettings, null, 2)
  );

  // Write combined file
  fs.writeFileSync(
    path.join(outputDir, 'all-content.json'),
    JSON.stringify(migrationData, null, 2)
  );

  console.log('✅ Migration data generated successfully!');
  console.log('📁 Files created in:', outputDir);
  console.log('\n📋 Next steps:');
  console.log('1. Start your Sanity Studio: cd studio && npm run dev');
  console.log('2. Manually copy the content from the generated JSON files');
  console.log('3. Upload images separately to Sanity\'s asset management');
  console.log('4. Update image references in your content');
  console.log('\n💡 Tip: You can also use Sanity\'s import tools for bulk import');
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateMigrationData();
  } catch (error) {
    console.error('❌ Error generating migration data:', error);
    process.exit(1);
  }
}

export {
  convertProjects,
  convertBlogs,
  createSiteSettings,
  generateMigrationData
};