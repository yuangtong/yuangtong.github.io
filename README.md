# Personal Portfolio Website

A modern, responsive portfolio website built with React and TypeScript. Features a clean, minimalist design with interactive elements and smooth animations.

## 🚀 Features

- Dark/Light mode toggle
- Multi-language support (EN/ES)
- Interactive cursor effects
- Smooth page transitions
- Responsive design
- Dynamic project showcase
- Blog integration

## 🛠️ Built With

- React
- TypeScript
- TailwindCSS
- Framer Motion
- React Router
- i18n

## 📦 Content Source & Data API

- Centralized content in `src/data/content.json` for `blogs`, `projects`, and `works`.
- Read data via the single hook `useContent(type)`, where `type` is `'blogs' | 'projects' | 'works'`.
- Detail views are unified with `ContentDetail` and list views use `ContentCard`.
- `src/data/timeline.ts` remains a separate TypeScript source consumed by `useCVTimeline`.

## 🧭 Navigation Patterns

- Detail and archive pages include the reusable `DetailNav` (Back + Home).
- `BackButton` provides accessible navigation with `aria-label="Go back"` and fallback to `/`.
