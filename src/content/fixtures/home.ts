import type { HomePage, NotFoundPage } from '../types';

export const home: HomePage = {
  intro: {
    name: 'yuang tong',
    nameZh: '唐源',
    role: 'creative coder y diseñador web',
    availability: 'disponible, lima',
    ctas: [
      { label: 'ver el lab', href: '#lab' },
      { label: 'fommo.studio', href: 'https://fommo.studio' },
    ],
    canvasLabel:
      'Un caballo de puntos azules galopa con sus ecos. Al bajar, la rejilla se abre en un túnel en espiral. Al salir, el caballo rompe doce hilos frente a una pared numerada, empuja una roca cuesta arriba, la roca cae, y el galope se detiene en el cuadro en que ninguna pata toca el suelo.',
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
  },
  lab: {
    title: 'el lab',
    lead: 'código, fotografías y música. cambia la celda de cada pieza y copia el enlace: compartes tu versión.',
    more: { label: 'ver todo el lab', href: '#lab' },
    experiments: [
      { id: 'medio', title: 'medio tono', meta: 'código, 2026', alt: 'El galope en puntos azules de tamaño variable', visual: 'medio', defaultCell: 8, href: '#lab' },
      { id: 'camara', title: 'cámara tramada', meta: 'código, 2026', alt: 'Fotografía del galope tramada en azul y papel', visual: 'camara', defaultCell: 4, href: '#lab' },
      { id: 'dona', title: 'dona de teselas', meta: 'código, 2026', alt: 'Una dona que gira, sombreada con teselas sobre azul', visual: 'dona', defaultCell: 8, href: '#lab' },
      { id: 'fotos', title: 'fotografías', meta: 'fotografía, [serie]', alt: 'Una fotografía convertida en mosaico de píxeles azules', visual: 'fotos', defaultCell: 8, href: '#lab' },
    ],
  },
  studio: {
    title: 'studio',
    body: 'dirijo FOMMO, un bespoke studio de marca y producto. el trabajo con clientes vive allí.',
    cta: { label: 'ir a fommo.studio', href: 'https://fommo.studio' },
  },
  notes: {
    title: 'notas',
    lead: 'cómo está hecha cada pieza, escrito mientras la construyo. cada nota lleva su imagen tramada.',
    more: { label: 'todas las notas', href: '#notas' },
    items: [
      { id: 'jinete', title: 'quitarle el jinete a un galope de 1887', excerpt: 'las fotos de Muybridge traen un jinete encima. lo borré con código para que el caballo fuera libre.', meta: '[fecha], [min] de lectura', href: '#notas', alt: 'La foto original del galope, tramada en azul', visual: 'foto', accent: 'azul' },
      { id: 'ecos', title: 'ecos: dibujar el tiempo detrás de una figura', excerpt: 'cómo la portada dibuja los cuadros anteriores del galope detrás del caballo.', meta: '[fecha], [min] de lectura', href: '#notas', alt: 'El caballo con sus ecos, tramado en rosado', visual: 'ecos', accent: 'rosado' },
      { id: 'dona', title: 'una dona 3d con cuatro teselas', excerpt: 'una dona en tres dimensiones sombreada solo con cuatro teselas de ocho por ocho.', meta: '[fecha], [min] de lectura', href: '#notas', alt: 'Una dona que gira, tramada en lima sobre tinta', visual: 'dona', accent: 'lima' },
    ],
  },
  contact: {
    title: 'hablemos',
    primary: { label: 'escribirme por correo', href: '#contacto' },
    links: [
      { label: 'whatsapp', href: '#contacto' },
      { label: 'github', href: 'https://github.com/yuangtong' },
      { label: 'linkedin', href: '#contacto' },
    ],
    facts: [
      { label: 'hora en lima', value: '', kind: 'clock', note: 'gmt−5' },
      { label: 'respondo en', value: '[1–2 días]' },
      { label: 'idiomas', value: 'español, english' },
      { label: 'disponible', value: '[desde mes]' },
    ],
  },
};

export const notFound: NotFoundPage = {
  title: 'esta página no existe',
  body: 'el enlace puede estar mal escrito o la página cambió de lugar. el caballo sigue corriendo por el resto del sitio.',
  back: { label: 'volver al inicio', href: '/' },
};
