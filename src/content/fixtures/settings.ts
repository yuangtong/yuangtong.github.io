import type { Settings } from '../types';

export const settings: Settings = {
  siteTitle: 'yuang tong (唐源), creative coder y diseñador web',
  description: 'yuang tong, creative coder y diseñador web en lima. dirige FOMMO. el lab reúne código, fotografía y música.',
  nav: [
    { label: 'sobre mí', href: '#sobre' },
    { label: 'lab', href: '#lab' },
    { label: 'studio', href: '#studio' },
    { label: 'notas', href: '#notas' },
    { label: 'contacto', href: '#contacto' },
  ],
  footer: { left: 'yuang tong, lima', right: 'galope: eadweard muybridge, 1887, dominio público' },
  ui: {
    openLabel: 'abrir',
    copyLinkLabel: 'copiar enlace',
    copiedLabel: 'enlace copiado',
    cellGroupLabel: 'Tamaño de celda de',
    frameStripLabel: 'Cuadros del galope',
    cameraCounter: 'cámara',
    frameCounter: 'cuadro',
    readNoteLabel: 'leer la nota',
    contactListLabel: 'Datos de contacto',
  },
};
