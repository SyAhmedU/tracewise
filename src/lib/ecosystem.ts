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
  kind: 'shadow-cluster' | 'judgment-gate' | 'single-point' | 'overloaded-now';
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

  const findings = buildFindings(workflows, nodes);

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

function buildFindings(workflows: Workflow[], nodes: RoleNode[]): Finding[] {
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

  // Cross-role loops are handled by the dynamic reinforcing-loop layer below
  // (analyzeLoops), because whether a loop is *vicious* depends on the load.

  // risk first, then warn, then info
  const rank: Record<FindingSeverity, number> = { risk: 0, warn: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

// ---- reinforcing-loop layer (the "why it breaks" on top of "what breaks") ----
//
// The stress test says WHICH roles break first. It does not explain why the
// break is non-linear. The usual cause is a reinforcing loop: a saturated role
// falls behind → downstream roles wait → they chase → chasing lands more load
// back on the saturated role → it falls further behind. This layer signs the
// edges Tracewise already has — purely from saturation, never authored — and
// flags the directed cycles that are back-pressured at the current load. It is
// load-dependent, so it lives outside buildEcosystem and recomputes per slider
// tick, the same way roleStateAt does.

export type EdgeSign = 'reinforcing' | 'relieving' | 'neutral';
export const EDGE_SIGN_COLOR: Record<EdgeSign, string> = {
  reinforcing: '#c0392b', // feeds an already-stressed role — back-pressure
  relieving: '#1b8a5a',   // flows into a role with room — work passes through
  neutral: '#9aa0a6',     // target carries no captured load
};

/** Sign of an edge at a given load: red if it feeds a saturated/near role. */
export function edgeSignAt(edge: Edge, nodeById: Map<string, RoleNode>, multiplier: number): EdgeSign {
  const target = nodeById.get(edge.toId);
  if (!target || target.demandWeeklyMin <= 0) return 'neutral';
  const st = roleStateAt(target, multiplier);
  return st === 'ok' ? 'relieving' : 'reinforcing';
}

export interface LoopAnalysis {
  roleIds: string[];        // cycle node ids, in loop order
  roleNames: string[];
  edges: Edge[];            // the edges composing the loop
  reinforcing: boolean;     // vicious at this load (most of the loop is back-pressured)
  saturatedCount: number;   // roles in the loop at/near saturation
  totalDelayHours: number;  // captured delay circulating in the loop
  leverageEdge: Edge | null;// the single best edge to cut
  leverageRationale: string;
}

/** Classify every directed cycle in the confirmed-edge graph at a given load. */
export function analyzeLoops(eco: Ecosystem, multiplier: number): LoopAnalysis[] {
  const nodeById = new Map(eco.nodes.map((n) => [n.id, n]));
  const cycles = findAllCycles(eco.nodes, eco.edges);
  const out: LoopAnalysis[] = [];

  for (const cyc of cycles) {
    const edges: Edge[] = [];
    for (let i = 0; i < cyc.length; i++) {
      const a = cyc[i], b = cyc[(i + 1) % cyc.length];
      const e = eco.edges.find((x) => x.fromId === a && x.toId === b);
      if (e) edges.push(e);
    }
    if (edges.length < cyc.length) continue; // safety: incomplete loop

    const roles = cyc.map((id) => nodeById.get(id)!);
    const saturatedCount = roles.filter((r) => roleStateAt(r, multiplier) !== 'ok').length;
    const totalDelayHours = edges.reduce((s, e) => s + (e.delayHours ?? 0), 0);
    // vicious when a majority of the loop is back-pressured (and at least one is)
    const reinforcing = saturatedCount >= 1 && saturatedCount >= Math.ceil(cyc.length / 2);

    let leverageEdge: Edge | null = null;
    let leverageRationale = '';
    if (reinforcing) {
      // prefer cutting intake to the loop role with the most automatable slack
      let bestRelief = -1;
      for (const e of edges) {
        const t = nodeById.get(e.toId)!;
        if (t.reliefHeadroom > bestRelief) { bestRelief = t.reliefHeadroom; leverageEdge = e; }
      }
      if (leverageEdge && bestRelief >= 0.25) {
        const t = nodeById.get(leverageEdge.toId)!;
        const f = nodeById.get(leverageEdge.fromId)!;
        leverageRationale = `Cut ${f.role} → ${t.role}: ${t.role} has ~${Math.round(bestRelief * 100)}% automatable slack, so relieving its intake (auto-route or validate “${leverageEdge.what || 'the handoff'}”) breaks the loop with the least pain.`;
      } else {
        // no slack anywhere — decouple the highest-delay link with a buffer
        leverageEdge = edges.reduce((m, e) => ((e.delayHours ?? 0) > (m.delayHours ?? -1) ? e : m), edges[0]);
        const t = nodeById.get(leverageEdge.toId)!;
        const f = nodeById.get(leverageEdge.fromId)!;
        leverageRationale = `Cut ${f.role} → ${t.role}: no role in the loop has automation slack, so decouple here — a buffer/queue stops backlog circling the loop.`;
      }
    }

    out.push({ roleIds: cyc, roleNames: roles.map((r) => r.role), edges, reinforcing, saturatedCount, totalDelayHours, leverageEdge, leverageRationale });
  }

  // vicious first, then by how much of the loop is saturated
  return out.sort((a, b) => (Number(b.reinforcing) - Number(a.reinforcing)) || (b.saturatedCount - a.saturatedCount));
}

/** Every simple directed cycle in the confirmed-edge graph (bounded for safety). */
function findAllCycles(nodes: RoleNode[], edges: Edge[], maxLen = 8, maxCycles = 40): string[][] {
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) adj.get(e.fromId)?.push(e.toId);

  const cycles: string[][] = [];
  const seen = new Set<string>();
  const canon = (cyc: string[]): string => {
    let min = 0;
    for (let i = 1; i < cyc.length; i++) if (cyc[i] < cyc[min]) min = i;
    return [...cyc.slice(min), ...cyc.slice(0, min)].join('>');
  };

  // Anchor each search at the loop's smallest id (v > start) so each cycle is
  // found once; canon() dedupes any residual rotations.
  function dfs(start: string, u: string, path: string[], onPath: Set<string>) {
    if (cycles.length >= maxCycles || path.length > maxLen) return;
    for (const v of adj.get(u) ?? []) {
      if (v === start && path.length >= 2) {
        const key = canon(path);
        if (!seen.has(key)) { seen.add(key); cycles.push([...path]); }
      } else if (v > start && !onPath.has(v)) {
        onPath.add(v); path.push(v);
        dfs(start, v, path, onPath);
        path.pop(); onPath.delete(v);
      }
    }
  }

  for (const n of nodes) {
    if (cycles.length >= maxCycles) break;
    dfs(n.id, n.id, [n.id], new Set([n.id]));
  }
  return cycles;
}
