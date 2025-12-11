# CLAUDE.md - AI Assistant Guide for yuangtong.github.io

**Last Updated:** 2025-12-11
**Repository:** yuangtong.github.io (Personal Portfolio Website)
**Domain:** yuangtong.dev
**Stack:** React 18 + TypeScript 5 + Vite 5 + TailwindCSS + Netlify

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start Commands](#quick-start-commands)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Directory Structure](#directory-structure)
5. [Development Workflows](#development-workflows)
6. [Code Conventions & Patterns](#code-conventions--patterns)
7. [Testing Guidelines](#testing-guidelines)
8. [Component Guidelines](#component-guidelines)
9. [State Management](#state-management)
10. [Styling Conventions](#styling-conventions)
11. [Common Tasks & Examples](#common-tasks--examples)
12. [Integration Points](#integration-points)
13. [Performance Considerations](#performance-considerations)
14. [Troubleshooting](#troubleshooting)
15. [AI Assistant Best Practices](#ai-assistant-best-practices)

---

## Project Overview

This is a modern portfolio website showcasing a designer/developer's work with a bold, brutalist-inspired design aesthetic. The site features:

- **Single Page Application (SPA)** with React Router
- **Dark mode support** with theme toggle
- **Multilingual capabilities** (EN/ES) via DeepL translation
- **3D graphics** using Three.js and React Three Fiber
- **Progressive Web App (PWA)** with service worker
- **Serverless functions** on Netlify for translation API
- **Content management** via static JSON (ready for CMS migration)

**Current State:**
- Production-ready static site
- Contentful CMS integration prepared but not implemented
- Supabase database integration prepared but not implemented
- ~1,819 lines of TypeScript/JavaScript code
- 80+ component/page files
- 8 test files with Vitest

---

## Quick Start Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:5173

# Building
npm run build            # Production build to /dist
npm run preview          # Preview production build locally

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Lint all files with ESLint

# Git workflow (always use the claude/* branch)
git status               # Check current state
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push -u origin claude/claude-md-mj141udinz2c8bvc-018K3sYvwwqeiZkx6o4JuM8U
```

**Important:** Always develop on the branch `claude/claude-md-mj141udinz2c8bvc-018K3sYvwwqeiZkx6o4JuM8U`

---

## Architecture & Technology Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI library with hooks and StrictMode |
| **Language** | TypeScript | 5.5.3 | Type safety with strict mode |
| **Build Tool** | Vite | 5.4.2 | Fast dev server and bundler |
| **Routing** | React Router | 6.22.3 | Client-side routing |
| **Styling** | TailwindCSS | 3.4.1 | Utility-first CSS with dark mode |
| **Testing** | Vitest | 1.6.0 | Vite-native test runner |
| **Deployment** | Netlify | - | Hosting + serverless functions |

### Key Libraries

**UI & Animation:**
- `framer-motion@11.18.2` - Component animations and transitions
- `gsap@3.13.0` - Advanced timeline animations
- `react-type-animation@3.2.0` - Typing effects

**3D Graphics:**
- `three@0.173.0` - 3D graphics engine
- `@react-three/fiber@8.18.0` - React renderer for Three.js
- `@react-three/drei@9.122.0` - Three.js helpers
- `react-globe.gl@2.27.1` - Interactive globe component

**Icons & Assets:**
- `@fortawesome/react-fontawesome@3.1.0` - FontAwesome icons
- `lucide-react@0.344.0` - Modern icon set

**Backend Integration (Ready):**
- `axios@1.8.1` - HTTP client
- `deepl-node@1.16.0` - Translation service
- Contentful SDK (not yet installed)
- Supabase SDK (not yet installed)

### Build Configuration

**Vite Features in Use:**
- **Advanced code splitting** - Manual chunk strategy to prevent TDZ errors
- **Dependency pre-bundling** - React, Three.js, FontAwesome pre-bundled
- **React deduplication** - Ensures single React instance
- **PWA plugin** - Service worker with 6MB cache limit
- **Image optimization** - vite-imagemin (disabled in CI)
- **Bundle analysis** - Rollup visualizer plugin

---

## Directory Structure

```
/home/user/yuangtong.github.io/
├── public/                      # Static assets (copied to /dist as-is)
│   ├── Yuang-Tong-CV.pdf       # Resume file
│   ├── social-preview.jpg      # OpenGraph image (1200x630)
│   ├── _headers                # Netlify security headers
│   └── _redirects              # Netlify routing rules
│
├── netlify/
│   └── functions/              # Serverless functions
│       └── translate.js        # DeepL translation proxy
│
├── src/
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Root component with routes
│   ├── index.css               # Global styles
│   │
│   ├── components/             # React components (3-tier architecture)
│   │   ├── Feature/            # Feature-specific modals
│   │   │   ├── CVDownloadModal.tsx
│   │   │   └── WhatsAppConsultationModal.tsx
│   │   ├── layout/             # Layout wrappers
│   │   │   ├── Layout.tsx      # Main layout (Header + Footer)
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── FlyoutNav.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── sections/           # Page sections (Home page)
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── Work.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/                 # Reusable UI atoms
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── ContentCard.tsx      # Unified card component
│   │       ├── ContentDetail.tsx    # Unified detail view
│   │       ├── NavigationBar.tsx
│   │       ├── BackButton.tsx
│   │       ├── Cursor.tsx
│   │       └── ... (20+ more components)
│   │
│   ├── pages/                  # Route pages
│   │   ├── Home.tsx            # Main landing page
│   │   ├── blog/               # Blog routes
│   │   │   ├── BlogPage.tsx    # Blog archive
│   │   │   └── BlogPost.tsx    # Blog post detail
│   │   ├── projects/           # Project routes
│   │   │   ├── ProjectsPage.tsx
│   │   │   └── ProjectDetails.tsx
│   │   ├── work/               # Work routes
│   │   │   ├── WorkPage.tsx
│   │   │   └── WorkDetails.tsx
│   │   └── payment/
│   │       └── PaymentsPage.tsx
│   │
│   ├── context/                # React Context providers
│   │   ├── ThemeContext.tsx    # Dark/light theme
│   │   └── TranslationContext.tsx  # Language & translation
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useContent.ts       # Fetch from content.json
│   │   ├── useCVTimeline.ts    # Timeline with translation
│   │   ├── useScrollReveal.ts  # Intersection Observer animations
│   │   ├── useScrollActive.ts  # Active section detection
│   │   ├── useMousePosition.ts # Mouse tracking
│   │   └── ... (15+ more hooks)
│   │
│   ├── services/               # External service integrations
│   │   ├── contentful.ts       # Contentful CMS (stub)
│   │   ├── supabase.ts         # Supabase DB (stub)
│   │   ├── translateService.ts # DeepL translation
│   │   ├── whatsapp.ts         # WhatsApp integration
│   │   └── geo.ts              # Geolocation
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts            # Common types
│   │   ├── cv.ts               # CV-related types
│   │   ├── contentful.ts       # CMS types
│   │   └── supabase.ts         # Database types
│   │
│   ├── data/                   # Static content
│   │   ├── content.json        # Blogs, projects, works, testimonials
│   │   └── timeline.ts         # Career timeline data
│   │
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts        # App-wide constants
│   │   ├── performance.ts      # Performance utilities
│   │   └── sanitize.ts         # Input sanitization
│   │
│   ├── docs/                   # Internal documentation
│   │   ├── CMSFundamentals.md
│   │   ├── CMSWorkflow-SPA-PWA.md
│   │   ├── ContentfulModels.md
│   │   ├── HomeGridScroll.md
│   │   ├── Navigation.md
│   │   ├── ProductionInitError.md
│   │   └── WhatsAppConsultation.md
│   │
│   └── test/                   # Test setup
│       └── setup.ts            # Vitest global setup
│
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── netlify.toml                # Netlify configuration
├── IMPLEMENTATION_GUIDE.md     # CMS integration guide
└── CLAUDE.md                   # This file
```

### Key File Locations

| Task | File Location | Notes |
|------|---------------|-------|
| Add new page | `src/pages/` | Create component + add route in App.tsx |
| Add new section | `src/components/sections/` | Use in Home.tsx or other pages |
| Add reusable component | `src/components/ui/` | Export from index.ts |
| Add custom hook | `src/hooks/` | Follow `use` prefix convention |
| Add content | `src/data/content.json` | Static content source |
| Add types | `src/types/` | Organize by domain |
| Add service | `src/services/` | External API integrations |
| Add tests | `**/__tests__/` | Co-located with components |

---

## Development Workflows

### 1. Adding a New Page

```typescript
// 1. Create page component in src/pages/
// src/pages/NewPage.tsx
import React from 'react';
import { NavigationBar } from '@/components/ui';

export default function NewPage() {
  return (
    <main className="min-h-screen pt-20">
      <NavigationBar topClass="top-14 sm:top-16 md:top-20" />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold">New Page</h1>
      </div>
    </main>
  );
}

// 2. Add route in src/App.tsx
import NewPage from './pages/NewPage';

<Routes>
  <Route path="/new-page" element={<NewPage />} />
  {/* ... other routes */}
</Routes>

// 3. Add navigation link in src/components/layout/Header.tsx
<Link to="/new-page" className="hover:text-pink-500 transition-colors">
  New Page
</Link>
```

### 2. Adding New Content

```typescript
// Edit src/data/content.json
{
  "blogs": [
    {
      "id": "new-blog-id",
      "slug": "new-blog-post",
      "title": "New Blog Post",
      "excerpt": "Brief description...",
      "content": "Full content here...",
      "date": "2025-12-11",
      "author": "Yuang Tong",
      "tags": ["design", "development"],
      "image": "/images/blog/new-post.jpg",
      "readTime": "5 min"
    }
  ]
}

// Content is automatically available via useContent hook
const { items, getItemBySlug } = useContent<BlogPost>('blogs');
```

### 3. Creating a New Component

```typescript
// src/components/ui/NewComponent.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface NewComponentProps {
  title: string;
  description?: string;
  className?: string;
}

export default function NewComponent({
  title,
  description,
  className = ''
}: NewComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border-4 border-black dark:border-white ${className}`}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      {description && <p className="mt-2">{description}</p>}
    </motion.div>
  );
}

// Export from src/components/ui/index.ts
export { default as NewComponent } from './NewComponent';

// Usage
import { NewComponent } from '@/components/ui';
<NewComponent title="Hello" description="World" />
```

### 4. Adding a Custom Hook

```typescript
// src/hooks/useNewHook.ts
import { useState, useEffect } from 'react';

export function useNewHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, [initialValue]);

  return { value, setValue, loading };
}

// Usage in component
import { useNewHook } from '@/hooks/useNewHook';

function MyComponent() {
  const { value, setValue, loading } = useNewHook('initial');
  // ...
}
```

### 5. Writing Tests

```typescript
// src/components/ui/__tests__/NewComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewComponent from '../NewComponent';

describe('NewComponent', () => {
  it('renders title correctly', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<NewComponent title="Test" description="Description text" />);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <NewComponent title="Test" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

---

## Code Conventions & Patterns

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ContentCard.tsx` |
| Hooks | camelCase with `use` prefix | `useContent.ts` |
| Services | camelCase | `translateService.ts` |
| Types | camelCase | `contentful.ts` |
| Constants | camelCase | `constants.ts` |
| Tests | Component name + `.test.tsx` | `BackButton.test.tsx` |
| CSS Modules | Component name + `.module.css` | `TimelineItem.module.css` |

### Import Organization

Always organize imports in this order:

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// 3. Internal components
import { Button, Modal } from '@/components/ui';

// 4. Hooks
import { useContent } from '@/hooks/useContent';

// 5. Context
import { useTheme } from '@/context/ThemeContext';

// 6. Types
import type { Project } from '@/types';

// 7. Utils and constants
import { DISPLAY_CONFIG } from '@/utils/constants';

// 8. Styles (if any)
import './styles.css';
```

### TypeScript Patterns

**Always use interfaces for component props:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant,
  size = 'md',
  onClick,
  disabled = false,
  children,
  className = ''
}: ButtonProps) {
  // Implementation
}
```

**Use const assertions for constants:**
```typescript
export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  WORK: '/work',
  BLOG: '/blog',
} as const;

export const DISPLAY_CONFIG = {
  HOME_PROJECTS_LIMIT: 6,
  HOME_WORKS_LIMIT: 2,
  HOME_BLOGS_LIMIT: 6,
} as const;
```

**Export types alongside implementations:**
```typescript
export interface ContentCardProps {
  type: 'blog' | 'project' | 'work';
  item: BlogPost | Project | Work;
  className?: string;
}

export default function ContentCard({ type, item, className }: ContentCardProps) {
  // Implementation
}

// Alternative: export type separately
export type { ContentCardProps };
```

### Component Patterns

**1. Barrel Exports (index.ts pattern):**
```typescript
// src/components/ui/index.ts
export { default as Button } from './Button';
export { default as Modal } from './Modal';
export { ContentCard } from './ContentCard';
export { ContentDetail } from './ContentDetail';

// Usage - clean imports
import { Button, Modal, ContentCard } from '@/components/ui';
```

**2. Unified Content Components:**
```typescript
// Single component handles multiple content types
<ContentCard
  type="blog" | "project" | "work"
  item={item}
/>

<ContentDetail
  type="blog" | "project" | "work"
  item={item}
/>
```

**3. Layout Wrapper Pattern:**
```typescript
// All pages wrapped in consistent layout
<Layout>
  <Routes>
    <Route path="/" element={<Home />} />
    {/* ... */}
  </Routes>
</Layout>
```

**4. Custom Hooks for Logic Separation:**
```typescript
// Component focuses on UI
function Timeline() {
  const { milestones, loading } = useCVTimeline();

  if (loading) return <Spinner />;

  return (
    <div>
      {milestones.map(milestone => (
        <TimelineItem key={milestone.id} {...milestone} />
      ))}
    </div>
  );
}

// Hook handles business logic
export function useCVTimeline() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, translate } = useTranslation();

  useEffect(() => {
    // Fetch and translate logic
  }, [language]);

  return { milestones, loading };
}
```

**5. Context for Global State:**
```typescript
// Define context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage in component
const { isDark, toggleTheme } = useTheme();
```

### Error Handling

**Multi-layer approach:**

```typescript
// 1. Error Boundary (main.tsx)
<ErrorBoundary>
  <App />
</ErrorBoundary>

// 2. Component-level error states
function MyComponent() {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Normal render
}

// 3. Service-level try-catch
export async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

---

## Testing Guidelines

### Test Setup

**Configuration Location:** `vite.config.ts` + `src/test/setup.ts`

**Available Matchers:** All `@testing-library/jest-dom` matchers
- `toBeInTheDocument()`
- `toHaveClass()`
- `toHaveTextContent()`
- `toBeVisible()`
- etc.

**Global Mocks:** IntersectionObserver is mocked globally

### Test Organization

**Co-locate tests with components:**
```
src/components/ui/
├── Button.tsx
└── __tests__/
    └── Button.test.tsx
```

### Testing Patterns

**1. Component Rendering Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

**2. Interaction Tests:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**3. Hook Tests:**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useContent } from '../useContent';

it('fetches content successfully', async () => {
  const { result } = renderHook(() => useContent('blogs'));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.items).toHaveLength(3);
});
```

**4. Tests with Context:**
```typescript
import { TranslationProvider } from '@/context/TranslationContext';

it('translates content correctly', async () => {
  render(
    <TranslationProvider language="es">
      <MyComponent />
    </TranslationProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/traducido/i)).toBeInTheDocument();
  });
});
```

**5. Mocking Modules:**
```typescript
import { vi } from 'vitest';

vi.mock('@/data/timeline', () => ({
  timeline: [
    { id: '1', title: 'Test Milestone', year: 2020 }
  ]
}));
```

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode for development
```

---

## Component Guidelines

### Accessibility Requirements

**Always include:**
- Semantic HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus indicators (visible focus states)
- Alt text for images

**Example:**
```typescript
<button
  onClick={handleClick}
  aria-label="Close modal"
  className="focus:outline-none focus:ring-2 focus:ring-pink-500"
>
  <X aria-hidden="true" />
</button>

<img
  src="/image.jpg"
  alt="Description of image content"
  loading="lazy"
/>
```

### Responsive Design

**Mobile-first approach:**
```typescript
className="
  // Mobile (default)
  flex flex-col px-4 text-sm

  // Tablet (md: 768px+)
  md:flex-row md:px-6 md:text-base

  // Desktop (lg: 1024px+)
  lg:px-8 lg:text-lg

  // Large Desktop (xl: 1280px+)
  xl:max-w-7xl xl:mx-auto
"
```

### Dark Mode Support

**Always provide dark mode variants:**
```typescript
className="
  bg-white dark:bg-gray-900
  text-black dark:text-white
  border-black dark:border-gray-600
  hover:bg-gray-100 dark:hover:bg-gray-800
"
```

**Use theme context when needed:**
```typescript
const { isDark } = useTheme();

return (
  <div className={isDark ? 'dark-specific-class' : 'light-specific-class'}>
    {/* Content */}
  </div>
);
```

### Animation Best Practices

**Use Framer Motion for most animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Content
</motion.div>
```

**Use GSAP for complex timeline animations:**
```typescript
useEffect(() => {
  const timeline = gsap.timeline();
  timeline
    .to('.element1', { opacity: 1, duration: 0.5 })
    .to('.element2', { x: 100, duration: 0.5 })
    .to('.element3', { rotation: 360, duration: 1 });

  return () => timeline.kill();
}, []);
```

**CSS transitions for simple hover states:**
```typescript
className="transition-colors duration-300 hover:text-pink-500"
```

### Performance Considerations

**1. Lazy load images:**
```typescript
<img src="/image.jpg" loading="lazy" alt="..." />
```

**2. Use IntersectionObserver for animations:**
```typescript
const { ref, isVisible } = useScrollReveal();

return (
  <div ref={ref} className={isVisible ? 'animate-fade-in' : 'opacity-0'}>
    Content
  </div>
);
```

**3. Memoize expensive computations:**
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

**4. Debounce frequent events:**
```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);
```

---

## State Management

### Context API Pattern

**Global state is managed through Context API:**

1. **ThemeContext** - Dark/light mode
2. **TranslationContext** - Language and translation

### Creating a New Context

```typescript
// 1. Define types
interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

// 2. Create context
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Create provider
export function MyProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('initial');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// 4. Create custom hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}

// 5. Add to provider tree (main.tsx)
<MyProvider>
  <App />
</MyProvider>

// 6. Use in components
const { value, setValue } = useMyContext();
```

### Local State

**Use useState for component-specific state:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

**Use useReducer for complex state:**
```typescript
type State = { count: number; loading: boolean };
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_LOADING'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, loading: false });
```

### Data Fetching

**Current approach: Static JSON via custom hook**
```typescript
const { items, getItemBySlug, loading } = useContent<BlogPost>('blogs');
```

**Future CMS approach (when implemented):**
```typescript
// Will use same hook interface, different implementation
const { items, getItemBySlug, loading } = useContent<BlogPost>('blogs');
// Behind the scenes, this will call Contentful API
```

---

## Styling Conventions

### TailwindCSS Configuration

**Custom theme extensions in `tailwind.config.js`:**
- Font families: `font-sans` (Inter), `font-mono` (JetBrains Mono)
- Custom animations: `animate-bounce-slow`
- Dark mode: Class-based (`dark:` prefix)

### Design System Colors

**Light Mode:**
- Primary accent: `pink-500`
- Secondary: `yellow-300`
- Background: `white`
- Text: `black`
- Borders: `black`

**Dark Mode:**
- Primary accent: `purple-400`
- Secondary: `indigo-500`
- Background: `gray-900`
- Text: `white`
- Borders: `gray-600`

### Brutalist Design Aesthetic

**Key characteristics to maintain:**

```typescript
// Heavy borders
className="border-4 border-black dark:border-white"

// Hard shadows (not soft)
className="shadow-[8px_8px_0_#0B1220]"

// Bold typography
className="text-6xl font-bold tracking-tight"

// High contrast
className="bg-white text-black dark:bg-gray-900 dark:text-white"

// Sharp corners (avoid rounded)
className="rounded-none"  // or just omit rounded classes
```

### Component Spacing

**Use consistent spacing scale:**
```typescript
// Padding
className="p-4 md:p-6 lg:p-8"

// Margin
className="mt-4 md:mt-6 lg:mt-8"

// Gap (for flexbox/grid)
className="gap-4 md:gap-6 lg:gap-8"
```

### Global CSS Utilities

**Available in `src/index.css`:**

```css
/* Hide scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Touch scrolling */
.horizontal-scroll-touch {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

---

## Common Tasks & Examples

### Task 1: Add a New Blog Post

```json
// Edit src/data/content.json
{
  "blogs": [
    {
      "id": "unique-id",
      "slug": "url-friendly-slug",
      "title": "Blog Post Title",
      "excerpt": "Brief description for cards...",
      "content": "Full blog content here. Can include markdown-style formatting.",
      "date": "2025-12-11",
      "author": "Yuang Tong",
      "tags": ["tag1", "tag2"],
      "image": "/images/blog/image.jpg",
      "readTime": "5 min"
    }
  ]
}
```

**The blog will automatically appear:**
- On home page (if within HOME_BLOGS_LIMIT)
- On /blog archive page
- At /blog/url-friendly-slug detail page

### Task 2: Add a New Project

```json
// Edit src/data/content.json
{
  "projects": [
    {
      "id": "project-id",
      "slug": "project-slug",
      "title": "Project Title",
      "description": "Brief description...",
      "longDescription": "Detailed project description...",
      "image": "/images/projects/cover.jpg",
      "images": [
        "/images/projects/image1.jpg",
        "/images/projects/image2.jpg"
      ],
      "technologies": ["React", "TypeScript", "TailwindCSS"],
      "category": "Web Development",
      "year": "2025",
      "client": "Client Name",
      "role": "Full Stack Developer",
      "duration": "3 months",
      "challenge": "What was the challenge...",
      "solution": "How you solved it...",
      "results": "What were the results...",
      "link": "https://example.com",
      "github": "https://github.com/user/repo"
    }
  ]
}
```

### Task 3: Modify Navigation

```typescript
// Edit src/components/layout/Header.tsx
const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/work', label: 'Trabajo' },
  { to: '/blog', label: 'Blog' },
  { to: '/new-page', label: 'New Page' },  // Add new link
];
```

### Task 4: Change Display Limits

```typescript
// Edit src/utils/constants.ts
export const DISPLAY_CONFIG = {
  HOME_PROJECTS_LIMIT: 9,    // Changed from 6
  HOME_WORKS_LIMIT: 3,        // Changed from 2
  HOME_BLOGS_LIMIT: 9,        // Changed from 6
} as const;
```

### Task 5: Add New Section to Home Page

```typescript
// 1. Create section component
// src/components/sections/NewSection.tsx
export default function NewSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">New Section</h2>
        {/* Content */}
      </div>
    </section>
  );
}

// 2. Add to Home page
// src/pages/Home.tsx
import NewSection from '@/components/sections/NewSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Timeline />
      <NewSection />  {/* Add here */}
      <Work />
      <Projects />
      <Blog />
      <Testimonials />
    </main>
  );
}
```

### Task 6: Add Environment Variable

```bash
# 1. Create .env file (gitignored)
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_token

# 2. Use in code
const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;

# 3. Add to Netlify dashboard
# Settings > Environment variables > Add variable
```

### Task 7: Implement CMS Integration

```bash
# 1. Install Contentful
npm install contentful @contentful/rich-text-react-renderer

# 2. Update service (src/services/contentful.ts)
import { createClient } from 'contentful';

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

export async function getBlogs() {
  const response = await client.getEntries({ content_type: 'blogPost' });
  return response.items;
}

# 3. Update useContent hook to fetch from Contentful
# 4. Test locally
# 5. Deploy with environment variables
```

---

## Integration Points

### Contentful CMS (Ready, Not Implemented)

**Files:**
- Service: `src/services/contentful.ts` (stub)
- Types: `src/types/contentful.ts`
- Docs: `src/docs/ContentfulModels.md`
- Implementation guide: `IMPLEMENTATION_GUIDE.md`

**To implement:**
1. Install: `npm install contentful @contentful/rich-text-react-renderer`
2. Add environment variables to `.env` and Netlify
3. Update service methods in `contentfulService.ts`
4. Update `useContent` hook to call service
5. Test and deploy

**Content models defined:**
- BlogPost
- Project
- WorkExperience
- Testimonial
- Author
- Tag/Category

### Supabase Database (Ready, Not Implemented)

**Files:**
- Service: `src/services/supabase.ts` (stub)
- Types: `src/types/supabase.ts`
- Implementation guide: `IMPLEMENTATION_GUIDE.md`

**To implement:**
1. Install: `npm install @supabase/supabase-js`
2. Create Supabase project
3. Run SQL schemas from implementation guide
4. Add environment variables
5. Update service methods
6. Connect forms to database

**Tables defined:**
- contact_form_entries
- cv_download_entries
- analytics_entries
- subscribers

### DeepL Translation (Implemented)

**Files:**
- Service: `src/services/translateService.ts`
- Netlify function: `netlify/functions/translate.js`
- Context: `src/context/TranslationContext.tsx`

**Usage:**
```typescript
const { language, setLanguage, translate } = useTranslation();

// Change language
setLanguage('es');

// Translate text
const translated = await translate('Hello World');
```

**Environment variable needed:**
- `DEEPL_API_KEY` (in Netlify dashboard)

### WhatsApp Integration (Implemented)

**Files:**
- Service: `src/services/whatsapp.ts`
- Hook: `src/hooks/useWhatsAppLink.ts`
- Modal: `src/components/Feature/WhatsAppConsultationModal.tsx`
- Docs: `src/docs/WhatsAppConsultation.md`

**Usage:**
```typescript
const whatsappLink = useWhatsAppLink({
  message: 'Hello, I want to discuss a project',
  phoneNumber: '+1234567890'
});

// Open WhatsApp
window.open(whatsappLink, '_blank');
```

---

## Performance Considerations

### Build Optimization

**Vite configuration includes:**

1. **Code Splitting Strategy**
   - React core in separate chunk (loaded first)
   - Vendor chunks by library (Three.js, FontAwesome, etc.)
   - Prevents Temporal Dead Zone (TDZ) errors

2. **Tree Shaking**
   - Automatic dead code elimination
   - Import only what you use

3. **Minification**
   - esbuild for fast minification
   - CSS minification enabled

4. **Asset Optimization**
   - Image optimization (production only)
   - Font subsetting
   - SVG optimization

### Runtime Performance

**Best practices:**

```typescript
// 1. Memoize expensive calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.date - b.date);
}, [items]);

// 2. Memoize callback functions
const handleClick = useCallback(() => {
  performAction(id);
}, [id]);

// 3. Use IntersectionObserver for lazy loading
const { ref, isVisible } = useScrollReveal();

// 4. Debounce frequent events
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);

// 5. Lazy load images
<img src="/image.jpg" loading="lazy" alt="..." />

// 6. Avoid unnecessary re-renders
const MemoizedComponent = React.memo(Component);
```

### Bundle Size

**Monitor with:**
```bash
npm run build
# Check stats.html generated by visualizer plugin
```

**Current chunk limits:**
- Warning threshold: 1500 KB
- Large dependencies: Three.js, React, FontAwesome

**Optimization strategies:**
- Use tree-shakeable imports: `import { Icon } from 'lucide-react'`
- Avoid importing entire libraries
- Consider lazy loading heavy features

---

## Troubleshooting

### Common Issues

**1. Build fails with "ReferenceError: Cannot access before initialization"**

**Cause:** React accessed before initialization (TDZ error)

**Solution:** Already fixed in `vite.config.ts` with manual chunks strategy. If issue persists, check that React is in `react-core` chunk.

---

**2. Dark mode not working**

**Check:**
- `<html>` element has `dark` class
- TailwindCSS config has `darkMode: 'class'`
- Components use `dark:` prefix correctly

```typescript
// Correct usage
className="bg-white dark:bg-gray-900"
```

---

**3. Translation not working**

**Check:**
- Netlify function deployed: `/.netlify/functions/translate`
- Environment variable set: `DEEPL_API_KEY`
- Network tab shows successful request
- No CORS errors

---

**4. Images not loading**

**Check:**
- Images in `/public/` directory
- Path starts with `/` (e.g., `/images/photo.jpg`)
- Image file exists
- No typos in path

---

**5. Tests failing with "Cannot find module"**

**Solution:**
```typescript
// Add to vitest.config.ts or vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

**6. Scroll animations not triggering**

**Check:**
- IntersectionObserver is mocked in tests
- `useScrollReveal` hook is used correctly
- Element has `ref` attached
- Element is in viewport

---

**7. Build works locally but fails on Netlify**

**Check:**
- All environment variables set in Netlify
- Node version matches local (`package.json` engines field)
- Build command is correct: `npm run build`
- Publish directory is `dist`
- No missing dependencies

---

## AI Assistant Best Practices

### When Making Changes

1. **Always read files before editing** - Never propose changes to code you haven't read
2. **Understand existing patterns** - Follow the conventions already in place
3. **Test your changes** - Write tests for new components/features
4. **Update documentation** - Keep docs in sync with code
5. **Check for side effects** - Consider impact on other components
6. **Maintain type safety** - Add proper TypeScript types
7. **Follow accessibility guidelines** - Include ARIA labels, semantic HTML
8. **Support dark mode** - Add dark: variants for all styles
9. **Keep it responsive** - Use mobile-first approach

### Code Quality Checklist

Before completing a task, verify:

- [ ] TypeScript types are correct (no `any` unless necessary)
- [ ] Component has proper props interface
- [ ] Dark mode variants included
- [ ] Responsive breakpoints added (mobile-first)
- [ ] Accessibility attributes present (ARIA, alt text)
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Tests written (if applicable)
- [ ] No console.logs left in code
- [ ] Imports organized correctly
- [ ] Code follows existing patterns
- [ ] No unused variables/imports
- [ ] Comments added for complex logic

### Don't Over-Engineer

**Avoid:**
- Creating abstractions for one-time use
- Adding features not requested
- Refactoring code not related to the task
- Adding comments for self-evident code
- Creating utilities for simple operations
- Adding error handling for impossible scenarios
- Using feature flags for simple changes

**Do:**
- Solve the specific problem asked
- Keep solutions simple and direct
- Only add complexity when necessary
- Write self-documenting code when possible
- Trust internal code and framework guarantees

### Communication Style

**When responding to users:**
- Be concise and direct
- Focus on technical accuracy
- Provide code examples
- Reference file locations with line numbers
- Explain "why" not just "what"
- Suggest best practices
- Point out potential issues

**Example response format:**
```
I've added the new feature to the project. Here's what I changed:

1. Created NewComponent in src/components/ui/NewComponent.tsx:42
2. Added route in src/App.tsx:18
3. Updated navigation in src/components/layout/Header.tsx:35

The component includes:
- Dark mode support
- Responsive design (mobile-first)
- Accessibility attributes
- Type-safe props interface

Test it with: npm run dev
```

### Git Workflow for AI Assistants

**Always:**
1. Work on the correct branch: `claude/claude-md-mj141udinz2c8bvc-018K3sYvwwqeiZkx6o4JuM8U`
2. Write clear commit messages
3. Stage related changes together
4. Push when task is complete

**Commit message format:**
```
type(scope): brief description

- Detail 1
- Detail 2
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, styling
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**
```bash
git add src/components/ui/NewComponent.tsx src/components/ui/index.ts
git commit -m "feat(ui): add NewComponent with dark mode support

- Includes responsive design
- Fully accessible with ARIA labels
- TypeScript types defined"
git push -u origin claude/claude-md-mj141udinz2c8bvc-018K3sYvwwqeiZkx6o4JuM8U
```

---

## Quick Reference

### Essential Commands
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm test              # Run tests
npm run lint          # Lint code
git status            # Check git status
```

### Key File Paths
```
src/App.tsx                      # Routes
src/main.tsx                     # App entry
src/data/content.json            # Content
src/components/ui/index.ts       # UI exports
src/utils/constants.ts           # Constants
vite.config.ts                   # Build config
tailwind.config.js               # Styles config
```

### Important Hooks
```typescript
useContent('blogs')              // Fetch content
useCVTimeline()                  // Timeline with translation
useTheme()                       // Dark mode
useTranslation()                 // Language & translation
useScrollReveal()                // Scroll animations
```

### Color Classes
```typescript
// Light mode
pink-500          // Primary
yellow-300        // Secondary
white             // Background
black             // Text/borders

// Dark mode
purple-400        // Primary
indigo-500        // Secondary
gray-900          // Background
white             // Text
gray-600          // Borders
```

### Breakpoints
```typescript
sm: 640px         // Mobile landscape
md: 768px         // Tablet
lg: 1024px        // Desktop
xl: 1280px        // Large desktop
2xl: 1536px       // Extra large
```

---

## Resources & Documentation

### Internal Documentation
- `IMPLEMENTATION_GUIDE.md` - CMS integration guide
- `src/docs/CMSFundamentals.md` - CMS basics
- `src/docs/ContentfulModels.md` - Content models
- `src/docs/Navigation.md` - Navigation patterns
- `src/docs/WhatsAppConsultation.md` - WhatsApp feature

### External Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
- [Vitest](https://vitest.dev/)
- [Contentful](https://www.contentful.com/developers/docs/)
- [Supabase](https://supabase.com/docs)

---

## Conclusion

This codebase is well-structured, modern, and follows industry best practices. When working on it:

1. **Understand before changing** - Read the code first
2. **Follow existing patterns** - Consistency is key
3. **Think about users** - Accessibility and UX matter
4. **Keep it simple** - Don't over-engineer
5. **Test your work** - Ensure quality
6. **Document changes** - Help future developers

The foundation is solid for scaling to a full CMS-powered application. The code is production-ready with room for enhancement in testing coverage, content management integration, and performance optimization.

Happy coding! 🚀
