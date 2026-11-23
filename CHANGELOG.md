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

- [ ] Push the tag `v1.0.0` on commit `db6054a` (the branch `version-2025` already holds version 1).
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
- [ ] Mobile framing of the opening: on portrait screens the canvas is
      cropped like `object-fit: cover`; the horse needs its own framing there.
- [ ] Real links for Upwork and Instagram, and note dates and reading times.
- [ ] Where the landing ends, and whether Sisyphus moves to "historias".
- [ ] Section flow from design G8: lab with three doors (historias, cámara,
      archivo.exe), estudio v3, contacto v2 (dot-grid globe, Natural Earth),
      one active tab and the "carcoma" transition.
- [ ] Lab and notes routes (`/lab/[id]`, `/notas/[slug]`); the copied links
      already point to `/lab/[id]?celda=`.
- [ ] Folk Club webfont for the stitched "hablemos" (Dancing Script stands in).
- [ ] Logo and favicon: pick one of the proposals in the design canvas.

### Added
- `docs/LAB.md`: the plan of the lab agreed with the owner (2026-11-23): the index in two groups with live previews on hover; mentilola (Menta and Lola) as one dither lab with about 32 algorithms; cámara, where a pinched hand draws a trail of glyphs through MediaPipe in the browser; dona de teselas, píxeles ácidos with the carcoma, and sólidos de glifos.
- Home G7.5 (canvas, approved 2026-11-22):
  - the gallop leaves sparks: each stride the hooves and the back throw blue sparks onto the dot grid that drift behind the horse, twinkle and cool back into the grey (hero only, not with reduced motion);
  - the role line sits lower so the name's descenders no longer touch it, and on phones (唐源) is larger and in weight 400 beside "tong";
  - the dithered cursor (`DitherCursor`, canvas "cursor tramado"): a small disc of 6 px cells, ordered so its edge breaks up, with a short trail from signal blue to the pale echo and a small ring on click. No lens; the system cursor stays. It is on in the section pages and on the landing once the story is over, off for touch and reduced motion. Over the letter horse the letters it passes scramble into glyph noise and settle back;
  - the titles of the lab, notes and contact sheets come out of glyph noise as their sheet opens, the same decode as "jugar con los píxeles";
  - the studio sheet (canvas "hoja studio v2"): only the word FOMMO glitches, and FOMMO's colours break out of it and slowly take the blue around it, then let go and start again. "entrar" goes through the carcoma to /studio and its own animation. `createStudio` takes `paper` and `halo`; the sheet's `brand` names the word.
- The landing opens with the rider on the horse, in the same dot grid and the horse's blue, with the photograph's tones (dark jacket and cap, light breeches). As the void starts to open he dissolves cell by cell through the ordered threshold, and only the horse goes on (owner, 2026-11-22). The rider (`public/media/galope-jinete.png`, 15 frames of 300 x 176, tones on the horse's scale) is taken out of Muybridge's original photographs (public domain) and aligned to the silhouettes; `loadRider` loads them, and the engine's `rider` option draws them. The lab piece of sísifo feliz starts without him.
- Travesía ácida as a piece in the lab at `/lab/travesia` (canvas "lab: travesía ácida"), with the crumb "02 el lab / travesía ácida" and its door in the lab. It is the landing's void with no bottom: nested squares turn in the dot grid, the zoom never ends, and every twelve layers the acid changes (azul, violeta, rojo, amarillo), dithered over three layers.
  - Scroll moves you through it, forward and back, and it also drifts on its own. While the pointer is over it, the scroll moves the tunnel and not the page. The centre follows the cursor.
  - On phones, swiping up goes deeper and a tap changes the colour.
  - Controls: cell (4, 8, 16 px) and colour ("todos los ácidos" or one), "pantalla completa" with the browser's full screen and "cerrar", and "copiar enlace" with the cell, colour and depth. A shared link opens with them.
  - Reduced motion holds a still tunnel.

  `TravesiaPage` and `getTravesiaPage` carry its copy; the ramps are tokens (`travesia`).
- A note page at `/notas/[slug]` from design G ("notas: una nota"), with the crumb "03 notas / quitarle el jinete". The first note, "quitarle el jinete a un galope de 1878", has:
  - the meta column (back to all notes, date, reading time worked out from the text, what it is about) and the title with its lead;
  - the before and after figures (Muybridge, public domain), the text in a column with its code listing, and the links to the lab and the next note.

  The card in the notes index now leads to it, and the cards go through the carcoma. `NotePage`, `NoteBlock`, `getNote` and `getNoteSlugs` carry notes as content, so the CMS can feed them later.
- The 404 from design G, reworked with the owner (2026-11-22). The number stands whole in a dot matrix; the horse gallops in, crashes into it, and the dots fly and pile up on the floor like sand. What is left of the number gives way after the horse has passed, then the number gathers itself again and the horse comes back. Reduced motion gets one composed frame of the crash. The page has the site header, "volver al inicio" and "ir al lab".
- Lalande, lágrimas de ángel, as a piece in the lab at `/lab/lalande` (design "Lalande v4", Historias project), with the crumb "02 el lab / Lalande". As you scroll:
  - the horse in the air comes apart and its letters spell "Lalande";
  - the word becomes a drop that falls on a small narcissus against a dithered blue sky, with two quotes from Clarice Lispector, and the pointer is the breeze;
  - the narcissus spins and implodes into red, and the real book (Perto do coração selvagem, Rocco) is born from that point, turns and opens on its quote;
  - the close is embroidered in cross-stitch and ends on "de nuevo".

  The 1440 x 900 scene keeps its scale on the tighter axis, and the grid fills the rest. The lab gets its "Lalande" door. Dancing Script (OFL) is added for the embroidered close only (`--font-cursive`), and the book and scene colours are tokens. `LalandePage` and `getLalandePage` carry its copy.
- Sísifo as a piece in the lab at `/lab/sisifo`, with the crumb "02 el lab / Sísifo": the landing's story on its own page with the narration on (the three lines, Camus' quote and the coda), from the gallop through the dive and the hill to the horse in letters, where "de nuevo" goes back to the start. The landing keeps telling it with the animation only. The lab's "historias" door becomes the "Sísifo" door; stories are pieces in the lab with their own names (owner decision, 2026-11-22). `StoryPage` and `getSisyphusPage` carry its copy.
- Contact at `/contacto` from design G8 (contacto v2): a dot-grid globe with land from Natural Earth 1:110m (public domain), rasterized to 2-degree cells, that turns and can be dragged; a great-circle arc in dots joins Lima with the visitor's place, taken from the time zone without asking for a location. Two clocks (Lima and the visitor), the email and GitHub; Upwork and Instagram stay off until their real links are in content. `ContactPage` carries the clock, globe and place strings; `ContactLink` adds the handle.
- Studio at `/studio` from design G8 (estudio v3): acid shapes land on the edges in FOMMO's colours and eat the paper, their front a flicker of glyphs; the colour heals through a Bayer threshold and falls as glyph rain, and "FOMMO Studio" splits its colour now and then. It leans toward the pointer. One line about the studio and "ir a la página de FOMMO"; no FOMMO typography. Reduced motion gets one composed still frame. `StudioPage` now carries `eyebrow`, `name`, `lead`, `cta` and `canvasLabel`; FOMMO's colours are tokens (`fommoLines`).
- archivo.exe at `/lab/archivo` (design G8, Archivo-v2), with the crumb "lab / archivo.exe": our own 1998 desktop over teal, opened inside the lab. Eight photos from 2017 as prints that can be dragged and opened; each window re-screens its photo with the cell (2, 4, 8, 16, original) and the palette (tinta, azul, rojo, ácida, color), sharpening from coarse to fine. Minimize, maximize, the start menu, the taskbar with the Lima clock, a shared link that reopens the photo with its cell and palette, and a phone layout without dragging.
- The three doors of the lab (historias, cámara, archivo.exe) above the pieces.
- Pixel-art icons of our own for archivo.exe (`src/lib/pixel-icons.ts`) and the `w98` tokens for its bevels and desk.
- Content types `LabDoor`, `ArchivePhoto`, `ArchivePage` and `Settings.crumbs`, with the loader `getArchivePage`, ready for the CMS agent to feed the photos from Sanity.
- Section flow from design G8 (part 1): the sections are their own pages
  (`/lab`, `/notas`, `/studio`, `/contacto`) under one header with the canvas
  navigation and one active tab, and a crumb only for a sub-level. Moving
  between sections goes through the "carcoma": six shapes from Acid Dither
  Shapes grow at 12 fps in difference mode, an ordered Bayer screen covers the
  page, the section changes underneath and the carcoma retreats. Reduced motion
  navigates without it.
- Option A for the end of the landing: the sheets still open and fold into the
  index strips, but each one shows a short view with "entrar", which goes to
  the full section. "jugar con los píxeles" stays complete in the landing.

### Changed

- The link preview shows the current design and speaks English (owner, 2026-11-23): a new thumbnail (`public/social-preview-g75.jpg`, 2400 x 1260) with the name, (唐源), "web designer & creative coder", yuangtong.dev and the horse with its rider in blue dots, and the Open Graph and X title, description and alt text in English, as content (`Settings.share`). The old thumbnail of version 1 is removed; the new file name makes the platforms fetch it again.
- The step from the end of the story into "jugar con los píxeles" is shorter: the text phase goes from 1800 to 1000 design pixels of scroll on desktop and from 1500 to 900 on phones (owner, 2026-11-22).
- The pointer over the letter horse is no longer a lens: letters it passes over are nudged along its path and settle back. The hint "mueve el cursor: las letras se apartan" is gone, and `Jugar` keeps only its title.
- The stories are named in lower case: "sísifo feliz" and "lalande, lágrimas de ángel", with their quotes, sources, close and crumbs in lower case too (owner, 2026-11-22). The word the horse spells in lalande is content (`word`).
- The section pages share the landing's header (G7.4): the status and the navigation sit on the rule over a paper-2 band, and below it the section's folded strip, numbered as on the landing ("02 el lab"), with the crumb for a sub-level ("02 el lab / archivo.exe"). The active section is underlined in signal instead of a blue tab. The navigation and strip labels are content (`navLabel`, `crumbLabel`).
- On phones the menu opens through the carcoma: the shapes cover the screen and the menu is there when they clear (owner idea, 2026-11-22). `useCarcoma()` now takes a path or a change to make while the screen is covered.
- Home page moved to design G7.4 (desktop and phone): the hero gallop, the
  spiral void, Sisyphus without written narration (it stays available in
  content), the drop in resolution that turns the horse into letters with
  matrix rain and the decoded title "jugar con los píxeles" (letters move away
  from the pointer), and five sheets (jugar, lab, notas, studio, contacto) that
  open on arrival and fold into strips that work as the index. The landing ends
  there. One engine (`src/lib/landing-engine.ts`) with a desktop and a phone
  configuration; the stage keeps its design size and scales to the window.
- The landing fills the window edge to edge: the stage keeps the design
  scale on the tighter axis and extends on the other, moving the scene anchors
  with it, instead of scaling a fixed 1440 x 900 frame with paper margins.
- Navigation from the design canvas: on desktop the status and "sobre mí, lab,
  studio, notas, contacto"; on phones a "menú" button that opens the
  full-screen menu (name, close, large section links, contact links and the
  Lima clock). The sheets and strips stay as in G7.4.
- Notes keep the dithered cards in three accents; contact uses
  hola@yuangtong.dev, Upwork, Instagram and GitHub.
- Removed the floating acid shapes from the home page (the owner rejected
  stickers over the layout) and the stitched "hablemos" closing.

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

- Version 1 (Vite) is kept in the branches `version-1` and `version-2025` on `db6054a` and
  removed from version 2, leftovers included (`node_modules 2/`, `nohup.out`,
  `vite.config.ts.timestamp-*.mjs`).
- Hosting is Vercel only: `netlify.toml` and the version 1 translation
  function are removed (they remain in `version-2025`). `package.json` declares `engines.node >= 20.9`,
  as Next.js 16 requires.
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
