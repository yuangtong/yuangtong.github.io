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

/** Contact globe (G8, contacto v2): sea dots, land dots, the arc and the marks. */
export const globe = { sea: '#d4d4ce', land: '#141414', arc: '#1847ff', arcHead: '#0b14c9', me: '#0b14c9', you: '#141414', label: '#ffffff' } as const;

/** Lalande (historia 02): sky, reds, the narcissus and the rain. */
export const lalande = {
  paper: '#ededeb', ink: '#141414', signal: '#0b14c9', white: '#ffffff', pale: '#c9ccff', electric: '#1847ff',
  sky: ['#0b14c9', '#1029e0', '#1847ff', '#3d64ff'],
  red: ['#8e1218', '#c41d23', '#ff3d24', '#ff7468'],
  bookRed: '#de2229', rainRed: '#ff7468', rainPink: '#ffd2cc',
  stem: '#178846', stemLight: '#86e4bb', cup: '#ffe600', cupRim: '#ff8616',
} as const;
