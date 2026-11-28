import type { AboutPage, ArchivePage, BitsplashPage, SketchbookPage, BoletosPage, CamaraPage, ContactPage, MetroCardsPage, HomePage, LabPage, LalandePage, NotePage, NotesPage, NotFoundPage, StoryPage, StudioPage, TravesiaPage } from '../../types';

export const home: HomePage = {
  intro: {
    name: 'yuang tong',
    nameZh: '唐源',
    role: ['diseñador web', 'creative coder'],
    // mon–fri 9 to 5 in lima, straight through (owner, 2026-11-27); data, so the CMS can set it later
    hours: {
      zone: 'America/Lima', city: 'lima', days: [1, 2, 3, 4, 5], start: 9, end: 17,
      on: 'disponible',
      off: 'no disponible',
      title: 'horario laboral',
      schedule: 'lun–vie, 9:00–17:00, lima',
      mine: 'mi hora',
      yours: 'tu hora',
      working: 'estoy trabajando: escríbeme y te respondo hoy.',
      workingLate: 'estoy trabajando, aunque donde estás son las {time}. siéntete libre de escribirme por correo.',
      away: 'ahora no estoy trabajando. vuelvo el {day} a las {time} en lima, {yours} en tu hora. siéntete libre de escribirme por correo y te respondo entonces.',
      email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' },
    },
    ctas: [
      { label: 'ver el lab', href: '/lab' },
      { label: 'fommo.studio', href: 'https://fommo.studio' },
    ],
    canvasLabel:
      'Un caballo de puntos azules galopa. Al bajar se abre un túnel en espiral, el caballo rompe doce hilos, empuja una roca cuesta arriba, la roca cae y el galope se detiene en el aire. Luego el caballo se pixela hasta volverse letras.',
    narrated: false,
    narration: {
      lines: [
        '1878. doce fotografías en medio segundo, para saber si un caballo vuela.',
        'un galope, cuesta arriba, para siempre.',
        'arriba, la roca vuelve a caer. el loop empieza otra vez.',
      ],
      quote: 'hay que imaginarse a sísifo feliz.',
      quoteSource: 'albert camus, el mito de sísifo, 1942',
      coda: 'crear es volver a empezar, hasta que algo vuele.',
    },
    glyphText: 'yuangtong creative coder diseñador web 唐源 ',
    scrollHint: 'baja para ver la historia',
    scrollHintTouch: 'desliza para ver la historia',
    restartHint: 'sigue deslizando para empezar la historia de nuevo',
    keepScrolling: 'sigue bajando',
    restartGo: 'la historia empieza de nuevo',
    progressLabel: 'dónde estás',
  },
  jugar: {
    title: 'sobre mí',
    line: 'yuang tong (唐源), diseñador web y creative coder en lima. dirijo FOMMO, un estudio boutique, y aquí guardo lo que hago por gusto: arte digital, fotos y música.',
    // the about page is still to come; the button already points to it (owner, 2026-11-27)
    cta: { label: 'más sobre mí', href: '/about' },
  },
  sheets: {
    lab: { title: 'el lab', line: 'historias, píxeles y mi archivo.', href: '/lab' },
    notes: { title: 'notas', line: 'mis notas, escritos y un poco de mi espacio personal.', href: '/notes' },
    studio: { title: 'studio', line: 'dirijo FOMMO, un bespoke studio. el trabajo para clientes vive ahí.', sub: 'marca, producto y desarrollo, hechos a medida.', brand: 'FOMMO', href: '/studio' },
    contact: { title: 'hablemos', line: 'escríbeme a', email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' }, href: '/contact' },
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
      { type: 'figure', src: '/media/notas/jinete-antes.jpg', alt: 'Quince fotografías de un caballo de carreras al galope con su jinete, tomadas por Muybridge', caption: 'antes: los quince cuadros originales, con jinete.', width: 1500, height: 600 },
      { type: 'p', text: 'Eadweard Muybridge fotografió a un caballo al galope en 1878. Sus fotos son de dominio público y sirven perfecto para animar: el movimiento ya está resuelto. El problema es que el caballo lleva jinete.' },
      { type: 'p', text: 'Primero separé la figura del fondo. Cada cuadro es una foto pequeña, de 300 por 200 píxeles, con el caballo oscuro sobre un cielo claro. Con un umbral de luz basta para quedarse con la silueta.' },
      { type: 'p', text: 'Después, encontrar al jinete. En cada columna busco el primer píxel oscuro desde arriba; la columna donde ese punto queda más alto es la gorra. Alrededor de ella abro una ventana de unos setenta píxeles y, dentro, borro todo lo que esté por encima del lomo.' },
      { type: 'p', text: 'El lomo no se ve, porque el jinete lo tapa. Lo reconstruyo con una curva suave entre la altura del cuello y la de la grupa, medidas justo fuera de la ventana. Debajo de la curva relleno; encima, nada.' },
      { type: 'code', text: '// la gorra: la columna con el píxel oscuro más alto\nconst gorra = topes.indexOf(Math.min(...topes));\n\n// el lomo: una curva suave entre cuello y grupa\nfor (let x = x0; x <= x1; x++) {\n  const t = (x - x0) / (x1 - x0);\n  const y = y0 + (y1 - y0) * t * t * (3 - 2 * t);\n  borrarEncima(x, y);\n}' },
      { type: 'p', text: 'Para terminar cierro la silueta con una dilatación y una erosión, y un filtro de mediana que limpia los bordes. No es perfecto: el lomo queda algo plano donde iba la montura. A doce cuadros por segundo casi no se nota.' },
      { type: 'figure', src: '/media/notas/jinete-despues.png', alt: 'Las mismas quince posiciones convertidas en siluetas negras de un caballo sin jinete', caption: 'después: la silueta sin jinete, lista para dibujarse con puntos, letras o teselas.', width: 1500, height: 600, paper: true },
    ],
    links: [
      { label: 'pruébalo en el lab', title: 'medio tono', href: '/lab#pieza-medio' },
      { label: 'siguiente nota', title: 'ecos: dibujar el tiempo detrás de una figura', href: '/notes' },
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
  lead: 'historias, píxeles y mi archivo. siéntete libre de explorar y compartir cada pieza ;)',
  doors: [
    { id: 'sisifo', group: 'story', preview: 'gallop', title: 'sísifo feliz', text: 'el galope de Muybridge de 1878 contado como sísifo: doce fotografías, la colina y la roca que vuelve a rodar.', cta: { label: 'ver sísifo feliz', href: '/lab/sisifo' } },
    { id: 'lalande', group: 'story', preview: 'drop', title: 'lalande, lágrimas de ángel', text: '¿sabes lo que son las lágrimas de ángel? una especie de narciso pequeño, la brisa más ligera lo mueve a un lado y a otro.', cta: { label: 'ver lalande', href: '/lab/lalande' } },
    { id: 'travesia', group: 'play', preview: 'tunnel', title: 'travesía ácida', text: 'enter the void.', cta: { label: 'entrar en la travesía', href: '/lab/travesia' } },
    { id: 'archivo', group: 'archive', preview: 'desk', title: 'archivo.exe', text: 'mi archivo fotográfico: mueve, abre y pixela cada foto.', cta: { label: 'abrir archivo.exe', href: '/lab/archivo' } },
    { id: 'boletos', held: true, group: 'archive', preview: 'tickets', title: 'boletos de lima', text: 'espacio dedicado a conservar, admirar y conmemorar el diseño de los boletos del transporte público de lima.', cta: { label: 'ver los boletos', href: '/lab/boletos' },
      points: ['un archivo del diseño gráfico de los boletos de bus de lima: sus colores, su tipografía, sus empresas.', 'cada boleto escaneado, para verlo de cerca y en detalle.', 'y un pequeño juego hecho con ellos, pasaje.'] },
    { id: 'metro-cards', held: true, group: 'archive', preview: 'card', title: 'metro cards', text: 'espacio que archiva el diseño de las tarjetas de metro de las principales ciudades que tienen este tipo de transporte público.', cta: { label: 'ver las tarjetas', href: '/lab/metro-cards' },
      points: ['un archivo del diseño de las tarjetas de metro, una por ciudad.', 'el frente y el reverso de cada tarjeta, con sus variantes.', 'cada ciudad marcada en un globo de puntos.'] },
    { id: 'bitsplash', group: 'play', preview: 'splash', title: 'bitsplash', text: 'salpicadura ácida. haz un desastre y guárdalo como imagen.', cta: { label: 'salpicar', href: '/lab/bitsplash' } },
    { id: 'sketchbook', group: 'archive', preview: 'book', title: 'sketchbook', text: 'mi intento de sketchbook.', cta: { label: 'hojear el sketchbook', href: '/lab/sketchbook' } },
    { id: 'camara', group: 'play', preview: 'trail', title: 'cámara', text: 'inspirado en los webcam toys de cuando internet era menos invasivo y más divertido.', cta: { label: 'explorar', href: '/lab/camara' } },
    { id: 'dona', group: 'play', preview: 'still', soon: true, title: 'dona de teselas', text: 'una dona y otros 32 algoritmos.', cta: { label: 'ver qué será', href: '/lab/dona' },
      points: ['arrastra para girarla.', 'teselas: molinete, damero, contorno, puntos, tick, macizo y glifos.', 'imagen, sólido, celda, paleta y velocidad.'] },
    { id: 'efimero', group: 'play', preview: 'still', soon: true, title: 'ambiente efímero', text: 'beep beep beep.', cta: { label: 'ver qué será', href: '/lab/efimero' },
      points: ['música escrita en vivo con strudel.', 'visuales en vivo con hydra.', 'quizá también mis sets.'] },
  ],
  groups: { story: 'historias', play: 'píxeles', archive: 'archivo' },
  previewLabel: '{title}, en vivo',
  soon: { label: 'próximamente', back: { label: 'volver al lab', href: '/lab' }, cta: 'ver qué será' },
  experiments: [
    { id: 'medio', title: 'medio tono', meta: 'código, 2026', alt: 'El galope en puntos azules de tamaño variable', visual: 'medio', defaultCell: 8, href: '/lab' },
    { id: 'camara', title: 'cámara tramada', meta: 'código, 2026', alt: 'Fotografía del galope tramada en azul y papel', visual: 'camara', defaultCell: 4, href: '/lab' },
    { id: 'dona', title: 'dona de teselas', meta: 'código, 2026', alt: 'Una dona que gira, sombreada con teselas sobre azul', visual: 'dona', defaultCell: 8, href: '/lab' },
    { id: 'fotos', title: 'fotografías', meta: 'fotografía, [serie]', alt: 'Una fotografía convertida en mosaico de píxeles azules', visual: 'fotos', defaultCell: 8, href: '/lab' },
  ],
};

export const notesPage: NotesPage = {
  title: 'notas',
  lead: 'mis notas, escritos y un poco de mi espacio personal.',
  soon: 'próximamente',
  // one note for now, not published yet (owner, 2026-11-27)
  items: [
    { id: 'manifiesto', soon: true, title: 'manifiesto', excerpt: '', meta: '', href: '/notes', alt: 'El galope tramado en azul', visual: 'foto', accent: 'azul' },
  ],
};

export const studioPage: StudioPage = {
  title: 'studio',
  eyebrow: 'studio',
  name: 'FOMMO Studio',
  lead: 'dirijo FOMMO, un estudio boutique en Lima donde el diseño y el desarrollo web de alta complejidad se hacen en la misma mesa.',
  cta: { label: 'ir a la página de FOMMO', href: 'https://fommo.studio' },
  canvasLabel: 'Formas de colores de FOMMO que se comen el papel, dejan caer letras y vuelven a empezar.',
  preview: {
    src: '/media/fommo-studio.jpg',
    alt: 'Vista previa de fommo.studio: en reposo es una trama de glifos con los colores del estudio; al pasar el cursor o tocarla, la carcoma deja ver la página real.',
    host: 'fommo.studio',
    caption: 'FOMMO, brand & product studio',
    live: 'en vivo',
    screened: 'en trama',
    href: 'https://fommo.studio',
  },
};

export const contactPage: ContactPage = {
  title: 'hablemos',
  lead: 'trabajo desde lima para todo el mundo. escríbeme por un proyecto, una colaboración o si solo tienes alguna duda :)',
  email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' },
  emailLabel: 'correo',
  links: [
    { label: 'upwork', href: 'https://www.upwork.com/freelancers/~01f641e45cff785eed', detail: 'perfil' },
    { label: 'instagram', href: 'https://www.instagram.com/yuang_tong/', detail: '@yuang_tong' },
    { label: 'github', href: 'https://github.com/yuangtong', detail: 'yuangtong' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/yuangtong', detail: 'yuangtong' },
  ],
  clocks: { mine: 'mi hora, Lima', you: 'tu hora, {place}', youSame: 'tu hora, Lima' },
  globe: {
    me: 'mi hora, Lima', you: 'tu hora, {place}', hint: 'arrastra para girarlo',
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
    { text: '«siempre que diga: lalande, debes sentir la vibración fresca y salada del mar…»', source: 'clarice lispector, cerca del corazón salvaje' },
  ],
  spec: ['narciso pequeño', 'lágrimas de ángel'],
  breezeLabel: 'brisa',
  breezeHint: 'mueve el cursor: eres la brisa',
  book: {
    label: 'perto do coração selvagem, de clarice lispector, edición de rocco, con tapa roja',
    author: 'clarice lispector', title: 'perto do coração selvagem',
    quote: '«libertad es poco. lo que deseo aún no tiene nombre.»', quoteSource: 'clarice lispector',
  },
  closeText: 'clarice lispector, 1943',
  word: 'lalande',
  horseText: 'Es como lágrimas de ángel. ¿Sabes lo que son las lágrimas de ángel? Una especie de narciso pequeño, la brisa más ligera lo mueve a un lado y a otro. Lalande es también mar de madrugada, cuando ninguna mirada ha visto todavía la playa, cuando el sol no ha nacido. Siempre que diga: Lalande, debes sentir la vibración fresca y salada del mar, debes andar a lo largo de la playa aún oscura, lentamente, desnudo. De inmediato sentirás Lalande.',
  closeTitle: 'cerca del corazón salvaje',
};

export const travesiaPage: TravesiaPage = {
  title: 'travesía ácida',
  lead: 'un void sin fondo. ¿hasta dónde puedes llegar?',
  canvasLabel: 'un túnel de cuadrados que giran, hecho de puntos, que no termina nunca; el color cambia de azul a violeta, rojo y amarillo mientras se avanza.',
  hint: 'baja con el scroll para entrar en el túnel; súbelo para volver. el centro sigue al cursor.',
  hintTouch: 'desliza hacia arriba para entrar en el túnel. toca para cambiar el color.',
  ui: {
    controls: 'controles', cell: 'celda', color: 'color', all: 'todos los ácidos',
    rampNames: { azul: 'azul', violeta: 'violeta', rojo: 'rojo', amarillo: 'amarillo' },
    full: 'pantalla completa', close: 'cerrar', copyLink: 'copiar enlace', copied: 'enlace copiado', depth: 'profundidad',
  },
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
  readme: 'archivo fotográfico.\n\nlas copias se mueven: arrástralas.\ndoble clic abre la foto en su ventana.\nceldas de 2, 4, 8 o 16 px, u original.\ncada foto guarda su versión.',
  ui: {
    start: 'Inicio', startLabel: 'inicio, índice del archivo', band: 'archivo 98', tray: 'lima', tidy: 'ordenar las copias', closeAll: 'cerrar ventanas', backToLab: 'volver al lab',
    readmeName: 'léeme.txt', readmeTitle: 'léeme.txt, bloc de notas', minimize: 'minimizar', maximize: 'maximizar', restore: 'restaurar', close: 'cerrar',
    closeExe: 'cerrar archivo.exe y volver al lab', fill: 'ocupar toda la pantalla', unfill: 'dejar ver el portafolio', copyLink: 'Copiar enlace', copied: 'enlace copiado', objects: 'objetos',
    photo: 'foto', photos: 'fotos', cell: 'celda', palette: 'paleta', original: 'original', openHint: 'doble clic para abrir', open: 'abrir',
    paletteNames: { tinta: 'tinta', azul: 'azul', rojo: 'rojo', acida: 'ácida', color: 'color' },
  },
};

export const boletosPage: BoletosPage = {
  title: 'boletos de lima',
  lead: 'los boletos de bus que guardo: 72 papeles, entre únicos y repetidos. si quieres colaborar con este archivo, ¡mándame un mensaje directo o un correo electrónico! haz clic en cada boleto para verlo en detalle.',
  boardLabel: 'boletos de bus de lima clavados con chinchetas de colores en la malla de puntos gris',
  sort: { label: 'ordenar', loose: 'sueltos', colour: 'por color', company: 'por empresa', price: 'por precio' },
  hint: { loose: 'haz clic en un boleto para verlo; arrástralo y se clava en la malla', sorted: 'ordenados; haz clic en uno para verlo, arrastra uno para soltarlo' },
  colours: { amarillo: 'amarillo', naranja: 'naranja', rojo: 'rojo', rosado: 'rosado', morado: 'morado', azul: 'azul', celeste: 'celeste', verde: 'verde', 'marrón': 'marrón', gris: 'gris', negro: 'negro', blanco: 'blanco' },
  lightbox: { label: 'boleto', of: 'de', price: 'precio', fare: 'tarifa', colour: 'color', noPrice: 'sin precio impreso', notPrinted: 'no impresa', prev: 'boleto anterior', next: 'boleto siguiente', close: 'cerrar' },
  play: { title: 'pasaje', text: 'cada boleto es plata. ¿quieres jugar?', cta: 'jugar' },
  game: {
    title: 'pasaje', lead: 'cada boleto es plata. haz clic antes de que se vayan y cobra el pasaje.',
    canvasLabel: 'boletos de bus de lima aparecen en la malla de puntos gris y se van; haz clic para cobrar su pasaje antes de que se vayan.',
    back: 'volver a los boletos', time: 'tiempo', collected: 'cobrado', tickets: 'boletos', start: 'empezar', restart: 'reiniciar', again: 'otra vez',
    ready: 'presiona empezar y haz clic en los boletos cuando aparezcan', playing: 'mientras más caro el boleto, más rápido se va',
    result: '{money} con {n} boletos', best: 'tu mejor marca.', bestWas: 'tu mejor marca: {money}',
  },
};

export const metroCardsPage: MetroCardsPage = {
  title: 'metro cards',
  lead: 'las tarjetas de transporte que guardé, una por ciudad. haz clic en una tarjeta para darle la vuelta.',
  countries: { pe: 'perú', cl: 'chile', ar: 'argentina', co: 'colombia' },
  front: 'anverso', back: 'reverso', turn: 'clic para voltear', variants: 'variantes', count: '{cities} ciudades, {cards} tarjetas',
  cardLabel: 'tarjeta {system}, {city}, mostrando su {side}. presiona para darle la vuelta.',
  globeLabel: 'un globo de puntos con {city}, {country} marcada en azul al centro. las otras ciudades con tarjeta: {others}.',
};

export const aboutPage: AboutPage = {
  title: 'sobre mí',
  paras: [
    'hola. soy yuang tong (唐源), diseñador web en lima.',
    'nací en 2001 y vivo en lima. desde muy chico encontré pasión por el arte digital.',
    'estudié, entre muchas cosas, ingeniería informática, y esa base sigue presente en cómo trabajo.',
    'disfruto mucho todo lo que rodea al arte digital: fotografiar, grabar, editar, crear collage digital, entre otros. últimamente me estoy metiendo en la programación creativa, el live coding y el dj. también me gusta mucho leer y escribir.',
    'profesionalmente me dedico al diseño de producto digital, de principio a fin. dirijo fommo, un estudio boutique a medida en lima.',
  ],
  closing: 'eso soy yo, más o menos. hablemos: ',
  email: { label: 'hola@yuangtong.dev', href: 'mailto:hola@yuangtong.dev' },
  portraitAlt: 'retrato de yuang tong en blanco y negro. un poema de césar vallejo se lo come celda por celda y lo vuelve letras, tinta y bloques azules; luego empieza otra vez.',
};

export const sketchbookPage: SketchbookPage = {
  title: 'sketchbook',
  lead: 'mi sketchbook, escaneado página por página. arrastra una esquina o usa las flechas para pasar las hojas.',
  cover: 'sketchbook', coverBy: 'yuang tong', back: 'más páginas pronto: las estoy escaneando.',
  prev: 'página anterior', next: 'página siguiente', bookLabel: 'el sketchbook, un libro que se hojea',
  alts: {
    menta: 'página de menta: su nombre en verde arriba y su retrato a lápiz, en papel de calco, sobre un paisaje de crayón azul y verde.',
    lola: 'página de lola: su nombre en rojo y su retrato con boina roja sobre un fondo amarillo, entre recortes pegados y una frase escrita a mano.',
  },
};

export const bitsplashPage: BitsplashPage = {
  title: 'bitsplash',
  lead: 'haz clic donde quieras: cae una salpicadura ácida de 8 bits sobre la malla.',
  canvasLabel: 'una malla de puntos gris. cada clic lanza una salpicadura ácida de 8 bits donde cae, en colores ácidos tramados, con unas gotas alrededor.',
  hint: 'haz clic donde quieras', clean: 'limpiar', download: 'descargar', one: 'salpicadura', many: 'salpicaduras',
};

export const camaraPage: CamaraPage = {
  title: 'cámara',
  lead: 'un juguete de webcam: pellizca y pinta un efecto sobre ti, y luego tómate la foto.',
  gate: { title: 'esta pieza necesita tu cámara', text: 'tu cámara se lee en tu navegador para encontrar tus manos. nada se guarda en este sitio: es solo para jugar y para mostrar lo que puede la web.', camera: 'encender la cámara', cursor: 'mejor dibujar con el cursor', touch: 'la experiencia completa, con tus manos, se disfruta en una computadora. en el celular la cámara es un web toy: eliges un efecto y cubre toda la imagen.' },
  loading: 'encendiendo la cámara…', stop: 'apagar la cámara', cursor: 'dibujar con el cursor', camera: 'encender la cámara',
  denied: 'no se permitió la cámara. puedes dibujar con el cursor: presiona y arrastra.', noCamera: 'aquí no hay cámara. puedes dibujar con el cursor: presiona y arrastra.',
  sourceHand: 'cámara encendida', sourceToy: 'web toy: toda la imagen', sourceCursor: 'cursor: presiona y arrastra', penUp: 'lápiz arriba', penDown: 'lápiz abajo',
  canvasMirror: 'la imagen de tu cámara, en espejo; donde pellizcas y mueves la mano, se pinta el efecto elegido.',
  canvasToy: 'la imagen de tu cámara, en espejo, entera con el efecto elegido.',
  leadToy: 'toda la imagen toma el efecto. cámbialo y cambia, en vivo.', controls: 'controles de la cámara',
  mode: { label: 'modo', draw: 'dibujo', toy: 'web toy' },
  full: { on: 'pantalla completa', off: 'panel lateral' },
  track: { label: 'seguimiento', on: 'encendido', off: 'en pausa', key: '(barra espaciadora)', paused: 'seguimiento en pausa' },
  canvasCursor: 'una malla de puntos gris; presiona y arrastra para dejar un trazo de tinta que se queda.',
  effect: { label: 'efecto', pixels: 'píxeles', dither: 'trama', halftone: 'medio tono', ascii: 'ascii', stitch: 'bordado', more: 'más efectos', back: 'efectos anteriores' },
  colour: { label: 'color', names: { signal: 'azul', ink: 'tinta', naranja: 'naranja', rosado: 'rosado', lima: 'lima', violeta: 'violeta', multi: 'multicolor' } },
  brush: { label: 'pincel', small: 'chico', medium: 'mediano', large: 'grande' },
  pixel: { label: 'píxel', fine: 'fino', medium: 'medio', coarse: 'grueso' },
  clear: 'limpiar', photo: 'tomar la foto', saved: 'foto guardada',
  how: ['junta pulgar e índice: por donde pasa tu dedo, aparece el efecto. si cierras un lazo, se rellena lo que encierra.', 'un trazo nuevo pinta sobre el anterior.', 'toma la foto: 3, 2, 1, y se descarga.'],
  howToy: ['elige un efecto: cubre toda la imagen.', 'cambia el efecto, el color o el píxel, y cambia en vivo.', 'toma la foto: 3, 2, 1, y se descarga.'],
};
