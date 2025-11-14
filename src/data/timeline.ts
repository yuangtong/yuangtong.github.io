/**
 * Datos estáticos: Timeline profesional
 * Propósito: Proveer hitos estructurados para la sección Timeline (sin parseo PDF)
 */
import type { CareerMilestone } from '../types/cv';

export const timeline: CareerMilestone[] = [
  {
    id: '2018-2020-software-engineer',
    dateRange: '2018 – 2020',
    title: 'Software Engineer',
    organization: 'Freelance & Startups',
    description: 'Built full‑stack apps with focus on performance and UX.',
    iconKey: 'code',
  },
  {
    id: '2021-2023-senior-frontend',
    dateRange: '2021 – 2023',
    title: 'Senior Frontend Developer',
    organization: 'Product Teams',
    description: 'Led UI architecture, design systems and component libraries.',
    iconKey: 'management',
  },
  {
    id: '2024-present-lead-engineer',
    dateRange: '2024 – Present',
    title: 'Lead Engineer',
    organization: 'Tech Initiatives',
    description: 'Driving modular CMS integrations, analytics and quality gates.',
    iconKey: 'briefcase',
  },
];

export default timeline;