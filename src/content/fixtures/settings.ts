import type { Settings } from '../types';

export const settings: Settings = {
  siteTitle: 'yuang tong (唐源), creative coder y diseñador web',
  description: 'yuang tong, creative coder y diseñador web en lima. dirige FOMMO. el lab reúne código, fotografía y música.',
  nav: [
    { label: 'sobre mí', href: '/#jugar' },
    { label: 'lab', href: '/lab' },
    { label: 'studio', href: '/studio' },
    { label: 'notas', href: '/notas' },
    { label: 'contacto', href: '/contacto' },
  ],
  footer: { left: 'yuang tong, lima', right: 'galope: eadweard muybridge, 1887, dominio público' },
  ui: {
    openLabel: 'abrir',
    copyLinkLabel: 'copiar enlace',
    copiedLabel: 'enlace copiado',
    cellGroupLabel: 'Tamaño de celda de',
    frameStripLabel: 'Cuadros del galope',
    menuLabel: 'menú',
    closeLabel: 'cerrar',
    framePrev: 'cuadro anterior',
    frameNext: 'cuadro siguiente',
    cameraCounter: 'cámara',
    frameCounter: 'cuadro',
    readNoteLabel: 'leer la nota',
    enterLabel: 'entrar',
    navLabel: 'Principal',
    crumbLabel: 'Sección',
  },
  share: {
    title: 'yuang tong (唐源), web designer & creative coder',
    description: 'yuang tong, web designer and creative coder in lima. he directs FOMMO. the lab gathers code, photography and music.',
    image: '/social-preview-g75.jpg',
    alt: "yuang tong (唐源), web designer & creative coder: Muybridge's horse and rider in blue dots on a grey dot grid.",
    width: 2400,
    height: 1260,
  },
  crumbs: {
    '/lab/sisifo': [{ label: 'lab', href: '/lab' }, { label: 'sísifo feliz', href: '/lab/sisifo' }],
    '/lab/lalande': [{ label: 'lab', href: '/lab' }, { label: 'lalande', href: '/lab/lalande' }],
    '/lab/travesia': [{ label: 'lab', href: '/lab' }, { label: 'travesía ácida', href: '/lab/travesia' }],
    '/notas/jinete': [{ label: 'notas', href: '/notas' }, { label: 'quitarle el jinete', href: '/notas/jinete' }],
    '/lab/archivo': [
      { label: 'lab', href: '/lab' },
      { label: 'archivo.exe', href: '/lab/archivo' },
    ],
  },
};
