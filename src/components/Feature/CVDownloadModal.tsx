/**
 * Modal para descarga de CV con stepper
 * Recolecta información del usuario antes de permitir la descarga
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import Modal from '../ui/Modal';
import Stepper from '../ui/Stepper';
import Button from '../ui/Button';
import { useCVDownload } from '../../hooks/useCVDownload';

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CVDownloadModal: React.FC<CVDownloadModalProps> = ({ isOpen, onClose }) => {
  const { state, steps, nextStep, prevStep, updateForm, submitAndDownload } = useCVDownload();

  const handleSubmit = async () => {
    const success = await submitAndDownload();
    if (success) {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 dark:text-white font-mono text-center">
              Información Personal
            </h3>
            
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                Nombre completo *
              </label>
              <input
                type="text"
                value={state.formData.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder="Tu nombre completo"
              />
              {state.errors.name && (
                <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                Email *
              </label>
              <input
                type="email"
                value={state.formData.email}
                onChange={(e) => updateForm({ email: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder="tu@email.com"
              />
              {state.errors.email && (
                <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.email}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 dark:text-white font-mono text-center">
              Información Profesional
            </h3>
            
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                Empresa *
              </label>
              <input
                type="text"
                value={state.formData.company}
                onChange={(e) => updateForm({ company: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder="Nombre de tu empresa"
              />
              {state.errors.company && (
                <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                Cargo/Posición *
              </label>
              <input
                type="text"
                value={state.formData.position}
                onChange={(e) => updateForm({ position: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder="Tu cargo actual"
              />
              {state.errors.position && (
                <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.position}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 dark:text-white font-mono text-center">
              Motivo de Interés
            </h3>
            
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                ¿Por qué necesitas mi CV? *
              </label>
              <div className="space-y-2 md:space-y-3">
                {[
                  { value: 'hiring', label: 'Proceso de contratación' },
                  { value: 'collaboration', label: 'Oportunidad de colaboración' },
                  { value: 'networking', label: 'Networking profesional' },
                  { value: 'other', label: 'Otro motivo' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 md:space-x-3">
                    <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={state.formData.reason === option.value}
                      onChange={(e) => updateForm({ reason: e.target.value as any })}
                      className="w-4 h-4"
                    />
                    <span className="dark:text-white font-mono text-sm md:text-base">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {state.formData.reason === 'other' && (
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                  Especifica el motivo *
                </label>
                <input
                  type="text"
                  value={state.formData.customReason || ''}
                  onChange={(e) => updateForm({ customReason: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                  placeholder="Describe tu motivo"
                />
                {state.errors.customReason && (
                  <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.customReason}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                Mensaje adicional (opcional)
              </label>
              <textarea
                value={state.formData.message || ''}
                onChange={(e) => updateForm({ message: e.target.value })}
                rows={3}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono resize-none text-sm md:text-base"
                placeholder="Cualquier información adicional..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Descargar CV">
      <div className="p-4 md:p-6">
        {/* Stepper */}
        <Stepper steps={steps} currentStep={state.currentStep} />

        {/* Content */}
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mt-6 md:mt-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 md:mt-8 pt-4 md:pt-6 border-t-2 border-black dark:border-white">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={state.currentStep === 1}
            icon={<ArrowLeft size={16} />}
            size="md"
            className="w-full sm:w-auto"
          >
            Anterior
          </Button>

          {state.currentStep < 3 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              icon={<ArrowRight size={16} />}
              size="md"
              className="w-full sm:w-auto"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={state.isSubmitting}
              icon={<Download size={16} />}
              size="md"
              className="w-full sm:w-auto"
            >
              Descargar CV
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CVDownloadModal;