/**
 * Tipos para la sección de Testimonials
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: string;
}

export interface TestimonialsResponse {
  items: Testimonial[];
  loading: boolean;
  error: string | null;
}