/**
 * Constantes y configuración centralizada del proyecto
 */

// URLs y enlaces externos
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/yuangtong',
  LINKEDIN: 'https://linkedin.com/in/yuangtong',
  EMAIL: 'mailto:yuang.tong@outlook.com',
  UPWORK: 'https://www.upwork.com/freelancers/~01234567890abcdef',
  CALENDAR: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3M-X60wSMYrYspDOQYRdAG8rNibLIpe9YoKZmwrdJ0cs8MvNxWtr3N8I507RyETNvDZ-qj_8ji'
} as const;

// Configuración de CMS
export const CMS_CONFIG = {
  // Contentful
  CONTENTFUL: {
    SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
    ACCESS_TOKEN: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
    ENVIRONMENT: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
  },
  
  // Supabase
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  }
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  SITE_NAME: 'Yuang Tong Portfolio',
  SITE_DESCRIPTION: 'Full-stack developer and software engineer portfolio',
  AUTHOR: 'Yuang Tong',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'es'] as const
} as const;

// Límite de elementos visibles en Home
export const DISPLAY_CONFIG = {
  HOME_PROJECTS_LIMIT: 6
} as const;

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/project/:slug',
  WORK_DETAIL: '/work/:slug',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  CONTACT: '/contact',
  PAYMENTS: '/paynow'
} as const;

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5
  },
  EASING: {
    EASE_OUT: [0.0, 0.0, 0.2, 1],
    EASE_IN_OUT: [0.4, 0.0, 0.2, 1]
  }
} as const;

// Breakpoints para responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;