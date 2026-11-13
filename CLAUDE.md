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

- `main` still holds version 1 of the site (React, Vite, Tailwind, Netlify) and
  keeps serving `yuangtong.dev` until the owner decides the switch. Version 1 is
  to be preserved, not deleted.
- The redesign (version 2) is developed on feature branches.
- The CMS is Sanity (owner decision, 2026-11-13). The framework for version 2
  is not decided yet; do not migrate it without the owner's answer.

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
- The horse stays as the recurring figure. Its narrative is the owner's to
  write and is still pending; do not invent story beats or final copy.
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
