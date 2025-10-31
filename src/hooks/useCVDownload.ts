/**
 * Hook personalizado para manejar la lógica de descarga del CV
 * Gestiona el estado del formulario, validación y envío
 */

import { useReducer, useMemo } from 'react';
import { CVFormData, CVDownloadState, CVDownloadAction, StepperStep } from '../types/cv';

const initialFormData: CVFormData = {
  name: '',
  email: '',
  company: '',
  position: '',
  reason: 'hiring',
  customReason: '',
  message: ''
};

const initialState: CVDownloadState = {
  currentStep: 1,
  formData: initialFormData,
  isValid: false,
  isSubmitting: false,
  errors: {}
};

function cvDownloadReducer(state: CVDownloadState, action: CVDownloadAction): CVDownloadState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 3)
      };
    
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1)
      };
    
    case 'UPDATE_FORM':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        errors: {}
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload
      };
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };
    
    case 'RESET_FORM':
      return initialState;
    
    default:
      return state;
  }
}

export const useCVDownload = () => {
  const [state, dispatch] = useReducer(cvDownloadReducer, initialState);

  // Validación por paso
  const validateStep = (step: number): boolean => {
    const errors: Partial<CVFormData> = {};
    
    switch (step) {
      case 1:
        if (!state.formData.name.trim()) errors.name = 'El nombre es requerido';
        if (!state.formData.email.trim()) errors.email = 'El email es requerido';
        else if (!/\S+@\S+\.\S+/.test(state.formData.email)) errors.email = 'Email inválido';
        break;
      
      case 2:
        if (!state.formData.company.trim()) errors.company = 'La empresa es requerida';
        if (!state.formData.position.trim()) errors.position = 'El cargo es requerido';
        break;
      
      case 3:
        if (state.formData.reason === 'other' && !state.formData.customReason?.trim()) {
          errors.customReason = 'Por favor especifica la razón';
        }
        break;
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors });
      return false;
    }

    return true;
  };

  // Generar steps del stepper
  const steps: StepperStep[] = useMemo(() => [
    {
      id: 1,
      title: 'Información Personal',
      description: '',
      isCompleted: state.currentStep > 1,
      isActive: state.currentStep === 1
    },
    {
      id: 2,
      title: 'Información Profesional',
      description: '',
      isCompleted: state.currentStep > 2,
      isActive: state.currentStep === 2
    },
    {
      id: 3,
      title: 'Motivo de Interés',
      description: '',
      isCompleted: state.currentStep > 3,
      isActive: state.currentStep === 3
    }
  ], [state.currentStep]);

  // Funciones de navegación
  const nextStep = () => {
    if (validateStep(state.currentStep)) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const updateForm = (data: Partial<CVFormData>) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
  };

  // Envío del formulario y descarga
  const submitAndDownload = async (): Promise<boolean> => {
    if (!validateStep(3)) return false;

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      // Simular envío a analytics o base de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log para analytics (en producción enviarías a tu servicio)
      console.log('CV Download Request:', {
        ...state.formData,
        timestamp: new Date().toISOString()
      });

      // Iniciar descarga
      const link = document.createElement('a');
      link.href = '/Yuang-Tong-CV.pdf';
      link.download = 'Yuang-Tong-CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch({ type: 'RESET_FORM' });
      return true;
    } catch (error) {
      console.error('Error al procesar descarga:', error);
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  return {
    state,
    steps,
    nextStep,
    prevStep,
    updateForm,
    submitAndDownload,
    resetForm,
    validateStep
  };
};