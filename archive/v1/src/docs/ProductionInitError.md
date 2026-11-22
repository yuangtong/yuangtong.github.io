# Error de inicialización en producción

## Síntoma
- Mensaje: `Cannot access '<var>' before initialization`
- Ubicación: vendor chunk minificado (ej. `assets/js/vendor-*.js`)
- Entorno: producción (Netlify/Vite build)

## Causa raíz
- La minificación con **Terser** reordenó/mangleó variables en un bundle con múltiples módulos y dependencias, produciendo un acceso en **TDZ** (Temporal Dead Zone) a una variable antes de su inicialización.
- Esto es más probable en vendor con dependencias que usan `let/const` y tienen inter‑dependencias circulares o inicializaciones en orden específico.

## Solución implementada
- Cambiar `build.minify` a `esbuild` y eliminar `terserOptions` en `vite.config.ts`.
- Mantener `manualChunks` para separar `react-vendor`, `ui-vendor`, `router-vendor`, `vendor`.
- Añadir pruebas en `src/test/buildConfig.test.ts` que aseguran la configuración correcta para producción.

## Recomendaciones adicionales
- Si el vendor sigue muy grande, evaluar `dynamic import()` para partes pesadas.
- Ejecutar una verificación de ciclos de dependencias durante el desarrollo (ej. `madge`), especialmente tras añadir librerías.
- Considerar desactivar `sourcemap` en producción si no se requiere, para reducir tamaño de artefactos.

## Verificación
- `npm run build` compila sin errores.
- Preview local carga sin el error.
- Netlify debe desplegar sin el error tras el cambio de minificación.