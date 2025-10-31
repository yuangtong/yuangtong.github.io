/**
 * Script to populate Sanity with static data from projects.ts and workData.ts
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity client configuration
const client = createClient({
  projectId: 'sd7nr7vr',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // You'll need to set this
  apiVersion: '2024-01-01'
});

// Static data
const projects = [
  {
    title: 'Personal Portfolio',
    description: 'Modern and interactive portfolio website with dark mode and multilingual support',
    fullDescription: `A modern, responsive portfolio website built with React and TypeScript. Features a clean, minimalist design with interactive elements and smooth animations.<br /><br />
    Key Features:<br />
    • Dark/Light mode toggle<br />
    • Multi-language support (EN/ES)<br />
    • Interactive cursor effects<br />
    • Smooth page transitions<br />
    • Responsive design<br />
    • Dynamic project showcase<br />
    • Blog integration`,
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
    fullDescription: `Passguard is a robust password generation tool that empowers users to create secure and customizable passwords.<br /><br />
    Key Features:<br />
    • Custom password length settings<br />
    • Multiple character type options<br />
    • Password strength indicator<br />
    • One-click copy functionality<br />
    • Secure password storage`,
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

// Helper function to upload image from URL
async function uploadImageFromUrl(imageUrl, title) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    const asset = await client.assets.upload('image', uint8Array, {
      filename: `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: title
    };
  } catch (error) {
    console.error(`Error uploading image for ${title}:`, error);
    return null;
  }
}

// Convert and upload projects
async function uploadProjects() {
  console.log('🚀 Starting to upload projects...');
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(`📦 Processing project: ${project.title}`);
    
    // Upload image
    const imageAsset = await uploadImageFromUrl(project.image, project.title);
    
    const sanityProject = {
      _type: 'project',
      title: project.title,
      slug: {
        _type: 'slug',
        current: project.slug
      },
      shortDescription: project.description,
      longDescription: project.fullDescription,
      image: imageAsset,
      technologies: project.tech,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      category: project.category,
      featured: true,
      order: i + 1
    };
    
    try {
      const result = await client.create(sanityProject);
      console.log(`✅ Created project: ${result.title}`);
    } catch (error) {
      console.error(`❌ Error creating project ${project.title}:`, error);
    }
  }
}

// Convert and upload works
async function uploadWorks() {
  console.log('🚀 Starting to upload works...');
  
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    console.log(`💼 Processing work: ${work.title}`);
    
    // Upload image
    const imageAsset = await uploadImageFromUrl(work.image, work.title);
    
    const sanityWork = {
      _type: 'work',
      title: work.title,
      slug: {
        _type: 'slug',
        current: work.slug
      },
      category: work.category,
      description: work.description,
      image: imageAsset,
      awards: work.awards,
      tech: work.tech,
      liveUrl: work.liveUrl,
      githubUrl: work.githubUrl,
      featured: true,
      order: i + 1
    };
    
    try {
      const result = await client.create(sanityWork);
      console.log(`✅ Created work: ${result.title}`);
    } catch (error) {
      console.error(`❌ Error creating work ${work.title}:`, error);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('🎯 Starting Sanity population...');
    
    // Check if token is provided
    if (!process.env.SANITY_AUTH_TOKEN) {
      console.error('❌ SANITY_AUTH_TOKEN environment variable is required');
      console.log('💡 Get your token from: https://sanity.io/manage');
      process.exit(1);
    }
    
    await uploadProjects();
    await uploadWorks();
    
    console.log('🎉 Successfully populated Sanity with static data!');
  } catch (error) {
    console.error('❌ Error populating Sanity:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { uploadProjects, uploadWorks };