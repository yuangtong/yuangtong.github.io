import type * as EnHome from './en/home';
import type { Settings } from '../types';

/** The shape of src/content/fixtures/<locale>/content.json: the English modules, translated. */
export type LearningContent = { home: typeof EnHome; settings: Settings };
