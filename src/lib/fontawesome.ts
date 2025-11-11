// Archivo: lib/fontawesome.ts
// Propósito: Inicializar Font Awesome para uso global en la app
// - Añade el pack de marcas (fab) a la librería
// - Permite usar referencias dinámicas como byPrefixAndName.fab["square-upwork"]
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fab);