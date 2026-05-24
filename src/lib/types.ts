// Tracewise data model — the "as-is" workflow, captured as it actually happens.
// v1 captures faithfully; the AI-opportunity scoring layer (v2) reads this same shape.

export const SCHEMA_VERSION = 1;

// Friction = the non-value-adding waste in a step, grounded in the Lean / Toyota
// Production System taxonomy of waste (muda) — Ohno (1988); Womack & Jones (1996).
// Human judgment is deliberately NOT a friction tag: it is value to preserve, a
// function-allocation question (Parasuraman, Sheridan & Wickens, 2000), captured
// as the per-step `needsJudgment` attribute instead.
export type FrictionTag =
  | 'wait'            // idle delay waiting on a person/system/approval — waiting waste
  | 'rework'         // redoing work already done — defect waste
  | 'manual-transfer' // re-keying / copying data between places — over-processing
  | 'movement'       // moving materials, documents or oneself between places — transport waste
  | 'lookup'         // searching for information, tools or materials — motion waste
  | 'approval'       // a sign-off gate that stalls the work — handback / waiting
  | 'chasing';       // actively following up / expediting to keep it moving — non-value-add

export interface FrictionMeta {
  id: FrictionTag;
  label: string;
  hint: string;       // names the underlying Lean waste type
  color: string;      // CSS var name
}

export const FRICTION_TAGS: FrictionMeta[] = [
  { id: 'wait',            label: 'Waiting',          hint: 'Idle delay until a person or system responds — waiting waste (muda)',        color: 'var(--f-wait)' },
  { id: 'rework',          label: 'Rework',           hint: 'Redoing work already done once — defect waste (muda)',                       color: 'var(--f-rework)' },
  { id: 'manual-transfer', label: 'Manual transfer',  hint: 'Re-keying or copying data between two places — over-processing waste',        color: 'var(--f-transfer)' },
  { id: 'movement',        label: 'Movement',         hint: 'Moving materials, documents or yourself between places — transport waste',     color: 'var(--f-movement)' },
  { id: 'lookup',          label: 'Searching',        hint: 'Hunting for information, tools or materials — motion waste',                    color: 'var(--f-lookup)' },
  { id: 'approval',        label: 'Approval gate',    hint: 'A sign-off that stalls the work — handback / waiting waste',                    color: 'var(--f-approval)' },
  { id: 'chasing',         label: 'Chasing',          hint: 'Following up or expediting to keep things moving — non-value-add work',         color: 'var(--f-chasing)' },
];

export type Frequency = 'many-times-a-day' | 'daily' | 'few-times-a-week' | 'weekly' | 'monthly' | 'rarely';

export const FREQUENCIES: { id: Frequency; label: string }[] = [
  { id: 'many-times-a-day', label: 'Many times a day' },
  { id: 'daily', label: 'About daily' },
  { id: 'few-times-a-week', label: 'A few times a week' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'rarely', label: 'Rarely' },
];

/** One concrete thing the person actually does, in order. */
export interface Step {
  id: string;
  order: number;
  action: string;                 // what you literally do
  tool: string;                   // system/app used, or "by hand / none"
  inputWhat: string;              // what you need to start
  inputSource: string;           // where that comes from (person/system)
  outputWhat: string;            // what you produce
  outputDestination: string;     // who/what receives it next
  timeMins: number | null;        // rough minutes per occurrence
  frequency: Frequency | null;
  frictionTags: FrictionTag[];
  isShadow: boolean;              // articulation work — unofficial but essential (Star & Strauss, 1999)
  needsJudgment: boolean;         // human-essential decision — preserve, don't automate (Parasuraman et al., 2000)
  isPainful: boolean;             // the step they dread — fast subjective signal
  notes: string;
}

export type HandoffDirection = 'wait-on' | 'hand-to';

export interface Handoff {
  id: string;
  direction: HandoffDirection; // you wait on them, or you hand to them
  who: string;
  what: string;                // what is passed / waited for
  typicalDelay: string;        // free text, e.g. "usually a day"
}

export interface Exception {
  id: string;
  trigger: string;     // what goes wrong
  whatYouDo: string;   // your real workaround
  howOften: string;    // free text
}

export interface Workflow {
  id: string;
  schemaVersion: number;
  role: string;            // the person's role (no real name needed)
  context: string;         // org / team / industry, optional free text
  outputName: string;      // the ONE recurring output being documented
  officialVersion: string; // work-as-imagined: the SOP/official process, if one exists (Hollnagel, 2014)
  instanceAnchor: string;  // critical-incident anchor: the specific recent instance being recalled (Klein et al., 1989)
  trigger: string;         // what kicks it off
  steps: Step[];
  handoffs: Handoff[];
  exceptions: Exception[];
  createdAt: number;
  updatedAt: number;
}

// ---- factories ----

let _seq = 0;
export function uid(prefix = 'id'): string {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${_seq.toString(36)}`;
}

export function newStep(order: number): Step {
  return {
    id: uid('st'),
    order,
    action: '',
    tool: '',
    inputWhat: '',
    inputSource: '',
    outputWhat: '',
    outputDestination: '',
    timeMins: null,
    frequency: null,
    frictionTags: [],
    isShadow: false,
    needsJudgment: false,
    isPainful: false,
    notes: '',
  };
}

export function newHandoff(direction: HandoffDirection): Handoff {
  return { id: uid('ho'), direction, who: '', what: '', typicalDelay: '' };
}

export function newException(): Exception {
  return { id: uid('ex'), trigger: '', whatYouDo: '', howOften: '' };
}

export function newWorkflow(): Workflow {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: '',
    context: '',
    outputName: '',
    officialVersion: '',
    instanceAnchor: '',
    trigger: '',
    steps: [],
    handoffs: [],
    exceptions: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ---- derived metrics (counts only in v1; v2 turns these into AI-opportunity scores) ----

export interface FrictionSummary {
  totalSteps: number;
  totalMinutes: number;        // sum of known step times
  toolCount: number;           // distinct tools touched
  toolSwitches: number;        // times the tool changes between consecutive steps
  handoffCount: number;
  shadowCount: number;         // articulation-work steps
  judgmentCount: number;       // human-essential decisions (preserve)
  painCount: number;           // steps marked "dreaded"
  wasteSteps: number;          // steps carrying at least one friction (muda) tag
  tagCounts: Record<FrictionTag, number>;
}

export function summarize(wf: Workflow): FrictionSummary {
  const tagCounts = {
    wait: 0, rework: 0, 'manual-transfer': 0, movement: 0, lookup: 0, approval: 0, chasing: 0,
  } as Record<FrictionTag, number>;

  let totalMinutes = 0;
  let shadowCount = 0;
  let judgmentCount = 0;
  let painCount = 0;
  let wasteSteps = 0;
  const tools = new Set<string>();
  let toolSwitches = 0;
  let prevTool: string | null = null;

  for (const s of wf.steps) {
    if (typeof s.timeMins === 'number') totalMinutes += s.timeMins;
    if (s.isShadow) shadowCount += 1;
    if (s.needsJudgment) judgmentCount += 1;
    if (s.isPainful) painCount += 1;
    if (s.frictionTags.length > 0) wasteSteps += 1;
    for (const t of s.frictionTags) tagCounts[t] += 1;
    const tool = s.tool.trim().toLowerCase();
    if (tool) {
      tools.add(tool);
      if (prevTool !== null && prevTool !== tool) toolSwitches += 1;
      prevTool = tool;
    }
  }

  return {
    totalSteps: wf.steps.length,
    totalMinutes,
    toolCount: tools.size,
    toolSwitches,
    handoffCount: wf.handoffs.length,
    shadowCount,
    judgmentCount,
    painCount,
    wasteSteps,
    tagCounts,
  };
}
