/**
 * Índice centralizado de tipos TypeScript
 */

// Tipos de CV
export * from './cv';

// Tipos de Contentful
export * from './contentful';

// Tipos de Supabase
export * from './supabase';

// Tipos comunes de la aplicación
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos para el contexto de traducción
export interface TranslationContextType {
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  translate: (text: string) => Promise<string>;
}

// Tipos para el contexto de tema
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}