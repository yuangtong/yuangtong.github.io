/**
 * Tipos TypeScript para Supabase Database
 * Define las interfaces para las tablas y operaciones de DB
 */

// Tabla de contactos
export interface ContactFormEntry {
  id?: string;
  name: string;
  email: string;
  reason: string;
  other_reason?: string;
  message: string;
  created_at?: string;
  ip_address?: string;
  user_agent?: string;
}

// Tabla de descargas de CV
export interface CVDownloadEntry {
  id?: string;
  name: string;
  email: string;
  company: string;
  position: string;
  reason: 'hiring' | 'collaboration' | 'networking' | 'other';
  custom_reason?: string;
  message?: string;
  created_at?: string;
  ip_address?: string;
  user_agent?: string;
}

// Tabla de analytics/métricas
export interface AnalyticsEntry {
  id?: string;
  event_type: 'page_view' | 'cv_download' | 'contact_form' | 'project_click';
  page?: string;
  project_slug?: string;
  user_data?: Record<string, any>;
  created_at?: string;
  ip_address?: string;
  user_agent?: string;
}

// Tabla de suscriptores (para futuro newsletter)
export interface SubscriberEntry {
  id?: string;
  email: string;
  name?: string;
  source: 'contact_form' | 'cv_download' | 'newsletter' | 'other';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Respuestas de la API
export interface SupabaseResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

// Configuración de tablas
export interface DatabaseSchema {
  contact_forms: ContactFormEntry;
  cv_downloads: CVDownloadEntry;
  analytics: AnalyticsEntry;
  subscribers: SubscriberEntry;
}

// Tipos para queries
export type TableName = keyof DatabaseSchema;
export type InsertData<T extends TableName> = Omit<DatabaseSchema[T], 'id' | 'created_at' | 'updated_at'>;
export type UpdateData<T extends TableName> = Partial<InsertData<T>>;

// Filtros para queries
export interface QueryFilters {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  where?: Record<string, any>;
}