// v2 — the Automation-Fit / AI-Opportunity view.
// Reads the captured workflow, runs the deterministic analyzer (transparent
// scoring) and presents: narrative, an impact × feasibility matrix, a ranked
// opportunity list (with on-demand AI-generated concrete suggestions), and a
// "protect these" section for judgment steps. The scoring is grounded in
// Task-Technology Fit (Goodhue & Thompson, 1995) and the Levels of Automation
// model (Parasuraman, Sheridan & Wickens, 2000) — see lib/automation.ts.
import { useMemo, useState } from 'react';
import type { Workflow } from '../../lib/types';
import type { ExampleRead } from '../../App';
import {
  analyzeWorkflow, ARCHETYPES, LOA_LEVEL_LABEL, LOA_STAGE_LABEL, QUADRANT_LABEL,
  type StepOpportunity, type Quadrant,
} from '../../lib/automation';
import { buildRecommendContext, fetchSuggestion } from '../../lib/recommend';
import { exportOpportunitiesMarkdown } from '../../lib/export';
import { Button, Pill } from '../../ui';

const QUADRANT_COLOR: Record<Quadrant, string> = {
  'quick-win': 'var(--f-lookup)',
  'easy': 'var(--f-approval)',
  'big-bet': 'var(--accent-2)',
  'leave': 'var(--text-soft)',
  'protect': 'var(--f-judgment)',
};

const QUADRANT_HINT: Record<Quadrant, string> = {
  'quick-win': 'High burden + good fit. Start here.',
  'easy': 'Good fit, low burden — only do it if it is genuinely cheap.',
  'big-bet': 'Real burden but harder to automate. Worth a redesign conversation.',
  'leave': 'Neither high burden nor good fit. Leave it alone for now.',
  'protect': 'Human judgment. Decision support only — do not replace.',
};

type SuggestionState = { loading: boolean; text: string | null; source: 'ai' | 'offline' | null };

export default function OpportunitiesStage({ wf, exampleRead }: { wf: Workflow; exampleRead?: ExampleRead | null }) {
  const analysis = useMemo(() => analyzeWorkflow(wf), [wf]);
  const [suggestions, setSuggestions] = useState<Record<string, SuggestionState>>({});

  const getSuggestion = async (op: StepOpportunity) => {
    setSuggestions((s) => ({ ...s, [op.stepId]: { loading: true, text: null, source: null } }));
    const step = wf.steps.find((x) => x.id === op.stepId);
    if (!step) return;
    const ctx = buildRecommendContext(wf, step, op);
    const { suggestion, source } = await fetchSuggestion(ctx);
    setSuggestions((s) => ({ ...s, [op.stepId]: { loading: false, text: suggestion, source } }));
  };

  if (wf.steps.length === 0) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-soft)' }}>No steps captured — go back to the Timeline stage and document the work first.</p>
      </div>
    );
  }

  const ranked = analysis.ranked;
  const protectedSteps = analysis.protectedSteps;
  const shadowOps = analysis.opportunities.filter((o) => o.shadowSignal);

  return (
    <div className="print-doc" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ---- narrative ---- */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        boxShadow: 'var(--shadow)', padding: 24, textAlign: 'left',
      }}>
        <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>
          Automation fit
        </div>
        <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Where AI actually fits, where to leave it alone</h3>
        <p style={{ color: 'var(--text)', lineHeight: 1.6, fontSize: '.95rem' }}>{analysis.narrative}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 18 }}>
          {(['quick-win', 'easy', 'big-bet', 'leave', 'protect'] as Quadrant[]).map((q) => (
            <div key={q} style={{
              background: 'var(--bg)', border: `1px solid color-mix(in srgb, ${QUADRANT_COLOR[q]} 30%, var(--border))`,
              borderRadius: 12, padding: '12px 14px',
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: QUADRANT_COLOR[q], fontFamily: 'var(--heading)', lineHeight: 1 }}>
                {analysis.counts[q]}
              </div>
              <div style={{ fontSize: '.74rem', color: 'var(--text-soft)', marginTop: 4 }}>{QUADRANT_LABEL[q]}</div>
            </div>
          ))}
        </div>

        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: 'pointer', fontSize: '.74rem', color: 'var(--accent)', fontWeight: 600, listStyle: 'none' }}>
            📖 how this is scored
          </summary>
          <p style={{ fontSize: '.78rem', color: 'var(--text-soft)', lineHeight: 1.55, marginTop: 7, paddingLeft: 10, borderLeft: '2px solid var(--border-strong)' }}>
            Each step gets two transparent scores. <strong>Impact</strong> = estimated weekly time burden (frequency × per-occurrence minutes), nudged up if the step is dreaded.
            {' '}<strong>Feasibility</strong> = automatability of its dominant Lean waste type × structuredness of the tool involved, capped low for judgment steps.
            The fit archetype and function-allocation level follow Parasuraman, Sheridan & Wickens (2000): the four LoA stages and "support → partial → high" levels.
            Judgment steps and shadow tools are flagged separately — automate the work, preserve the judgment, fix the unmet need behind the shadow tool.
          </p>
        </details>
      </div>

      {/* ---- the human read behind this worked example ---- */}
      {exampleRead && (
        <div style={{
          background: 'color-mix(in srgb, var(--accent) 5%, var(--surface))',
          border: '1px solid var(--accent-border)', borderRadius: 16, padding: 24, textAlign: 'left',
        }}>
          <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>
            The human read behind the scores
          </div>
          <p style={{ fontSize: '.82rem', color: 'var(--text-soft)', lineHeight: 1.55, marginBottom: 16 }}>
            This worked example ships with a hand-written interpretation. Read it against the deterministic scores above — the engine ranks by burden and fit; this is the ground-level dynamic that decides whether a fit is real.
          </p>
          <div style={{
            fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em',
            color: 'var(--text-soft)', marginBottom: 3,
          }}>Ground-level dynamic</div>
          <div style={{ fontSize: '.9rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: 14 }}>
            {exampleRead.behavioralContext}
          </div>
          <div style={{
            fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em',
            color: 'var(--accent)', marginBottom: 3,
          }}>Where AI fits</div>
          <div style={{ fontSize: '.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
            {exampleRead.fieldSpecificFit}
          </div>
        </div>
      )}

      {/* ---- matrix ---- */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        boxShadow: 'var(--shadow)', padding: 24, textAlign: 'left',
      }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Impact × Feasibility</h3>
        <p style={{ fontSize: '.82rem', color: 'var(--text-soft)', marginBottom: 14 }}>
          Bigger dot = more weekly minutes. Hover for the step. Judgment steps are shown in purple — those are value to preserve.
        </p>
        <Matrix opportunities={analysis.opportunities} />
      </div>

      {/* ---- ranked list ---- */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        boxShadow: 'var(--shadow)', padding: 24, textAlign: 'left',
      }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Ranked opportunities</h3>
        <p style={{ fontSize: '.82rem', color: 'var(--text-soft)', marginBottom: 18 }}>
          Steps where automation looks like it would fit, highest priority first. Click <em>Suggest a concrete try</em> for a one-paragraph, role-specific idea.
        </p>
        {ranked.length === 0 && (
          <p style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>
            No clear automation candidates — most steps are either low-burden or low-fit. That is a legitimate finding: not every job needs AI added to it.
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ranked.map((op, i) => (
            <OpportunityRow
              key={op.stepId}
              op={op}
              rank={i + 1}
              suggestion={suggestions[op.stepId]}
              onSuggest={() => getSuggestion(op)}
            />
          ))}
        </div>
      </div>

      {/* ---- shadow signals ---- */}
      {shadowOps.length > 0 && (
        <div style={{
          background: 'color-mix(in srgb, var(--f-transfer) 6%, var(--surface))',
          border: '1px solid color-mix(in srgb, var(--f-transfer) 30%, var(--border))',
          borderRadius: 16, padding: 24, textAlign: 'left',
        }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--f-transfer)' }}>Shadow signals</h3>
          <p style={{ fontSize: '.82rem', color: 'var(--text-soft)', marginBottom: 14 }}>
            These steps rely on unofficial tools — that is articulation work, and it usually signals that the official system does not cover something. <strong>Fix the cause; do not just paper over with automation</strong> (Star & Strauss, 1999).
          </p>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: '.88rem', color: 'var(--text)', lineHeight: 1.7 }}>
            {shadowOps.map((o) => (
              <li key={o.stepId}>
                <strong style={{ color: 'var(--text-h)' }}>Step {o.order}: {o.action || '(unnamed)'}</strong>
                {' '}— surfaces an unmet need from the official process.
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- protect these ---- */}
      {protectedSteps.length > 0 && (
        <div style={{
          background: 'color-mix(in srgb, var(--f-judgment) 6%, var(--surface))',
          border: '1px solid color-mix(in srgb, var(--f-judgment) 30%, var(--border))',
          borderRadius: 16, padding: 24, textAlign: 'left',
        }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--f-judgment)' }}>Protect — human judgment</h3>
          <p style={{ fontSize: '.82rem', color: 'var(--text-soft)', marginBottom: 14 }}>
            These steps rest on judgment that should stay with the person. Function allocation (Parasuraman et al., 2000) puts these at <em>decision support</em> at most — augment the inputs, do not replace the decision.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {protectedSteps.map((o) => (
              <div key={o.stepId} style={{
                background: 'var(--bg)', borderRadius: 10, padding: '10px 14px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: 3 }}>
                  Step {o.order}: {o.action || '(unnamed)'}
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--text-soft)' }}>{o.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- exports ---- */}
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Button variant="primary" onClick={() => window.print()}>🖨️ Print / PDF</Button>
        <Button variant="soft" onClick={() => exportOpportunitiesMarkdown(wf, analysis)}>↓ Opportunities (Markdown)</Button>
      </div>
    </div>
  );
}

function OpportunityRow({
  op, rank, suggestion, onSuggest,
}: {
  op: StepOpportunity;
  rank: number;
  suggestion: SuggestionState | undefined;
  onSuggest: () => void;
}) {
  const arch = ARCHETYPES[op.archetype];
  const c = QUADRANT_COLOR[op.quadrant];
  return (
    <div style={{
      background: 'var(--bg)', border: `1px solid color-mix(in srgb, ${c} 22%, var(--border))`,
      borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: c,
          color: '#fff', fontWeight: 800, fontSize: '.78rem',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{rank}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: 4 }}>
            Step {op.order}: {op.action || '(unnamed step)'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            <Pill color={c}>{QUADRANT_LABEL[op.quadrant]}</Pill>
            <Pill color={'var(--accent-2)'}>{arch.label}</Pill>
            <Pill color={'var(--accent)'}>{LOA_LEVEL_LABEL[op.level]}</Pill>
            {op.stages.map((s) => <Pill key={s}>{LOA_STAGE_LABEL[s]}</Pill>)}
          </div>
          <div style={{ fontSize: '.82rem', color: 'var(--text-soft)', lineHeight: 1.55 }}>
            {op.rationale}
          </div>

          {suggestion && (
            <div style={{
              marginTop: 12, padding: '12px 14px', borderRadius: 10,
              background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
            }}>
              {suggestion.loading && <span style={{ fontSize: '.85rem', color: 'var(--text-soft)' }}>Generating suggestion…</span>}
              {!suggestion.loading && suggestion.text && (
                <>
                  <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>
                    Try this {suggestion.source === 'offline' && <span style={{ color: 'var(--text-soft)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>· offline template</span>}
                  </div>
                  <div style={{ fontSize: '.88rem', color: 'var(--text-h)', lineHeight: 1.6 }}>{suggestion.text}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {!suggestion && (
        <div className="no-print" style={{ marginTop: 10, marginLeft: 40 }}>
          <Button variant="soft" onClick={onSuggest}>✨ Suggest a concrete try</Button>
        </div>
      )}
    </div>
  );
}

function Matrix({ opportunities }: { opportunities: StepOpportunity[] }) {
  const W = 560, H = 320, padL = 56, padR = 16, padT = 16, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxBurden = Math.max(1, ...opportunities.map((o) => o.weeklyMinutes));

  const x = (feas: number) => padL + feas * plotW;
  const y = (imp: number) => padT + (1 - imp) * plotH;
  const r = (mins: number) => 6 + (mins / maxBurden) * 14;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 420, height: 'auto', maxHeight: 360 }}>
        {/* quadrant fills */}
        <rect x={padL + plotW / 2} y={padT} width={plotW / 2} height={plotH / 2} fill="color-mix(in srgb, var(--f-lookup) 7%, transparent)" />
        <rect x={padL} y={padT} width={plotW / 2} height={plotH / 2} fill="color-mix(in srgb, var(--accent-2) 5%, transparent)" />
        <rect x={padL + plotW / 2} y={padT + plotH / 2} width={plotW / 2} height={plotH / 2} fill="color-mix(in srgb, var(--f-approval) 5%, transparent)" />
        {/* axes */}
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="var(--border-strong)" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--border-strong)" strokeWidth={1} />
        {/* gridlines */}
        <line x1={padL + plotW / 2} y1={padT} x2={padL + plotW / 2} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={padL} y1={padT + plotH / 2} x2={padL + plotW} y2={padT + plotH / 2} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
        {/* quadrant labels */}
        <text x={padL + plotW - 8} y={padT + 16} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--f-lookup)">quick win</text>
        <text x={padL + 8} y={padT + 16} fontSize="11" fontWeight="700" fill="var(--accent-2)">big bet</text>
        <text x={padL + plotW - 8} y={padT + plotH - 8} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--f-approval)">easy</text>
        <text x={padL + 8} y={padT + plotH - 8} fontSize="11" fontWeight="700" fill="var(--text-soft)">leave</text>
        {/* axis labels */}
        <text x={padL + plotW / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--text-soft)">Feasibility →</text>
        <text x={14} y={padT + plotH / 2} fontSize="11" fill="var(--text-soft)" transform={`rotate(-90 14 ${padT + plotH / 2})`} textAnchor="middle">Impact (weekly burden) →</text>
        {/* dots */}
        {opportunities.map((o) => (
          <g key={o.stepId}>
            <circle
              cx={x(o.feasibility)}
              cy={y(o.impact)}
              r={r(o.weeklyMinutes)}
              fill={o.protect ? 'var(--f-judgment)' : QUADRANT_COLOR[o.quadrant]}
              fillOpacity={0.55}
              stroke={o.protect ? 'var(--f-judgment)' : QUADRANT_COLOR[o.quadrant]}
              strokeWidth={1.5}
            >
              <title>{`Step ${o.order}: ${o.action || '(unnamed)'} — ${o.weeklyMinutes} min/week`}</title>
            </circle>
            <text x={x(o.feasibility)} y={y(o.impact) + 3} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" pointerEvents="none">
              {o.order}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6, fontSize: '.74rem', color: 'var(--text-soft)' }}>
        {(['quick-win', 'easy', 'big-bet', 'leave', 'protect'] as Quadrant[]).map((q) => (
          <span key={q} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: 99, background: QUADRANT_COLOR[q], display: 'inline-block' }} />
            {QUADRANT_LABEL[q]} — {QUADRANT_HINT[q]}
          </span>
        ))}
      </div>
    </div>
  );
}
