---
title: Guía Técnica — Workflow SPA/PWA con Headless CMS y BD
description: Proceso end‑to‑end desde ideación, maquetación, arquitectura y despliegue a producción.
---

# Objetivo
- Definir un workflow técnico para crear SPAs/PWAs integradas con un headless CMS (p.ej. Contentful) y una Base de Datos (p.ej. Supabase), desde ideación hasta producción.

# Alcance
- Tipos de apps: SPA (Single Page Application) y PWA (Progressive Web App).
- Integraciones: entrega y preview de contenido (CMS), datos transaccionales (BD), autenticación y analítica.

# Stack recomendado
- Frontend: `React`, `TypeScript`, `Vite`, `TailwindCSS`, `React Router`.
- CMS: `Contentful` (CDA/CPA/CMA, GraphQL o REST).
- BD: `Supabase` (Postgres, Auth, Storage) o equivalente.
- Infra: `Netlify` (builds, previews, deploy), `Webhooks`.
- Tests: `Vitest` + `Testing Library`.

# Workflow por Fases

## 1) Ideación
- Objetivos del producto y KPIs (retención, conversión, velocidad).
- Usuarios y casos de uso; mapa de contenidos y funcionalidades core.
- Definir taxonomías (categorías, etiquetas) y estados (borrador/publicado).
- Riesgos iniciales: SEO, i18n, performance, seguridad, privacidad.

## 2) Modelado de Contenido (CMS)
- Diseñar Content Types y validaciones (ver `src/docs/ContentfulModels.md`).
- Reusables: `SEO`, `Author`, `SocialLinks`, `Image/Gallery`, `Timeline`, `Testimonial`.
- Estrategia de slugs únicos (kebab‑case) y relaciones entre tipos.
- Ambientes: `dev/staging/prod` y locales para i18n con fallback.

## 3) Arquitectura de Información
- Sitemap, navegación, rutas y estados de detalle/listado.
- Definir componentes de UI, layout y bloques de contenido.
- Reglas de visibilidad (featured, order, status) y paginación/filtros.

## 4) Maquetación y Diseño de Componentes
- Design System (tokens, tipografía, colores, espaciados).
- Componentes modulares y reutilizables (ver estructura del proyecto):
  - `components/UI`: botones, cards, inputs, modals.
  - `components/Layout`: Header, Footer, Navigation Bar.
  - `components/Feature`: componentes específicos (p.ej. WhatsApp modal).
- Accesibilidad: `aria-*`, focus visible, tamaño táctil.

## 5) Arquitectura Web (Capas)
- UI (presentación) sin lógica de negocio.
- `hooks/`: lógica de vista (estado, memoización, efectos controlados).
- `services/`: consumo de CMS/BD, transformadores (mappers), caché.
- `utils/`: sanitización, constantes, helpers.
- `context/`: estado global (idioma, tema, autenticación).
- Data Flow: CMS (contenido) vs BD (transaccional); evitar mezclas.
- Errores: manejo centralizado, reintentos y backoff; reporting.

## 6) Integración CMS
- CDA/GraphQL: consultas de contenido publicado; CPA para preview.
- Mappers `Entry/Asset` → modelos frontend (`Project`, `BlogPost`, `Work`).
- Preview Mode: flag para leer CPA y desactivar caché.
- Webhooks: revalidación de build en `Netlify` ante cambios de contenido.

## 7) Integración BD
- Supabase: tablas para transacciones (p.ej. descargas de CV, suscriptores).
- Auth: flujos de sesión y permisos; almacenamiento seguro de tokens.
- Migrations: versionar esquemas; scripts reproducibles.
- Capa `services/supabase.ts`: métodos tipados y desacoplados de UI.

## 8) Seguridad y Cumplimiento
- Secrets en `.env` (no en código): `VITE_CONTENTFUL_*`, `VITE_SUPABASE_*`.
- CORS y políticas de contenido; sanitización de inputs y HTML.
- Evitar XSS/CSRF; validar URLs y formatos (E.164, emails).
- Logs sin PII; cumplir GDPR (retención, consentimiento).

## 9) Performance y PWA
- Lighthouse targets: Performance, Accessibility, Best Practices, SEO.
- PWA: Service Worker, precache, runtime caching (Workbox), offline.
- Optimización: code splitting, lazy loading, imágenes (responsive, formatos),
  memoización (`React.memo`, `useMemo`, `useCallback`).
- Reducción de bundle vendor (ver `ProductionInitError.md`): minificación segura.

## 10) Entornos y Configuraciones
- Dev/Staging/Prod con variables y endpoints diferenciados.
- Feature flags para activar funcionalidades (preview, banners, etc.).
- Mapear `environment` de Contentful (`master`, etc.).

## 11) Testing
- Unit: servicios (mappers CMS/BD), utils, hooks.
- Integración: rutas, navegación (Back/Home), render de detalle/listado.
- Contratos: shape de respuestas del CMS/BD con fixtures.
- E2E (opcional): flujos críticos (auth, envío de formularios).

## 12) Observabilidad
- Monitoreo de errores (Sentry) y logs.
- Métricas de uso (Netlify Analytics, Supabase logs).
- Alertas sobre fallos de build/deploy/webhooks.

## 13) CI/CD
- Pipelines: lint, test, build, preview.
- Webhooks de Contentful → trigger build en Netlify.
- Post‑deploy checks: smoke tests y validaciones de rutas.
- Rollbacks y estrategia de releases.

## 14) Despliegue a Producción
- `netlify.toml`: headers, redirects, caché.
- Variables de entorno seguras; CDN y edge caching.
- Checklist de lanzamiento (abajo) y plan de contingencia.

## 15) Operación y Mantenimiento
- Versionado de modelos (CMA/migraciones) y documentación viva.
- Auditorías periódicas de performance y seguridad.
- Limpieza de contenidos y archivado; gobernanza de roles.

# Diagramas Conceptuales (texto)
- Capa UI → Hooks → Services(CMS/BD) → Utils → Context.
- CMS (CDA/CPA) y BD (REST/SDK) alimentan servicios; mappers transforman a modelos frontend; cache en memoria/indexedDB para PWA.
- Webhooks: CMS → CI → Netlify Build → Deploy.

# Checklists
- Pre‑modelado:
  - Definir tipos, slugs, taxonomías, relaciones y estados.
  - Reglas de validación y objetos reusables (SEO/Author/SocialLinks).
- Pre‑integración:
  - Mappers de `Entry/Asset` → tipos frontend.
  - Endpoints/queries y paginación; errores y retries.
- Pre‑deploy:
  - Lint/tests verdes, build estable.
  - Variables de entorno y secretos configurados.
  - Lighthouse ≥ 90 en PWA; smoke tests.

# Comandos y Configuración
- Dependencias:
  - `npm install contentful @contentful/rich-text-react-renderer`
  - `npm install @supabase/supabase-js`
  - `npm install vitest @testing-library/react @testing-library/jest-dom`
  - `npm install workbox-build` (o plugin PWA)
- Variables de entorno:
  - `VITE_CONTENTFUL_SPACE_ID`, `VITE_CONTENTFUL_ACCESS_TOKEN`, `VITE_CONTENTFUL_ENVIRONMENT`
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Scripts:
  - `npm run dev` — desarrollo
  - `npm run test` — pruebas
  - `npm run build` — producción

# Roles y Responsabilidades
- Product/UX: ideación, IA/maquetación, accesibilidad.
- Dev Frontend: componentes, hooks, PWA, integración CMS.
- Dev Backend/Data: BD, auth, APIs, migraciones.
- Content Ops: gestión de contenidos, workflows y publicaciones.
- DevOps: CI/CD, observabilidad, seguridad.

# Riesgos y Mitigaciones
- Minificación agresiva en vendor (ver `ProductionInitError.md`) → usar `esbuild` y chunks manuales.
- Invalidez de caché PWA ante cambios de contenido → versionar SW y controlar TTL.
- Slugs duplicados → validaciones en CMS + checks en build.
- Fugas de secretos `.env` → políticas y revisiones.

# Guía de Estudio (Complementaria)
- Semana A: Modelado CMS y taxonomías; migraciones CMA.
- Semana B: Integración CDA/GraphQL + mappers; preview mode.
- Semana C: BD y auth; testing de servicios; estrategias de caché PWA.
- Semana D: CI/CD, webhooks, observabilidad; optimización y seguridad.