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
import { useTranslation } from '../../context/TranslationContext';

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CVDownloadModal: React.FC<CVDownloadModalProps> = ({ isOpen, onClose }) => {
  const { state, steps, nextStep, prevStep, updateForm, submitAndDownload } = useCVDownload();
  const { language, translate } = useTranslation();

  // UI text: English fallback, translated dynamically when language != 'en'
  const defaultText = {
    modalTitle: 'Download CV',
    personalInfo: 'Personal Information',
    fullNameLabel: 'Full name *',
    fullNamePlaceholder: 'Your full name',
    emailLabel: 'Email *',
    emailPlaceholder: 'you@example.com',
    professionalInfo: 'Professional Information',
    companyLabel: 'Company *',
    companyPlaceholder: 'Your company name',
    positionLabel: 'Position *',
    positionPlaceholder: 'Your current position',
    interestReason: 'Reason of Interest',
    whyNeedCV: 'Why do you need my CV? *',
    optionHiring: 'Hiring process',
    optionCollaboration: 'Collaboration opportunity',
    optionNetworking: 'Professional networking',
    optionOther: 'Other reason',
    specifyReasonLabel: 'Specify the reason *',
    specifyReasonPlaceholder: 'Describe your reason',
    additionalMessageLabel: 'Additional message (optional)',
    additionalMessagePlaceholder: 'Any additional information...',
    prev: 'Previous',
    next: 'Next',
    download: 'Download CV',
  };

  const [uiText, setUiText] = React.useState(defaultText);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (language === 'en') {
        if (mounted) setUiText(defaultText);
        return;
      }
      try {
        const translated = await Promise.all([
          translate(defaultText.modalTitle),
          translate(defaultText.personalInfo),
          translate(defaultText.fullNameLabel),
          translate(defaultText.fullNamePlaceholder),
          translate(defaultText.emailLabel),
          translate(defaultText.emailPlaceholder),
          translate(defaultText.professionalInfo),
          translate(defaultText.companyLabel),
          translate(defaultText.companyPlaceholder),
          translate(defaultText.positionLabel),
          translate(defaultText.positionPlaceholder),
          translate(defaultText.interestReason),
          translate(defaultText.whyNeedCV),
          translate(defaultText.optionHiring),
          translate(defaultText.optionCollaboration),
          translate(defaultText.optionNetworking),
          translate(defaultText.optionOther),
          translate(defaultText.specifyReasonLabel),
          translate(defaultText.specifyReasonPlaceholder),
          translate(defaultText.additionalMessageLabel),
          translate(defaultText.additionalMessagePlaceholder),
          translate(defaultText.prev),
          translate(defaultText.next),
          translate(defaultText.download),
        ]);
        const [
          modalTitle,
          personalInfo,
          fullNameLabel,
          fullNamePlaceholder,
          emailLabel,
          emailPlaceholder,
          professionalInfo,
          companyLabel,
          companyPlaceholder,
          positionLabel,
          positionPlaceholder,
          interestReason,
          whyNeedCV,
          optionHiring,
          optionCollaboration,
          optionNetworking,
          optionOther,
          specifyReasonLabel,
          specifyReasonPlaceholder,
          additionalMessageLabel,
          additionalMessagePlaceholder,
          prev,
          next,
          download,
        ] = translated;
        if (mounted)
          setUiText({
            modalTitle,
            personalInfo,
            fullNameLabel,
            fullNamePlaceholder,
            emailLabel,
            emailPlaceholder,
            professionalInfo,
            companyLabel,
            companyPlaceholder,
            positionLabel,
            positionPlaceholder,
            interestReason,
            whyNeedCV,
            optionHiring,
            optionCollaboration,
            optionNetworking,
            optionOther,
            specifyReasonLabel,
            specifyReasonPlaceholder,
            additionalMessageLabel,
            additionalMessagePlaceholder,
            prev,
            next,
            download,
          });
      } catch (err) {
        // Fallback silently to English
        if (mounted) setUiText(defaultText);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [language, translate]);

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
              {uiText.personalInfo}
            </h3>
            
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                {uiText.fullNameLabel}
              </label>
              <input
                type="text"
                value={state.formData.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder={uiText.fullNamePlaceholder}
              />
              {state.errors.name && (
                <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                {uiText.emailLabel}
              </label>
              <input
                type="email"
                value={state.formData.email}
                onChange={(e) => updateForm({ email: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder={uiText.emailPlaceholder}
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
              {uiText.professionalInfo}
            </h3>
            
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                {uiText.companyLabel}
              </label>
              <input
                type="text"
                value={state.formData.company}
                onChange={(e) => updateForm({ company: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder={uiText.companyPlaceholder}
              />
              {state.errors.company && (
                <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                {uiText.positionLabel}
              </label>
              <input
                type="text"
                value={state.formData.position}
                onChange={(e) => updateForm({ position: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                placeholder={uiText.positionPlaceholder}
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
              {uiText.interestReason}
            </h3>
            
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                {uiText.whyNeedCV}
              </label>
              <div className="space-y-2 md:space-y-3">
                {[
                  { value: 'hiring', label: uiText.optionHiring },
                  { value: 'collaboration', label: uiText.optionCollaboration },
                  { value: 'networking', label: uiText.optionNetworking },
                  { value: 'other', label: uiText.optionOther }
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
                  {uiText.specifyReasonLabel}
                </label>
                <input
                  type="text"
                  value={state.formData.customReason || ''}
                  onChange={(e) => updateForm({ customReason: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono text-sm md:text-base"
                  placeholder={uiText.specifyReasonPlaceholder}
                />
                {state.errors.customReason && (
                  <p className="text-red-500 text-xs md:text-sm mt-1 font-mono">{state.errors.customReason}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white font-mono">
                {uiText.additionalMessageLabel}
              </label>
              <textarea
                value={state.formData.message || ''}
                onChange={(e) => updateForm({ message: e.target.value })}
                rows={3}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 dark:text-white font-mono resize-none text-sm md:text-base"
                placeholder={uiText.additionalMessagePlaceholder}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={uiText.modalTitle}>
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
            {uiText.prev}
          </Button>

          {state.currentStep < 3 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              icon={<ArrowRight size={16} />}
              size="md"
              className="w-full sm:w-auto"
            >
              {uiText.next}
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
              {uiText.download}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CVDownloadModal;