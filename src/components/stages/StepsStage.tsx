import { type Workflow, type Step, newStep } from '../../lib/types';
import { Button } from '../../ui';
import StepEditor from '../StepEditor';

export default function StepsStage({ wf, update }: { wf: Workflow; update: (fn: (d: Workflow) => void) => void }) {
  const reorder = (steps: Step[]) => steps.map((s, i) => ({ ...s, order: i + 1 }));

  const addStep = () => update((d) => {
    d.steps = reorder([...d.steps, newStep(d.steps.length + 1)]);
  });

  const changeStep = (id: string, fn: (s: Step) => void) => update((d) => {
    const s = d.steps.find((x) => x.id === id);
    if (s) fn(s);
  });

  const moveStep = (id: string, dir: -1 | 1) => update((d) => {
    const i = d.steps.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= d.steps.length) return;
    [d.steps[i], d.steps[j]] = [d.steps[j], d.steps[i]];
    d.steps = reorder(d.steps);
  });

  const deleteStep = (id: string) => update((d) => {
    d.steps = reorder(d.steps.filter((x) => x.id !== id));
  });

  return (
    <div>
      {wf.steps.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '40px 24px', color: 'var(--text-soft)',
          border: '1.5px dashed var(--border-strong)', borderRadius: 16, marginBottom: 18, background: 'var(--surface)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧭</div>
          <p style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: 4 }}>Start with the very first thing you do.</p>
          <p style={{ fontSize: '.88rem' }}>Not how it should be done — what you actually did last time. Add each step, then “then what?” until it's handed off or done.</p>
        </div>
      )}

      {wf.steps.map((s, i) => (
        <StepEditor
          key={s.id}
          wf={wf}
          step={s}
          isFirst={i === 0}
          isLast={i === wf.steps.length - 1}
          onChange={(fn) => changeStep(s.id, fn)}
          onMove={(dir) => moveStep(s.id, dir)}
          onDelete={() => deleteStep(s.id)}
        />
      ))}

      <Button variant="primary" onClick={addStep} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
        + {wf.steps.length === 0 ? 'Add the first step' : 'Then what? Add the next step'}
      </Button>
    </div>
  );
}
