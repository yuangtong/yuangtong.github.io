/**
 * Archivo: src/utils/sanitize.ts
 * Propósito: Funciones auxiliares para sanitización y seguridad básica de inputs
 */

/**
 * Elimina posibles inyecciones y caracteres peligrosos.
 * No usamos innerHTML, pero limpiamos por seguridad.
 */
export function sanitizeInput(value: string): string {
  const trimmed = value.trim();
  // Remover etiquetas <script> y caracteres angulares
  const withoutScripts = trimmed.replace(/<\/?script[^>]*>/gi, '');
  const escaped = withoutScripts
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/\u0000/g, '');
  // Normalizar espacios múltiples
  return escaped.replace(/\s{2,}/g, ' ');
}

/** Limita la longitud del texto y asegura salto de línea seguro */
export function clampText(value: string, limit: number): string {
  if (value.length <= limit) return value;
  return value.slice(0, limit);
}