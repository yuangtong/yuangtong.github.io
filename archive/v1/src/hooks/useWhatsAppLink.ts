/**
 * Archivo: src/hooks/useWhatsAppLink.ts
 * Propósito: Hook para generar el enlace de WhatsApp desde un formulario de consulta.
 */

import { useCallback, useEffect, useState } from 'react';
import { getGeoInfo } from '../services/geo';
import { buildConsultationMessage, buildWhatsAppUrl, isValidInternationalNumber } from '../services/whatsapp';
import { WHATSAPP_NUMBER } from '../constants/contact';

export interface ConsultationFormData {
  name: string;
  startTime: string;
  endTime: string;
  country: string;
}

export function useWhatsAppLink() {
  const [countryDetected, setCountryDetected] = useState<string>('');
  const [timeZone, setTimeZone] = useState<string>('UTC');

  useEffect(() => {
    getGeoInfo().then(({ country, timeZone }) => {
      setCountryDetected(country || '');
      setTimeZone(timeZone || 'UTC');
    }).catch(() => {
      setCountryDetected('');
      setTimeZone('UTC');
    });
  }, []);

  const generateLink = useCallback((data: ConsultationFormData) => {
    const phone = WHATSAPP_NUMBER;
    if (!isValidInternationalNumber(phone)) {
      throw new Error('Invalid WhatsApp phone number.');
    }

    const finalCountry = data.country || countryDetected || 'Unknown';
    const message = buildConsultationMessage({
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      country: finalCountry,
      timeZone
    });
    return buildWhatsAppUrl(phone, message);
  }, [countryDetected, timeZone]);

  return { countryDetected, timeZone, generateLink };
}