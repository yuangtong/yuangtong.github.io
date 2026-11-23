# The lab: plan

Status: plan agreed with the owner on 2026-11-23. Nothing here is designed in
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
- exploraciones: travesía ácida, archivo.exe, mentilola, cámara, dona de
  teselas, píxeles ácidos, sólidos de glifos.

## Pieces

### mentilola (Menta and Lola, the owner's cats)

One dither lab: pick an image, pick how to screen it.

- Sources: Menta, Lola, the horse. The old "medio tono" piece folds into
  this one. Photos of the cats come from the owner.
- About 32 algorithms in families, after the DitherFX Figma plugin: error
  diffusion (Floyd-Steinberg, Atkinson, Jarvis, Stucki, Burkes, Sierra),
  ordered (Bayer 2, 4, 8, cluster), halftone (dots, lines, cross), bitmap
  patterns, edge, noise, CRT and ASCII.
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
- The camera image itself can sit underneath, screened by one of mentilola's
  algorithms (the old "cámara tramada" idea), with the effect strongest inside
  the moving blobs.
- Everything runs on the visitor's device: no frames leave the browser, no
  server. The model loads only after the visitor turns the camera on, with a
  plain sentence about why the camera is asked for.
- Without a camera, or if it is refused, the pointer or a finger on the
  screen draws the same trail.
- Reduced motion: the trail is drawn without the scramble and fades without
  movement.

### dona de teselas

A 3D torus covered in 8 x 8 tiles. The visitor drags to turn it.

- Tile sets: molinete, damero, contorno, puntos, tick, macizo.
- Controls: tile set, cell size, palette, speed.

### píxeles ácidos

The photo glitch matrix from home G5.3: the horse photograph broken into a
matrix of acid colours, played with the carcoma. The pointer starts the
carcoma that eats and heals the photo.

### sólidos de glifos

3D solids made of glyphs; the visitor turns them. An ASCII-art version is
pending: the owner is looking for the reference.

## Shared rules

- The dithered cursor is off on touch screens and with reduced motion.
- Every piece has "copiar enlace" with its state, "pantalla completa" where
  it makes sense, and composed still frames for reduced motion.
- No piece shows client work; that lives on fommo.studio.

## Waiting on the owner

- Photos of Menta and Lola.
- The ASCII-art reference for sólidos de glifos.
