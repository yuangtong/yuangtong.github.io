/**
 * Archivo: src/services/whatsapp.ts
 * Propósito: Validación de número y construcción del enlace WhatsApp.
 */

import { sanitizeInput, clampText } from '../utils/sanitize';
import { MESSAGE_CHAR_LIMIT } from '../constants/contact';

export const E164_REGEX = /^\+?[1-9]\d{1,14}$/;

export function isValidInternationalNumber(num: string): boolean {
  return E164_REGEX.test(num.trim());
}

interface MessageParams {
  name: string;
  startTime: string; // formato HH:MM
  endTime: string;   // formato HH:MM
  country: string;
  timeZone: string;
}

/** Construye el mensaje profesional en inglés con sanitización y límite. */
export function buildConsultationMessage(params: MessageParams): string {
  const name = sanitizeInput(params.name);
  const country = sanitizeInput(params.country);
  const tz = sanitizeInput(params.timeZone);

  const lines = [
    `Hello Yuang! I'm ${name} and I'm interested in scheduling a free consultation. My available hours are:`,
    `${params.startTime} – ${params.endTime} (${tz})`,
    '',
    `${country}`
  ];

  return clampText(lines.join('\n'), MESSAGE_CHAR_LIMIT);
}

/** Devuelve URL de WhatsApp segura con encodeURIComponent. */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const base = 'https://api.whatsapp.com/send';
  const query = `phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}`;
  return `${base}?${query}`;
}