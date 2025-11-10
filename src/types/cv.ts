/**
 * Tipos para el sistema de descarga de CV
 */

export interface CVFormData {
  name: string;
  email: string;
  company: string;
  position: string;
  reason: 'hiring' | 'collaboration' | 'networking' | 'other';
  customReason?: string;
  message?: string;
}

export interface StepperStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CVDownloadState {
  currentStep: number;
  formData: CVFormData;
  isValid: boolean;
  isSubmitting: boolean;
  errors: Partial<CVFormData>;
}

export type CVDownloadAction = 
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FORM'; payload: Partial<CVFormData> }
  | { type: 'SET_ERRORS'; payload: Partial<CVFormData> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' };

/**
 * Tipos para la línea de tiempo profesional extraída del PDF
 */
export type TimelineIconKey =
  | 'briefcase'
  | 'graduation'
  | 'award'
  | 'code'
  | 'management'
  | 'milestone';

export interface CareerMilestone {
  id: string;
  dateRange: string; // Ej: "2019 – 2021"
  title: string; // Puesto o hito
  organization?: string; // Empresa/organización
  description?: string; // Resumen breve
  iconKey?: TimelineIconKey; // Ícono representativo
}

export interface CVTimelineData {
  milestones: CareerMilestone[];
  source: 'pdf' | 'fallback';
}