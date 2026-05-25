// Worked-example library, split by sector and CODE-SPLIT for lazy loading.
// Each sector file is its own dynamic import() chunk — loaded only when its
// domain is viewed or one of its examples is opened — so the library can grow
// to thousands of examples without bloating the initial bundle. SECTORS is the
// tiny static registry the UI renders chips from; the heavy example data (and
// the build() workflows) download on demand, per domain.
//
// To add examples: append to the relevant sector file (keys globally unique) —
// that's the only file you touch. To add a NEW sector: create the file, then
// add one line to SECTORS below AND to _all.ts (the test-only aggregate).
import type { WorkedExample } from './_shared';
export type { WorkedExample } from './_shared';

export interface SectorInfo {
  /** stable id used as the chip key + cache key */
  id: string;
  /** chip label; MUST match the `domain` field on that sector's examples */
  domain: string;
  /** lazy loader — resolves to the sector's examples (its own JS chunk) */
  load: () => Promise<WorkedExample[]>;
}

export const SECTORS: SectorInfo[] = [
  { id: 'food', domain: 'Food prep', load: () => import('./food').then((m) => m.FOOD) },
  { id: 'retail', domain: 'Retail', load: () => import('./retail').then((m) => m.RETAIL) },
  { id: 'hospitality', domain: 'Hospitality', load: () => import('./hospitality').then((m) => m.HOSPITALITY) },
  { id: 'services', domain: 'Professional services', load: () => import('./services').then((m) => m.SERVICES) },
  { id: 'healthcare', domain: 'Healthcare', load: () => import('./healthcare').then((m) => m.HEALTHCARE) },
  { id: 'government', domain: 'Government', load: () => import('./government').then((m) => m.GOVERNMENT) },
  { id: 'manufacturing', domain: 'Manufacturing', load: () => import('./manufacturing').then((m) => m.MANUFACTURING) },
  { id: 'agri', domain: 'Agriculture', load: () => import('./agri').then((m) => m.AGRI) },
  { id: 'logistics', domain: 'Logistics', load: () => import('./logistics').then((m) => m.LOGISTICS) },
  { id: 'it', domain: 'IT services', load: () => import('./it').then((m) => m.IT) },
  { id: 'ites', domain: 'ITES', load: () => import('./ites').then((m) => m.ITES) },
  { id: 'saas', domain: 'SaaS', load: () => import('./saas').then((m) => m.SAAS) },
  { id: 'academia', domain: 'Academia', load: () => import('./academia').then((m) => m.ACADEMIA) },
];

/** Loads every sector in parallel. Used by the "All" view (and convenient for
 * any consumer that genuinely needs the whole library at once). */
export async function loadAllExamples(): Promise<WorkedExample[]> {
  const arrays = await Promise.all(SECTORS.map((s) => s.load()));
  return arrays.flat();
}
