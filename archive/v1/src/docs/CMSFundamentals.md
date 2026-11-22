---
title: Fundamentos y Patrones Reusables (CMS)
description: Terminología, patrones reusables y guía de estudio para CMS headless como Contentful.
---

# Objetivo

Establecer una base sólida de conceptos, terminología y patrones reusables para trabajar con CMS headless (especialmente Contentful), relacionándolos con el modelado implementado en `ContentfulModels.md` y el frontend del workspace.

## Terminología Canónica (EN/ES)
- Content Type (Tipo de Contenido): esquema que define campos y validaciones.
- Entry (Entrada): instancia de un Content Type con valores de campos.
- Asset (Recurso): archivo multimedia administrado por el CMS (imágenes, docs, etc.).
- Space (Espacio): contenedor lógico del contenido y configuración.
- Environment (Entorno): variante del espacio para workflows (ej.: `master`, `staging`).
- Locale (Idioma/Localización): configuración para contenidos multilenguaje.
- Editor Interface (Interfaz del Editor): UI y ayudas del editor para cada campo.
- Field (Campo): unidad de datos dentro de un Content Type (tipo + validaciones).
- Validation (Validación): reglas para valores válidos (required, regex, opciones, rango).
- Reference/Link (Referencia): campo que relaciona entradas entre tipos distintos.
- Array/List (Lista): colección de valores (ej. `tags: string[]`).
- Symbol (Texto corto): cadena breve (ej.: `title`, `slug`).
- Text (Texto largo): cadena extensa sin formato.
- Rich Text (Texto enriquecido): contenido estructurado con bloques, enlaces, assets.
- Boolean (Booleano), Integer/Number (Entero/Número), Date/Time (Fecha/Hora), Location (Ubicación), JSON Object (Objeto).
- Slug: identificador legible para URL; único por type, formato kebab-case.
- Taxonomy (Taxonomía): categorización con `tags`, `category` u otros.
- Status (Estado): ciclo de vida de publicación (ej.: `draft`, `published`, `archived`).
- Publishing Workflow (Flujo de publicación): estados, revisiones y permisos.

## Patrones Reusables de Modelado

Estos tipos/objetos se recomiendan para reutilización transversal en varios Content Types:

**SEO**
- `metaTitle` (Short text)
- `metaDescription` (Long text)
- `keywords` (Short text, List)
- `ogImage` (Media)

**Author**
- `name` (Short text)
- `role` (Short text)
- `bio` (Long text)
- `avatar` (Media)
- `socialLinks` (Object) con `github`, `linkedin`, `twitter`, `email`

**SocialLinks**
- `github`, `linkedin`, `twitter`, `email` (Short text)

**Image/Gallery**
- `image` (Media)
- `gallery` (Media, Multiple files)

**Taxonomy**
- `tags` (Short text, List)
- `category` (Short text, opciones controladas)

**CTA Block (Llamado a la acción)**
- `title` (Short text)
- `description` (Long text)
- `buttonText` (Short text)
- `url` (Short text)

**Timeline Entry**
- `title`, `organization`, `description`, `startDate`, `endDate`, `dateRangeDisplay`, `iconKey`, `order`

**Testimonial**
- `name`, `role`, `company`, `quote`, `image`, `order`

**Site Settings**
- `siteName`, `siteDescription`, `author`, `socialLinks`, `seoSettings`

## Buenas Prácticas de Nomenclatura
- Content Type IDs: `kebab-case` y específicos (ej.: `blogPost`, `project`, `work`, `testimonial`).
- Campos: nombres descriptivos y consistentes (`shortDescription`, `longDescription`, `publishDate`).
- Slugs: únicos por tipo; regex recomendada `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Opciones: listas cerradas para `category`, `status`, `iconKey`.
- Orden: `order` como entero positivo para controlar listados.

## Mapeo con el Frontend del Workspace
- `ProjectFields.shortDescription` → `Project.description`.
- `ProjectFields.longDescription` → `Project.fullDescription`.
- `technologies` (CMS) ↔ `tech` (frontend).
- `featuredImage`/`image` (`Asset`) → URL de `image: string`.
- `BlogFields.readTime`: string tipo `"5 min read"` (mantener convención).
- `status` → derivar `published: boolean` en frontend.
- Ver documento `src/docs/ContentfulModels.md` para detalles de cada modelo.

## Arquitectura y APIs (Contentful)
- Content Delivery API (CDA): entrega de contenido publicado (REST/GraphQL).
- Content Preview API (CPA): acceso a contenidos en estado preview.
- Content Management API (CMA): creación/actualización de Content Types y Entries.
- GraphQL vs REST: GraphQL reduce sobrefetching y simplifica queries compuestas.
- Webhooks: disparadores ante cambios de contenido para CI/CD, revalidaciones, etc.
- Environments: aislar cambios; flujos `master`/`staging`/`dev`.
- Locales: i18n con fallback de idioma; modelar campos multilenguaje.
- Caching/Preview: gestionar caché y bypass en preview; invalidar ante publicación.
- Roles/Permisos: gobernanza de edición y publicación.
- Rate Limiting: respetar límites API; aplicar backoff y retries.

## Flujo de Desarrollo Fullstack con CMS
1) Modelar Content Types y validaciones (en CMS y tipado TS).
2) Implementar servicios (`src/services/contentful.ts`) para CDA/CPA/CMA.
3) Diseñar transformadores (mappers) de `Entry/Asset` → modelos de frontend.
4) Integrar GraphQL/REST; gestionar paginación, filtros y orden.
5) Añadir `preview mode` y flags `draft/published`.
6) Implementar i18n con `Locale` y fallbacks.
7) Configurar SEO (metas, `ogImage`) y taxonomías.
8) Pruebas unitarias/integración para servicios y mappers.
9) CI/CD con migraciones de esquemas (CMA), webhooks y despliegue.
10) Observabilidad: logs, métricas y alertas sobre entrega de contenido.

## Guía de Estudio (4 semanas)

**Semana 1: Fundamentos y Modelado**
- Leer documentación: Content Types, Fields, Validations, Locales.
- Práctica: definir `project`, `blogPost`, `work`, `testimonial`, `siteSettings`.
- Ejercicio: crear `SEO` y `Author` como objetos reusables.

**Semana 2: APIs y Entrega de Contenido**
- Estudiar CDA/CPA, diferencias y casos de uso.
- Implementar consultas REST y GraphQL en `contentful.ts`.
- Práctica: mapper `Entry/Asset` → `Project/BlogPost/Work`.

**Semana 3: i18n, Preview y Webhooks**
- Configurar `Locale` con fallback.
- Implementar `preview mode` y estrategia de caché.
- Crear webhooks para revalidar despliegues y notificaciones.

**Semana 4: Migraciones, CI/CD y Performance**
- Explorar CMA para migrar cambios de esquema.
- Automatizar pipeline con validaciones y pruebas.
- Optimizar performance: paginación, filtros, cache-control, edge/CDN.

## Mini‑proyectos sugeridos
- Blog con GraphQL y preview, SEO y tags.
- Portafolio de proyectos con `featured` y orden manual.
- Timeline interactivo con datos del CMS.
- Sección de testimonials con scroll horizontal e igualación de alturas.

## Recursos recomendados
- Contentful Docs – Content Delivery API (CDA): https://www.contentful.com/developers/docs/references/content-delivery-api/
- Contentful Docs – Content Management API (CMA): https://www.contentful.com/developers/docs/references/content-management-api/
- Contentful GraphQL API: https://www.contentful.com/developers/docs/references/graphql/
- Rich Text – Rendering: https://www.contentful.com/developers/docs/concepts/rich-text/
- Migrations con CMA: https://www.contentful.com/developers/docs/concepts/migrations/