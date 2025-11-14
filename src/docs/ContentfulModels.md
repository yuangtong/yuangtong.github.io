---
title: Modelos de Contenido (Contentful)
description: Definiciones de Content Types y validaciones para la integración con el CMS.
---

# 1.2 Crear Modelos de Contenido

Este documento define los modelos de contenido de Contentful basados en el código del workspace. Incluye IDs de tipos, campos, validaciones sugeridas y notas de mapeo con el frontend.

## Convenciones Generales
- `slug` único por tipo de contenido; formato kebab-case.
- Imágenes como `Asset` con `title`, `fileName`, `contentType` y `url`.
- Campos de texto enriquecido recomendados para contenido largo (`Rich text`).
- Listas de etiquetas (`tags`, `technologies`) como arrays de texto.
- Campos `order` para ordenar manualmente.

## 1.2.1 Modelo: Project
Content Type ID: `project`

Fields:
```
├── title (Short text) - Required
├── slug (Short text) - Required, Unique
├── shortDescription (Short text) - Required
├── longDescription (Rich text) - Optional
├── technologies (Short text, List)
├── category (Short text) - Options: "web", "mobile", "desktop", "other"
├── featured (Boolean)
├── liveUrl (Short text)
├── githubUrl (Short text)
├── image (Media) - Single file
├── order (Integer)
└── seo (Object) - Optional
    ├── metaTitle (Short text)
    ├── metaDescription (Long text)
    └── keywords (Short text, List)
```

Notas de mapeo (frontend):
- `ProjectFields` → `Project` (transforma `Asset` a `image: string`, agrega `createdAt`, `updatedAt`).
- En el frontend existe `description`/`fullDescription`; se sugiere mapear `shortDescription` → `description` y `longDescription` → `fullDescription`.

## 1.2.2 Modelo: Blog Post
Content Type ID: `blogPost`

Fields:
```
├── title (Short text) - Required
├── slug (Short text) - Required, Unique
├── excerpt (Long text) - Required
├── content (Rich text) - Required
├── author (Short text)
├── publishDate (Date) - Required
├── readTime (Short text) - Ej.: "5 min read"
├── category (Short text)
├── featured (Boolean)
├── tags (Short text, List)
├── featuredImage (Media) - Single file
├── gallery (Media, Multiple files) - Optional
├── status (Short text) - Options: "draft", "published", "archived"
└── seo (Object) - Optional
    ├── metaTitle (Short text)
    ├── metaDescription (Long text)
    └── keywords (Short text, List)
```

Notas de mapeo (frontend):
- `BlogFields` incluye `published: boolean`; recomendado derivar de `status`.
- `featuredImage` se transforma a `image: string` en `BlogPost`.

## 1.2.3 Modelo: Work
Content Type ID: `work`

Fields:
```
├── title (Short text) - Required
├── slug (Short text) - Required, Unique
├── category (Short text) - Required
├── description (Long text) - Required
├── image (Media) - Single file
├── awards (Short text, List) - Optional
├── technologies (Short text, List)
├── liveUrl (Short text)
├── githubUrl (Short text)
├── featured (Boolean)
└── order (Integer)
```

Notas de mapeo (frontend):
- `WorkFields` → `Work` (transforma `Asset` a `image: string`).
- `technologies` se mapea a `tech` en el frontend.

## 1.2.4 Modelo: Testimonial
Content Type ID: `testimonial`

Fields:
```
├── name (Short text) - Required
├── role (Short text)
├── company (Short text)
├── quote (Long text) - Required
├── image (Media) - Single file - Optional
└── order (Integer)
```

Notas de mapeo (frontend):
- Se usa como lista en `Testimonials` (scroll horizontal) y se consume vía `useContent('testimonials')`.

## 1.2.5 Modelo: Site Settings
Content Type ID: `siteSettings`

Fields:
```
├── siteName (Short text) - Required
├── siteDescription (Long text) - Required
├── author (Short text)
├── socialLinks (Object)
│   ├── github (Short text)
│   ├── linkedin (Short text)
│   ├── twitter (Short text)
│   └── email (Short text)
└── seoSettings (Object)
    ├── metaTitle (Short text)
    ├── metaDescription (Long text)
    └── ogImage (Media)
```

Notas:
- Centraliza metadatos globales y enlaces sociales.
- `ogImage` como `Asset` para compartir en redes.

## 1.2.6 Modelo: Timeline Entry
Content Type ID: `timelineEntry`

Fields:
```
├── title (Short text) - Required
├── organization (Short text)
├── description (Long text)
├── startDate (Date) - Required
├── endDate (Date) - Optional
├── dateRangeDisplay (Short text) - Ej.: "2024 – Present"
├── iconKey (Short text) - Options: "briefcase", "graduation", "award", "code", "management", "milestone"
└── order (Integer)
```

Notas:
- Preparado para futura integración CMS del CV (`timeline.ts`).

## Validaciones y Reglas Sugeridas
- `slug`: único por modelo; validar con regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- `category` en `project` y `work`: usar opciones predefinidas.
- `readTime`: formato `"N min read"` o número de minutos (definir convención).
- `featured`: boolean usado para destacar en Home.
- `order`: entero positivo; usar para orden manual en listados.

## Mapeo con el Workspace
- Tipos fuente: `src/types/contentful.ts` y `src/types/testimonials.ts`.
- Servicios: `src/services/contentful.ts` (métodos stub listos para integrar cuando se instale Contentful SDK).
- Consumo de contenidos: `src/hooks/useContent.ts` (actualmente lee de `content.json` pero preparado para migrar).
- Secciones: Projects, Blog, Work, Testimonials renderizan campos aquí definidos.

## Notas de Implementación
- SDK sugerido: `contentful` + `@contentful/rich-text-react-renderer`.
- Transformar `Asset` a URL segura y alt text desde `fields.title`.
- Mantener `publishDate` en ISO 8601 (ej.: `YYYY-MM-DD`).
- Derivar `published` desde `status` para gobernar visibilidad.