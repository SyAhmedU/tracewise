// v3 — the Ecosystem engine. Pure, transparent, no AI. It does NOT model the org
// top-down: it *stitches* independent ground-truth role-captures into a connected
// map, using only what each person already reported (their handoffs, step times,
// frequencies and judgment calls). The guiding constraint of Tracewise holds —
// the truth-source is one role captured by the person who does it — so an edge
// exists only where a real handoff was reported and confirmed, and a dependency
// pointing at a role nobody mapped is surfaced as a blind spot, never invented.
//
// On top of the stitched graph it runs the question the AI-ecosystem talk poses:
// "if this had to grow 10-15x in 18 months, what breaks first?" Each role gets a
// saturation multiplier M* (the load at which demand overruns capacity), grounded
// in plain capacity arithmetic rather than anything hand-wavy. Judgment-bound
// roles (no automation escape valve) and single-points-of-failure surface as the
// hard ceilings — same ethos as the Automation-Fit engine in automation.ts.

import { type Workflow, type HandoffDirection } from './types';
import { analyzeWorkflow } from './automation';

// One person's realistically usable focused minutes per week: 5 days x 6 hours.
// Deliberately conservative — overstating capacity would hide real bottlenecks.
export const USABLE_MIN_PER_WEEK = 1800;

export type ConstraintKind =
  | 'single-point'   // headcount 1 and many roles depend on it — bus-factor risk
  | 'judgment-bound' // dominated by human-judgment minutes; only headcount relieves it
  | 'capacity-bound' // breaks early with little automatable slack to buy back
  | 'has-slack'      // automatable headroom = optionality; automate and M* climbs
  | 'comfortable';   // high M*, not a near-term worry

export const CONSTRAINT_LABEL: Record<ConstraintKind, string> = {
  'single-point': 'Single point of failure',
  'judgment-bound': 'Judgment-bound (no automation slack)',
  'capacity-bound': 'Capacity-bound',
  'has-slack': 'Has slack (automatable)',
  'comfortable': 'Comfortable',
};

export interface RoleNode {
  id: string;                 // workflow id
  role: string;
  outputName: string;
  headcount: number;
  demandWeeklyMin: number;    // totalWeeklyMinutes for this role's output
  capacityWeeklyMin: number;  // headcount x USABLE_MIN_PER_WEEK
  utilizationNow: number;     // demand / capacity (>1 = already underwater today)
  breaksAt: number;           // M* = capacity / demand (Infinity when no demand)
  reliefHeadroom: number;     // automatable weekly min / total (0..1) — your optionality
  judgmentShare: number;      // protected (judgment) weekly min / total (0..1)
  inDegree: number;           // confirmed handoffs feeding this role
  outDegree: number;          // confirmed handoffs this role feeds
  constraint: ConstraintKind;
}

export interface Edge {
  fromId: string;             // work flows FROM this role
  toId: string;               // ...TO this role
  what: string;
  delayHours: number | null;
  sourceWorkflowId: string;   // who reported it
  handoffId: string;
}

export interface BlindSpot {
  who: string;                // a dependency named in a handoff that no capture covers
  fromRole: string;
  direction: HandoffDirection;
  what: string;
}

export interface LinkSuggestion {
  sourceWorkflowId: string;
  handoffId: string;
  who: string;
  fromRole: string;
  candidateId: string;
  candidateRole: string;
  score: number;              // 0..1 match confidence
}

export type FindingSeverity = 'info' | 'warn' | 'risk';
export interface Finding {
  kind: 'shadow-cluster' | 'judgment-gate' | 'single-point' | 'cycle' | 'overloaded-now';
  title: string;
  detail: string;
  severity: FindingSeverity;
}

export interface Ecosystem {
  nodes: RoleNode[];
  edges: Edge[];
  blindSpots: BlindSpot[];
  suggestions: LinkSuggestion[];
  findings: Finding[];
}

// ---- fuzzy role matching (for suggest-and-confirm linking) ----

// words that say nothing about *which* role this is, so they shouldn't drive a match
const STOP = new Set(['team', 'the', 'a', 'an', 'of', 'and', 'dept', 'department', 'group', 'unit', 'office', 'staff', 'my', 'our', 'their']);

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((t) => t && !STOP.has(t));
}

/** Jaccard token overlap, nudged up when one name contains the other. 0..1. */
function nameScore(a: string, b: string): number {
  const ta = tokens(a); const tb = tokens(b);
  if (ta.length === 0 || tb.length === 0) return 0;
  const sa = new Set(ta); const sb = new Set(tb);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter += 1;
  const union = new Set([...ta, ...tb]).size;
  let score = inter / union;
  const ja = ta.join(' '); const jb = tb.join(' ');
  if (ja.includes(jb) || jb.includes(ja)) score = Math.max(score, 0.6);
  return score;
}

const SUGGEST_THRESHOLD = 0.34;

// ---- the build ----

export function buildEcosystem(workflows: Workflow[]): Ecosystem {
  const byId = new Map(workflows.map((w) => [w.id, w]));

  // Per-role capacity / demand metrics, from the existing Automation-Fit analysis.
  const nodes: RoleNode[] = workflows.map((w) => {
    const a = analyzeWorkflow(w);
    const demand = a.totalWeeklyMinutes;
    const headcount = w.headcount && w.headcount > 0 ? w.headcount : 1;
    const capacity = headcount * USABLE_MIN_PER_WEEK;
    const protectedMin = a.protectedSteps.reduce((s, o) => s + o.weeklyMinutes, 0);
    return {
      id: w.id,
      role: w.role || 'Untitled role',
      outputName: w.outputName || 'untitled output',
      headcount,
      demandWeeklyMin: demand,
      capacityWeeklyMin: capacity,
      utilizationNow: capacity > 0 ? demand / capacity : 0,
      breaksAt: demand > 0 ? capacity / demand : Infinity,
      reliefHeadroom: demand > 0 ? a.automatableWeeklyMinutes / demand : 0,
      judgmentShare: demand > 0 ? protectedMin / demand : 0,
      inDegree: 0,
      outDegree: 0,
      constraint: 'comfortable',
    };
  });
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // Stitch edges from confirmed handoff links; collect suggestions + blind spots.
  const edges: Edge[] = [];
  const blindSpots: BlindSpot[] = [];
  const suggestions: LinkSuggestion[] = [];

  for (const w of workflows) {
    for (const h of w.handoffs) {
      if (!h.who.trim()) continue;
      const delayHours = typeof h.delayHours === 'number' ? h.delayHours : null;

      // confirmed link → a real edge
      if (h.linkedWorkflowId && byId.has(h.linkedWorkflowId)) {
        const other = h.linkedWorkflowId;
        // hand-to: work flows w -> other. wait-on: other feeds w.
        if (h.direction === 'hand-to') edges.push({ fromId: w.id, toId: other, what: h.what, delayHours, sourceWorkflowId: w.id, handoffId: h.id });
        else edges.push({ fromId: other, toId: w.id, what: h.what, delayHours, sourceWorkflowId: w.id, handoffId: h.id });
        continue;
      }

      // not linked: is there a captured role that plausibly matches?
      let best: { id: string; role: string; score: number } | null = null;
      for (const cand of workflows) {
        if (cand.id === w.id) continue;
        const sc = nameScore(h.who, cand.role);
        if (sc >= SUGGEST_THRESHOLD && (!best || sc > best.score)) best = { id: cand.id, role: cand.role, score: sc };
      }
      if (best) {
        suggestions.push({ sourceWorkflowId: w.id, handoffId: h.id, who: h.who, fromRole: w.role || 'Untitled role', candidateId: best.id, candidateRole: best.role, score: best.score });
      } else {
        blindSpots.push({ who: h.who, fromRole: w.role || 'Untitled role', direction: h.direction, what: h.what });
      }
    }
  }

  // degrees from confirmed edges only
  for (const e of edges) {
    const f = nodeById.get(e.fromId); const t = nodeById.get(e.toId);
    if (f) f.outDegree += 1;
    if (t) t.inDegree += 1;
  }

  // classify each role's constraint character (drives colour + label)
  for (const n of nodes) n.constraint = classify(n);

  const findings = buildFindings(workflows, nodes, edges);

  return { nodes, edges, blindSpots, suggestions, findings };
}

function classify(n: RoleNode): ConstraintKind {
  if (n.demandWeeklyMin <= 0) return 'comfortable';
  if (n.headcount === 1 && n.inDegree >= 2) return 'single-point';
  if (n.judgmentShare >= 0.4) return 'judgment-bound';
  if (n.reliefHeadroom < 0.25) return 'capacity-bound';
  if (n.reliefHeadroom >= 0.5) return 'has-slack';
  return 'comfortable';
}

// ---- stress test (applied live as the slider moves) ----

export type RoleState = 'broken' | 'near' | 'ok';

/** Where a role sits at a given org-wide load multiplier. */
export function roleStateAt(n: RoleNode, multiplier: number): RoleState {
  if (n.demandWeeklyMin <= 0 || !isFinite(n.breaksAt)) return 'ok';
  if (multiplier >= n.breaksAt) return 'broken';
  if (multiplier >= n.breaksAt * 0.8) return 'near';
  return 'ok';
}

export const STATE_COLOR: Record<RoleState, string> = {
  broken: '#c0392b',
  near: '#FF9656',
  ok: '#1b8a5a',
};

/** Roles ordered by the load at which they break — the literal "what breaks first". */
export function breaksFirst(nodes: RoleNode[]): RoleNode[] {
  return [...nodes].sort((a, b) => a.breaksAt - b.breaksAt);
}

// ---- findings: properties visible only across captures ----

function buildFindings(workflows: Workflow[], nodes: RoleNode[], edges: Edge[]): Finding[] {
  const out: Finding[] = [];

  // 1. shadow-tool clusters — the same unofficial tool propping up multiple roles
  const shadowToolRoles = new Map<string, Set<string>>();
  for (const w of workflows) {
    for (const s of w.steps) {
      if (!s.isShadow) continue;
      const tool = s.tool.trim().toLowerCase();
      if (!tool) continue;
      if (!shadowToolRoles.has(tool)) shadowToolRoles.set(tool, new Set());
      shadowToolRoles.get(tool)!.add(w.role || w.id);
    }
  }
  for (const [tool, roles] of shadowToolRoles) {
    if (roles.size >= 2) {
      out.push({
        kind: 'shadow-cluster', severity: 'warn',
        title: `Shadow tool "${tool}" props up ${roles.size} roles`,
        detail: `${[...roles].join(', ')} all lean on the same unofficial tool. That is an org-wide unmet need the official systems do not cover — fix the cause, do not just bless the workaround.`,
      });
    }
  }

  // 2. judgment gates — a judgment-bound role that several roles feed into
  for (const n of nodes) {
    if (n.judgmentShare >= 0.4 && n.inDegree >= 2) {
      out.push({
        kind: 'judgment-gate', severity: 'risk',
        title: `${n.role} is a judgment gate (${n.inDegree} roles feed it)`,
        detail: `Most of its load is human-judgment work that cannot be automated or easily parallelised. At higher volume this is a hard ceiling — only adding people who can exercise that judgment relieves it.`,
      });
    }
  }

  // 3. single points of failure — one person, many dependents
  for (const n of nodes) {
    if (n.headcount === 1 && n.inDegree >= 2) {
      out.push({
        kind: 'single-point', severity: 'risk',
        title: `${n.role} is a single point of failure`,
        detail: `One person, and ${n.inDegree} role${n.inDegree > 1 ? 's' : ''} depend on their output. The technical map hides this; the bus-factor is 1.`,
      });
    }
  }

  // 4. already-overloaded roles (before any growth)
  for (const n of nodes) {
    if (n.utilizationNow > 1) {
      out.push({
        kind: 'overloaded-now', severity: 'risk',
        title: `${n.role} is already over capacity today`,
        detail: `Estimated demand is ${Math.round(n.utilizationNow * 100)}% of one person-week even at 1x. This role breaks first the moment volume rises.`,
      });
    }
  }

  // 5. cross-role cycles — a rework loop that spans roles
  const cycle = findCycle(nodes, edges);
  if (cycle) {
    const names = cycle.map((id) => nodes.find((n) => n.id === id)?.role ?? id);
    out.push({
      kind: 'cycle', severity: 'warn',
      title: `Work loops between ${cycle.length} roles`,
      detail: `${names.join(' → ')} → ${names[0]}. Work circles back instead of flowing forward — a rework loop that gets more expensive as volume grows.`,
    });
  }

  // risk first, then warn, then info
  const rank: Record<FindingSeverity, number> = { risk: 0, warn: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

/** First directed cycle in the confirmed-edge graph, as a list of node ids, or null. */
function findCycle(nodes: RoleNode[], edges: Edge[]): string[] | null {
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) adj.get(e.fromId)?.push(e.toId);

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>(nodes.map((n) => [n.id, WHITE]));
  const stack: string[] = [];

  function dfs(u: string): string[] | null {
    color.set(u, GRAY);
    stack.push(u);
    for (const v of adj.get(u) ?? []) {
      if (color.get(v) === GRAY) {
        const i = stack.indexOf(v);
        return stack.slice(i);
      }
      if (color.get(v) === WHITE) {
        const found = dfs(v);
        if (found) return found;
      }
    }
    stack.pop();
    color.set(u, BLACK);
    return null;
  }

  for (const n of nodes) {
    if (color.get(n.id) === WHITE) {
      const found = dfs(n.id);
      if (found) return found;
    }
  }
  return null;
}
