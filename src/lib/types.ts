// Tracewise data model — the "as-is" workflow, captured as it actually happens.
// v1 captures faithfully; the AI-opportunity scoring layer (v2) reads this same shape.

export const SCHEMA_VERSION = 1;

/** The seams where waste, duplication and wait-time hide. These drive v2's analysis. */
export type FrictionTag =
  | 'wait'            // time spent waiting on a person, system, or approval
  | 'rework'         // redoing something that was already done
  | 'manual-transfer' // copying / re-typing data between places by hand
  | 'approval'       // a gate where someone must sign off
  | 'lookup'         // hunting for information across places
  | 'judgment';      // a decision that needs human knowledge / context

export interface FrictionMeta {
  id: FrictionTag;
  label: string;
  hint: string;
  color: string; // CSS var name
}

export const FRICTION_TAGS: FrictionMeta[] = [
  { id: 'wait',            label: 'Waiting',          hint: 'You sit idle until a person or system responds', color: 'var(--f-wait)' },
  { id: 'rework',          label: 'Rework',           hint: 'You redo work that was already done once',       color: 'var(--f-rework)' },
  { id: 'manual-transfer', label: 'Manual transfer',  hint: 'You copy or re-type data between two places',     color: 'var(--f-transfer)' },
  { id: 'approval',        label: 'Approval gate',    hint: 'Someone has to sign off before you continue',     color: 'var(--f-approval)' },
  { id: 'lookup',          label: 'Hunting / lookup', hint: 'You search across places to find what you need',  color: 'var(--f-lookup)' },
  { id: 'judgment',        label: 'Judgment call',    hint: 'A human decision using context or experience',    color: 'var(--f-judgment)' },
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
  isShadow: boolean;              // unofficial but essential (shadow tool/step)
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
  instanceAnchor: string;  // the specific recent instance being recalled
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
  shadowCount: number;
  painCount: number;           // steps marked "dreaded"
  tagCounts: Record<FrictionTag, number>;
}

export function summarize(wf: Workflow): FrictionSummary {
  const tagCounts = {
    wait: 0, rework: 0, 'manual-transfer': 0, approval: 0, lookup: 0, judgment: 0,
  } as Record<FrictionTag, number>;

  let totalMinutes = 0;
  let shadowCount = 0;
  let painCount = 0;
  const tools = new Set<string>();
  let toolSwitches = 0;
  let prevTool: string | null = null;

  for (const s of wf.steps) {
    if (typeof s.timeMins === 'number') totalMinutes += s.timeMins;
    if (s.isShadow) shadowCount += 1;
    if (s.isPainful) painCount += 1;
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
    painCount,
    tagCounts,
  };
}
