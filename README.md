# yuangtong.dev

Portfolio of Yuang Tong (唐源): creative coder and web designer in Lima.
Version 2 is a Next.js (App Router) site drawn as an indexed canvas: a cell
grid, ordered dithering and a four-entry palette.

## Run

```bash
npm install
npm run dev
```

`npm run build` builds for production; `npm run typecheck` checks types.
Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.

## Where things live

- `src/app/`: routes, fonts and the token layer (`tokens.css`).
- `src/components/`: sections of the home page.
- `src/content/`: the content contract (types, fixtures, loaders). See `AGENTS.md`.
- `src/lib/`: canvas engines, shared media loading and canvas tokens.
- `archive/v1/`: version 1 (Vite), kept for reference and excluded from the build.

Rules for contributors, human or AI: `CLAUDE.md` and `AGENTS.md`.
Changes: `CHANGELOG.md`.

Credits: the gallop is Eadweard Muybridge's, public domain. Floating shapes:
Acid Dither Shapes by Pixelbuddha, commercial license.
