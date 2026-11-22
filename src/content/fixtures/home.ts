import type { ArchivePage, ContactPage, HomePage, LabPage, NotesPage, NotFoundPage, StudioPage } from '../types';

export const home: HomePage = {
  intro: {
    name: 'yuang tong',
    nameZh: '唐源',
    role: 'creative coder y diseñador web',
    availability: 'disponible, lima',
    ctas: [
      { label: 'ver el lab', href: '/lab' },
      { label: 'fommo.studio', href: 'https://fommo.studio' },
    ],
    canvasLabel:
      'Un caballo de puntos azules galopa. Al bajar se abre un túnel en espiral, el caballo rompe doce hilos, empuja una roca cuesta arriba, la roca cae y el galope se detiene en el aire. Luego el caballo se pixela hasta volverse letras.',
    narrated: false,
    narration: {
      lines: [
        '1878. un caballo rompe doce hilos y cada hilo dispara una cámara.',
        'quince cuadros, cuesta arriba, para siempre.',
        'arriba, la roca vuelve a caer. el loop empieza otra vez.',
      ],
      quote: 'hay que imaginarse a Sísifo feliz.',
      quoteSource: 'Albert Camus, El mito de Sísifo, 1942',
      coda: 'programar es repetir el loop hasta encontrar el cuadro en el que vuelas.',
    },
    glyphText: 'yuangtong creative coder diseñador web lima ',
  },
  jugar: {
    title: 'jugar con los píxeles',
    hint: 'mueve el cursor: las letras se apartan',
    hintTouch: 'toca y arrastra: las letras se apartan',
  },
  sheets: {
    lab: { title: 'el lab', line: 'historias, juegos con la cámara y mi archivo de fotos.', href: '/lab' },
    notes: { title: 'notas', line: 'cómo está hecha cada pieza, escrito mientras la construyo.', href: '/notas' },
    studio: { title: 'studio', line: 'dirijo FOMMO, un bespoke studio. el trabajo para clientes vive ahí.', sub: 'marca, producto y desarrollo, hechos a medida.', href: '/studio' },
    contact: { title: 'hablemos', line: 'escríbeme a', email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' }, href: '/contacto' },
  },
};

export const notFound: NotFoundPage = {
  title: 'esta página no existe',
  body: 'el enlace puede estar mal escrito o la página cambió de lugar. el caballo sigue corriendo por el resto del sitio.',
  back: { label: 'volver al inicio', href: '/' },
};

export const labPage: LabPage = {
  title: 'el lab',
  lead: 'historias, juegos con la cámara y mi archivo de fotos. cada pieza se puede retramar y compartir.',
  doors: [
    { id: 'historias', title: 'historias', text: 'Sísifo con el caballo de Muybridge y Lalande con Clarice Lispector, contadas en píxeles.', cta: { label: 'ver historias', href: '/lab#pieza-medio' } },
    { id: 'camara', title: 'cámara', text: 'tu cámara tramada en vivo. elige la celda y guarda tu versión.', cta: { label: 'abrir la cámara', href: '/lab#pieza-camara' } },
    { id: 'archivo', title: 'archivo.exe', text: 'mis fotos de california y nevada, febrero de 2017. muévelas, ábrelas, pixélalas.', cta: { label: 'abrir archivo.exe', href: '/lab/archivo' } },
  ],
  experiments: [
    { id: 'medio', title: 'medio tono', meta: 'código, 2026', alt: 'El galope en puntos azules de tamaño variable', visual: 'medio', defaultCell: 8, href: '/lab' },
    { id: 'camara', title: 'cámara tramada', meta: 'código, 2026', alt: 'Fotografía del galope tramada en azul y papel', visual: 'camara', defaultCell: 4, href: '/lab' },
    { id: 'dona', title: 'dona de teselas', meta: 'código, 2026', alt: 'Una dona que gira, sombreada con teselas sobre azul', visual: 'dona', defaultCell: 8, href: '/lab' },
    { id: 'fotos', title: 'fotografías', meta: 'fotografía, [serie]', alt: 'Una fotografía convertida en mosaico de píxeles azules', visual: 'fotos', defaultCell: 8, href: '/lab' },
  ],
};

export const notesPage: NotesPage = {
  title: 'notas',
  lead: 'cómo está hecha cada pieza, escrito mientras la construyo. cada nota lleva su imagen tramada.',
  items: [
    { id: 'jinete', title: 'quitarle el jinete a un galope de 1878', excerpt: 'las fotos de Muybridge traen un jinete encima. lo borré con código para que el caballo fuera libre.', meta: '[fecha], [min] de lectura', href: '/notas', alt: 'La foto original del galope, tramada en azul', visual: 'foto', accent: 'azul' },
    { id: 'ecos', title: 'ecos: dibujar el tiempo detrás de una figura', excerpt: 'cómo la portada dibuja los cuadros anteriores del galope detrás del caballo.', meta: '[fecha], [min] de lectura', href: '/notas', alt: 'El caballo con sus ecos, tramado en rosado', visual: 'ecos', accent: 'rosado' },
    { id: 'dona', title: 'una dona 3d con cuatro teselas', excerpt: 'una dona en tres dimensiones sombreada solo con cuatro teselas de ocho por ocho.', meta: '[fecha], [min] de lectura', href: '/notas', alt: 'Una dona que gira, tramada en lima sobre tinta', visual: 'dona', accent: 'lima' },
  ],
};

export const studioPage: StudioPage = {
  title: 'studio',
  lead: 'dirijo FOMMO, un bespoke studio. el trabajo para clientes vive ahí.',
  sub: 'marca, producto y desarrollo, hechos a medida.',
  cta: { label: 'fommo.studio', href: 'https://fommo.studio' },
};

export const contactPage: ContactPage = {
  title: 'hablemos',
  lead: 'escríbeme a',
  email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' },
  links: [
    { label: 'upwork', href: '#' },
    { label: 'instagram', href: '#' },
    { label: 'github', href: 'https://github.com/yuangtong' },
  ],
};


export const archivePage: ArchivePage = {
  title: 'archivo.exe',
  windowTitle: 'archivo.exe, C:\\fotos',
  series: ['carretera', 'san francisco', 'chinatown', 'reno'],
  photos: [
    { id: 'IMG_4999', src: '/archivo/img_4999.jpg', serie: 'carretera', date: '11 feb 2017, 13:30', alt: 'autopista bajo pasos elevados de concreto, cielo azul', cell: 8, palette: 'tinta', spot: [0.94, 0.04] },
    { id: 'IMG_5071', src: '/archivo/img_5071.jpg', serie: 'carretera', date: '11 feb 2017, 14:10', alt: 'intercambio de autopistas con el letrero a Alum Rock Ave', cell: 4, palette: 'color', spot: [0.44, 0.5] },
    { id: 'IMG_5185', src: '/archivo/img_5185.jpg', serie: 'san francisco', date: '11 feb 2017, 14:51', alt: 'el Golden Gate detrás de un campo verde', cell: 4, palette: 'color', spot: [0.34, 0.02] },
    { id: 'IMG_5252', src: '/archivo/img_5252.jpg', serie: 'san francisco', date: '11 feb 2017, 15:28', alt: 'skyline de San Francisco con la Transamerica y dos grúas', cell: 2, palette: 'azul', spot: [0.66, 0.1] },
    { id: 'IMG_5253', src: '/archivo/img_5253.jpg', serie: 'san francisco', date: '11 feb 2017, 15:29', alt: 'skyline de San Francisco, más cerca', cell: 16, palette: 'acida', spot: [0.72, 0.74] },
    { id: 'IMG_5383', src: '/archivo/img_5383.jpg', serie: 'chinatown', date: '11 feb 2017, 16:55', alt: 'calle de Chinatown con faroles rojos de año nuevo', cell: 4, palette: 'color', spot: [0.06, 0.08] },
    { id: 'IMG_5397', src: '/archivo/img_5397.jpg', serie: 'chinatown', date: '11 feb 2017, 17:45', alt: 'plaza de Chinatown con un pabellón rojo', cell: 8, palette: 'rojo', spot: [0.16, 0.62] },
    { id: 'IMG_5765', src: '/archivo/img_5765.jpg', serie: 'reno', date: '19 feb 2017, 19:27', alt: 'hotel casino GSR en Reno bajo un cielo de tormenta', cell: 4, palette: 'color', spot: [0.98, 0.56] },
  ],
  readme: 'archivo fotográfico de yuang tong.\ncalifornia y nevada, febrero de 2017.\ncanon eos rebel t6.\n\nlas copias se mueven: arrástralas.\ndoble clic abre la foto en su ventana.\nceldas de 2, 4, 8 o 16 px, u original.\ncada foto guarda su versión.',
  ui: {
    start: 'Inicio', startLabel: 'inicio, índice del archivo', band: 'archivo 98', tray: 'lima', tidy: 'ordenar las copias', closeAll: 'cerrar ventanas', backToLab: 'volver al lab',
    readmeName: 'léeme.txt', readmeTitle: 'léeme.txt, bloc de notas', minimize: 'minimizar', maximize: 'maximizar', restore: 'restaurar', close: 'cerrar',
    closeExe: 'cerrar archivo.exe y volver al lab', fill: 'ocupar toda la pantalla', unfill: 'dejar ver el portafolio', copyLink: 'Copiar enlace', copied: 'enlace copiado', objects: 'objetos',
    photo: 'foto', photos: 'fotos', cell: 'celda', palette: 'paleta', original: 'original', openHint: 'doble clic para abrir', open: 'abrir',
    paletteNames: { tinta: 'tinta', azul: 'azul', rojo: 'rojo', acida: 'ácida', color: 'color' },
  },
};
