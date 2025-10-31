/**
 * Componente Stepper reutilizable
 * Muestra el progreso en formularios multi-paso
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { StepperStep } from '../../types/cv';

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4 md:py-6">
      <div className="flex items-start justify-between px-2 md:px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Container */}
            <div className="flex flex-col items-center flex-1 max-w-[120px] md:max-w-none">
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`
                  relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-bold font-mono text-sm md:text-base
                  ${step.isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : step.isActive 
                      ? 'bg-pink-500 border-pink-500 text-white dark:bg-purple-600 dark:border-purple-600' 
                      : 'bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {step.isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Check size={16} className="md:w-5 md:h-5" />
                  </motion.div>
                ) : (
                  <span className="font-mono">{step.id}</span>
                )}
              </motion.div>
              
              {/* Step Label */}
              <div className="mt-2 md:mt-3 text-center px-1">
                <p className={`
                  text-xs md:text-sm font-bold font-mono leading-tight
                  ${step.isActive || step.isCompleted 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {step.title}
                </p>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 md:mx-4 mt-5 md:mt-6">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ 
                    scaleX: step.isCompleted ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    h-0.5 md:h-1 origin-left
                    ${step.isCompleted 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                    }
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;