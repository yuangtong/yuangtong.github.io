# Changelog

All notable changes to the yuangtong.dev portfolio are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Traceability rule: every commit that changes product code or documentation must
update this file under `[Unreleased]` in the same commit. See
[docs/VERSIONING.md](docs/VERSIONING.md).

## [Unreleased]

### Pending

Owner decisions and housekeeping, to pick up later:

- [ ] Archive version 1: tag `v1.0.0` and an archive branch on commit `db6054a`.
- [ ] The narrative the horse carries through the site.
- [ ] Which current projects stay here and which move to the studio's site.
- [ ] Site languages and which one is the source.
- [ ] Lab piece "Camara tramada": a live camera, photo or video rendered
      through the site's dithering effects (two-ink Bayer, error diffusion,
      dot mesh, tiles, glyphs), with the effect applied only inside moving
      blobs over the untouched image. Prototyped outside the repository; to be
      built as the first lab piece once the Next.js migration starts.
- [ ] Refine the blobs of that piece: organic contour deformed by noise,
      less regular motion, and an edge that dissolves into dither instead of
      a hard per-cell cut. Consider a shader if more resolution is needed.
- [ ] Hand tracking for that piece with MediaPipe in the browser
      (`@mediapipe/tasks-vision`, hand landmarker): a blob follows the
      fingertip and leaves a trail. Runs on the visitor's device, no Python
      and no server; load the model only when the camera is turned on.
- [ ] Remove tracked leftovers, now under `archive/v1/`: `node_modules 2/`,
      `package-lock 2.json`, `nohup.out` and three `vite.config.ts.timestamp-*.mjs` files.
- [ ] Mobile framing of the opening: on portrait screens the canvas is
      cropped like `object-fit: cover`; the horse needs its own framing there.
- [ ] Real values for the placeholders in content: contact links and email,
      reply time, availability date, note dates and reading times.
- [ ] Lab and notes routes (`/lab/[id]`, `/notas/[slug]`); the copied links
      already point to `/lab/[id]?celda=`.
- [ ] Folk Club webfont for the stitched "hablemos" (Dancing Script stands in).
- [ ] Logo and favicon: pick one of the proposals in the design canvas.

### Added

- Version 2 home page on Next.js 16 (App Router), built from home G7.3 and G6:
  the narrated opening (hero, spiral void, Muybridge's 1878 gallop told as
  Sisyphus, frame strip), the lab with live dithered cards, cell sizes and
  copy-link, studio, notes as dithered cards in three accents, and the closing
  with the stitched "hablemos", a live Lima clock and contact facts. Floating
  shapes from Pixelbuddha's Acid Dither Shapes (commercial license) cycle
  their tones through the accent ramps. `prefers-reduced-motion` gets still
  frames everywhere.
- Content contract in `src/content/` (`types.ts`, fixtures and loaders) for the
  CMS agent to connect Sanity behind.
- Token layer in `src/app/tokens.css` and `src/lib/tokens.ts`.
- `.env.example` with `NEXT_PUBLIC_SITE_URL`.
- `vercel.json` sets the framework to Next.js for this branch; the Vercel
  project is still configured for Vite (output `dist`), which `main` keeps using.

### Changed

- Version 1 (Vite) moved to `archive/v1/` on this branch; `main` keeps serving
  it until the owner switches. Netlify now builds Next.js.
- The version 1 translation function (`netlify/functions/translate.js`, which
  needs `axios`) moved to `archive/v1/netlify/functions/`; version 2 does not
  call it, and it broke the Netlify build.
- Node.js 22 pinned for Netlify (`netlify.toml`) and `engines.node >= 20.9`
  in `package.json`, as Next.js 16 requires.
- `CLAUDE.md`: hero role label "creative coder y diseñador web", the Sisyphus
  narrative for the horse, and the migration status.

### Changed

- Hero copy direction in `CLAUDE.md`: the role label "diseñador web y
  programador creativo" ("web designer and creative coder") replaces the
  statement "¿yo?, hago lo que quiero". The lab will also cover Strudel and
  Hydra.

- Design direction in `CLAUDE.md`: no literal "creative coder" claim, the
  "studio" section only points to FOMMO, the lab covers code, photography and
  music, and the language selector lists languages the owner wants to learn.

- Version 2 will be built on Next.js with the App Router instead of the Vite
  single-page app (owner decision, 2026-11-14). Recorded in `CLAUDE.md`; no
  code has been migrated yet.

### Added

- Design treatment for home exploration F (`docs/design/treatment-f.md`) and a
  filmography log (`docs/design/filmography.md`). The film notes in the
  treatment are written from memory and marked unverified.

- Cross-agent contract (`AGENTS.md`), repository rules (`CLAUDE.md`), this
  changelog and the versioning policy (`docs/VERSIONING.md`), adapted from the
  FOMMO Studio website. They define the UI agent and CMS agent roles, the
  content contract between them, the agent trailer and the design direction
  agreed for version 2.

## [1.0.0]

Retroactive baseline: the version 1 site (React, Vite, Tailwind, Framer Motion,
Netlify) as it stands on `main` at commit `db6054a`. Not tagged yet.
