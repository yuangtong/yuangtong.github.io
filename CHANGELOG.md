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
- Hero v2 (canvas "hero v2: todo cae menos el navbar", approved 2026-11-24): on the first scroll everything but the navigation comes loose. The availability line falls with the letters, the buttons and the scroll hint, and the blocks now land on the floor (without pushing the letters) so the void swallows them with the pile, instead of dropping out of view. Only the navigation and the phone's menu button stay still.
- "Keep scrolling" / "sigue bajando" (owner, 2026-11-24): whenever the visitor stops for more than a moment between the first scroll and the first sheet (about), a small line at the bottom of the stage blinks and bounces until they scroll again; it never shows on the sheets. Desktop and phones, every language (`intro.keepScrolling`). Reduced motion keeps it still.
- Lab: **sketchbook** (`/lab/sketchbook`) leaves "coming soon" with its first two
  scanned pages, menta then lola (`public/lab/sketchbook/`, `SKETCHBOOK` in
  `collections.ts`), between a hard cover and a hard back. page-flip 2.0.7
  (the engine behind react-pageflip, the owner's reference; pinned, with a
  local type declaration) turns them: drag a corner, click, the arrows or
  the keyboard; one page at a time on phones; the book fits the screen. Its
  door gets a preview: the spread, with the right page turning.

### Changed

- Owner's notes on phones and navigation (2026-11-27):
  - From the landing, on a computer and on a phone, the navigation opens each
    section's page (`/lab`, `/studio`...); only "/" and hashes scroll inside
    the landing.
  - Phones: an open sheet's content is as tall as the room it has, so the
    "enter" button sits above the strips of the next sheets instead of under
    them; a strong fling is held at the next sheet, never skipping one.
  - Lab index on touch screens: no previews (they are made for a computer);
    one tap on a door opens its piece.
  - travesía ácida's preview is the piece itself, small: the same engine,
    dot grid and acids.
- menta&lola is removed from the lab (door and page): cámara does what it
  promised. Kept in `docs/LAB.md` as the record of the idea.
- Lab previews (owner, 2026-11-27): the tickets carry the piece's own push
  pins; each half turn of the metro card brings the next city's card; the
  sketchbook starts closed, its cover opens once onto menta and lola and it
  stays open. A preview starts when its door opens.
- Notes: the screened image keeps its own proportion (it was stretched). No
  note is published yet, so every card is switched off ("coming soon"): it
  says what the note is about and opens nothing, and the note pages are gone
  (`Note.soon`).
- Contact: Instagram, @yuang_tong, in both languages.
- Navigation: "home" ("inicio") comes first and takes you to the start of
  the landing; it is marked as current only on the landing itself.
- lalande's close names the book like a work's label: its title, large
  ("near to the wild heart", "cerca del corazón salvaje"), then "clarice
  lispector, 1943" in mono. The cross-stitch is gone (owner, 2026-11-27).
- Notes: one note for now, "manifesto" ("manifiesto"), coming soon; the
  earlier drafts leave the list, and only a listed, published note has a
  page.
- lalande: the horse is written with Clarice Lispector's passage on Lalande
  (the owner's Spanish text, and an English translation), read line by line
  across it, instead of repeating "lalande" (`LalandePage.horseText`).

- Lab: **boletos de lima** (`/lab/boletos`). The owner's 73 Lima bus tickets
  (72 on paper, one electronic receipt), cut out from the scans, on the grey
  dot grid with drawn push pins. Drag one and it pins where it drops; sort by
  colour, company or price into columns held by big clips (flat or binder),
  with labels that fit their column; click (or Enter) opens a lightbox with
  the ticket and what it says, with previous, next and Escape. From the page,
  one panel invites to play **pasaje**: tickets pop up and go, a click
  collects the fare, dearer tickets stay less, 30 seconds, best score kept in
  the visitor's browser. Only paper tickets play; nothing subtracts. Canvas
  "lab: boletos v2" and "lab: pasaje", approved 2026-11-26.
- Lab: **metro cards** (`/lab/metro-cards`), named the same in every
  language. The owner's transport cards, one per city (Lima with two
  variants, Santiago, Buenos Aires, Medellín): the card tilts with the
  pointer under a glare and turns over on click or Enter; the contact globe,
  as `src/lib/city-globe.ts`, turns the chosen city to the middle and marks
  it in blue, with no route (owner, 2026-11-26). Numbers shown in full.
- Lab: **bitsplash** (`/lab/bitsplash`). Clicks throw 8-bit acid splashes on
  the grey grid (the acid shapes, a glyph front, two dithered acids); clean,
  and download the grid as a PNG.
- Lab: **sketchbook** door and page, marked coming soon (the pages are being
  chosen).
- Lab: the **píxeles ácidos** door is gone; bitsplash is that piece (owner,
  2026-11-26). The idea stays in the tracker.
- Lab index v2 (canvas "lab: índice v2", approved 2026-11-26): one grid of
  doors, four to a row, each with its group (story, to play, archive). Hover
  or focus widens a door while its live preview slides in from the right
  (`src/lib/lab-previews.ts`, 12 fps, only the open door runs); the row gives
  way and never reflows. Pieces still coming keep a still frame. On touch
  screens the preview is a still frame under the text. The lower grid of
  experiments (`LabGrid`) is no longer on the page. The sketchbook door, lost
  when the píxeles ácidos door was removed, is back.
  sísifo feliz's preview is only the horse, small and whole inside the door,
  galloping in blue dots (owner, 2026-11-27).
- Shared data for the collections in `src/content/collections.ts`; new token
  groups `corkGrid`, `boletos` and `bitsplash` in `src/lib/tokens.ts`, and
  `--cork-dot`, `--ticket-shadow`, `--pin-shadow`, `--card-lift`,
  `--card-glare` and `--veil` in `tokens.css`.
- The hero comes apart on the first scroll (canvas "hero: secuencia completa", approved 2026-11-23). Every letter of the name, (唐源) and the tagline pulls in toward the middle of the name, then falls with gravity, spins, bounces and piles on the floor; the buttons and the scroll hint drop out of view. As the void opens it swallows the pile, turning it in toward its centre. Back at the top, GSAP springs every piece home. `src/lib/hero-fall.ts` moves the real DOM nodes in the stage's design pixels, so the text stays real text (each letter is its own span; the full name and tagline are read once by screen readers) and it runs the same in every language. Reduced motion keeps the old fade. New dependency: `gsap`.
- Favicon "yt" (canvas "favicon v3", approved 2026-11-23): the initials in Host Grotesk, outlined from the site's own font so they do not depend on it, with the y's arm running into the t's bar, ink on a paper tile with soft corners. `public/favicon.svg`, `favicon.ico` (16, 32, 48), `apple-touch-icon.png` (paper on signal blue, full bleed for iOS to round) and `icon-512.png`.
- The site speaks English first (owner, 2026-11-22): English at `/`, Spanish at `/es`.
  - Routes live under `src/app/[lang]` and are prerendered for both languages. `src/proxy.ts` rewrites a path without a locale to the English route and redirects `/en/...` to the root, so each page has one address. Pages carry `hreflang` alternates and their OpenGraph locale.
  - Content comes per locale: `src/content/fixtures/en` (written for this change) and `src/content/fixtures/es`. Every loader takes the locale (`getLabPage(locale)`); fixtures keep canonical paths and `localize` adds `/es` to every internal `href` and crumb. `src/content/locale.ts` has `localePath` and `splitPath`.
  - The language selector (canvas "nav: idiomas", `LangSwitch`) sits after the navigation on the landing and the section pages, and inside the phone menu. English and Spanish link to the same page in the other language; Portuguese, Chinese (simplified) and Japanese are listed as "learning" and marked "soon" until their DeepL translations exist.
  - The tagline is "web designer & creative coder"; on phones the ampersand is large and blue on its own line (G7.5 mobile). 
  - The 404 carries both languages and shows the one in the path, so the pages around it stay static.
  - Piece names stay as the owner named them (sísifo feliz, lalande, travesía ácida, menta&lola, dona de teselas...).

- The studio page has a window onto fommo.studio (canvas "studio: glitch FOMMO + ventana", approved 2026-11-23): at rest the site's screenshot (`public/media/fommo-studio.jpg`) is screened as ASCII in FOMMO's colours on the studio's night; hover, focus or a first tap starts the carcoma from the pointer and the real page shows through, and leaving lets the glyphs eat it back. A second tap or a click opens fommo.studio. Beside the title on desktop, above it on phones; the title is a little smaller (176 px at most) and breaks into two lines beside the window. `StudioPage.preview` carries its copy; `fommoWindow` and `--fommo-*` are tokens.
- The dithered cursor reads the colour under it (same canvas): signal blue over paper, ink over light colours and paper over dark ones, so it no longer melts into the red of the void; inside `data-cursor-tone="fommo"` (the studio page) it uses FOMMO's red, night and lime. The tones are tokens (`cursorTones`).
- Planned lab pieces have their doors and pages, marked "próximamente" (docs/LAB.md): menta&lola, cámara, dona de teselas, píxeles ácidos and ambiente efímero (live coding with Strudel and Hydra; the name is still open). Each page at `/lab/[pieza]` says what the piece will do. `LabDoor.soon` and `points`, `LabPage.soon`. The old "cámara" door, which pointed into the grid, is replaced by the planned piece.
- `docs/LAB.md`: the plan of the lab agreed with the owner (2026-11-23): the index in two groups with live previews on hover; menta&lola as one dither lab with about 32 algorithms (the carcoma eating the horse into ASCII among them); cámara, where a pinched hand draws a trail of glyphs through MediaPipe in the browser; dona de teselas, to play with images in 3D (it absorbs sólidos de glifos); and píxeles ácidos, the carcoma's acid shapes as a toy.
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
- The landing's sheets follow the navigation (owner, 2026-11-23): about, lab, studio, notes, contact (before, notes came before studio). The section pages' numbered strips follow too: 02 lab, 03 studio, 04 notes, 05 contact. Sheet anchors are `#lab`, `#studio`, `#notes`, `#contact`; `#notas` and `#contacto` still land on their sheet.
- Phones, from the first sheet on (canvas "móvil: un deslizamiento, una hoja", approved 2026-11-23): one swipe moves exactly one sheet, however hard (the sheet stops snap with `scroll-snap-stop: always`, switched on only once the story is behind you; the story keeps its free pace). A five-step bar on the header's rule fills one step per sheet, studio's in FOMMO's red, with "03/05" beside it. Going up from the first sheet would rewind the whole story by scroll, so a ring fills instead ("keep swiping up to start the story again"); full, the carcoma takes you to the start and the story begins again; let go early and you settle back on the first sheet. Copy in `intro.restartHint`, `restartGo` and `progressLabel`, in both languages. The frame strip no longer shows at the start after that jump, nor does the title of "play with the pixels" (a sheet's content now inherits the sheets' visibility instead of forcing itself visible). Also fixed: on phones the tagline stacks again with the large ampersand on its own line; since the hero's letters became spans for the fall, the column no longer reached them.
- Every change applies to every language (owner, 2026-11-23), written into CLAUDE.md. The Spanish lab line now says the same as the English one: "historias, juguetes hechos de píxeles y mi archivo de fotos" (it still spoke of camera games).
- Phones have one density for the whole site, the landing's airier one (owner, 2026-11-23). The landing fitted the tighter axis, which on a phone is the height, so it was drawn at roughly 0.8 to 0.9 and the other pages, at full size, looked bigger. Now the landing fits the width at `PHONE_K` = 0.88 (down to 720 design pixels of height; a shorter screen scales it down), so it no longer depends on the browser bars, and the section pages' type tokens, title and header bars follow the same proportion on phones (`tokens.css`: `--t-*`, `--t-h2-phone`, `--bar`), and so does the phone menu, which is drawn outside the landing's stage and stood out larger when opened from it (`--menu-head`, `--t-menu-name`, `--t-menu-nav`; every link stays at least 44 px tall). Desktop is unchanged.
- The tagline is two words joined by an ampersand in every language (owner, 2026-11-23): `intro.role` holds only the two words (`['web designer', 'creative coder']`, `['diseñador web', 'creative coder']`) and the component sets the "&", which is never translated. On phones both languages show the same large blue ampersand. Before, Spanish read "creative coder y diseñador web".
- Section paths are in English in both languages: `/notes` and `/contact` (before `/notas` and `/contacto`, which redirect permanently, also under `/es`). The note images moved to `/media/notas/`. Reading time in a note comes from `settings.ui.readingTime`; the phone menu's navigation label from `ui.navLabel`.
- Lalande on phones scrolls like the landing: the story is longer to scroll (at least 60 % of its desktop track), a fling makes it catch up at a capped pace instead of skipping scenes, and the browser bar showing or hiding no longer rebuilds the scene mid-scroll. The replay button waits until the story has actually reached its end. On desktop a fast wheel or trackpad fling also catches up at a capped pace, and short laptop screens keep at least 85 % of the track.
- The site title is "yuang tong | creative coder", and section pages read "studio | yuang tong".

- The landing on phones (owner, 2026-11-23):
  - a quiet scroll hint at the start ("desliza para ver la historia ↓", "baja para ver la historia ↓" on desktop) that appears after a moment and goes away with the first scroll (`Intro.scrollHint`, `scrollHintTouch`);
  - the scroll settles on chapters (hero, the void, three scenes of the story, the letters, each sheet) with the browser's proximity snap, so a fast swipe lands on a whole scene;
  - the story catches up with a fling at a capped pace instead of skipping scenes;
  - the stage is only rebuilt when the width changes, not when the address bar hides or shows, and it fits the small viewport;
  - a shorter track on phones: the void takes 2700 design pixels (was 3600) and the story 2900 (was 3600).
- The gallop credit reads 1878, as on Wikipedia (owner, 2026-11-23).
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
