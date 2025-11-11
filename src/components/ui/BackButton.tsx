/**
 * Componente UI: BackButton
 * Botón accesible y consistente para navegar al historial anterior
 * - Usa el enrutador principal (useNavigate)
 * - Fallback a '/' cuando no hay historial previo
 * - Estados hover/active y soporte responsive
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  label?: string; // Permite personalizar el texto según idioma
}

const BackButton: React.FC<BackButtonProps> = ({ className = '', label = 'Back' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Si no hay historial suficiente, navegar al home
    if (typeof window !== 'undefined' && window.history.length <= 1) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleBack}
      aria-label="Go back"
      className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-none ${className}`}
    >
      <ArrowLeft size={18} className="md:w-5 md:h-5" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
};

export default BackButton;