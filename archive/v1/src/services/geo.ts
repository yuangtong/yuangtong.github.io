/**
 * Archivo: src/services/geo.ts
 * Propósito: Detección de país y zona horaria del usuario.
 */

export interface GeoInfo {
  country: string; // Country name or code
  timeZone: string; // IANA timezone
}

/** Obtiene zona horaria usando Intl API. */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Intenta detectar país vía ipapi.co. Fallback a navigator.language.
 */
export async function detectCountry(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      // Preferimos nombre de país, con fallback al código
      return data.country_name || data.country || 'Unknown';
    }
  } catch {
    // Ignoramos errores de red
  }
  // Fallback: navigator.language -> en-US => US
  const lang = navigator.language || (Array.isArray((navigator as any).languages) ? (navigator as any).languages[0] : 'en-US');
  const region = lang.split('-')[1];
  return region || 'Unknown';
}

export async function getGeoInfo(): Promise<GeoInfo> {
  const timeZone = detectTimeZone();
  const country = await detectCountry();
  return { country, timeZone };
}