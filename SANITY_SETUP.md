# Sanity Headless CMS Setup Guide

This guide will help you set up Sanity headless CMS for your portfolio website.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Sanity account (free at [sanity.io](https://sanity.io))

## Step 1: Create a Sanity Project

1. Go to [sanity.io](https://sanity.io) and create a free account
2. Create a new project:
   ```bash
   cd studio
   npx sanity@latest init
   ```
3. Follow the prompts:
   - Choose "Create new project"
   - Give your project a name (e.g., "Portfolio CMS")
   - Choose "production" as your dataset name
   - Select "Clean project with no predefined schemas"

## Step 2: Install Studio Dependencies

```bash
cd studio
npm install
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Sanity project details:
   ```env
   VITE_SANITY_PROJECT_ID=your-actual-project-id
   VITE_SANITY_DATASET=production
   ```

3. Also update the `studio/sanity.config.ts` file with your project ID:
   ```typescript
   projectId: 'your-actual-project-id', // Replace with your actual project ID
   ```

## Step 4: Start the Sanity Studio

```bash
cd studio
npm run dev
```

The studio will be available at `http://localhost:3333`

## Step 5: Add Content

1. Open the Sanity Studio in your browser
2. Create some sample content:
   - **Projects**: Add your portfolio projects
   - **Blog Posts**: Add blog articles
   - **Site Settings**: Configure your site information

## Step 6: Update Your React Components

The following components have been set up to work with Sanity:

### Using Sanity Data in Components

```typescript
import { useProjects } from '../hooks/useSanity';

function Projects() {
  const { projects, loading, error } = useProjects();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Available Hooks

- `useProjects()` - Fetch all projects
- `useProject(slug)` - Fetch a single project by slug
- `useBlogs()` - Fetch all blog posts
- `useBlog(slug)` - Fetch a single blog post by slug
- `useSiteSettings()` - Fetch site settings

## Step 7: Deploy Sanity Studio (Optional)

To deploy your studio to Sanity's hosted platform:

```bash
cd studio
npm run deploy
```

This will give you a URL like `https://your-project.sanity.studio`

## Content Schema

### Project Schema
- Title (required)
- Slug (auto-generated from title)
- Short Description
- Full Description
- Project Image
- Technologies (array)
- Live URL
- GitHub URL
- Category
- Featured (boolean)
- Display Order

### Blog Schema
- Title (required)
- Slug (auto-generated from title)
- Excerpt
- Content
- Publication Date
- Read Time
- Category
- Featured Image
- Author
- Tags
- Published (boolean)

### Site Settings Schema
- Site Title
- Site Description
- Author Name
- Social Media Links
- SEO Settings

## Migration from Static Data

Your existing static data in `src/data/content.json` and `src/data/projects.ts` can be migrated to Sanity:

1. Copy the content from these files
2. Manually add them through the Sanity Studio interface
3. Once verified, you can remove the static files

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your domain is added to the CORS origins in your Sanity project settings
2. **Environment Variables**: Ensure all environment variables are properly set
3. **Node Version**: Sanity requires Node.js v18 or higher

### Getting Help

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Community](https://www.sanity.io/community)
- [Sanity Slack](https://slack.sanity.io/)

## Next Steps

1. **Rich Text**: Consider upgrading to Portable Text for rich content editing
2. **Image Optimization**: Implement Sanity's image transformation features
3. **Webhooks**: Set up webhooks for automatic deployment when content changes
4. **Preview Mode**: Implement draft preview functionality
5. **Internationalization**: Add multi-language support through Sanity

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- Consider using Sanity's built-in authentication for the studio
- Set up proper CORS origins in your Sanity project settings