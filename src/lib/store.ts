// Local persistence for Tracewise. Mirrors the gt_* / autosave conventions used
// across Syed's projects (researchflow's rf_autosave, cadence's cadence_*).
import { type Workflow, type Step, SCHEMA_VERSION } from './types';

// Fill in fields added after a workflow was first saved, so older localStorage
// records keep working (and controlled inputs never go uncontrolled). Also
// migrates the retired 'judgment' friction tag into the needsJudgment attribute.
function normalize(w: Workflow): Workflow {
  return {
    ...w,
    headcount: typeof w.headcount === 'number' && w.headcount > 0 ? w.headcount : 1,
    officialVersion: w.officialVersion ?? '',
    instanceAnchor: w.instanceAnchor ?? '',
    steps: (w.steps ?? []).map((s: Step) => {
      const tags = (s.frictionTags ?? []) as string[];
      const hadJudgment = tags.includes('judgment');
      return {
        ...s,
        frictionTags: tags.filter((t) => t !== 'judgment') as Step['frictionTags'],
        needsJudgment: s.needsJudgment ?? hadJudgment,
        isShadow: s.isShadow ?? false,
        isPainful: s.isPainful ?? false,
      };
    }),
    handoffs: w.handoffs ?? [],
    exceptions: w.exceptions ?? [],
  };
}

const SAVED_KEY = 'tw_workflows';     // array of completed/saved workflows
const AUTOSAVE_KEY = 'tw_autosave';   // single in-progress workflow + meta
const AUTOSAVE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days, matches researchflow

interface AutosavePayload {
  ts: number;
  stage: number;
  wf: Workflow;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — fail silent, app still works in-memory */
  }
}

// ---- saved workflows ----

export function listWorkflows(): Workflow[] {
  const all = read<Workflow[]>(SAVED_KEY, []);
  return all
    .filter((w) => w && w.schemaVersion === SCHEMA_VERSION)
    .map(normalize)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveWorkflow(wf: Workflow): void {
  const all = read<Workflow[]>(SAVED_KEY, []);
  const idx = all.findIndex((w) => w.id === wf.id);
  const stamped = { ...wf, updatedAt: Date.now() };
  if (idx >= 0) all[idx] = stamped;
  else all.push(stamped);
  write(SAVED_KEY, all);
}

export function deleteWorkflow(id: string): void {
  const all = read<Workflow[]>(SAVED_KEY, []).filter((w) => w.id !== id);
  write(SAVED_KEY, all);
}

export function getWorkflow(id: string): Workflow | null {
  const w = read<Workflow[]>(SAVED_KEY, []).find((x) => x.id === id);
  return w ? normalize(w) : null;
}

// v3: confirm (or clear, with targetId = null) that a handoff's free-text `who`
// is a captured role — the suggest-and-confirm link that turns the pile of
// per-role captures into a connected ecosystem graph.
export function linkHandoff(workflowId: string, handoffId: string, targetId: string | null): void {
  const all = read<Workflow[]>(SAVED_KEY, []);
  const wf = all.find((w) => w.id === workflowId);
  if (!wf) return;
  const h = (wf.handoffs ?? []).find((x) => x.id === handoffId);
  if (!h) return;
  if (targetId) h.linkedWorkflowId = targetId;
  else delete h.linkedWorkflowId;
  wf.updatedAt = Date.now();
  write(SAVED_KEY, all);
}

// ---- autosave (in-progress capture) ----

export function loadAutosave(): { wf: Workflow; stage: number } | null {
  const p = read<AutosavePayload | null>(AUTOSAVE_KEY, null);
  if (!p || !p.wf) return null;
  if (Date.now() - p.ts > AUTOSAVE_TTL_MS) {
    clearAutosave();
    return null;
  }
  // only resume if there is something worth resuming
  const hasContent = p.wf.outputName?.trim() || p.wf.steps.length > 0;
  if (!hasContent) return null;
  return { wf: normalize(p.wf), stage: p.stage };
}

export function writeAutosave(wf: Workflow, stage: number): void {
  write(AUTOSAVE_KEY, { ts: Date.now(), stage, wf } satisfies AutosavePayload);
}

export function clearAutosave(): void {
  try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignore */ }
}
