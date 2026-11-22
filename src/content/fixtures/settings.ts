import type { Settings } from '../types';

export const settings: Settings = {
  siteTitle: 'yuang tong (唐源), creative coder y diseñador web',
  description: 'yuang tong, creative coder y diseñador web en lima. dirige FOMMO. el lab reúne código, fotografía y música.',
  nav: [
    { label: 'inicio', href: '#inicio' },
    { label: 'jugar', href: '#jugar' },
    { label: 'lab', href: '#lab' },
    { label: 'notas', href: '#notas' },
    { label: 'studio', href: '#studio' },
    { label: 'contacto', href: '#contacto' },
  ],
  footer: { left: 'yuang tong, lima', right: 'galope: eadweard muybridge, 1887, dominio público' },
  ui: {
    openLabel: 'abrir',
    copyLinkLabel: 'copiar enlace',
    copiedLabel: 'enlace copiado',
    cellGroupLabel: 'Tamaño de celda de',
    frameStripLabel: 'Cuadros del galope',
    indexLabel: 'índice',
    framePrev: 'cuadro anterior',
    frameNext: 'cuadro siguiente',
    cameraCounter: 'cámara',
    frameCounter: 'cuadro',
    readNoteLabel: 'leer la nota',
  },
};
