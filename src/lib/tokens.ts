/**
 * Token layer for canvas drawing. CSS reads the same values from
 * `src/app/tokens.css`; keep both in sync. No component holds a hex value.
 */

export const color = {
  paper: '#ededeb',
  paper2: '#dcdcd8',
  ink: '#141414',
  body: '#2e2e2b',
  quiet: '#4d4d49',
  signal: '#0b14c9',
  signalElectric: '#2a36ff',
  white: '#ffffff',
  black: '#000000',
  dotOff: '#cfcfca',
  echo: '#9aa0ea',
} as const;

/** Four tones per accent: base, shade, light, pale. */
export const ramp = {
  azul: ['#0b14c9', '#050a6b', '#7a82ff', '#c9ccff'],
  rosado: ['#ff3ea5', '#9e0057', '#ff8fc8', '#ffd1e8'],
  lima: ['#c8ff2e', '#5d8a00', '#8fbf00', '#e9ffb0'],
} as const;

/** Note cards: [dither ink, dither paper, button text]. */
export const noteSwatch = {
  azul: ['#0b14c9', '#ededeb', '#ffffff'],
  rosado: ['#ff3ea5', '#ededeb', '#141414'],
  lima: ['#c8ff2e', '#141414', '#141414'],
} as const;

/** Opening sequence palette (the void and the gallop). */
export const introPalette = {
  ink: '#181c24',
  dim: '#2b2f3a',
  wall: '#b3b3ae',
  electric: '#1847ff',
  light: '#7d93ff',
  violet: '#a937e1',
  red: '#ff3d24',
  yellow: '#ffe600',
  stripBg: '#dcdcd8',
  cardLight: '#b9bff2',
  cardMid: '#5d66e6',
  dotRule: '#b3b3ae',
} as const;

/** Carcoma ramps (G8): acid colors stay inside the shapes, never in the UI. */
export const acidRamps = [
  ['#ff3d24', '#a937e1', '#ffe600', '#ededeb'],
  ['#0b14c9', '#050a6b', '#7a82ff', '#c9ccff'],
  ['#a937e1', '#ff3d24', '#1847ff', '#ffe600'],
] as const;

/** archivo.exe palettes: one ink, a ramp, or the photo's own color. */
export const archivePalettes = {
  tinta: { ink: '#141414' },
  azul: { ink: '#0b14c9' },
  rojo: { ink: '#c41d23' },
  acida: { ramp: ['#141414', '#0b14c9', '#a937e1', '#ff3d24', '#ffe600', '#ededeb'] },
  color: {},
} as const;

/** Studio (G8, estudio v3): FOMMO's colours as [base, dither] pairs, plus the paper they eat. */
export const fommoLines = [
  ['#e8451a', '#edaae8'],
  ['#c4e118', '#8aadd6'],
  ['#0d0f1e', '#8aadd6'],
  ['#edaae8', '#e8451a'],
  ['#c4e118', '#0d0f1e'],
] as const;
export const fommoSplit = ['#e8451a', '#8aadd6'] as const;

/** Studio window: the night it sits on, and the colours its glyphs are quantized to. */
export const fommoWindow = { night: '#0d0f1e', bar: '#141414', barText: '#ededeb', on: '#c4e118', off: '#e8451a', light: '#ededeb', palette: [[232, 69, 26], [196, 225, 24], [237, 170, 232], [138, 173, 214], [237, 237, 235]] } as const;

/** The contact globe (G8, contacto v2): my time in blue, the visitor's time in red (owner, 2026-11-27). */
export const globe = { sea: '#d4d4ce', land: '#141414', arc: '#1847ff', arcHead: '#0b14c9', me: '#0b14c9', you: '#ff3d24', other: '#141414', label: '#ffffff' } as const;

/** Lalande (historia 02): sky, reds, the narcissus and the rain. */
export const lalande = {
  paper: '#ededeb', ink: '#141414', signal: '#0b14c9', white: '#ffffff', pale: '#c9ccff', electric: '#1847ff',
  sky: ['#0b14c9', '#1029e0', '#1847ff', '#3d64ff'],
  red: ['#8e1218', '#c41d23', '#ff3d24', '#ff7468'],
  bookRed: '#de2229', rainRed: '#ff7468', rainPink: '#ffd2cc',
  stem: '#178846', stemLight: '#86e4bb', cup: '#ffe600', cupRim: '#ff8616',
} as const;

/** Travesía ácida: one ramp per acid, [dim, mid, base, light], on the night ink. */
export const travesia = {
  ink: '#181c24', core: '#ededeb',
  ramps: {
    azul: ['#232a63', '#0b14c9', '#1847ff', '#9fb0ff'],
    violeta: ['#3a1f52', '#7a2bb0', '#a937e1', '#e6b8ff'],
    rojo: ['#4a1416', '#c41d23', '#ff3d24', '#ffa08f'],
    amarillo: ['#4a4310', '#b8a200', '#ffe600', '#fff6b8'],
  },
} as const;
export type TravesiaRamp = keyof typeof travesia.ramps;

/** The grey dot grid the lab collections lie on (the landing's grid, quiet). */
export const corkGrid = { paper: '#ededeb', dot: '#d1d1cc', step: 8 } as const;

/**
 * Boletos de Lima: push pins in the colours of the owner's references (pastels
 * and a few deep ones), the big clips that hold a sorted column, and the money
 * tags of pasaje (2026-11-26).
 */
export const boletos = {
  pins: ['#d9b48f', '#cdb4e6', '#a8dfb6', '#8fcde3', '#2f5e3a', '#ecd65a', '#5a2e22', '#e9c3b3', '#9fdfcd', '#d9531e', '#e2261f', '#b7d2ef', '#f3e39a', '#4b1f52', '#f0a9bf', '#f2b98a'],
  needle: '#8a8a85', pivot: '#8a8a85', wire: '#9a9a95', wireLight: '#c9c9c4', light: '#ffffff', ink: '#141414',
  clips: [['board', '#a9c2e6'], ['binder', '#141414'], ['board', '#efb9c3'], ['board', '#8a7a4a']],
  shadow: 'rgba(20,20,20,.22)', money: '#0b14c9', moneyText: '#ffffff',
} as const;

/** bitsplash: pairs of acids a splash settles into, and the glyph ink of its front. */
export const bitsplash = {
  pairs: [['#e8451a', '#edaae8'], ['#c4e118', '#8aadd6'], ['#0b14c9', '#a937e1'], ['#ffe600', '#ff3d24'], ['#a937e1', '#edaae8'], ['#ff3d24', '#0d0f1e']],
  ink: '#141414',
} as const;

/** archivo.exe's desktop in the lab index preview: the same value as --w98-teal. */
export const labDesk = '#0e7c7b';

/** cámara: the inks a visitor can paint with, from the site's palette and its acids (2026-11-27). */
export const camaraInks = { signal: '#0b14c9', ink: '#141414', naranja: '#e8451a', rosado: '#ff3ea5', lima: '#c8ff2e', violeta: '#a937e1' } as const;
export type CamaraInk = keyof typeof camaraInks;
/** cámara's multicolour: a small retro palette from the site's inks and acids; images are posterized or dithered into it (owner, 2026-11-27). */
/** cámara's halftone in multicolour: four process screens, printed with multiply (owner's reference, 2026-11-27). */
export const camaraProcess = { c: '#00a0e4', m: '#e6007e', y: '#ffe600', k: '#141414' } as const;
export const camaraRetro = ['#141414', '#ededeb', '#ffffff', '#0b14c9', '#1847ff', '#8aadd6', '#0e7c7b', '#2fb35a', '#c8ff2e', '#ffe600', '#e8451a', '#ff3d24', '#ff3ea5', '#a937e1', '#5a2e22', '#d9b48f'] as const;

/** About (canvas "about v3"): the portrait eaten by the poem, in the site's paper, ink and blues. */
export const about = { paper: '#ededeb', ink: '#141414', blue: '#0b14c9', electric: '#2a36ff', quiet: '#4d4d49' } as const;

/** The site's cursor (owner, 2026-11-27): blue cells, paper characters, a paper edge round the pointer. */
export const asciiCursor = { box: '#0b14c9', text: '#ededeb', edge: '#ededeb' } as const;
