# Work vs Projects - Content Management Guide

Este documento explica la diferencia entre **Work** y **Projects** en tu portfolio y cómo gestionar el contenido a través de Sanity CMS.

## Diferencias Conceptuales

### 🏢 Work (Trabajos Profesionales)
- **Propósito**: Mostrar trabajos profesionales de gran envergadura
- **Características**:
  - Proyectos empresariales o comerciales
  - Incluyen premios y reconocimientos
  - Categorías específicas (Web Application, E-Commerce, etc.)
  - Descripciones más detalladas del impacto empresarial
  - Enlaces a demos en vivo y repositorios

### 💻 Projects (Proyectos Personales)
- **Propósito**: Mostrar proyectos personales y técnicos
- **Características**:
  - Proyectos de desarrollo personal
  - Enfoque en tecnologías y aprendizaje
  - Descripciones técnicas detalladas
  - Categorías más amplias

## Estructura de Datos

### Work Schema
```typescript
interface Work {
  title: string;
  slug: string;
  category: string; // 'Web Application', 'E-Commerce', etc.
  description: string;
  image: SanityImage;
  awards?: string[]; // Premios y reconocimientos
  tech: string[]; // Tecnologías utilizadas
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}
```

### Project Schema
```typescript
interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  image: SanityImage;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'other';
  featured: boolean;
  awards?: string[];
  order: number;
}
```

## Cómo Gestionar Contenido

### 1. Acceder al CMS
1. Ejecuta `npm run dev` en la carpeta `/studio`
2. Abre http://localhost:3333/
3. Inicia sesión con tu cuenta de Sanity

### 2. Agregar Work Items
1. En el CMS, selecciona "Work" en el menú lateral
2. Haz clic en "Create new Work"
3. Completa los campos:
   - **Title**: Nombre del proyecto profesional
   - **Slug**: URL amigable (se genera automáticamente)
   - **Category**: Selecciona la categoría apropiada
   - **Description**: Descripción del proyecto y su impacto
   - **Image**: Imagen principal del proyecto
   - **Awards**: Lista de premios o reconocimientos
   - **Technologies**: Tecnologías utilizadas
   - **Live URL**: Enlace al proyecto en vivo
   - **GitHub URL**: Enlace al repositorio
   - **Featured**: Marcar si debe aparecer destacado
   - **Order**: Orden de visualización

### 3. Agregar Projects
1. En el CMS, selecciona "Project" en el menú lateral
2. Sigue un proceso similar, pero enfócate en:
   - Aspectos técnicos del proyecto
   - Tecnologías aprendidas
   - Desafíos superados

## Componentes Frontend

### Work Component
- **Ubicación**: `/src/components/Work.tsx`
- **Hook**: `useWork()` desde `/src/hooks/useWork.ts`
- **Página de detalle**: `/src/pages/work/WorkDetail.tsx`
- **Ruta**: `/#work` y `/work/{slug}`

### Projects Component
- **Ubicación**: `/src/components/Projects.tsx`
- **Hook**: `useProjects()` desde `/src/hooks/useProjects.ts`
- **Ruta**: `/#projects`

## Configuración Técnica

### Sanity Configuration
- **Project ID**: `9tc8hhiy`
- **Dataset**: `production`
- **Schemas**: `/studio/schemaTypes/work.ts` y `/studio/schemaTypes/project.ts`

### Queries GROQ
```groq
// Obtener todos los works
*[_type == "work"] | order(order asc, _createdAt desc)

// Obtener work por slug
*[_type == "work" && slug.current == $slug][0]

// Obtener todos los projects
*[_type == "project"] | order(order asc, _createdAt desc)
```

## Mejores Prácticas

1. **Imágenes**: Usa imágenes de alta calidad (mínimo 800x500px)
2. **SEO**: Completa siempre el campo `alt` de las imágenes
3. **Orden**: Usa el campo `order` para controlar la secuencia de visualización
4. **Categorías**: Mantén consistencia en las categorías
5. **URLs**: Asegúrate de que las URLs externas funcionen correctamente

## Troubleshooting

### Error de conexión con Sanity
- Verifica que el Project ID sea correcto (`9tc8hhiy`)
- Asegúrate de que el Sanity Studio esté ejecutándose
- Revisa las credenciales de autenticación

### Imágenes no se cargan
- Verifica que la imagen esté subida correctamente en Sanity
- Revisa la configuración de `urlFor()` en `/src/lib/sanity.ts`

### Contenido no aparece
- Verifica que el contenido esté publicado en Sanity
- Revisa las queries GROQ en `/src/lib/sanity.ts`
- Comprueba los hooks en `/src/hooks/`