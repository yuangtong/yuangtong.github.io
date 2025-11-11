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

- `src/components/ui/NavigationBar.tsx`
  - Barra de navegación reutilizable (Back + Home) para detalle y listados.
  - Sticky/fixed cuando se activa el estado de scroll mediante `useScrollActive`.
  - Usa `NavigationBarContent` con `BackButton` y `Link` a Home accesible.
  - Se incluye en `ContentDetail`, `ProjectsPage`, `BlogPage`, `WorkPage`.

## Uso

- En páginas de detalle y listados, usar `NavigationBar` para Back/Home consistente.
- `ContentDetail` integra `NavigationBar` automáticamente.

## Accesibilidad

- Cumple WCAG:
  - Controles con `aria-label` (Back y Home).
  - Estados de foco visibles (`focus-visible:ring`).
  - Objetivos táctiles adecuados (`px-3 py-2` en mobile).

## Pruebas

- Unitarias:
  - `BackButton.test.tsx`: navega con `navigate(-1)` y fallback a `/`.

- Integración:
  - `DetailNavVisibility.test.tsx`: valida la presencia de Back/Home en `ContentDetail` y listados (provistos por `NavigationBar`).
  - `BackFromDetails.test.tsx`: navegación desde detalles hacia listados.

## Diseño

- Estilos coherentes con Tailwind y modo oscuro.
- Animaciones sutiles con `framer-motion` para `hover/tap`.