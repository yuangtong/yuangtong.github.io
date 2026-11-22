import type { ArchivePage, ContactPage, HomePage, LabPage, LalandePage, NotePage, NotesPage, NotFoundPage, StoryPage, StudioPage } from '../types';

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
      quote: 'hay que imaginarse a sísifo feliz.',
      quoteSource: 'albert camus, el mito de sísifo, 1942',
      coda: 'programar es repetir el loop hasta encontrar el cuadro en el que vuelas.',
    },
    glyphText: 'yuangtong creative coder diseñador web lima ',
  },
  jugar: {
    title: 'jugar con los píxeles',
  },
  sheets: {
    lab: { title: 'el lab', line: 'historias, juegos con la cámara y mi archivo de fotos.', href: '/lab' },
    notes: { title: 'notas', line: 'cómo está hecha cada pieza, escrito mientras la construyo.', href: '/notas' },
    studio: { title: 'studio', line: 'dirijo FOMMO, un bespoke studio. el trabajo para clientes vive ahí.', sub: 'marca, producto y desarrollo, hechos a medida.', brand: 'FOMMO', href: '/studio' },
    contact: { title: 'hablemos', line: 'escríbeme a', email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' }, href: '/contacto' },
  },
};

export const notes: NotePage[] = [
  {
    slug: 'jinete',
    title: 'quitarle el jinete a un galope de 1878',
    lead: 'las fotos de Muybridge traen un jinete encima. el caballo de este sitio tenía que ir solo, así que lo borré con código.',
    date: 'noviembre 2026',
    about: 'sobre: medio tono',
    backLabel: 'todas las notas',
    blocks: [
      { type: 'figure', src: '/notas/jinete-antes.jpg', alt: 'Quince fotografías de un caballo de carreras al galope con su jinete, tomadas por Muybridge', caption: 'antes: los quince cuadros originales, con jinete.', width: 1500, height: 600 },
      { type: 'p', text: 'Eadweard Muybridge fotografió a un caballo al galope en quince cuadros. Son de dominio público y sirven perfecto para animar: el movimiento ya está resuelto. El problema es que el caballo lleva jinete.' },
      { type: 'p', text: 'Primero separé la figura del fondo. Cada cuadro es una foto pequeña, de 300 por 200 píxeles, con el caballo oscuro sobre un cielo claro. Con un umbral de luz basta para quedarse con la silueta.' },
      { type: 'p', text: 'Después, encontrar al jinete. En cada columna busco el primer píxel oscuro desde arriba; la columna donde ese punto queda más alto es la gorra. Alrededor de ella abro una ventana de unos setenta píxeles y, dentro, borro todo lo que esté por encima del lomo.' },
      { type: 'p', text: 'El lomo no se ve, porque el jinete lo tapa. Lo reconstruyo con una curva suave entre la altura del cuello y la de la grupa, medidas justo fuera de la ventana. Debajo de la curva relleno; encima, nada.' },
      { type: 'code', text: '// la gorra: la columna con el píxel oscuro más alto\nconst gorra = topes.indexOf(Math.min(...topes));\n\n// el lomo: una curva suave entre cuello y grupa\nfor (let x = x0; x <= x1; x++) {\n  const t = (x - x0) / (x1 - x0);\n  const y = y0 + (y1 - y0) * t * t * (3 - 2 * t);\n  borrarEncima(x, y);\n}' },
      { type: 'p', text: 'Para terminar cierro la silueta con una dilatación y una erosión, y un filtro de mediana que limpia los bordes. No es perfecto: el lomo queda algo plano donde iba la montura. A doce cuadros por segundo casi no se nota.' },
      { type: 'figure', src: '/notas/jinete-despues.png', alt: 'Las mismas quince posiciones convertidas en siluetas negras de un caballo sin jinete', caption: 'después: la silueta sin jinete, lista para dibujarse con puntos, letras o teselas.', width: 1500, height: 600, paper: true },
    ],
    links: [
      { label: 'pruébalo en el lab', title: 'medio tono', href: '/lab#pieza-medio' },
      { label: 'siguiente nota', title: 'ecos: dibujar el tiempo detrás de una figura', href: '/notas' },
    ],
    credit: 'fotografías: eadweard muybridge, dominio público',
  },
];

export const notFound: NotFoundPage = {
  title: 'esta página no existe',
  body: 'el enlace puede estar mal escrito o la página cambió de lugar. el caballo sigue corriendo por el resto del sitio.',
  back: { label: 'volver al inicio', href: '/' },
  lab: { label: 'ir al lab', href: '/lab' },
  canvasLabel: 'el número 404 hecho de puntos; un caballo al galope choca contra él y lo desmorona.',
};

export const labPage: LabPage = {
  title: 'el lab',
  lead: 'historias, juegos con la cámara y mi archivo de fotos. cada pieza se puede retramar y compartir.',
  doors: [
    { id: 'sisifo', title: 'sísifo feliz', text: 'el galope de Muybridge de 1878 contado como sísifo: doce hilos, la colina y la roca que vuelve a rodar.', cta: { label: 'ver sísifo feliz', href: '/lab/sisifo' } },
    { id: 'lalande', title: 'lalande, lágrimas de ángel', text: 'una palabra de clarice lispector cae como gota sobre un narciso pequeño. tú eres la brisa.', cta: { label: 'ver lalande', href: '/lab/lalande' } },
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
    { id: 'jinete', title: 'quitarle el jinete a un galope de 1878', excerpt: 'las fotos de Muybridge traen un jinete encima. lo borré con código para que el caballo fuera libre.', meta: 'noviembre 2026, 2 min de lectura', href: '/notas/jinete', alt: 'La foto original del galope, tramada en azul', visual: 'foto', accent: 'azul' },
    { id: 'ecos', title: 'ecos: dibujar el tiempo detrás de una figura', excerpt: 'cómo la portada dibuja los cuadros anteriores del galope detrás del caballo.', meta: '[fecha], [min] de lectura', href: '/notas', alt: 'El caballo con sus ecos, tramado en rosado', visual: 'ecos', accent: 'rosado' },
    { id: 'dona', title: 'una dona 3d con cuatro teselas', excerpt: 'una dona en tres dimensiones sombreada solo con cuatro teselas de ocho por ocho.', meta: '[fecha], [min] de lectura', href: '/notas', alt: 'Una dona que gira, tramada en lima sobre tinta', visual: 'dona', accent: 'lima' },
  ],
};

export const studioPage: StudioPage = {
  title: 'studio',
  eyebrow: 'studio',
  name: 'FOMMO Studio',
  lead: 'dirijo FOMMO, un estudio en Lima donde el diseño y el desarrollo web de alta complejidad se hacen en la misma mesa.',
  cta: { label: 'ir a la página de FOMMO', href: 'https://fommo.studio' },
  canvasLabel: 'Formas de colores de FOMMO que se comen el papel, dejan caer letras y vuelven a empezar.',
};

export const contactPage: ContactPage = {
  title: 'hablemos',
  lead: 'trabajo desde Lima para cualquier huso horario. escríbeme por un proyecto, una colaboración o solo para jugar con píxeles.',
  email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' },
  emailLabel: 'correo',
  // upwork and instagram wait for their real links; '#' keeps them off the contact page
  links: [
    { label: 'upwork', href: '#', detail: '' },
    { label: 'instagram', href: '#', detail: '' },
    { label: 'github', href: 'https://github.com/yuangtong', detail: 'yuangtong' },
  ],
  clocks: { mine: 'mi hora, Lima', you: 'tú, {place}', youSame: 'tú también, Lima' },
  globe: {
    me: 'yo, Lima', you: 'tú, {place}', hint: 'arrastra para girarlo',
    label: 'globo terráqueo hecho de puntos que gira. un punto azul marca Lima, donde estoy, y un arco de puntos lo une con {place}, cerca de donde estás tú.',
    labelSame: 'globo terráqueo hecho de puntos que gira. un punto azul marca Lima, donde estoy.',
  },
  places: {
    'America/Lima': 'Lima', 'America/Bogota': 'Bogotá', 'America/Mexico_City': 'Ciudad de México', 'America/Santiago': 'Santiago',
    'America/Argentina/Buenos_Aires': 'Buenos Aires', 'America/Sao_Paulo': 'São Paulo', 'America/Caracas': 'Caracas', 'America/Guayaquil': 'Ecuador',
    'America/La_Paz': 'La Paz', 'America/New_York': 'Nueva York', 'America/Chicago': 'Chicago', 'America/Denver': 'Denver',
    'America/Los_Angeles': 'Los Ángeles', 'America/Toronto': 'Toronto', 'America/Panama': 'Panamá', 'Europe/Madrid': 'Madrid',
    'Europe/London': 'Londres', 'Europe/Paris': 'París', 'Europe/Berlin': 'Berlín', 'Europe/Rome': 'Roma', 'Europe/Amsterdam': 'Ámsterdam',
    'Europe/Lisbon': 'Lisboa', 'Asia/Tokyo': 'Tokio', 'Asia/Shanghai': 'Shanghái', 'Asia/Seoul': 'Seúl', 'Asia/Kolkata': 'India',
    'Asia/Singapore': 'Singapur', 'Asia/Dubai': 'Dubái', 'Australia/Sydney': 'Sídney',
  },
};


export const sisyphusPage: StoryPage = {
  title: 'sísifo feliz',
  label: 'sísifo feliz, el galope de Muybridge de 1878 contado con narración',
  hint: 'baja para contar la historia',
  replay: 'de nuevo',
};

export const lalandePage: LalandePage = {
  title: 'lalande, lágrimas de ángel',
  canvasLabel: 'el caballo de Muybridge, hecho de letras, se deshace y forma la palabra lalande. la palabra se vuelve una gota que cae sobre un narciso pequeño contra un cielo azul. el narciso se mece, gira e implosiona, y en su lugar aparece el libro de clarice lispector entre lluvia de letras.',
  hint: 'baja para leer',
  replay: 'de nuevo',
  quotes: [
    { text: '«lalande. es como lágrimas de ángel.»', source: 'clarice lispector, cerca del corazón salvaje' },
    { text: '«…la brisa más ligera lo mueve a un lado y a otro.»', source: 'clarice lispector, cerca del corazón salvaje' },
  ],
  spec: ['narciso pequeño', 'lágrimas de ángel'],
  breezeLabel: 'brisa',
  breezeHint: 'mueve el cursor: eres la brisa',
  book: {
    label: 'perto do coração selvagem, de clarice lispector, edición de rocco, con tapa roja',
    author: 'clarice lispector', title: 'perto do coração selvagem',
    quote: '«libertad es poco. lo que deseo aún no tiene nombre.»', quoteSource: 'clarice lispector',
  },
  closeText: 'clarice lispector',
  word: 'lalande',
  closeTitle: 'cerca del corazón salvaje, 1943',
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
