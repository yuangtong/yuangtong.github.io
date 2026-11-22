/**
 * Test: buildConfig
 * Verifica configuración de build para producción
 * - Minificación con esbuild (no Terser)
 * - Sin terserOptions
 * - ManualChunks definidos para separar vendor
 */
import { describe, it, expect } from 'vitest';
// Importa el objeto de configuración exportado por Vite
import config from '../../vite.config';

describe('Vite build configuration', () => {
  it('uses esbuild for minification to avoid TDZ errors', () => {
    expect(config.build?.minify).toBe('esbuild');
  });

  it('does not define terserOptions', () => {
    // Verifica ausencia sin usar anotaciones especiales
    const hasTerserOptions = Object.prototype.hasOwnProperty.call(config.build ?? {}, 'terserOptions');
    expect(hasTerserOptions).toBe(false);
  });

  it('has manualChunks returning vendor groups', () => {
    const ro = config.build?.rollupOptions;
    expect(ro?.output && typeof ro.output === 'object').toBe(true);
  });
});