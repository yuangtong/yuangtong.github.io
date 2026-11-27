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
  /**
   * The tagline, as two words joined by an ampersand that the component sets
   * and never translates: "web designer & creative coder". Only the words
   * change per language.
   */
  role: [string, string];
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
  /** A quiet hint at the start of the landing, until the visitor scrolls. */
  scrollHint: string; scrollHintTouch: string;
  /** Phones, on the first sheet going up: the ring that takes you back to the start, and its label once full. Where-you-are bar label. */
  restartHint: string; restartGo: string; progressLabel: string;
};

/** First sheet: the horse made of letters; the pointer nudges them as it passes. */
export type Jugar = { title: string };

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

/** A language of the site. `learning` languages are the ones the owner is learning: machine translated, marked as such. */
export type Language = { code: string; name: string; learning?: boolean; ready?: boolean };

export type Settings = {
  /** The locale this content is written in, and the OpenGraph locale for it. */
  locale: string; ogLocale: string;
  /** The language selector (canvas "nav: idiomas"). */
  languages: {
    label: string; spoken: string; learning: string; learningNote: string; soon: string; promise: string;
    list: Language[];
  };
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
    /** After the minutes in a note, "min read". */
    readingTime: string;
    enterLabel: string;
    navLabel: string;
    crumbLabel: string;
  };
  /** Crumbs for sub-levels, keyed by path. */
  crumbs: Record<string, Link[]>;
  /** The link preview (Open Graph and X): in English, for an international audience. */
  share: { title: string; description: string; image: string; alt: string; width: number; height: number };
};

/** A folded sheet at the end of the landing: a short view that leads to its section. */
export type SheetPreview = { title: string; line: string; href: string };

export type HomePage = {
  intro: Intro;
  jugar: Jugar;
  sheets: {
    lab: SheetPreview;
    notes: SheetPreview;
    /** `brand` is the word in `line` that glitches and lets FOMMO's colours out. */
    studio: SheetPreview & { sub: string; brand: string };
    contact: SheetPreview & { email: Link };
  };
};

/** A door in the lab: historias, cámara, archivo.exe. */
/**
 * A door of the lab. `soon` marks a piece that is planned but not built yet
 * (docs/LAB.md): its door says so and leads to a page that describes it.
 * `points` are the lines that page lists.
 */
/** How a door's live preview hints at its piece (lab index v2). */
export type LabPreview = 'gallop' | 'drop' | 'tunnel' | 'desk' | 'tickets' | 'card' | 'splash' | 'trail' | 'still';
/** A lab door: `group` sorts the pieces into stories, toys and the owner's archive. */
export type LabDoor = { id: string; title: string; text: string; cta: Link; group: 'story' | 'play' | 'archive'; preview: LabPreview; soon?: boolean; points?: string[] };

export type LabPage = { title: string; lead: string; doors: LabDoor[]; groups: Record<LabDoor['group'], string>; previewLabel: string; experiments: Experiment[]; soon: { label: string; back: Link } };

/** A story in the lab, told with the landing's engine and its narration on. */
export type StoryPage = { title: string; label: string; hint: string; replay: string };

/** Lalande, historia 02: Clarice Lispector's narcissus and her book. */
export type LalandePage = {
  title: string; canvasLabel: string; hint: string; replay: string;
  quotes: { text: string; source: string }[];
  spec: string[]; breezeLabel: string; breezeHint: string;
  book: { label: string; author: string; title: string; quote: string; quoteSource: string };
  /** The word the horse's letters spell. */
  word: string;
  closeText: string; closeTitle: string;
};

/** Boletos de Lima (lab): the owner's bus tickets on a corkboard, and pasaje, the game that comes with them. */
export type BoletosPage = {
  title: string; lead: string; boardLabel: string;
  sort: { label: string; loose: string; colour: string; company: string; price: string };
  hint: { loose: string; sorted: string };
  /** Colour keys from the catalogue, named in this language. */
  colours: Record<string, string>;
  lightbox: { label: string; of: string; price: string; fare: string; colour: string; noPrice: string; notPrinted: string; prev: string; next: string; close: string };
  play: { title: string; text: string; cta: string };
  game: {
    title: string; lead: string; canvasLabel: string; back: string;
    time: string; collected: string; tickets: string; start: string; restart: string; again: string;
    ready: string; playing: string; result: string; best: string; bestWas: string;
  };
};

/** Metro cards (lab): one transport card per city, and the contact globe marking the city. */
export type MetroCardsPage = {
  title: string; lead: string; countries: Record<string, string>;
  front: string; back: string; turn: string; variants: string; count: string;
  cardLabel: string; globeLabel: string;
};

/** cámara (lab): a webcam toy; a pinch paints an effect over your image, and you take the photo. */
export type CamaraPage = {
  title: string; lead: string;
  gate: { title: string; text: string; camera: string; cursor: string; touch: string };
  loading: string; stop: string; cursor: string; camera: string; denied: string; noCamera: string;
  sourceHand: string; sourceToy: string; sourceCursor: string; penUp: string; penDown: string;
  canvasMirror: string; canvasToy: string; canvasHand: string; canvasCursor: string;
  leadToy: string; controls: string;
  mode: { label: string; draw: string; toy: string };
  full: { on: string; off: string };
  view: { label: string; mirror: string; hand: string };
  hands: { label: string; one: string; two: string };
  effect: { label: string; pixels: string; dither: string; halftone: string; ascii: string; stitch: string; trail: string; more: string; back: string };
  colour: { label: string; names: Record<string, string> };
  brush: { label: string; small: string; medium: string; large: string };
  pixel: { label: string; fine: string; medium: string; coarse: string };
  clear: string; photo: string; saved: string;
  how: string[]; howToy: string[];
};

/** bitsplash (lab): acid splashes on the grey grid; the visitor keeps what they made. */
export type BitsplashPage = { title: string; lead: string; canvasLabel: string; hint: string; clean: string; download: string; one: string; many: string };

/** Travesía ácida: the void with no bottom, as a lab piece. */
export type TravesiaPage = {
  title: string; lead: string; canvasLabel: string;
  hint: string; hintTouch: string;
  ui: {
    controls: string; cell: string; color: string; all: string; rampNames: Record<string, string>;
    full: string; close: string; copyLink: string; copied: string; depth: string;
  };
};

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
/** A block in a note: a paragraph, a code listing or a full-width figure. */
export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'code'; text: string }
  | { type: 'figure'; src: string; alt: string; caption: string; width: number; height: number; paper?: boolean };

/** One note (G, "notas: una nota"). */
export type NotePage = {
  slug: string; title: string; lead: string;
  date: string; about: string; backLabel: string;
  blocks: NoteBlock[];
  links: { label: string; title: string; href: string }[];
  credit: string;
};

export type NotesPage = { title: string; lead: string; items: Note[] };
/** Studio (G8, estudio v3): the owner directs FOMMO; FOMMO's colours eat the paper. */
/**
 * `preview`: the window onto the studio's site (canvas "studio: glitch FOMMO +
 * ventana"). At rest the screenshot is screened as glyphs; hover or a tap lets
 * the carcoma reveal it. `live` and `screened` are the two states in the bar.
 */
export type StudioPreview = { src: string; alt: string; host: string; caption: string; live: string; screened: string; href: string };
export type StudioPage = { title: string; eyebrow: string; name: string; lead: string; cta: Link; canvasLabel: string; preview: StudioPreview };
/** A way to reach the owner: the label, the handle shown in mono, the link. */
export type ContactLink = Link & { detail: string };

/** Contact (G8, contacto v2). `{place}` in the strings is replaced with the visitor's place. */
export type ContactPage = {
  title: string; lead: string; email: Link; emailLabel: string; links: ContactLink[];
  clocks: { mine: string; you: string; youSame: string };
  globe: { me: string; you: string; hint: string; label: string; labelSame: string };
  /** Place names by time zone; unknown zones fall back to the city in the zone id. */
  places: Record<string, string>;
};

export type NotFoundPage = { title: string; body: string; back: Link; lab: Link; canvasLabel: string };
