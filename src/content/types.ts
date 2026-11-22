/**
 * Content contract between the UI agent and the CMS agent (see AGENTS.md).
 * Components receive these shapes through props; pages get them through the
 * loaders in `src/content/index.ts`. The CMS agent re-implements the loaders
 * against Sanity without changing these types.
 */

export type Link = {
  label: string;
  href: string;
};

/** Accent families used by notes and floating shapes. Values live in the token layer. */
export type Accent = 'azul' | 'rosado' | 'lima';

/** Opening sequence: hero, the dive into the void and Sisyphus. */
export type Intro = {
  name: string;
  nameZh: string;
  role: string;
  availability: string;
  ctas: Link[];
  /** Describes the animated canvas for assistive technology. */
  canvasLabel: string;
  /** Written narration over the story. Off by default: the animation tells it. */
  narrated: boolean;
  narration: {
    lines: [string, string, string];
    quote: string;
    quoteSource: string;
    coda: string;
  };
  /** Letters the horse turns into. */
  glyphText: string;
};

/** First sheet: the horse made of letters that move away from the pointer. */
export type Jugar = { title: string; hint: string; hintTouch: string };

export type ExperimentVisual = 'medio' | 'camara' | 'dona' | 'fotos';

/** A piece in the lab. */
export type Experiment = {
  id: string;
  title: string;
  meta: string;
  alt: string;
  visual: ExperimentVisual;
  defaultCell: 4 | 8 | 16;
  href: string;
};

export type NoteVisual = 'foto' | 'ecos' | 'dona';

/** A note: how a piece was made. */
export type Note = {
  id: string;
  title: string;
  excerpt: string;
  meta: string;
  href: string;
  alt: string;
  visual: NoteVisual;
  accent: Accent;
};

export type Settings = {
  siteTitle: string;
  description: string;
  nav: Link[];
  footer: { left: string; right: string };
  ui: {
    openLabel: string;
    copyLinkLabel: string;
    copiedLabel: string;
    cellGroupLabel: string;
    frameStripLabel: string;
    menuLabel: string;
    closeLabel: string;
    framePrev: string;
    frameNext: string;
    cameraCounter: string;
    frameCounter: string;
    readNoteLabel: string;
    enterLabel: string;
  };
  /** Crumbs for sub-levels, keyed by path. */
  crumbs: Record<string, Link[]>;
};

/** A folded sheet at the end of the landing: a short view that leads to its section. */
export type SheetPreview = { title: string; line: string; href: string };

export type HomePage = {
  intro: Intro;
  jugar: Jugar;
  sheets: {
    lab: SheetPreview;
    notes: SheetPreview;
    studio: SheetPreview & { sub: string };
    contact: SheetPreview & { email: Link };
  };
};

/** A door in the lab: historias, cámara, archivo.exe. */
export type LabDoor = { id: string; title: string; text: string; cta: Link };

export type LabPage = { title: string; lead: string; doors: LabDoor[]; experiments: Experiment[] };

export type ArchivePalette = 'tinta' | 'azul' | 'rojo' | 'acida' | 'color';

/** A photo in archivo.exe. `cell` 0 is the original photo; `spot` places the print on the desk (0..1). */
export type ArchivePhoto = {
  id: string; src: string; serie: string; date: string; alt: string;
  cell: 0 | 2 | 4 | 8 | 16; palette: ArchivePalette; spot: [number, number];
};

export type ArchivePage = {
  title: string;
  windowTitle: string;
  series: string[];
  photos: ArchivePhoto[];
  readme: string;
  ui: {
    start: string; startLabel: string; band: string; tray: string; tidy: string; closeAll: string; backToLab: string;
    readmeName: string; readmeTitle: string; minimize: string; maximize: string; restore: string; close: string;
    closeExe: string; fill: string; unfill: string; copyLink: string; copied: string; objects: string;
    photo: string; photos: string; cell: string; palette: string; original: string; openHint: string; open: string;
    paletteNames: Record<ArchivePalette, string>;
  };
};
export type NotesPage = { title: string; lead: string; items: Note[] };
/** Studio (G8, estudio v3): the owner directs FOMMO; FOMMO's colours eat the paper. */
export type StudioPage = { title: string; eyebrow: string; name: string; lead: string; cta: Link; canvasLabel: string };
export type ContactPage = { title: string; lead: string; email: Link; links: Link[] };

export type NotFoundPage = { title: string; body: string; back: Link };
