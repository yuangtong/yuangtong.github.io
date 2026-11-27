import type { ArchivePage, BitsplashPage, BoletosPage, CamaraPage, ContactPage, MetroCardsPage, HomePage, LabPage, LalandePage, NotePage, NotesPage, NotFoundPage, StoryPage, StudioPage, TravesiaPage } from '../../types';

export const home: HomePage = {
  intro: {
    name: 'yuang tong',
    nameZh: '唐源',
    role: ['web designer', 'creative coder'],
    availability: 'available, lima',
    ctas: [
      { label: 'see the lab', href: '/lab' },
      { label: 'fommo.studio', href: 'https://fommo.studio' },
    ],
    canvasLabel:
      'A horse made of blue dots gallops. Scrolling down opens a spiral tunnel; the horse breaks twelve threads, pushes a rock uphill, the rock falls and the gallop stops in mid-air. Then the horse pixelates until it turns into letters.',
    narrated: false,
    narration: {
      lines: [
        '1878. a horse breaks twelve threads and each thread fires a camera.',
        'fifteen frames, uphill, forever.',
        'at the top, the rock falls again. the loop starts over.',
      ],
      quote: 'one must imagine sisyphus happy.',
      quoteSource: 'albert camus, the myth of sisyphus, 1942',
      coda: 'to code is to run the loop again until you find the frame where you fly.',
    },
    glyphText: 'yuangtong web designer creative coder lima ',
    scrollHint: 'scroll down for the story',
    scrollHintTouch: 'swipe up for the story',
    restartHint: 'keep swiping up to start the story again',
    restartGo: 'the story starts again',
    progressLabel: 'where you are',
  },
  jugar: {
    title: 'play with the pixels',
  },
  sheets: {
    lab: { title: 'the lab', line: 'stories, toys made of pixels and my photo archive.', href: '/lab' },
    notes: { title: 'notes', line: 'how each piece is made, written while I build it.', href: '/notes' },
    studio: { title: 'studio', line: 'I direct FOMMO, a bespoke studio. client work lives there.', sub: 'brand, product and development, made to measure.', brand: 'FOMMO', href: '/studio' },
    contact: { title: "let's talk", line: 'write to me at', email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' }, href: '/contact' },
  },
};

export const notes: NotePage[] = [
  {
    slug: 'jinete',
    title: 'taking the rider off an 1878 gallop',
    lead: "Muybridge's photographs come with a rider on top. the horse on this site had to run alone, so I erased him with code.",
    date: 'november 2026',
    about: 'about: medio tono',
    backLabel: 'all notes',
    blocks: [
      { type: 'figure', src: '/media/notas/jinete-antes.jpg', alt: 'Fifteen photographs of a racehorse galloping with its rider, taken by Muybridge', caption: 'before: the fifteen original frames, with the rider.', width: 1500, height: 600 },
      { type: 'p', text: 'Eadweard Muybridge photographed a galloping horse in fifteen frames. They are in the public domain and perfect for animation: the motion is already solved. The trouble is that the horse carries a rider.' },
      { type: 'p', text: 'First I separated the figure from the background. Each frame is a small photo, 300 by 200 pixels, with the dark horse against a light sky. A brightness threshold is enough to keep the silhouette.' },
      { type: 'p', text: 'Then, finding the rider. In each column I look for the first dark pixel from the top; the column where that point sits highest is the cap. Around it I open a window of about seventy pixels and, inside it, erase everything above the back.' },
      { type: 'p', text: 'The back cannot be seen, because the rider hides it. I rebuild it with a smooth curve between the height of the neck and the height of the croup, measured just outside the window. Below the curve I fill; above it, nothing.' },
      { type: 'code', text: '// the cap: the column with the highest dark pixel\nconst cap = tops.indexOf(Math.min(...tops));\n\n// the back: a smooth curve between neck and croup\nfor (let x = x0; x <= x1; x++) {\n  const t = (x - x0) / (x1 - x0);\n  const y = y0 + (y1 - y0) * t * t * (3 - 2 * t);\n  eraseAbove(x, y);\n}' },
      { type: 'p', text: 'To finish, I close the silhouette with a dilation and an erosion, and a median filter cleans the edges. It is not perfect: the back stays a little flat where the saddle was. At twelve frames a second you barely notice.' },
      { type: 'figure', src: '/media/notas/jinete-despues.png', alt: 'The same fifteen positions turned into black silhouettes of a horse without a rider', caption: 'after: the silhouette without the rider, ready to be drawn with dots, letters or tiles.', width: 1500, height: 600, paper: true },
    ],
    links: [
      { label: 'try it in the lab', title: 'medio tono', href: '/lab#pieza-medio' },
      { label: 'next note', title: 'echoes: drawing time behind a figure', href: '/notes' },
    ],
    credit: 'photographs: eadweard muybridge, public domain',
  },
];

export const notFound: NotFoundPage = {
  title: 'this page does not exist',
  body: 'the link may be misspelled or the page has moved. the horse keeps running through the rest of the site.',
  back: { label: 'back to the start', href: '/' },
  lab: { label: 'go to the lab', href: '/lab' },
  canvasLabel: 'the number 404 made of dots; a galloping horse crashes into it and it crumbles.',
};

export const labPage: LabPage = {
  title: 'the lab',
  lead: 'stories, toys made of pixels and my photo archive. every piece can be re-screened and shared.',
  doors: [
    { id: 'sisifo', group: 'story', preview: 'gallop', title: 'sísifo feliz', text: "Muybridge's 1878 gallop told as sisyphus: twelve threads, the hill and the rock that rolls back.", cta: { label: 'see sísifo feliz', href: '/lab/sisifo' } },
    { id: 'lalande', group: 'story', preview: 'drop', title: 'lalande, lágrimas de ángel', text: "a word by clarice lispector falls like a drop onto a small narcissus. you are the breeze.", cta: { label: 'see lalande', href: '/lab/lalande' } },
    { id: 'travesia', group: 'play', preview: 'tunnel', title: 'travesía ácida', text: 'the void from the opening, with no bottom. scrolling takes you in and every twelve layers the acid changes.', cta: { label: 'enter the travesía', href: '/lab/travesia' } },
    { id: 'archivo', group: 'archive', preview: 'desk', title: 'archivo.exe', text: 'my photos of california and nevada, february 2017. move them, open them, pixelate them.', cta: { label: 'open archivo.exe', href: '/lab/archivo' } },
    { id: 'boletos', group: 'archive', preview: 'tickets', title: 'boletos de lima', text: "the bus tickets i kept in lima, pinned to the grid. sort them, open them, or play pasaje with them.", cta: { label: 'see the tickets', href: '/lab/boletos' } },
    { id: 'metro-cards', group: 'archive', preview: 'card', title: 'metro cards', text: 'the transport cards i kept, one city each, on the dot-grid globe. turn them over.', cta: { label: 'see the cards', href: '/lab/metro-cards' } },
    { id: 'bitsplash', group: 'play', preview: 'splash', title: 'bitsplash', text: 'click and an 8-bit acid splash lands on the grey grid. make a mess and keep it as an image.', cta: { label: 'make a splash', href: '/lab/bitsplash' } },
    { id: 'sketchbook', group: 'archive', preview: 'still', soon: true, title: 'sketchbook', text: 'my sketchbook, scanned page by page, as a book you leaf through in 3d.', cta: { label: 'see what it will be', href: '/lab/sketchbook' },
      points: ['the pages fanned like an accordion; drag to turn them.', 'drawings, collage and what i paste in it.', 'the pages are being chosen.'] },
    { id: 'menta-lola', group: 'play', preview: 'still', soon: true, title: 'menta&lola', text: 'my cats, menta and lola, to screen an image with some thirty-two algorithms and their knobs.', cta: { label: 'see what it will be', href: '/lab/menta-lola' },
      points: ['three images: menta, lola and the horse.', 'error diffusion, bayer, halftone, patterns, edges, noise, crt and ascii, among others.', 'the carcoma that eats the image from inside and turns it into ascii.', 'scale, threshold, contrast, gamma, brightness and palette; before and after; copy link.'] },
    { id: 'camara', group: 'play', preview: 'trail', title: 'cámara', text: 'your camera and your hand: pinch thumb and index together and your fingertip leaves a trail of glyphs.', cta: { label: 'draw with your hand', href: '/lab/camara' } },
    { id: 'dona', group: 'play', preview: 'still', soon: true, title: 'dona de teselas', text: 'a donut and other 3d solids made of tiles and glyphs. you turn them and change the image they are made of.', cta: { label: 'see what it will be', href: '/lab/dona' },
      points: ['drag to turn it.', 'tiles: molinete, damero, contorno, puntos, tick, macizo and glyphs.', 'image, solid, cell, palette and speed.'] },
    { id: 'efimero', group: 'play', preview: 'still', soon: true, title: 'ambiente efímero', text: 'live code: music with strudel and visuals with hydra, which exist while they play.', cta: { label: 'see what it will be', href: '/lab/efimero' },
      points: ['music written live with strudel.', 'live visuals with hydra.', 'maybe my sets too.'] },
  ],
  groups: { story: 'story', play: 'to play', archive: 'archive' },
  previewLabel: '{title}, live',
  soon: { label: 'coming soon', back: { label: 'back to the lab', href: '/lab' } },
  experiments: [
    { id: 'medio', title: 'medio tono', meta: 'code, 2026', alt: 'The gallop in blue dots of varying size', visual: 'medio', defaultCell: 8, href: '/lab' },
    { id: 'camara', title: 'cámara tramada', meta: 'code, 2026', alt: 'A photograph of the gallop screened in blue and paper', visual: 'camara', defaultCell: 4, href: '/lab' },
    { id: 'dona', title: 'dona de teselas', meta: 'code, 2026', alt: 'A spinning donut shaded with tiles on blue', visual: 'dona', defaultCell: 8, href: '/lab' },
    { id: 'fotos', title: 'photographs', meta: 'photography, [series]', alt: 'A photograph turned into a mosaic of blue pixels', visual: 'fotos', defaultCell: 8, href: '/lab' },
  ],
};

export const notesPage: NotesPage = {
  title: 'notes',
  lead: 'how each piece is made, written while I build it. every note carries its screened image.',
  items: [
    { id: 'jinete', title: 'taking the rider off an 1878 gallop', excerpt: "Muybridge's photographs come with a rider on top. I erased him with code so the horse could run free.", meta: 'november 2026, 2 min read', href: '/notes/jinete', alt: 'The original photograph of the gallop, screened in blue', visual: 'foto', accent: 'azul' },
    { id: 'ecos', title: 'echoes: drawing time behind a figure', excerpt: 'how the opening draws the earlier frames of the gallop behind the horse.', meta: '[date], [min] read', href: '/notes', alt: 'The horse with its echoes, screened in pink', visual: 'ecos', accent: 'rosado' },
    { id: 'dona', title: 'a 3d donut with four tiles', excerpt: 'a three-dimensional donut shaded with only four eight-by-eight tiles.', meta: '[date], [min] read', href: '/notes', alt: 'A spinning donut, screened in lime on ink', visual: 'dona', accent: 'lima' },
  ],
};

export const studioPage: StudioPage = {
  title: 'studio',
  eyebrow: 'studio',
  name: 'FOMMO Studio',
  lead: 'I direct FOMMO, a studio in Lima where design and complex web development happen at the same table.',
  cta: { label: "go to FOMMO's site", href: 'https://fommo.studio' },
  canvasLabel: "FOMMO's coloured shapes eat the paper, drop letters and start again.",
  preview: {
    src: '/media/fommo-studio.jpg',
    alt: "Preview of fommo.studio: at rest it is a screen of glyphs in the studio's colours; on hover or a tap, the carcoma reveals the real page.",
    host: 'fommo.studio',
    caption: 'FOMMO, brand & product studio',
    live: 'live',
    screened: 'screened',
    href: 'https://fommo.studio',
  },
};

export const contactPage: ContactPage = {
  title: "let's talk",
  lead: 'I work from Lima for any time zone. write to me about a project, a collaboration or just to play with pixels.',
  email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' },
  emailLabel: 'email',
  // upwork and instagram wait for their real links; '#' keeps them off the contact page
  links: [
    { label: 'upwork', href: '#', detail: '' },
    { label: 'instagram', href: '#', detail: '' },
    { label: 'github', href: 'https://github.com/yuangtong', detail: 'yuangtong' },
  ],
  clocks: { mine: 'my time, Lima', you: 'you, {place}', youSame: 'you too, Lima' },
  globe: {
    me: 'me, Lima', you: 'you, {place}', hint: 'drag to turn it',
    label: 'a spinning globe made of dots. a blue dot marks Lima, where I am, and an arc of dots joins it to {place}, near where you are.',
    labelSame: 'a spinning globe made of dots. a blue dot marks Lima, where I am.',
  },
  places: {
    'America/Lima': 'Lima', 'America/Bogota': 'Bogotá', 'America/Mexico_City': 'Mexico City', 'America/Santiago': 'Santiago',
    'America/Argentina/Buenos_Aires': 'Buenos Aires', 'America/Sao_Paulo': 'São Paulo', 'America/Caracas': 'Caracas', 'America/Guayaquil': 'Ecuador',
    'America/La_Paz': 'La Paz', 'America/New_York': 'New York', 'America/Chicago': 'Chicago', 'America/Denver': 'Denver',
    'America/Los_Angeles': 'Los Angeles', 'America/Toronto': 'Toronto', 'America/Panama': 'Panama', 'Europe/Madrid': 'Madrid',
    'Europe/London': 'London', 'Europe/Paris': 'Paris', 'Europe/Berlin': 'Berlin', 'Europe/Rome': 'Rome', 'Europe/Amsterdam': 'Amsterdam',
    'Europe/Lisbon': 'Lisbon', 'Asia/Tokyo': 'Tokyo', 'Asia/Shanghai': 'Shanghai', 'Asia/Seoul': 'Seoul', 'Asia/Kolkata': 'India',
    'Asia/Singapore': 'Singapore', 'Asia/Dubai': 'Dubai', 'Australia/Sydney': 'Sydney',
  },
};


export const sisyphusPage: StoryPage = {
  title: 'sísifo feliz',
  label: "sísifo feliz, Muybridge's 1878 gallop told with narration",
  hint: 'scroll down to tell the story',
  replay: 'again',
};

export const lalandePage: LalandePage = {
  title: 'lalande, lágrimas de ángel',
  canvasLabel: "Muybridge's horse, made of letters, comes apart and forms the word lalande. the word becomes a drop that falls onto a small narcissus against a blue sky. the narcissus sways, turns and implodes, and in its place clarice lispector's book appears in a rain of letters.",
  hint: 'scroll down to read',
  replay: 'again',
  quotes: [
    { text: '“lalande. it is like angel’s tears.”', source: 'clarice lispector, near to the wild heart' },
    { text: '“…the lightest breeze sways it from side to side.”', source: 'clarice lispector, near to the wild heart' },
  ],
  spec: ['small narcissus', 'angel’s tears'],
  breezeLabel: 'breeze',
  breezeHint: 'move the cursor: you are the breeze',
  book: {
    label: 'perto do coração selvagem, by clarice lispector, rocco edition, with a red cover',
    author: 'clarice lispector', title: 'perto do coração selvagem',
    quote: '“freedom is not enough. what I desire has no name yet.”', quoteSource: 'clarice lispector',
  },
  closeText: 'clarice lispector',
  word: 'lalande',
  closeTitle: 'near to the wild heart, 1943',
};

export const travesiaPage: TravesiaPage = {
  title: 'travesía ácida',
  lead: 'a void with no bottom, made of the same dot grid as the opening. scrolling takes you in and every twelve layers the acid changes.',
  canvasLabel: 'a never-ending tunnel of turning squares made of dots; the colour shifts from blue to violet, red and yellow as you go.',
  hint: 'scroll down to enter the tunnel; scroll up to come back. the centre follows the cursor.',
  hintTouch: 'swipe up to enter the tunnel. tap to change the colour.',
  ui: {
    controls: 'controls', cell: 'cell', color: 'colour', all: 'all the acids',
    rampNames: { azul: 'blue', violeta: 'violet', rojo: 'red', amarillo: 'yellow' },
    full: 'full screen', close: 'close', copyLink: 'copy link', copied: 'link copied', depth: 'depth',
  },
};

export const archivePage: ArchivePage = {
  title: 'archivo.exe',
  windowTitle: 'archivo.exe, C:\\photos',
  series: ['highway', 'san francisco', 'chinatown', 'reno'],
  photos: [
    { id: 'IMG_4999', src: '/archivo/img_4999.jpg', serie: 'highway', date: '11 feb 2017, 13:30', alt: 'a freeway under concrete overpasses, blue sky', cell: 8, palette: 'tinta', spot: [0.94, 0.04] },
    { id: 'IMG_5071', src: '/archivo/img_5071.jpg', serie: 'highway', date: '11 feb 2017, 14:10', alt: 'a freeway interchange with the sign to Alum Rock Ave', cell: 4, palette: 'color', spot: [0.44, 0.5] },
    { id: 'IMG_5185', src: '/archivo/img_5185.jpg', serie: 'san francisco', date: '11 feb 2017, 14:51', alt: 'the Golden Gate behind a green field', cell: 4, palette: 'color', spot: [0.34, 0.02] },
    { id: 'IMG_5252', src: '/archivo/img_5252.jpg', serie: 'san francisco', date: '11 feb 2017, 15:28', alt: 'the San Francisco skyline with the Transamerica and two cranes', cell: 2, palette: 'azul', spot: [0.66, 0.1] },
    { id: 'IMG_5253', src: '/archivo/img_5253.jpg', serie: 'san francisco', date: '11 feb 2017, 15:29', alt: 'the San Francisco skyline, closer', cell: 16, palette: 'acida', spot: [0.72, 0.74] },
    { id: 'IMG_5383', src: '/archivo/img_5383.jpg', serie: 'chinatown', date: '11 feb 2017, 16:55', alt: 'a Chinatown street with red new year lanterns', cell: 4, palette: 'color', spot: [0.06, 0.08] },
    { id: 'IMG_5397', src: '/archivo/img_5397.jpg', serie: 'chinatown', date: '11 feb 2017, 17:45', alt: 'a Chinatown square with a red pavilion', cell: 8, palette: 'rojo', spot: [0.16, 0.62] },
    { id: 'IMG_5765', src: '/archivo/img_5765.jpg', serie: 'reno', date: '19 feb 2017, 19:27', alt: 'the GSR casino hotel in Reno under a stormy sky', cell: 4, palette: 'color', spot: [0.98, 0.56] },
  ],
  readme: 'photo archive of yuang tong.\ncalifornia and nevada, february 2017.\ncanon eos rebel t6.\n\nthe prints move: drag them.\ndouble click opens a photo in its window.\ncells of 2, 4, 8 or 16 px, or the original.\neach photo keeps its version.',
  ui: {
    start: 'Start', startLabel: 'start, index of the archive', band: 'archivo 98', tray: 'lima', tidy: 'tidy the prints', closeAll: 'close windows', backToLab: 'back to the lab',
    readmeName: 'readme.txt', readmeTitle: 'readme.txt, notepad', minimize: 'minimize', maximize: 'maximize', restore: 'restore', close: 'close',
    closeExe: 'close archivo.exe and go back to the lab', fill: 'fill the whole screen', unfill: 'show the portfolio', copyLink: 'Copy link', copied: 'link copied', objects: 'objects',
    photo: 'photo', photos: 'photos', cell: 'cell', palette: 'palette', original: 'original', openHint: 'double click to open', open: 'open',
    paletteNames: { tinta: 'ink', azul: 'blue', rojo: 'red', acida: 'acid', color: 'colour' },
  },
};

export const boletosPage: BoletosPage = {
  title: 'boletos de lima',
  lead: "the bus tickets i kept in lima: 72 on paper and one electronic receipt. lima's transport is informal and hard, and still these tickets are ours. drag them, sort them, open them.",
  boardLabel: 'bus tickets from lima pinned to the grey dot grid with coloured push pins',
  sort: { label: 'sort', loose: 'loose', colour: 'by colour', company: 'by company', price: 'by price' },
  hint: { loose: 'click a ticket to see it; drag it and it pins to the grid', sorted: 'sorted; click one to see it, drag one to set it loose' },
  colours: { amarillo: 'yellow', naranja: 'orange', rojo: 'red', rosado: 'pink', morado: 'purple', azul: 'blue', celeste: 'light blue', verde: 'green', 'marrón': 'brown', gris: 'grey', negro: 'black', blanco: 'white' },
  lightbox: { label: 'ticket', of: 'of', price: 'price', fare: 'fare', colour: 'colour', noPrice: 'no price printed', notPrinted: 'not printed', prev: 'previous ticket', next: 'next ticket', close: 'close' },
  play: { title: 'pasaje', text: 'every ticket is money. want to play?', cta: 'play' },
  game: {
    title: 'pasaje', lead: 'every ticket is money. click them before they go and collect the fare.',
    canvasLabel: 'bus tickets from lima pop up on the grey dot grid and vanish; click them to collect their fare before they go.',
    back: 'back to the tickets', time: 'time', collected: 'collected', tickets: 'tickets', start: 'start', restart: 'restart', again: 'play again',
    ready: 'press start, then click the tickets as they appear', playing: 'the dearer the ticket, the faster it goes',
    result: '{money} from {n} tickets', best: 'your best.', bestWas: 'your best: {money}',
  },
};

export const metroCardsPage: MetroCardsPage = {
  title: 'metro cards',
  lead: 'the transport cards i kept, one city each. click a card to turn it over.',
  countries: { pe: 'peru', cl: 'chile', ar: 'argentina', co: 'colombia' },
  front: 'front', back: 'back', turn: 'click to turn', variants: 'variants', count: '{cities} cities, {cards} cards',
  cardLabel: '{system} card, {city}, showing its {side}. press to turn it over.',
  globeLabel: 'a dot-grid globe with {city}, {country} marked in blue in the middle. the other cities with cards: {others}.',
};

export const bitsplashPage: BitsplashPage = {
  title: 'bitsplash',
  lead: 'click anywhere: an 8-bit acid splash lands on the grid.',
  canvasLabel: 'a grey dot grid. every click throws an 8-bit acid splash where it lands, in dithered acid colours, with a few drops around it.',
  hint: 'click anywhere', clean: 'clean', download: 'download', one: 'splash', many: 'splashes',
};

export const camaraPage: CamaraPage = {
  title: 'cámara',
  lead: 'pinch your thumb and index together and your fingertip writes. open your hand to lift the pen.',
  privacy: 'the camera stays on your device: your hand is read in your browser and no image leaves it.',
  start: 'turn the camera on', loading: 'starting the camera…', cursor: 'draw with the cursor', stop: 'turn the camera off',
  denied: 'the camera was not allowed. you can draw with the cursor: press and drag.', noCamera: 'no camera here. you can draw with the cursor: press and drag.',
  sourceHand: 'hand, 21 points', sourceCursor: 'cursor: press and drag', penUp: 'pen up', penDown: 'pen down',
  canvasHand: 'a grey dot grid with your hand screened in ink dots and its 21 tracked points; when you pinch, your fingertip writes a trail of glyphs that glow blue and fade into the paper.',
  canvasCursor: 'a grey dot grid; press and drag to write a trail of glyphs that glow blue and fade into the paper.',
  under: { label: 'under', off: 'off', dots: 'dots', glyphs: 'glyphs' }, trail: { label: 'trail', short: 'short', long: 'long' },
};
