---
title: Navegación Consistente
description: Componente y patrones de navegación (Back y Home)
---

# Navegación Consistente

Este documento describe la implementación de navegación consistente a través de la aplicación, cumpliendo con los requisitos de modularidad, responsividad y accesibilidad (WCAG).

## Componentes

- `src/components/ui/BackButton.tsx`
  - Botón reutilizable que usa `useNavigate` para volver en el historial.
  - Fallback a `/` cuando `window.history.length <= 1`.
  - Accesible: `aria-label="Go back"`, foco visible, área táctil adecuada.
  - Responsive: oculta el texto en mobile y muestra el ícono.

- `src/components/layout/Header.tsx`
  - Logo `YT` convertido en `Link` a `/`.
  - Ícono Home (`lucide-react`) con estados `hover`/`active` y foco visible.
  - `BackButton` incluido globalmente en acciones de escritorio y móvil.

## Uso

- No es necesario importar `BackButton` en cada página: el `Header` lo muestra globalmente.
- Para navegación a Home, usar los `Link` definidos en el `Header` (logo e ícono Home).

## Accesibilidad

- Cumple WCAG:
  - Controles con `aria-label` (Back y Home).
  - Estados de foco visibles (`focus-visible:ring`).
  - Objetivos táctiles adecuados (`px-3 py-2` en mobile).

## Pruebas

- Unitarias:
  - `BackButton.test.tsx`: navega con `navigate(-1)` y fallback a `/`.
  - `HeaderNavigation.test.tsx`: el logo e ícono Home navegan a `/`.

- Integración:
  - `BackFromDetails.test.tsx`: desde `/project/:slug` se vuelve a `/projects` con el Back global.

## Diseño

- Estilos coherentes con Tailwind y modo oscuro.
- Animaciones sutiles con `framer-motion` para `hover/tap`.