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

/** Opening sequence: hero, the dive into the void and the narrated gallop. */
export type Intro = {
  name: string;
  nameZh: string;
  role: string;
  availability: string;
  ctas: Link[];
  /** Describes the animated canvas for assistive technology. */
  canvasLabel: string;
  narration: {
    lines: [string, string, string];
    quote: string;
    quoteSource: string;
    coda: string;
  };
};

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

export type ContactFact = {
  label: string;
  value: string;
  /** `clock` renders the live time in Lima instead of `value`. */
  kind?: 'text' | 'clock';
  note?: string;
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
    cameraCounter: string;
    frameCounter: string;
    readNoteLabel: string;
    contactListLabel: string;
  };
};

export type HomePage = {
  intro: Intro;
  lab: { title: string; lead: string; more: Link; experiments: Experiment[] };
  studio: { title: string; body: string; cta: Link };
  notes: { title: string; lead: string; more: Link; items: Note[] };
  contact: { title: string; primary: Link; links: Link[]; facts: ContactFact[] };
};

export type NotFoundPage = { title: string; body: string; back: Link };
