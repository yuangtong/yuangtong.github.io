import { archivePhoto } from './archivePhoto';
import { labIndex } from './labIndex';

export const schemaTypes = [labIndex, archivePhoto];
export const singletons = new Set(['labIndex']);
