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
  crumbs: {
    '/lab/sisifo': [{ label: 'lab', href: '/lab' }, { label: 'sísifo feliz', href: '/lab/sisifo' }],
    '/lab/lalande': [{ label: 'lab', href: '/lab' }, { label: 'lalande', href: '/lab/lalande' }],
    '/lab/archivo': [
      { label: 'lab', href: '/lab' },
      { label: 'archivo.exe', href: '/lab/archivo' },
    ],
  },
};
