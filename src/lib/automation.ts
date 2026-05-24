// v2 — the Automation-Fit engine. Pure, transparent, no AI: given a captured
// work-as-done map, it scores each step for where automation actually FITS,
// grounded in Task-Technology Fit (Goodhue & Thompson, 1995) and the types &
// Levels of Automation model (Parasuraman, Sheridan & Wickens, 2000). Judgment
// steps are protected (function allocation); shadow steps are flagged as unmet
// needs. The concrete recommendation TEXT is layered on separately by the AI
// (lib/recommend.ts); this file is the explainable scoring substrate.
import { type Workflow, type Step, type FrictionTag, type Frequency, FRICTION_TAGS } from './types';

// Which of Parasuraman et al.'s four function stages an automation touches.
export type LoaStage = 'acquisition' | 'analysis' | 'decision' | 'action';
export const LOA_STAGE_LABEL: Record<LoaStage, string> = {
  acquisition: 'Information acquisition',
  analysis: 'Information analysis',
  decision: 'Decision selection',
  action: 'Action implementation',
};

export type Archetype =
  | 'data-integration' | 'retrieval' | 'orchestration' | 'validation'
  | 'routing' | 'decision-support' | 'physical-redesign' | 'limited';

export type LoaLevel = 'none' | 'support' | 'partial' | 'high';
export const LOA_LEVEL_LABEL: Record<LoaLevel, string> = {
  none: 'Not an AI target',
  support: 'Decision support (human decides)',
  partial: 'Partial automation (human in the loop)',
  high: 'High automation (human verifies)',
};

export interface ArchetypeMeta {
  id: Archetype;
  label: string;
  blurb: string;
  stages: LoaStage[];
  level: LoaLevel;
}

export const ARCHETYPES: Record<Archetype, ArchetypeMeta> = {
  'data-integration': { id: 'data-integration', label: 'Data integration / auto-fill', blurb: 'Move or pre-fill data between systems so the human verifies instead of re-keys.', stages: ['acquisition', 'analysis', 'action'], level: 'high' },
  'retrieval':        { id: 'retrieval',        label: 'Automated retrieval / search', blurb: 'Fetch and surface the right information automatically instead of hunting for it.', stages: ['acquisition', 'analysis'], level: 'high' },
  'orchestration':    { id: 'orchestration',    label: 'Orchestration & reminders',    blurb: 'Auto-route, notify, and chase so the work does not stall on waiting.', stages: ['action'], level: 'partial' },
  'validation':       { id: 'validation',       label: 'Automated validation / checks', blurb: 'Catch errors early with automated checks to cut the rework loop.', stages: ['analysis'], level: 'partial' },
  'routing':          { id: 'routing',          label: 'Rules-based routing / approval', blurb: 'Auto-approve the clear-cut cases by rule; escalate only the rest.', stages: ['decision', 'action'], level: 'partial' },
  'decision-support': { id: 'decision-support', label: 'Decision support (keep human)',  blurb: 'Augment the human decision with information; do not replace the judgment.', stages: ['analysis', 'decision'], level: 'support' },
  'physical-redesign':{ id: 'physical-redesign',label: 'Process redesign (physical)',    blurb: 'Physical movement — outside software AI; address by layout or process change.', stages: [], level: 'none' },
  'limited':          { id: 'limited',          label: 'Limited AI potential',           blurb: 'Value-adding work with little captured waste — leave with the human for now.', stages: [], level: 'none' },
};

export type Quadrant = 'quick-win' | 'easy' | 'big-bet' | 'leave' | 'protect';
export const QUADRANT_LABEL: Record<Quadrant, string> = {
  'quick-win': 'Quick win',
  'easy': 'Low-effort, low-impact',
  'big-bet': 'Big bet / redesign',
  'leave': 'Leave as is',
  'protect': 'Protect (human judgment)',
};

// per-friction automatability (0..1) and the archetype that addresses it
const WASTE_INFO: Record<FrictionTag, { auto: number; archetype: Archetype }> = {
  'manual-transfer': { auto: 0.90, archetype: 'data-integration' },
  'lookup':          { auto: 0.85, archetype: 'retrieval' },
  'chasing':         { auto: 0.88, archetype: 'orchestration' },
  'wait':            { auto: 0.60, archetype: 'orchestration' },
  'approval':        { auto: 0.62, archetype: 'routing' },
  'rework':          { auto: 0.55, archetype: 'validation' },
  'movement':        { auto: 0.20, archetype: 'physical-redesign' },
};

const FREQ_PER_WEEK: Record<Frequency, number> = {
  'many-times-a-day': 25,
  'daily': 5,
  'few-times-a-week': 3,
  'weekly': 1,
  'monthly': 0.25,
  'rarely': 0.05,
};

const PHYSICAL_TOOL = /\b(hand|paper|phone|walk|physical|verbal|in person|in-person|stores|forklift|bench)\b/i;

function structuredness(step: Step): number {
  if (step.frictionTags.includes('movement')) return 0.4;
  const t = step.tool.trim();
  if (!t) return 0.6;
  if (PHYSICAL_TOOL.test(t)) return 0.45;
  return 1.0;
}

function tagLabel(t: FrictionTag): string {
  return FRICTION_TAGS.find((x) => x.id === t)?.label ?? t;
}

export interface StepOpportunity {
  stepId: string;
  order: number;
  action: string;
  weeklyMinutes: number;   // estimated time burden per week
  impact: number;          // 0..1 (normalised burden, nudged by dread)
  feasibility: number;     // 0..1 (automatability × structuredness, judgment-capped)
  priority: number;        // impact × feasibility
  quadrant: Quadrant;
  archetype: Archetype;
  stages: LoaStage[];
  level: LoaLevel;
  wasteAddressed: FrictionTag[];
  rationale: string;       // transparent, deterministic explanation
  protect: boolean;        // human judgment — do not automate away
  shadowSignal: boolean;   // shadow tool reveals an unmet need
}

export interface WorkflowAnalysis {
  opportunities: StepOpportunity[];
  ranked: StepOpportunity[];       // non-protected, by priority desc
  protectedSteps: StepOpportunity[];
  totalWeeklyMinutes: number;
  automatableWeeklyMinutes: number; // burden in high-feasibility steps
  counts: Record<Quadrant, number>;
  narrative: string;
}

function dominantWaste(step: Step): FrictionTag | null {
  let best: FrictionTag | null = null;
  let bestAuto = -1;
  for (const t of step.frictionTags) {
    const a = WASTE_INFO[t]?.auto ?? 0;
    if (a > bestAuto) { bestAuto = a; best = t; }
  }
  return best;
}

function scoreStep(step: Step, maxWeekly: number): StepOpportunity {
  const freq = step.frequency ? FREQ_PER_WEEK[step.frequency] : 1;
  const mins = step.timeMins ?? 10;
  const weeklyMinutes = Math.round(freq * mins);

  let impact = maxWeekly > 0 ? weeklyMinutes / maxWeekly : 0;
  if (step.isPainful) impact = Math.min(1, impact + 0.12);

  const dom = dominantWaste(step);
  const base = dom ? WASTE_INFO[dom].auto : 0.3;
  let feasibility = base * structuredness(step);

  const protect = step.needsJudgment;
  let archetype: Archetype;
  if (protect) {
    archetype = 'decision-support';
    feasibility = Math.min(feasibility, 0.35);
  } else if (dom) {
    archetype = WASTE_INFO[dom].archetype;
  } else {
    archetype = 'limited';
  }
  feasibility = Math.max(0, Math.min(1, feasibility));

  const meta = ARCHETYPES[archetype];

  // quadrant
  let quadrant: Quadrant;
  if (protect) {
    quadrant = 'protect';
  } else {
    const impHi = impact >= 0.4;
    const feasHi = feasibility >= 0.5;
    quadrant = feasHi && impHi ? 'quick-win' : feasHi && !impHi ? 'easy' : !feasHi && impHi ? 'big-bet' : 'leave';
  }

  const wasteAddressed = step.frictionTags.slice();
  const wasteText = wasteAddressed.length ? wasteAddressed.map(tagLabel).join(', ').toLowerCase() : 'no logged waste';
  const burdenText = `≈${weeklyMinutes} min/week`;
  const rationale = protect
    ? `Human judgment — keep the decision with the person; at most provide decision support. (${burdenText})`
    : `${burdenText}; addresses ${wasteText}; ${meta.label.toLowerCase()} (${LOA_LEVEL_LABEL[meta.level].toLowerCase()}).`;

  return {
    stepId: step.id,
    order: step.order,
    action: step.action,
    weeklyMinutes,
    impact,
    feasibility,
    priority: impact * feasibility,
    quadrant,
    archetype,
    stages: meta.stages,
    level: meta.level,
    wasteAddressed,
    rationale,
    protect,
    shadowSignal: step.isShadow,
  };
}

export function analyzeWorkflow(wf: Workflow): WorkflowAnalysis {
  const maxWeekly = wf.steps.reduce((m, s) => {
    const freq = s.frequency ? FREQ_PER_WEEK[s.frequency] : 1;
    return Math.max(m, freq * (s.timeMins ?? 10));
  }, 1);

  const opportunities = wf.steps.map((s) => scoreStep(s, maxWeekly));
  const ranked = opportunities
    .filter((o) => !o.protect && o.quadrant !== 'leave')
    .sort((a, b) => b.priority - a.priority);
  const protectedSteps = opportunities.filter((o) => o.protect);

  const counts = { 'quick-win': 0, easy: 0, 'big-bet': 0, leave: 0, protect: 0 } as Record<Quadrant, number>;
  for (const o of opportunities) counts[o.quadrant] += 1;

  const totalWeeklyMinutes = opportunities.reduce((s, o) => s + o.weeklyMinutes, 0);
  const automatableWeeklyMinutes = opportunities
    .filter((o) => o.feasibility >= 0.5 && !o.protect)
    .reduce((s, o) => s + o.weeklyMinutes, 0);

  const shadowCount = opportunities.filter((o) => o.shadowSignal).length;
  const narrative = buildNarrative(opportunities, counts, totalWeeklyMinutes, automatableWeeklyMinutes, protectedSteps.length, shadowCount);

  return { opportunities, ranked, protectedSteps, totalWeeklyMinutes, automatableWeeklyMinutes, counts, narrative };
}

function buildNarrative(
  all: StepOpportunity[], counts: Record<Quadrant, number>,
  totalMin: number, autoMin: number, protectN: number, shadowN: number,
): string {
  if (all.length === 0) return 'No steps captured yet — document the work first, then this analysis becomes meaningful.';
  const strong = counts['quick-win'];
  const pct = totalMin > 0 ? Math.round((autoMin / totalMin) * 100) : 0;
  const parts: string[] = [];
  parts.push(`Of ${all.length} steps, ${strong} look like quick wins and ${counts['big-bet']} are bigger bets worth a redesign.`);
  if (totalMin > 0) parts.push(`Automation-amenable steps carry about ${autoMin} of ~${totalMin} estimated weekly minutes (${pct}%).`);
  if (protectN > 0) parts.push(`${protectN} step${protectN > 1 ? 's' : ''} rest on human judgment — those are value to protect, not automate.`);
  if (shadowN > 0) parts.push(`${shadowN} shadow step${shadowN > 1 ? 's' : ''} signal an unmet need the official system does not cover — fix the cause, do not just paper over it.`);
  parts.push('Fit before features: aim AI at the high-fit, high-burden steps and leave the rest alone.');
  return parts.join(' ');
}
