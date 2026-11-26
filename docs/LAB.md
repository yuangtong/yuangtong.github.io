# The lab: plan

Status: plan agreed with the owner on 2026-11-23 (names fixed the same day). Nothing here is designed in
the canvas yet unless marked. Each piece is designed in the canvas first,
approved, then built in its own branch.

The lab holds every creative practice. Its pieces are toys: the visitor is
invited to play, and the controls (cell size, palette, parameters) live here,
never on the home page.

## Index

- A grid of doors in two groups: **historias** (pieces with a narrative) and
  **exploraciones** (pieces to play with).
- On hover a door slides aside and shows a live preview of its piece. On
  touch screens the preview is a still frame; there is no hover.
- historias: sísifo feliz; lalande, lágrimas de ángel.
- exploraciones: travesía ácida, archivo.exe, boletos de lima (with the game
  pasaje), metro cards, bitsplash, sketchbook (coming soon), menta&lola,
  cámara, dona de teselas, píxeles ácidos, ambiente efímero.
- Collections (2026-11-26): the owner's scans live in `public/lab/` and their
  data in `src/content/collections.ts`, the same in every language; only the
  words around them are translated.
- Pieces that are not built yet have their door and their own page at
  `/lab/[pieza]`, marked "próximamente": the page says what the piece will do.
  A piece drops the mark when it ships.

## Pieces

### menta&lola (Menta and Lola, the owner's cats)

The section is written `menta&lola`. One dither lab: pick an image, pick how
to screen it.

- Sources: Menta, Lola, the horse. The old "medio tono" piece folds into
  this one. Photos of the cats come from the owner. Whether visitors may
  upload their own photo is undecided; for now, no.
- About 32 algorithms in families, after the DitherFX Figma plugin: error
  diffusion (Floyd-Steinberg, Atkinson, Jarvis, Stucki, Burkes, Sierra),
  ordered (Bayer 2, 4, 8, cluster), halftone (dots, lines, cross), bitmap
  patterns, edge, noise, CRT and ASCII.
- One more effect from an early home version: the image is eaten from the
  inside by the carcoma, and what it eats turns into another effect (ASCII
  art, glyphs). It lives here as one of the algorithms.
- Sliders: scale, threshold, contrast, gamma, brightness, palette (the
  site's palettes and the acids).
- Before and after, and "copiar enlace" with every parameter in the URL.
- The first sketch the owner liked is the reference for the sliders.

### cámara

The live camera as an instrument. Uses MediaPipe in the browser
(`@mediapipe/tasks-vision`, hand landmarker).

- The visitor turns the camera on and shows a hand. Pinching (thumb and index
  together) puts the pen down; the index fingertip then leaves a trail of
  glyphs, the same family as the dithered cursor: cells that scramble, glow
  in signal blue and cool back into the paper.
- Opening the hand lifts the pen; the trail fades on its own.
- The camera image itself can sit underneath, screened by one of menta&lola's
  algorithms of menta&lola (the old "cámara tramada" idea), with the effect strongest inside
  the moving blobs.
- Everything runs on the visitor's device: no frames leave the browser, no
  server. The model loads only after the visitor turns the camera on, with a
  plain sentence about why the camera is asked for.
- Without a camera, or if it is refused, the pointer or a finger on the
  screen draws the same trail.
- Reduced motion: the trail is drawn without the scramble and fades without
  movement.

### dona de teselas

To play with images in 3D. A torus (and other solids) covered in 8 x 8 tiles
and glyphs; the visitor drags to turn it and changes the image it is made
from. This is the same piece as the "sólidos de glifos" explored before: one
piece, not two.

- Tile sets: molinete, damero, contorno, puntos, tick, macizo, and glyphs.
- Controls: image, solid, tile set, cell size, palette, speed.
- An ASCII-art version is pending: the owner is looking for the reference.

### píxeles ácidos

The acid pixels that are born in the carcoma, as a toy of their own: the
acid shapes land, eat the paper and heal into glyph rain, and the visitor
steers them with the pointer (or a finger). Palette, cell size and how
hungry they are can be changed.

### ambiente efímero (name still open)

Live coding: music with Strudel and visuals with Hydra, pieces that exist
while they play. It may also hold the owner's DJ sets, or the sets may get a
section of their own; under discussion.

### boletos de lima, pasaje, metro cards, bitsplash (shipped 2026-11-26)

See the changelog. Still open: a phone layout for the board (today it is the
desktop board scaled down), sound for pasaje, the lab index redesign (one
grid of doors that expand on hover with a live preview).

## Shared rules

- The dithered cursor is off on touch screens and with reduced motion.
- Every piece has "copiar enlace" with its state, "pantalla completa" where
  it makes sense, and composed still frames for reduced motion.
- No piece shows client work; that lives on fommo.studio.

## Waiting on the owner

- Photos of Menta and Lola.
- The ASCII-art reference for dona de teselas.
