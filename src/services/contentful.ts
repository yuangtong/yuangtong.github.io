/**
 * Servicio para Contentful CMS
 * Maneja la conexión y queries a Contentful
 */

// TODO: Instalar @contentful/rich-text-react-renderer cuando se implemente
// npm install contentful @contentful/rich-text-react-renderer

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
}

// Configuración por defecto (usar variables de entorno en producción)
const defaultConfig: ContentfulConfig = {
  space: process.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
};

export const contentfulService = new ContentfulService(defaultConfig);
export default ContentfulService;