import { describe, it, expect } from 'vitest';
import { ALL_EXAMPLES as WORKED_EXAMPLES } from './examples/_all';
import { SECTORS } from './examples';
import { analyzeWorkflow, ARCHETYPES } from './automation';

describe('worked-example library', () => {
  it('has unique keys', () => {
    const keys = WORKED_EXAMPLES.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every example belongs to a registered sector domain (chips stay in sync)', () => {
    const sectorDomains = new Set(SECTORS.map((s) => s.domain));
    for (const ex of WORKED_EXAMPLES) {
      expect(sectorDomains.has(ex.domain), `${ex.key} has domain "${ex.domain}" with no matching sector`).toBe(true);
    }
    // and every registered sector actually has at least one example
    for (const s of SECTORS) {
      expect(WORKED_EXAMPLES.some((e) => e.domain === s.domain), `sector "${s.id}" has no examples`).toBe(true);
    }
  });

  it('every example builds a workflow with at least one step and both read fields', () => {
    for (const ex of WORKED_EXAMPLES) {
      const wf = ex.build();
      expect(wf.steps.length, ex.key).toBeGreaterThan(0);
      expect(ex.behavioralContext.length, ex.key).toBeGreaterThan(0);
      expect(ex.fieldSpecificFit.length, ex.key).toBeGreaterThan(0);
    }
  });
});

describe('analyzeWorkflow — core invariants across all examples', () => {
  for (const ex of WORKED_EXAMPLES) {
    describe(ex.key, () => {
      const wf = ex.build();
      const a = analyzeWorkflow(wf);

      it('protects exactly the needs-judgment steps', () => {
        const judgmentIds = new Set(wf.steps.filter((s) => s.needsJudgment).map((s) => s.id));
        const protectedIds = new Set(a.protectedSteps.map((o) => o.stepId));
        expect(protectedIds).toEqual(judgmentIds);
      });

      it('THE THESIS: a judgment step is never offered as an automation opportunity', () => {
        for (const op of a.ranked) {
          expect(op.protect, `${ex.key} step #${op.order} ranked but protected`).toBe(false);
        }
        const rankedIds = new Set(a.ranked.map((o) => o.stepId));
        for (const s of wf.steps) {
          if (s.needsJudgment) expect(rankedIds.has(s.id), `${ex.key} judgment step #${s.order} leaked into ranked`).toBe(false);
        }
      });

      it('protected steps are decision-support at most (never high/partial automation)', () => {
        for (const op of a.protectedSteps) {
          expect(op.archetype).toBe('decision-support');
          expect(ARCHETYPES[op.archetype].level).toBe('support');
        }
      });

      it('ranked steps are non-protected and not in the leave quadrant', () => {
        for (const op of a.ranked) expect(op.quadrant).not.toBe('leave');
        // ranked is sorted by priority descending
        const ps = a.ranked.map((o) => o.priority);
        expect([...ps].sort((x, y) => y - x)).toEqual(ps);
      });

      it('shadow steps are flagged and surfaced regardless of ranking', () => {
        const shadowIds = new Set(wf.steps.filter((s) => s.isShadow).map((s) => s.id));
        const flagged = new Set(a.opportunities.filter((o) => o.shadowSignal).map((o) => o.stepId));
        expect(flagged).toEqual(shadowIds);
      });

      it('quadrant counts sum to the step count', () => {
        const total = Object.values(a.counts).reduce((s, n) => s + n, 0);
        expect(total).toBe(wf.steps.length);
        expect(a.opportunities.length).toBe(wf.steps.length);
      });
    });
  }
});

describe('regression — resolved borderline tags', () => {
  const byKey = (k: string) => analyzeWorkflow(WORKED_EXAMPLES.find((e) => e.key === k)!.build());

  it('sweet-shop packing is a throughput opportunity, not protected judgment', () => {
    const a = byKey('sweet-shop');
    const packing = a.opportunities.find((o) => o.action.startsWith('Pack per type'))!;
    expect(packing.protect).toBe(false);
    expect(packing.archetype).toBe('physical-redesign');
    expect(a.ranked.some((o) => o.stepId === packing.stepId)).toBe(true);
  });

  it('mobile-shop separates the logging opportunity from the protected valuation', () => {
    const a = byKey('mobile-shop');
    const logging = a.opportunities.find((o) => o.action.startsWith('Log the old exchange'))!;
    const decide = a.opportunities.find((o) => o.action.startsWith('Decide repair vs flip'))!;
    expect(logging.protect).toBe(false);
    expect(logging.shadowSignal).toBe(true);
    expect(decide.protect).toBe(true);
  });
});
