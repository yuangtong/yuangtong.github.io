/**
 * Datos estáticos: Timeline profesional
 * Propósito: Proveer hitos estructurados para la sección Timeline (sin parseo PDF)
 */
import type { CareerMilestone } from '../types/cv';

export const timeline: CareerMilestone[] = [
  {
    id: '2024-2025-process-it-assistant',
    dateRange: 'Jul. 2024 – Jan. 2025',
    title: 'Process & IT Engineering Assistant',
    organization: 'Corporación Congrains',
    description: 'Focused on process optimization and automation technologies to improve efficiency and drive growth.',
    iconKey: 'code',
  },
  {
    id: '2025-billing-systems-intern',
    dateRange: 'Mar. 2025 – Sep. 2025',
    title: 'Billing Systems Intern',
    organization: 'Claro Perú',
    description: 'Supported improvement, automation, and validation of billing systems; managed reports, testing, and cross‑team collaboration.',
    iconKey: 'management',
  },
  {
    id: '2025-present-it-assistant',
    dateRange: 'Oct. 2025 – Present',
    title: 'IT Assistant',
    organization: 'Centro de Alta Especialización en CC. HH. – Human',
    description: 'Maintaining and supporting an Oracle APEX application, managing database processes, and automating tasks with Google Apps Script.',
    iconKey: 'briefcase',
  },
];

export default timeline;