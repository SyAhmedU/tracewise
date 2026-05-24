// Worked-example library, split by sector. Each domain file exports an array
// built with the S/mk helpers in _shared.ts; this index concatenates them into
// the single WORKED_EXAMPLES list the app consumes.
import { FOOD } from './food';
import { RETAIL } from './retail';
import { GOVERNMENT } from './government';
import { HEALTHCARE } from './healthcare';
import { HOSPITALITY } from './hospitality';
import type { WorkedExample } from './_shared';

export type { WorkedExample } from './_shared';

export const WORKED_EXAMPLES: WorkedExample[] = [
  ...FOOD,
  ...RETAIL,
  ...HOSPITALITY,
  ...HEALTHCARE,
  ...GOVERNMENT,
];
