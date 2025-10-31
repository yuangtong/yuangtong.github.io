import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Sanity client configuration
const client = createClient({
  projectId: 'sd7nr7vr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skEkDG5O476qftACaRw7WtsKvBvWVFuJwDYF3fCEVWBUvEv6LZeveNy0xvixzFiSYa6bvtbWmiA6gepUtB9cqKoi0d2l4OogqNjcdVgPO8kNkXMSzcJ6OWU8yenAb11j0MRAhV862RtGgvgiJrgA8pGJfd9O5f9V4eBSLzwb60VyZjUTvniG'
});

// Sample data to populate
const projectsData = [
  {
    _type: 'project',
    title: 'Personal Portfolio',
    slug: { current: 'personal-portfolio' },
    shortDescription: 'Modern and interactive portfolio website with dark mode and smooth animations.',
    longDescription: 'A comprehensive portfolio website showcasing my work and skills. Built with modern web technologies, featuring a responsive design, dark/light mode toggle, smooth animations, and an intuitive user interface. The site includes sections for projects, work experience, about me, and contact information.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Vite'],
    liveUrl: 'https://yuangtong.github.io',
    githubUrl: 'https://github.com/yuangtong/yuangtong.github.io',
    category: 'web',
    featured: true,
    order: 1
    // Note: Image should be uploaded manually in Sanity Studio
  },
  {
    _type: 'project',
    title: 'Passguard - Password Generator',
    slug: { current: 'passguard' },
    shortDescription: 'Secure password generation tool with customizable options.',
    longDescription: 'Passguard is a robust password generation tool that empowers users to create secure and customizable passwords.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    liveUrl: 'https://yuangtong.github.io/passguard/',
    githubUrl: 'https://github.com/yuangtong/passguard',
    category: 'web',
    featured: true,
    order: 2
    // Note: Image should be uploaded manually in Sanity Studio
  }
];

const worksData = [
  {
    _type: 'work',
    title: 'AI-Powered Analytics Dashboard',
    slug: { current: 'ai-analytics' },
    category: 'Web Application',
    description: 'Enterprise analytics platform with AI-driven insights and real-time data visualization.',
    awards: ['Best Enterprise Solution 2023'],
    tech: ['React', 'TypeScript', 'Python', 'TensorFlow'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    order: 1
    // Note: Image should be uploaded manually in Sanity Studio
  },
  {
    _type: 'work',
    title: 'Sustainable Fashion Marketplace',
    slug: { current: 'fashion-marketplace' },
    category: 'E-Commerce',
    description: 'Modern marketplace connecting eco-conscious fashion brands with consumers.',
    awards: ['Green Tech Award 2023'],
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    order: 2
    // Note: Image should be uploaded manually in Sanity Studio
  }
];

async function checkSanityConnection() {
  try {
    console.log('🔍 Checking Sanity connection...');
    const result = await client.fetch('*[_type == "project"] | order(_createdAt desc) [0...1]');
    console.log('✅ Connected to Sanity successfully');
    console.log(`📊 Current projects in database: ${result.length}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Sanity:', error.message);
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n🔑 You need to add a write token to the client configuration.');
      console.log('1. Go to https://sanity.io/manage');
      console.log('2. Select your project');
      console.log('3. Go to API > Tokens');
      console.log('4. Create a new token with Editor permissions');
      console.log('5. Add the token to this script\'s client configuration');
    }
    return false;
  }
}

async function populateProjects() {
  try {
    console.log('\n📝 Creating projects...');
    for (const project of projectsData) {
      const result = await client.create(project);
      console.log(`✅ Created project: ${project.title}`);
    }
    console.log('🎉 All projects created successfully!');
  } catch (error) {
    console.error('❌ Error creating projects:', error.message);
  }
}

async function populateWorks() {
  try {
    console.log('\n💼 Creating works...');
    for (const work of worksData) {
      const result = await client.create(work);
      console.log(`✅ Created work: ${work.title}`);
    }
    console.log('🎉 All works created successfully!');
  } catch (error) {
    console.error('❌ Error creating works:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Sanity Auto-Population Script\n');
  
  const isConnected = await checkSanityConnection();
  
  if (!isConnected) {
    console.log('\n❌ Cannot proceed without proper Sanity connection.');
    return;
  }

  // Check if data already exists
  const existingProjects = await client.fetch('*[_type == "project"]');
  const existingWorks = await client.fetch('*[_type == "work"]');
  
  console.log('\n📊 Current data in Sanity:');
  console.log(`   Projects: ${existingProjects.length}`);
  console.log(`   Works: ${existingWorks.length}`);
  
  // Only create projects if none exist
  if (existingProjects.length === 0) {
    await populateProjects();
  } else {
    console.log('\n✅ Projects already exist, skipping project creation.');
  }
  
  // Only create works if none exist
  if (existingWorks.length === 0) {
    await populateWorks();
  } else {
    console.log('\n✅ Works already exist, skipping work creation.');
  }
  
  console.log('\n✨ Sanity population completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to http://localhost:3333 to verify the data');
  console.log('2. Upload images for each document');
  console.log('3. Refresh your frontend at http://localhost:5174');
  
  console.log('\n📸 Image URLs to upload:');
  console.log('Personal Portfolio: https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  console.log('Passguard: https://images.unsplash.com/photo-1634804306598-f2efe3ead034?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  console.log('AI Analytics: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500');
  console.log('Fashion Marketplace: https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=500');
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { checkSanityConnection, populateProjects, populateWorks };