import { describe, it, expect } from 'vitest';
import { type Workflow, type Frequency, type FrictionTag, type HandoffDirection, newWorkflow, newStep, newHandoff } from './types';
import { buildEcosystem, breaksFirst, roleStateAt, USABLE_MIN_PER_WEEK } from './ecosystem';

// --- tiny builder so each test reads as a scenario, not setup noise ---
interface StepSpec { mins: number; freq: Frequency; tags?: FrictionTag[]; judgment?: boolean; shadow?: boolean; tool?: string }
interface HandoffSpec { direction: HandoffDirection; who: string; link?: string }
function role(id: string, roleName: string, opts: { headcount?: number; steps?: StepSpec[]; handoffs?: HandoffSpec[] } = {}): Workflow {
  const wf = newWorkflow();
  wf.id = id;
  wf.role = roleName;
  wf.outputName = `${roleName} output`;
  wf.headcount = opts.headcount ?? 1;
  wf.steps = (opts.steps ?? []).map((s, i) => {
    const st = newStep(i);
    st.action = `step ${i}`;
    st.tool = s.tool ?? 'a system';
    st.timeMins = s.mins;
    st.frequency = s.freq;
    st.frictionTags = s.tags ?? [];
    st.needsJudgment = !!s.judgment;
    st.isShadow = !!s.shadow;
    return st;
  });
  wf.handoffs = (opts.handoffs ?? []).map((h) => {
    const ho = newHandoff(h.direction);
    ho.who = h.who;
    ho.what = 'the thing';
    if (h.link) ho.linkedWorkflowId = h.link;
    return ho;
  });
  return wf;
}

describe('ecosystem — capacity arithmetic', () => {
  // one person, one 60-min daily step → 300 min/week demand against 1800 capacity
  const wf = role('a', 'Analyst', { headcount: 1, steps: [{ mins: 60, freq: 'daily' }] });
  const eco = buildEcosystem([wf]);
  const n = eco.nodes[0];

  it('demand is freq × mins per week', () => {
    expect(n.demandWeeklyMin).toBe(300); // 60 × 5
  });
  it('capacity is headcount × usable minutes', () => {
    expect(n.capacityWeeklyMin).toBe(USABLE_MIN_PER_WEEK);
  });
  it('M* (breaks-at) is capacity / demand', () => {
    expect(n.breaksAt).toBeCloseTo(6, 5); // 1800 / 300
  });
  it('utilisation today is demand / capacity', () => {
    expect(n.utilizationNow).toBeCloseTo(300 / 1800, 5);
  });
});

describe('ecosystem — stress thresholds', () => {
  const wf = role('a', 'Analyst', { steps: [{ mins: 60, freq: 'daily' }] }); // breaksAt = 6
  const n = buildEcosystem([wf]).nodes[0];

  it('ok well below saturation', () => expect(roleStateAt(n, 4)).toBe('ok'));
  it('near within 80% of saturation', () => expect(roleStateAt(n, 5)).toBe('near'));
  it('broken at or past saturation', () => expect(roleStateAt(n, 6)).toBe('broken'));

  it('a role with no captured load never breaks', () => {
    const idle = buildEcosystem([role('b', 'Bystander')]).nodes[0];
    expect(idle.breaksAt).toBe(Infinity);
    expect(roleStateAt(idle, 15)).toBe('ok');
  });
});

describe('ecosystem — stitching is ground-truth only', () => {
  it('builds an edge only from a confirmed link, in flow direction', () => {
    const a = role('a', 'Analyst', { handoffs: [{ direction: 'hand-to', who: 'the approver', link: 'b' }] });
    const b = role('b', 'Approver');
    const eco = buildEcosystem([a, b]);
    expect(eco.edges).toHaveLength(1);
    expect(eco.edges[0]).toMatchObject({ fromId: 'a', toId: 'b' });
    expect(eco.nodes.find((n) => n.id === 'b')!.inDegree).toBe(1);
    expect(eco.nodes.find((n) => n.id === 'a')!.outDegree).toBe(1);
  });

  it('a wait-on link points the edge the other way (they feed you)', () => {
    const a = role('a', 'Analyst', { handoffs: [{ direction: 'wait-on', who: 'data team', link: 'b' }] });
    const b = role('b', 'Data team');
    const eco = buildEcosystem([a, b]);
    expect(eco.edges[0]).toMatchObject({ fromId: 'b', toId: 'a' });
  });

  it('an unlinked but name-matching handoff becomes a suggestion, not an edge', () => {
    const a = role('a', 'Analyst', { handoffs: [{ direction: 'hand-to', who: 'Approvals' }] });
    const b = role('b', 'Approvals coordinator');
    const eco = buildEcosystem([a, b]);
    expect(eco.edges).toHaveLength(0);
    expect(eco.suggestions).toHaveLength(1);
    expect(eco.suggestions[0]).toMatchObject({ candidateId: 'b', who: 'Approvals' });
  });

  it('a handoff to an uncaptured role is a blind spot, never an invented node', () => {
    const a = role('a', 'Analyst', { handoffs: [{ direction: 'wait-on', who: 'External vendor' }] });
    const eco = buildEcosystem([a]);
    expect(eco.nodes).toHaveLength(1); // only the captured role
    expect(eco.blindSpots).toHaveLength(1);
    expect(eco.blindSpots[0].who).toBe('External vendor');
  });
});

describe('ecosystem — what breaks first', () => {
  it('orders roles by ascending saturation multiplier', () => {
    const fragile = role('f', 'Fragile', { steps: [{ mins: 120, freq: 'daily' }] }); // 600/wk → M* 3
    const sturdy = role('s', 'Sturdy', { steps: [{ mins: 30, freq: 'weekly' }] });    // 30/wk → M* 60
    const ranked = breaksFirst(buildEcosystem([sturdy, fragile]).nodes);
    expect(ranked.map((n) => n.id)).toEqual(['f', 's']);
  });
});

describe('ecosystem — cross-capture findings', () => {
  it('flags a single point of failure: one person, many dependents', () => {
    const hub = role('h', 'Approver', { headcount: 1 });
    const a = role('a', 'Analyst', { handoffs: [{ direction: 'hand-to', who: 'approver', link: 'h' }] });
    const c = role('c', 'Clerk', { handoffs: [{ direction: 'hand-to', who: 'approver', link: 'h' }] });
    const eco = buildEcosystem([hub, a, c]);
    expect(eco.nodes.find((n) => n.id === 'h')!.inDegree).toBe(2);
    expect(eco.findings.some((f) => f.kind === 'single-point')).toBe(true);
  });

  it('flags a judgment gate that several roles feed', () => {
    const gate = role('g', 'Underwriter', { headcount: 3, steps: [{ mins: 60, freq: 'daily', judgment: true }] });
    const a = role('a', 'Analyst', { handoffs: [{ direction: 'hand-to', who: 'underwriter', link: 'g' }] });
    const c = role('c', 'Clerk', { handoffs: [{ direction: 'hand-to', who: 'underwriter', link: 'g' }] });
    const eco = buildEcosystem([gate, a, c]);
    const g = eco.nodes.find((n) => n.id === 'g')!;
    expect(g.judgmentShare).toBeCloseTo(1, 5);
    expect(eco.findings.some((f) => f.kind === 'judgment-gate')).toBe(true);
  });

  it('flags a shadow tool shared across roles', () => {
    const a = role('a', 'Analyst', { steps: [{ mins: 10, freq: 'daily', shadow: true, tool: 'a tracking spreadsheet' }] });
    const b = role('b', 'Clerk', { steps: [{ mins: 10, freq: 'daily', shadow: true, tool: 'A Tracking Spreadsheet' }] });
    const eco = buildEcosystem([a, b]);
    expect(eco.findings.some((f) => f.kind === 'shadow-cluster')).toBe(true);
  });

  it('flags a cross-role rework loop (cycle)', () => {
    const a = role('a', 'A', { handoffs: [{ direction: 'hand-to', who: 'b', link: 'b' }] });
    const b = role('b', 'B', { handoffs: [{ direction: 'hand-to', who: 'a', link: 'a' }] });
    const eco = buildEcosystem([a, b]);
    expect(eco.findings.some((f) => f.kind === 'cycle')).toBe(true);
  });

  it('flags a role already over capacity at 1×', () => {
    const drowning = role('d', 'Drowning', { headcount: 1, steps: [{ mins: 120, freq: 'many-times-a-day' }] }); // 120×25 = 3000/wk
    const eco = buildEcosystem([drowning]);
    expect(eco.nodes[0].utilizationNow).toBeGreaterThan(1);
    expect(eco.findings.some((f) => f.kind === 'overloaded-now')).toBe(true);
  });
});

describe('ecosystem — optionality classification', () => {
  it('a role whose burden is automatable waste has slack', () => {
    const wf = role('a', 'Re-keyer', { headcount: 2, steps: [{ mins: 60, freq: 'daily', tags: ['manual-transfer'] }] });
    expect(buildEcosystem([wf]).nodes[0].constraint).toBe('has-slack');
  });
  it('a judgment-dominated role is judgment-bound, not a quick win', () => {
    const wf = role('a', 'Judge', { headcount: 2, steps: [{ mins: 60, freq: 'daily', judgment: true }] });
    expect(buildEcosystem([wf]).nodes[0].constraint).toBe('judgment-bound');
  });
});
