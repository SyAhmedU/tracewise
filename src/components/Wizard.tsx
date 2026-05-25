import type { Workflow } from '../lib/types';
import type { ExampleRead } from '../App';
import { STAGES } from '../lib/questions';
import { Button } from '../ui';
import FrameStage from './stages/FrameStage';
import TriggerStage from './stages/TriggerStage';
import StepsStage from './stages/StepsStage';
import HandoffsStage from './stages/HandoffsStage';
import ExceptionsStage from './stages/ExceptionsStage';
import ReviewStage from './stages/ReviewStage';
import OpportunitiesStage from './stages/OpportunitiesStage';

type StageProps = {
  wf: Workflow;
  update: (fn: (d: Workflow) => void) => void;
  exampleRead?: ExampleRead | null;
};

/** The header block for a stage — the "Step N of 7 · label", the big question,
 * its framing, and the method note. Shared by the stepped wizard and the
 * single-page example view so the labelling stays identical. */
function StageHeader({ index }: { index: number }) {
  const meta = STAGES[index];
  return (
    <div className="no-print" style={{ textAlign: 'left', marginBottom: 20 }}>
      <div style={{ fontSize: '.76rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>
        Step {index + 1} of {STAGES.length} · {meta.label}
      </div>
      <h2 style={{ fontSize: '1.55rem', lineHeight: 1.2, letterSpacing: '-.01em', marginBottom: 8 }}>{meta.title}</h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '.95rem', lineHeight: 1.55 }}>{meta.blurb}</p>
      <details style={{ marginTop: 10 }}>
        <summary style={{ cursor: 'pointer', fontSize: '.74rem', color: 'var(--accent)', fontWeight: 600, listStyle: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          📖 the method behind this step
        </summary>
        <p style={{ fontSize: '.78rem', color: 'var(--text-soft)', lineHeight: 1.5, marginTop: 7, paddingLeft: 4, borderLeft: '2px solid var(--border-strong)', paddingInlineStart: 10 }}>{meta.basis}</p>
      </details>
    </div>
  );
}

/** Renders the right stage component for a given stage id. */
function StageBody({ id, wf, update, exampleRead }: StageProps & { id: string }) {
  switch (id) {
    case 'frame': return <FrameStage wf={wf} update={update} />;
    case 'trigger': return <TriggerStage wf={wf} update={update} />;
    case 'steps': return <StepsStage wf={wf} update={update} />;
    case 'handoffs': return <HandoffsStage wf={wf} update={update} />;
    case 'exceptions': return <ExceptionsStage wf={wf} update={update} />;
    case 'review': return <ReviewStage wf={wf} />;
    case 'opportunities': return <OpportunitiesStage wf={wf} exampleRead={exampleRead} />;
    default: return null;
  }
}

/** Single-page presentation used when a worked example is loaded: every stage
 * stacked top-to-bottom, each under its own "Step N of 7" header, no Next/Back.
 * The actual documenting flow keeps the stepped wizard below. */
function SinglePage({ wf, update, exampleRead, onExit }: StageProps & { onExit: () => void }) {
  return (
    <div>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button variant="ghost" onClick={onExit}>← Back to examples</Button>
        <span style={{ marginLeft: 'auto', fontSize: '.78rem', color: 'var(--text-soft)' }}>
          Worked example · all {STAGES.length} steps on one page
        </span>
      </div>

      {STAGES.map((s, i) => {
        const last = i === STAGES.length - 1;
        return (
          <section
            key={s.id}
            style={{
              marginBottom: last ? 0 : 36,
              paddingBottom: last ? 0 : 28,
              borderBottom: last ? 'none' : '1px solid var(--border)',
            }}
          >
            <StageHeader index={i} />
            <div className="tw-fade">
              <StageBody id={s.id} wf={wf} update={update} exampleRead={exampleRead} />
            </div>
          </section>
        );
      })}

      <div className="no-print" style={{ marginTop: 28 }}>
        <Button variant="primary" onClick={onExit}>✓ Done</Button>
      </div>
    </div>
  );
}

export default function Wizard({
  wf, update, stage, setStage, onSaveExit, exampleRead, singlePage,
}: {
  wf: Workflow;
  update: (fn: (d: Workflow) => void) => void;
  stage: number;
  setStage: (n: number) => void;
  onSaveExit: () => void;
  exampleRead?: ExampleRead | null;
  singlePage?: boolean;
}) {
  // Worked examples render as one scrollable page; documenting stays stepped.
  if (singlePage) {
    return <SinglePage wf={wf} update={update} exampleRead={exampleRead} onExit={onSaveExit} />;
  }

  const meta = STAGES[stage];

  // light gating: don't let people skip the bits that make the map meaningful
  const blocked = (): string | null => {
    if (meta.id === 'frame' && (!wf.role.trim() || !wf.outputName.trim())) return 'Add your role and the one output first.';
    if (meta.id === 'steps' && !wf.steps.some((s) => s.action.trim())) return 'Capture at least one real step.';
    return null;
  };
  const block = blocked();
  const isLast = stage === STAGES.length - 1;

  return (
    <div>
      {/* progress */}
      <div className="no-print" style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        {STAGES.map((s, i) => {
          const done = i < stage;
          const here = i === stage;
          return (
            <button
              key={s.id}
              onClick={() => i <= stage && setStage(i)}
              title={s.label}
              style={{
                flex: 1, minWidth: 70, height: 6, borderRadius: 999, border: 'none', padding: 0,
                cursor: i <= stage ? 'pointer' : 'default',
                background: here ? 'var(--warm-grad)' : done ? 'var(--accent-border)' : 'var(--code-bg)',
                transition: 'background .2s',
              }}
            />
          );
        })}
      </div>

      <StageHeader index={stage} />

      <div key={meta.id} className="tw-fade">
        <StageBody id={meta.id} wf={wf} update={update} exampleRead={exampleRead} />
      </div>

      {/* footer nav */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26 }}>
        <Button variant="ghost" onClick={() => (stage === 0 ? onSaveExit() : setStage(stage - 1))}>
          {stage === 0 ? '← Save & exit' : '← Back'}
        </Button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {block && <span style={{ fontSize: '.8rem', color: 'var(--text-soft)' }}>{block}</span>}
          {isLast ? (
            <Button variant="primary" onClick={onSaveExit}>✓ Save & finish</Button>
          ) : (
            <Button variant="primary" disabled={!!block} onClick={() => setStage(stage + 1)}>Next →</Button>
          )}
        </div>
      </div>
    </div>
  );
}
