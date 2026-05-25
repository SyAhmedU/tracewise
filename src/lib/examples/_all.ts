// Eager aggregate of EVERY worked example — for TESTS ONLY.
// The app never imports this module; it uses the lazy SECTORS registry in
// index.ts. Because nothing in the app's import graph reaches this file, pulling
// the whole library in here does not affect the production bundle's code-split.
import { FOOD } from './food';
import { RETAIL } from './retail';
import { HOSPITALITY } from './hospitality';
import { SERVICES } from './services';
import { HEALTHCARE } from './healthcare';
import { GOVERNMENT } from './government';
import { MANUFACTURING } from './manufacturing';
import { AGRI } from './agri';
import { LOGISTICS } from './logistics';
import { IT } from './it';
import { ITES } from './ites';
import { SAAS } from './saas';
import { ACADEMIA } from './academia';
import type { WorkedExample } from './_shared';

export const ALL_EXAMPLES: WorkedExample[] = [
  ...FOOD, ...RETAIL, ...HOSPITALITY, ...SERVICES, ...HEALTHCARE, ...GOVERNMENT,
  ...MANUFACTURING, ...AGRI, ...LOGISTICS, ...IT, ...ITES, ...SAAS, ...ACADEMIA,
];
