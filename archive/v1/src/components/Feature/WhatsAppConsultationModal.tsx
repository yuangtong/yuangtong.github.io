/**
 * Archivo: src/components/Feature/WhatsAppConsultationModal.tsx
 * Propósito: Modal de confirmación para agendar consulta por WhatsApp.
 * - Formulario: nombre, horario (inicio/fin), país (auto o manual)
 * - Validación de campos obligatorios y reglas simples
 * - Construye el enlace y redirige tras confirmación
 */

import React, { useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import { motion } from 'framer-motion';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';

interface WhatsAppConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  'Auto-detect', 'Peru', 'United States', 'Mexico', 'Spain', 'Argentina', 'Chile', 'Colombia', 'Brazil', 'Canada', 'United Kingdom'
];

const timePattern = /^\d{2}:\d{2}$/; // HTML time input ya valida; esto es extra

const WhatsAppConsultationModal: React.FC<WhatsAppConsultationModalProps> = ({ isOpen, onClose }) => {
  const { countryDetected, timeZone, generateLink } = useWhatsAppLink();

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialCountry = useMemo(() => countryDetected || 'Auto-detect', [countryDetected]);

  const resetForm = () => {
    setName('');
    setStartTime('');
    setEndTime('');
    setCountry('');
    setError(null);
    setIsSubmitting(false);
  };

  const validate = (): boolean => {
    if (!name.trim()) { setError('Name is required.'); return false; }
    if (!timePattern.test(startTime) || !timePattern.test(endTime)) { setError('Please select valid start and end times.'); return false; }
    if (endTime <= startTime) { setError('End time must be later than start time.'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const link = generateLink({
        name,
        startTime,
        endTime,
        country: country && country !== 'Auto-detect' ? country : (countryDetected || 'Unknown')
      });
      // Redirigimos en la misma pestaña por mejor UX móvil
      window.location.assign(link);
      resetForm();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Unable to build WhatsApp link.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} size="md" title="Confirm your details">
      <div className="p-4 md:p-6">
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 font-mono">
          Please complete the form to send a professional WhatsApp message. Your timezone: <span className="font-bold">{timeZone}</span>.
        </p>

        <div className="mt-4 space-y-4">
          {/* Name */}
          <label className="block">
            <span className="block text-xs md:text-sm font-mono text-black dark:text-white">Full name</span>
            <input
              type="text"
              inputMode="text"
              placeholder="[name]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              required
            />
          </label>

          {/* Time range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs md:text-sm font-mono text-black dark:text-white">Start time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                required
              />
            </label>
            <label className="block">
              <span className="block text-xs md:text-sm font-mono text-black dark:text-white">End time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                required
              />
            </label>
          </div>

          {/* Country */}
          <label className="block">
            <span className="block text-xs md:text-sm font-mono text-black dark:text-white">Country of origin</span>
            <select
              value={country || initialCountry}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 w-full border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm font-mono">{error}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 border-t-2 border-black dark:border-white pt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { resetForm(); onClose(); }}
            className="px-4 py-2 border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white font-mono"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-4 py-2 border-2 border-black bg-black text-white font-mono disabled:opacity-60"
          >
            {isSubmitting ? 'Sending…' : 'Send'}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsAppConsultationModal;