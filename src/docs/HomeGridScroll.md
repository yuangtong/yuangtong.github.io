<!-- Archivo: HomeGridScroll.md -->
<!-- Propósito: Documentar configuración de grilla y scroll horizontal en Home -->

# Home: Grilla 1x3 y Scroll Horizontal

## Secciones afectadas
- Projects (Home)
- Blog (Home)
- Testimonials (Home) – ya tenía scroll horizontal; se homologa el comportamiento

## Comportamiento
- Máximo 1 fila con hasta 3 columnas visibles en `lg` y superiores.
- Para más de 3 elementos, se habilita scroll horizontal en `sm`/`md`.
- La barra de scroll se oculta visualmente con la utilidad global `scrollbar-hide`.
- Se añade `horizontal-scroll-touch` para mejorar el desplazamiento en dispositivos táctiles.

## CSS de utilidades
- `src/index.css`
  - `.scrollbar-hide`: oculta scrollbars en Chrome/Safari/Firefox/Edge.
  - `.horizontal-scroll-touch`: activa `-webkit-overflow-scrolling: touch` y `overscroll-behavior-x: contain`.

## Constantes
- `src/utils/constants.ts`
  - `DISPLAY_CONFIG.HOME_WORKS_LIMIT = 2` (actualizado para Home).
  - `HOME_PROJECTS_LIMIT`, `HOME_BLOGS_LIMIT` usados para determinar cantidad de items disponibles en el carrusel.

## Datos y Tipos
- `src/data/content.json`
  - Se agrega `testimonials` para consumo uniforme vía `useContent`.
- `src/hooks/useContent.ts`
  - Acepta tipo `testimonials`.
- `src/types/testimonials.ts`
  - Interfaces `Testimonial` y `TestimonialsResponse`.

## Importaciones Clave
- Components: `src/components/sections/Projects.tsx`, `Blog.tsx`, `Testimonials.tsx`
- Hook: `src/hooks/useContent.ts`
- Types: `src/types/testimonials.ts`
- CSS: `src/index.css`

## Notas
- Cambios son responsivos y mantienen consistencia visual.
- No se modifica el layout de `Work` salvo el límite de items.