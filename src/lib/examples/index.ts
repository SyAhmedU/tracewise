// Worked-example library, split by sector. Each domain file exports an array
// built with the S/mk helpers in _shared.ts; this index concatenates them into
// the single WORKED_EXAMPLES list the app consumes.
import { FOOD } from './food';
import { RETAIL } from './retail';
import { HOSPITALITY } from './hospitality';
import { HEALTHCARE } from './healthcare';
import { GOVERNMENT } from './government';
import { MANUFACTURING } from './manufacturing';
import { AGRI } from './agri';
import { LOGISTICS } from './logistics';
import { SERVICES } from './services';
import type { WorkedExample } from './_shared';

export type { WorkedExample } from './_shared';

export const WORKED_EXAMPLES: WorkedExample[] = [
  ...FOOD,
  ...RETAIL,
  ...HOSPITALITY,
  ...SERVICES,
  ...HEALTHCARE,
  ...GOVERNMENT,
  ...MANUFACTURING,
  ...AGRI,
  ...LOGISTICS,
];
