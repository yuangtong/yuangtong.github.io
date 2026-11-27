/**
 * The owner's collections in the lab, the same in every language (only the
 * words around them are translated, in the fixtures). Scans by the owner,
 * 2026-11-26: cut out from the scanner bed, each page brought to one scale.
 */

/** A Lima bus ticket. `colour` is the owner's classification (Spanish key, named per language in content); `fare` is printed on the ticket; `w`/`h` at one shared scale. */
export type Boleto = { id: string; colour: string; company: string; price: number | null; fare: string; w: number; h: number; electronic?: true };

export const boletoSrc = (id: string) => `/lab/boletos/${id}.webp`;

/** 73 tickets: 72 on paper and one electronic receipt (b43), the last one. */
export const BOLETOS: Boleto[] = [
  { id: 'b01', colour: 'azul', company: "ETUSA", price: 1.0, fare: "medio / urbano / escolar", w: 338, h: 484 },
  { id: 'b02', colour: 'verde', company: "Las Flores", price: 1.5, fare: "medio / univ. / urbano", w: 382, h: 502 },
  { id: 'b03', colour: 'azul', company: "Urano Tours", price: 3.0, fare: "inter / urbano", w: 390, h: 488 },
  { id: 'b04', colour: 'morado', company: "Etgusicsa", price: 9.0, fare: "directo", w: 392, h: 498 },
  { id: 'b05', colour: 'azul', company: "Trans. Service Canada", price: 4.0, fare: "adulto interurbano", w: 330, h: 523 },
  { id: 'b06', colour: 'celeste', company: "Nuevo Horizonte", price: 1.5, fare: "adulto / directo", w: 318, h: 463 },
  { id: 'b07', colour: 'amarillo', company: "Translima", price: 1.0, fare: "", w: 360, h: 574 },
  { id: 'b08', colour: 'amarillo', company: "Translima", price: 1.0, fare: "univ. / zonal / escolar", w: 352, h: 529 },
  { id: 'b09', colour: 'amarillo', company: "Etsajosa", price: 6.0, fare: "directo", w: 363, h: 487 },
  { id: 'b10', colour: 'rojo', company: "Translima", price: 3.0, fare: "", w: 328, h: 473 },
  { id: 'b11', colour: 'rosado', company: "Vencedores", price: 1.0, fare: "zonal / escolar", w: 392, h: 530 },
  { id: 'b12', colour: 'naranja', company: "San Francisco de Asís", price: 1.0, fare: "esc. / zonal / univ.", w: 349, h: 516 },
  { id: 'b13', colour: 'naranja', company: "Las Flores", price: 1.0, fare: "promocional / escolar", w: 404, h: 541 },
  { id: 'b14', colour: 'naranja', company: "Víctor Raúl Haya de la Torre", price: 3.0, fare: "adulto / interurbano 2", w: 340, h: 542 },
  { id: 'b15', colour: 'rojo', company: "La Unidad de Villa", price: 1.0, fare: "zonal / urbano", w: 371, h: 491 },
  { id: 'b16', colour: 'morado', company: "Lima Urban Company", price: 1.5, fare: "urbano", w: 355, h: 510 },
  { id: 'b17', colour: 'rosado', company: "Las Flores", price: 1.5, fare: "medio / univ. / urbano", w: 398, h: 543 },
  { id: 'b18', colour: 'marrón', company: "Comité Cien", price: 1.5, fare: "interurb. / med. / univ.", w: 365, h: 526 },
  { id: 'b19', colour: 'morado', company: "Nuevo Horizonte", price: 1.2, fare: "medio / univ. / interurbano", w: 355, h: 556 },
  { id: 'b20', colour: 'verde', company: "Santo Cristo de Pachacamilla", price: 2.0, fare: "urbano / univ.", w: 383, h: 503 },
  { id: 'b21', colour: 'verde', company: "Transportes Pesqueros", price: 1.5, fare: "local", w: 335, h: 480 },
  { id: 'b22', colour: 'verde', company: "Las Flores", price: 1.5, fare: "medio / univ. / urbano", w: 390, h: 501 },
  { id: 'b23', colour: 'gris', company: "Víctor Raúl Haya de la Torre", price: null, fare: "medio / univ.", w: 337, h: 540 },
  { id: 'b24', colour: 'naranja', company: "Etgusicsa", price: 2.5, fare: "medio / directo", w: 358, h: 434 },
  { id: 'b25', colour: 'rosado', company: "Translima", price: 5.0, fare: "directo", w: 448, h: 311 },
  { id: 'b26', colour: 'naranja', company: "Etgusicsa", price: 2.5, fare: "medio / directo", w: 443, h: 359 },
  { id: 'b27', colour: 'amarillo', company: "El Porvenir", price: 1.0, fare: "escolar", w: 335, h: 474 },
  { id: 'b28', colour: 'celeste', company: "Transportes Pesqueros", price: 1.0, fare: "zonal", w: 371, h: 471 },
  { id: 'b29', colour: 'amarillo', company: "Translima", price: 1.0, fare: "adulto / escolar / medio / univ.", w: 311, h: 502 },
  { id: 'b30', colour: 'morado', company: "Translima", price: 2.5, fare: "", w: 434, h: 309 },
  { id: 'b31', colour: 'azul', company: "Corp. Roma", price: 1.5, fare: "", w: 304, h: 490 },
  { id: 'b32', colour: 'rojo', company: "Trans. Service Canada", price: 3.0, fare: "adulto urbano", w: 492, h: 313 },
  { id: 'b33', colour: 'gris', company: "Etgusicsa", price: 1.0, fare: "escolar", w: 361, h: 431 },
  { id: 'b34', colour: 'rosado', company: "Las Flores", price: 2.0, fare: "medio / univ. / interurb.", w: 337, h: 469 },
  { id: 'b35', colour: 'verde', company: "Transportes Pesqueros", price: 1.5, fare: "medio / urbano", w: 358, h: 452 },
  { id: 'b36', colour: 'verde', company: "El Porvenir", price: 1.5, fare: "universitario / urbano", w: 482, h: 308 },
  { id: 'b37', colour: 'amarillo', company: "Translima", price: 1.0, fare: "adulto / escolar / medio / univ.", w: 315, h: 402 },
  { id: 'b38', colour: 'marrón', company: "El Porvenir", price: 1.0, fare: "universitario / zonal", w: 313, h: 452 },
  { id: 'b39', colour: 'negro', company: "Las Flores", price: 1.0, fare: "promocional / escolar", w: 360, h: 501 },
  { id: 'b40', colour: 'celeste', company: "Etvasa", price: 2.0, fare: "medio univ. / directo", w: 482, h: 304 },
  { id: 'b41', colour: 'morado', company: "Etvasa", price: 1.0, fare: "medio univ. / urbano", w: 317, h: 515 },
  { id: 'b42', colour: 'rosado', company: "Translima", price: 5.5, fare: "directo", w: 437, h: 311 },
  { id: 'b43', colour: 'blanco', company: "San Francisco de Asís", price: 1.0, fare: "zonal / med. / univ.", w: 615, h: 445, electronic: true },
  { id: 'b44', colour: 'marrón', company: "Grupo Diez", price: 1.0, fare: "zonal", w: 362, h: 551 },
  { id: 'b45', colour: 'naranja', company: "Santo Cristo", price: 3.0, fare: "adulto", w: 349, h: 504 },
  { id: 'b46', colour: 'celeste', company: "Translima", price: 1.5, fare: "", w: 358, h: 517 },
  { id: 'b47', colour: 'morado', company: "Etgusicsa", price: 1.5, fare: "urbano", w: 448, h: 507 },
  { id: 'b48', colour: 'amarillo', company: "Víctor Raúl Haya de la Torre", price: 5.0, fare: "directo", w: 384, h: 263 },
  { id: 'b49', colour: 'amarillo', company: "Las Flores", price: 1.5, fare: "medio / univ. / urbano", w: 316, h: 418 },
  { id: 'b50', colour: 'verde', company: "Transportes Pesqueros", price: 1.5, fare: "medio / urbano", w: 376, h: 303 },
  { id: 'b51', colour: 'verde', company: "Urano Tours", price: 4.5, fare: "adulto / directo", w: 371, h: 296 },
  { id: 'b52', colour: 'azul', company: "ETUSA", price: 1.0, fare: "medio / urbano / escolar", w: 288, h: 399 },
  { id: 'b53', colour: 'celeste', company: "Translima", price: 1.5, fare: "", w: 259, h: 363 },
  { id: 'b54', colour: 'verde', company: "Transportes Pesqueros", price: 1.5, fare: "medio / urbano", w: 358, h: 247 },
  { id: 'b55', colour: 'naranja', company: "Las Flores", price: 1.0, fare: "promocional / escolar", w: 404, h: 317 },
  { id: 'b56', colour: 'morado', company: "Víctor Raúl Haya de la Torre", price: 2.0, fare: "interurbano 1", w: 290, h: 403 },
  { id: 'b57', colour: 'marrón', company: "Cruz del Centro", price: 3.5, fare: "zonal", w: 362, h: 299 },
  { id: 'b58', colour: 'rojo', company: "Consorcio Roma", price: 1.5, fare: "", w: 270, h: 355 },
  { id: 'b59', colour: 'rosado', company: "Los Excelentes Unidos", price: 1.5, fare: "urb. / medio univ.", w: 394, h: 270 },
  { id: 'b60', colour: 'rojo', company: "Consorcio Roma", price: 1.5, fare: "", w: 254, h: 346 },
  { id: 'b62', colour: 'gris', company: "San Francisco de Asís", price: 2.5, fare: "directo / univ.", w: 380, h: 273 },
  { id: 'b63', colour: 'naranja', company: "Los Excelentes Unidos", price: 1.0, fare: "zonal / med. univ. / esc.", w: 254, h: 384 },
  { id: 'b64', colour: 'azul', company: "Trans. Service Canada", price: 4.0, fare: "adulto interurbano", w: 402, h: 262 },
  { id: 'b65', colour: 'gris', company: "Trans. Service Canada", price: 2.0, fare: "medio univ. / interurbano", w: 505, h: 332 },
  { id: 'b66', colour: 'verde', company: "Víctor Raúl Haya de la Torre", price: 3.5, fare: "interurbano", w: 506, h: 394 },
  { id: 'b67', colour: 'marrón', company: "Huandoy", price: 4.0, fare: "directo", w: 315, h: 457 },
  { id: 'b68', colour: 'naranja', company: "Transportes Pesqueros", price: 3.0, fare: "universitario / directo", w: 574, h: 416 },
  { id: 'b69', colour: 'morado', company: "Transportes Pesqueros", price: 4.0, fare: "adulto / interurbano", w: 470, h: 368 },
  { id: 'b70', colour: 'naranja', company: "Transportes Pesqueros", price: 3.0, fare: "universitario / directo", w: 449, h: 371 },
  { id: 'b71', colour: 'amarillo', company: "Las Flores", price: 1.5, fare: "medio / univ. / urbano", w: 481, h: 383 },
  { id: 'b72', colour: 'verde', company: "Trans. Service Canada", price: 1.5, fare: "medio univ. / urbano", w: 517, h: 360 },
  { id: 'b74', colour: 'naranja', company: "Transportes Pesqueros", price: 1.0, fare: "escolar", w: 456, h: 371 },
  { id: 'b75', colour: 'celeste', company: "Consorcio Grupo Salamanca", price: 3.0, fare: "urbano 1 / medio / univ.", w: 333, h: 473 },];

/** The order of the colours when the board is sorted by colour. */
export const BOLETO_COLOURS = ['amarillo', 'naranja', 'rojo', 'rosado', 'morado', 'azul', 'celeste', 'verde', 'marrón', 'gris', 'negro', 'blanco'];

/** A transport card: its two faces, scanned. */
export type MetroCardFace = { name: string; front: string; back: string };
/** A city and its card (or cards: Lima has two variants). Names of places stay as they are; the country is named in content. */
export type MetroCity = { id: string; city: string; country: string; lat: number; lon: number; system: string; variants: MetroCardFace[]; labelLeft?: true };

const card = (n: string) => `/lab/metro-cards/${n}.webp`;
export const METRO_CITIES: MetroCity[] = [
  { id: 'lima', city: 'Lima', country: 'pe', lat: -12.05, lon: -77.04, system: 'Línea 1, Metro de Lima', variants: [
    { name: 'San Pedro, Gamarra', front: card('l1pink-front'), back: card('l1pink-back') },
    { name: 'Buenos Ciudadanos', front: card('l1green-front'), back: card('l1green-back') }] },
  { id: 'santiago', city: 'Santiago', country: 'cl', lat: -33.45, lon: -70.66, system: 'bip!, Red Metropolitana de Movilidad', labelLeft: true, variants: [
    { name: '', front: card('bip-front'), back: card('bip-back') }] },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'ar', lat: -34.6, lon: -58.4, system: 'SUBE', variants: [
    { name: '', front: card('sube-front'), back: card('sube-back') }] },
  { id: 'medellin', city: 'Medellín', country: 'co', lat: 6.25, lon: -75.57, system: 'Cívica, Metro de Medellín', variants: [
    { name: '', front: card('civica-front'), back: card('civica-back') }] },
];

/** The sketchbook's scanned pages, in order (owner, 2026-11-27: menta, then lola; more being scanned). */
export type SketchbookLeaf = { id: string; src: string };
export const SKETCHBOOK: SketchbookLeaf[] = [
  { id: 'menta', src: '/lab/sketchbook/01-menta.webp' },
  { id: 'lola', src: '/lab/sketchbook/02-lola.webp' },
];
