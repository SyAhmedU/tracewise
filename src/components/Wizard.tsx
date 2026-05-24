import type { Workflow } from '../lib/types';
import { STAGES } from '../lib/questions';
import { Button } from '../ui';
import FrameStage from './stages/FrameStage';
import TriggerStage from './stages/TriggerStage';
import StepsStage from './stages/StepsStage';
import HandoffsStage from './stages/HandoffsStage';
import ExceptionsStage from './stages/ExceptionsStage';
import ReviewStage from './stages/ReviewStage';

export default function Wizard({
  wf, update, stage, setStage, onSaveExit,
}: {
  wf: Workflow;
  update: (fn: (d: Workflow) => void) => void;
  stage: number;
  setStage: (n: number) => void;
  onSaveExit: () => void;
}) {
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

      <div className="no-print" style={{ textAlign: 'left', marginBottom: 20 }}>
        <div style={{ fontSize: '.76rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>
          Step {stage + 1} of {STAGES.length} · {meta.label}
        </div>
        <h2 style={{ fontSize: '1.55rem', lineHeight: 1.2, letterSpacing: '-.01em', marginBottom: 8 }}>{meta.title}</h2>
        <p style={{ color: 'var(--text-soft)', fontSize: '.95rem', lineHeight: 1.55 }}>{meta.blurb}</p>
      </div>

      <div key={meta.id} className="tw-fade">
        {meta.id === 'frame' && <FrameStage wf={wf} update={update} />}
        {meta.id === 'trigger' && <TriggerStage wf={wf} update={update} />}
        {meta.id === 'steps' && <StepsStage wf={wf} update={update} />}
        {meta.id === 'handoffs' && <HandoffsStage wf={wf} update={update} />}
        {meta.id === 'exceptions' && <ExceptionsStage wf={wf} update={update} />}
        {meta.id === 'review' && <ReviewStage wf={wf} />}
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
