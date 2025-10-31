/**
 * Script to generate Sanity-compatible JSON data from static content
 * This generates files that can be imported manually into Sanity Studio
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static data
const projects = [
  {
    title: 'Personal Portfolio',
    description: 'Modern and interactive portfolio website with dark mode and multilingual support',
    fullDescription: `A modern, responsive portfolio website built with React and TypeScript. Features a clean, minimalist design with interactive elements and smooth animations.\n\nKey Features:\n• Dark/Light mode toggle\n• Multi-language support (EN/ES)\n• Interactive cursor effects\n• Smooth page transitions\n• Responsive design\n• Dynamic project showcase\n• Blog integration`,
    image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'React Router', 'Vite'],
    liveUrl: 'https://yuangtong.dev',
    githubUrl: 'https://github.com/yuangtong/yuangtong.github.io',
    slug: 'personal-portfolio',
    category: 'web'
  },
  {
    title: 'Passguard: Password Generator',
    description: 'A bold web solution built with React',
    fullDescription: `Passguard is a robust password generation tool that empowers users to create secure and customizable passwords.\n\nKey Features:\n• Custom password length settings\n• Multiple character type options\n• Password strength indicator\n• One-click copy functionality\n• Secure password storage`,
    image: 'https://images.unsplash.com/photo-1634804306598-f2efe3ead034?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    liveUrl: 'https://yuangtong.github.io/passguard/',
    githubUrl: 'https://github.com/yuangtong/passguard',
    slug: 'passguard-password-generator',
    category: 'web'
  }
];

const works = [
  {
    slug: 'ai-analytics',
    title: 'AI-Powered Analytics Dashboard',
    category: 'Web Application',
    description: 'Enterprise analytics platform with AI-driven insights and real-time data visualization.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
    awards: ['Best Enterprise Solution 2023'],
    tech: ['React', 'TypeScript', 'Python', 'TensorFlow'],
    liveUrl: '#',
    githubUrl: '#',
    fullDescription: 'A comprehensive analytics platform that leverages AI to provide actionable insights.'
  },
  {
    slug: 'fashion-marketplace',
    title: 'Sustainable Fashion Marketplace',
    category: 'E-Commerce',
    description: 'Modern marketplace connecting eco-conscious fashion brands with consumers.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=500',
    awards: ['Green Tech Award 2023'],
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
    fullDescription: 'An innovative marketplace focused on sustainable and ethical fashion.'
  }
];

// Generate unique IDs
function generateId(type, index) {
  return `${type}-${Date.now()}-${index}`;
}

// Convert projects to Sanity format
function convertProjects() {
  return projects.map((project, index) => ({
    _id: generateId('project', index),
    _type: 'project',
    title: project.title,
    slug: {
      _type: 'slug',
      current: project.slug
    },
    shortDescription: project.description,
    longDescription: project.fullDescription,
    // For manual import, we'll use external URLs directly
    // In production, these should be uploaded as Sanity assets
    imageUrl: project.image, // Temporary field for reference
    technologies: project.tech,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    category: project.category,
    featured: true,
    order: index + 1,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString()
  }));
}

// Convert works to Sanity format
function convertWorks() {
  return works.map((work, index) => ({
    _id: generateId('work', index),
    _type: 'work',
    title: work.title,
    slug: {
      _type: 'slug',
      current: work.slug
    },
    category: work.category,
    description: work.description,
    // For manual import, we'll use external URLs directly
    // In production, these should be uploaded as Sanity assets
    imageUrl: work.image, // Temporary field for reference
    awards: work.awards,
    tech: work.tech,
    liveUrl: work.liveUrl,
    githubUrl: work.githubUrl,
    featured: true,
    order: index + 1,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString()
  }));
}

// Generate all data
function generateAllData() {
  const sanityProjects = convertProjects();
  const sanityWorks = convertWorks();
  
  const outputDir = path.join(__dirname, '..', 'sanity-data');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write projects data
  fs.writeFileSync(
    path.join(outputDir, 'projects.json'),
    JSON.stringify(sanityProjects, null, 2)
  );
  
  // Write works data
  fs.writeFileSync(
    path.join(outputDir, 'works.json'),
    JSON.stringify(sanityWorks, null, 2)
  );
  
  // Write combined data
  const allData = {
    projects: sanityProjects,
    works: sanityWorks
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'all-data.json'),
    JSON.stringify(allData, null, 2)
  );
  
  console.log('✅ Generated Sanity data files:');
  console.log(`📁 ${path.join(outputDir, 'projects.json')}`);
  console.log(`📁 ${path.join(outputDir, 'works.json')}`);
  console.log(`📁 ${path.join(outputDir, 'all-data.json')}`);
  console.log('');
  console.log('📋 Instructions:');
  console.log('1. Open Sanity Studio at http://localhost:3333');
  console.log('2. Go to Vision (query tool)');
  console.log('3. Use the import feature or manually create documents');
  console.log('4. For images, you\'ll need to upload them manually and replace imageUrl with proper image references');
  
  return { projects: sanityProjects, works: sanityWorks };
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateAllData();
  } catch (error) {
    console.error('❌ Error generating Sanity data:', error);
    process.exit(1);
  }
}

export { convertProjects, convertWorks, generateAllData };