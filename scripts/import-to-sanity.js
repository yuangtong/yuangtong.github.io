/**
 * Script to import data directly to Sanity using Sanity CLI
 * This creates documents directly in Sanity Studio
 */

import { createClient } from '@sanity/client';

// Sanity client configuration (read-only for now)
const client = createClient({
  projectId: 'sd7nr7vr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
});

// Sample data to create via Sanity Studio
const sampleProjects = [
  {
    _type: 'project',
    title: 'Personal Portfolio',
    slug: { _type: 'slug', current: 'personal-portfolio' },
    shortDescription: 'Modern and interactive portfolio website with dark mode and multilingual support',
    longDescription: 'A modern, responsive portfolio website built with React and TypeScript. Features a clean, minimalist design with interactive elements and smooth animations.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'React Router', 'Vite'],
    liveUrl: 'https://yuangtong.dev',
    githubUrl: 'https://github.com/yuangtong/yuangtong.github.io',
    category: 'web',
    featured: true,
    order: 1
  },
  {
    _type: 'project',
    title: 'Passguard: Password Generator',
    slug: { _type: 'slug', current: 'passguard-password-generator' },
    shortDescription: 'A bold web solution built with React',
    longDescription: 'Passguard is a robust password generation tool that empowers users to create secure and customizable passwords.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    liveUrl: 'https://yuangtong.github.io/passguard/',
    githubUrl: 'https://github.com/yuangtong/passguard',
    category: 'web',
    featured: true,
    order: 2
  }
];

const sampleWorks = [
  {
    _type: 'work',
    title: 'AI-Powered Analytics Dashboard',
    slug: { _type: 'slug', current: 'ai-analytics' },
    category: 'Web Application',
    description: 'Enterprise analytics platform with AI-driven insights and real-time data visualization.',
    awards: ['Best Enterprise Solution 2023'],
    tech: ['React', 'TypeScript', 'Python', 'TensorFlow'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    order: 1
  },
  {
    _type: 'work',
    title: 'Sustainable Fashion Marketplace',
    slug: { _type: 'slug', current: 'fashion-marketplace' },
    category: 'E-Commerce',
    description: 'Modern marketplace connecting eco-conscious fashion brands with consumers.',
    awards: ['Green Tech Award 2023'],
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    order: 2
  }
];

// Function to check current data
async function checkCurrentData() {
  try {
    console.log('🔍 Checking current Sanity data...');
    
    const projects = await client.fetch('*[_type == "project"]');
    const works = await client.fetch('*[_type == "work"]');
    
    console.log(`📦 Current projects: ${projects.length}`);
    console.log(`💼 Current works: ${works.length}`);
    
    if (projects.length > 0) {
      console.log('\n📦 Existing projects:');
      projects.forEach(p => console.log(`  - ${p.title}`));
    }
    
    if (works.length > 0) {
      console.log('\n💼 Existing works:');
      works.forEach(w => console.log(`  - ${w.title}`));
    }
    
    return { projects, works };
  } catch (error) {
    console.error('❌ Error checking current data:', error.message);
    return { projects: [], works: [] };
  }
}

// Function to generate GROQ queries for manual creation
function generateCreationQueries() {
  console.log('\n📋 Manual Creation Instructions:');
  console.log('\n1. Open Sanity Studio at http://localhost:3333');
  console.log('2. Navigate to the Projects or Works section');
  console.log('3. Click "Create new" and fill in the following data:');
  
  console.log('\n📦 PROJECTS TO CREATE:');
  console.log('=' .repeat(50));
  
  sampleProjects.forEach((project, index) => {
    console.log(`\n${index + 1}. ${project.title}`);
    console.log(`   Slug: ${project.slug.current}`);
    console.log(`   Short Description: ${project.shortDescription}`);
    console.log(`   Long Description: ${project.longDescription}`);
    console.log(`   Technologies: ${project.technologies.join(', ')}`);
    console.log(`   Live URL: ${project.liveUrl}`);
    console.log(`   GitHub URL: ${project.githubUrl}`);
    console.log(`   Category: ${project.category}`);
    console.log(`   Featured: ${project.featured}`);
    console.log(`   Order: ${project.order}`);
  });
  
  console.log('\n💼 WORKS TO CREATE:');
  console.log('=' .repeat(50));
  
  sampleWorks.forEach((work, index) => {
    console.log(`\n${index + 1}. ${work.title}`);
    console.log(`   Slug: ${work.slug.current}`);
    console.log(`   Category: ${work.category}`);
    console.log(`   Description: ${work.description}`);
    console.log(`   Awards: ${work.awards.join(', ')}`);
    console.log(`   Technologies: ${work.tech.join(', ')}`);
    console.log(`   Live URL: ${work.liveUrl}`);
    console.log(`   GitHub URL: ${work.githubUrl}`);
    console.log(`   Featured: ${work.featured}`);
    console.log(`   Order: ${work.order}`);
  });
  
  console.log('\n📸 IMAGE URLS TO UPLOAD:');
  console.log('=' .repeat(50));
  console.log('For Personal Portfolio: https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  console.log('For Passguard: https://images.unsplash.com/photo-1634804306598-f2efe3ead034?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  console.log('For AI Analytics: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500');
  console.log('For Fashion Marketplace: https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=500');
}

// Main function
async function main() {
  console.log('🎯 Sanity Data Import Helper');
  console.log('=' .repeat(50));
  
  await checkCurrentData();
  generateCreationQueries();
  
  console.log('\n✨ Next Steps:');
  console.log('1. Open http://localhost:3333 in your browser');
  console.log('2. Create the documents manually using the data above');
  console.log('3. Upload images from the provided URLs');
  console.log('4. Refresh your frontend to see the data');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { checkCurrentData, generateCreationQueries, sampleProjects, sampleWorks };