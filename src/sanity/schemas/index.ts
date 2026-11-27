import { archivePhoto } from './archivePhoto';
import { labIndex } from './labIndex';
import { labPiece } from './labPiece';
import { note } from './note';

export const schemaTypes = [labIndex, labPiece, archivePhoto, note];
export const singletons = new Set(['labIndex']);
