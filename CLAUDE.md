# CLAUDE.md

Repository rules for the yuangtong.dev portfolio. These apply to every
contributor, human or AI.

## Agent collaboration (mandatory)

Two agents work on this repository: a UI agent (visual surface, UI, UX, canvas
work) and a CMS agent (Sanity integration). The contract between them is
[`AGENTS.md`](AGENTS.md) and it is binding: read it before starting.

In short:

- The UI agent builds against typed local content; the CMS agent connects
  Sanity behind the same types. Components never talk to the CMS directly.
- If the requested work belongs to the other role, say so and stop; wait for an
  explicit answer from the owner.
- Parallel work happens on separate branches. Foundational work has a single
  owner and merges first.
- Every commit that changes product code or documentation carries an
  `Agent: UI` or `Agent: CMS` trailer.

## Changelog traceability (mandatory)

Every commit that changes product code or product documentation MUST update
[`CHANGELOG.md`](CHANGELOG.md) under `[Unreleased]` in the same commit. The
full policy is in [`docs/VERSIONING.md`](docs/VERSIONING.md).

## State of the repository

- Hosting is Vercel; Netlify is no longer used (owner, 2026-11-22). Version 2
  builds there as Next.js (`vercel.json`).
- Version 1 of the site (React, Vite, Tailwind) is preserved in the branches
  `version-1` and `version-2025`, both on commit `db6054a`, for the owner to
  download. Version 2 replaces `main` completely; version 1 is not archived
  inside it. Do not delete those branches.
- The redesign (version 2) is developed on feature branches.
- The CMS is Sanity (owner decision, 2026-11-13).
- The site is in English at `/` and in Spanish at `/es` (owner, 2026-11-22).
  Routes live under `src/app/[lang]`; every content loader takes the locale,
  and content keeps canonical paths (`/lab`) that the loaders localize.
  Portuguese, Chinese (simplified) and Japanese will be machine translated
  with DeepL and marked as "learning".
- Every change applies to every language (owner, 2026-11-23). Layout, motion
  and structure live in components and are shared; content per language says
  the same thing. A change to one language's copy is made in all of them in
  the same commit, and a new visual detail never depends on how one
  language's text is written (see the tagline's fixed ampersand).
- Version 2 is built on Next.js with the App Router (owner decision,
  2026-11-14), replacing the Vite single-page app. Version 2 is live on `main`
  since 2026-11-22. The canonical landing is design G7.4 (desktop and phone);
  G7 to G7.3 are history. The section flow comes from design G8.
- The owner's design criteria live in the `fommo-criterio` skill: read it
  before proposing a visual direction, and wait for explicit confirmation.
- The visual direction is still being explored: the owner is collecting
  references and several design versions will be produced and combined. Treat
  the direction below as the current baseline, not as final.

## Design direction for version 2

Decided with the owner. Do not drift from these without asking.

- The owner presents as a creative coder who directs a bespoke studio. Client
  work moves to the studio's site; this site shows craft and experiments.
- The whole site is an indexed canvas: a low-resolution cell grid scaled
  without smoothing, 8x8 bitmap tiles, ordered (Bayer) dithering and a
  four-entry palette (paper, paper-2, ink, signal). The rules come from the
  `yuangtong/pixel-art-horse` repository.
- The default palette is cool grey paper with an ultramarine signal. Light and
  dark are palette swaps, not a separate theme.
- On the home page the cell grid fills the whole screen behind the content, and
  it carries no visitor controls. Controls (density, palette, parameters) belong
  to the pieces in the lab, where the visitor is invited to play.
- The horse stays as the recurring figure. Its narrative is the owner's: the
  opening tells Muybridge's 1878 gallop as Sisyphus (twelve photographs in half
  a second, the hill, the rock that rolls back, Camus' "hay que imaginarse a
  Sísifo feliz", and the close "crear es volver a empezar, hasta que algo
  vuele"). Approved with home G7.3, 2026-11-22; facts corrected against Spanish
  Wikipedia's "El caballo en movimiento" and the close rewritten without the
  word "code" (owner, 2026-11-27). The twelve threads stay in the animation as
  the trigger. Do not add story beats without asking.
- The hero carries the owner's name, his Chinese name (唐源) and a role label:
  two words joined by a fixed ampersand in every language, "(word) & (word)":
  "web designer & creative coder", "diseñador web & creative coder". Content
  holds only the two words; the "&" lives in the component and is never
  translated (owner, 2026-11-23; before it, "creative coder y diseñador web",
  home G7.3, 2026-11-22; before that,
  "diseñador web y programador creativo", 2026-11-21). It replaces the earlier statement
  "¿yo?, hago lo que quiero" and the earlier rule of never saying "creative
  coder".
- The section about FOMMO is called "studio". It only says that the owner
  directs FOMMO and sends visitors to the studio's site; no client projects
  are shown on this site.
- The lab holds every creative practice, not only code: creative coding,
  photography and music (DJ sets). It will also cover live coding with Strudel
  (music) and Hydra (visuals); not designed yet.
- The site is international. The language selector lists the languages the
  owner wants to learn, on purpose. Not designed yet.
- The page layer is minimal and editorial; the motion lives in the canvas.
  Content is always real DOM text. `prefers-reduced-motion` gets composed still
  frames, never a broken page.

## Respect the token layer

Colors, type roles and spacing are defined once in the token layer and consumed
from there. No hex values, font families or ad-hoc spacing in components. If a
new token is needed, add it to the token layer and document it.

## No emojis

No emojis anywhere in the repository: documentation, UI, logs, commit messages,
PR titles and bodies. Icons come from the project's icon library. Typographic
arrows used as UI copy are text glyphs and are allowed.

## Branching and promotion policy

- `main` is production. Merging or pushing to `main` requires explicit
  confirmation from the owner, every time.
- Feature branches: `feat/*`, `fix/*`, `docs/*`, `claude/*`, `cursor/*`. One
  change per branch, opened as a PR against `main` and reviewed on its preview
  deployment before merge.

## Environment and secrets

All secrets and environment-specific values come from environment variables;
never hardcode URLs, keys or project ids. Keep `.env.example` in sync with the
variables the code reads.

## Language

Documentation is written in English. Product copy language is the owner's
decision and lives in content, never hardcoded in components.
