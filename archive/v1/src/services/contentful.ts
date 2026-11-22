/**
 * Servicio para Contentful CMS
 * Maneja la conexión y queries a Contentful
 */

// TODO: Instalar @contentful/rich-text-react-renderer cuando se implemente
// npm install contentful @contentful/rich-text-react-renderer
import type { TimelineEntry, TimelineEntryFields } from '../types/contentful';
import type { CareerMilestone } from '../types/cv';

interface ContentfulConfig {
  space: string;
  accessToken: string;
  environment?: string;
}

class ContentfulService {
  private config: ContentfulConfig;

  constructor(config: ContentfulConfig) {
    this.config = config;
  }

  // TODO: Implementar cuando se instale Contentful
  async getProjects() {
    console.log('ContentfulService: getProjects - To be implemented');
    return [];
  }

  async getProject(slug: string) {
    console.log(`ContentfulService: getProject(${slug}) - To be implemented`);
    return null;
  }

  async getBlogs() {
    console.log('ContentfulService: getBlogs - To be implemented');
    return [];
  }

  async getBlog(slug: string) {
    console.log(`ContentfulService: getBlog(${slug}) - To be implemented`);
    return null;
  }

  async getSiteSettings() {
    console.log('ContentfulService: getSiteSettings - To be implemented');
    return null;
  }

  /**
   * Adaptador mínimo: Timeline
   * Cuando se conecte el SDK de Contentful, mapeará las entradas a hitos.
   */
  mapTimelineEntryToMilestone(entry: TimelineEntry): CareerMilestone {
    const f: TimelineEntryFields = entry.fields;
    const dateRange = f.dateRangeDisplay || this.formatDateRange(f.startDate, f.endDate);
    return {
      id: `${dateRange}-${f.title}`.toLowerCase().replace(/\s+/g, '-'),
      dateRange,
      title: f.title,
      organization: f.organization,
      description: f.description,
      iconKey: f.iconKey || 'milestone',
    };
  }

  formatDateRange(startISO: string, endISO?: string): string {
    const startY = new Date(startISO).getFullYear();
    const endY = endISO ? new Date(endISO).getFullYear() : 'Present';
    return `${startY} – ${endY}`;
  }

  async getTimeline(): Promise<CareerMilestone[]> {
    console.log('ContentfulService: getTimeline - To be implemented');
    // Ejemplo de cómo funcionará (cuando se conecte el SDK):
    // const entries = await client.getEntries({ content_type: 'timelineEntry', order: 'fields.order' });
    // return entries.items.map(this.mapTimelineEntryToMilestone.bind(this));
    return [];
  }
}

// Configuración por defecto (usar variables de entorno en producción)
const defaultConfig: ContentfulConfig = {
  space: process.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
};

export const contentfulService = new ContentfulService(defaultConfig);
export default ContentfulService;