import { useState } from 'react';
import { type Workflow, type Step, newStep } from '../../lib/types';
import { Button, TextInput } from '../../ui';
import StepEditor from '../StepEditor';

export default function StepsStage({ wf, update }: { wf: Workflow; update: (fn: (d: Workflow) => void) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [focusId, setFocusId] = useState<string | null>(null);

  const reorder = (steps: Step[]) => steps.map((s, i) => ({ ...s, order: i + 1 }));

  const addStep = () => {
    const s = newStep(wf.steps.length + 1);
    update((d) => { d.steps = reorder([...d.steps, s]); });
    setFocusId(s.id);
  };

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

  const toggleExpand = (id: string) => setExpanded((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div>
      {/* #2 — anchor on a concrete recent instance */}
      <div style={{
        background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 14,
        padding: '16px 18px', marginBottom: 18, textAlign: 'left',
      }}>
        <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text-h)', marginBottom: 4 }}>
          Pin the last real time you did this.
        </div>
        <div style={{ fontSize: '.84rem', color: 'var(--text)', marginBottom: 10, lineHeight: 1.5 }}>
          Don't describe the usual way — recall <em>one specific time</em> you produced “{wf.outputName || 'this'}”. When was it?
        </div>
        <TextInput
          value={wf.instanceAnchor}
          placeholder="e.g. “last Tuesday morning”, “the Acme order yesterday”"
          onChange={(e) => update((d) => { d.instanceAnchor = e.target.value; })}
        />
      </div>

      {wf.steps.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '32px 24px', color: 'var(--text-soft)',
          border: '1.5px dashed var(--border-strong)', borderRadius: 16, marginBottom: 16, background: 'var(--surface)',
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🧭</div>
          <p style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: 4 }}>Lay down the spine first.</p>
          <p style={{ fontSize: '.88rem' }}>Type each thing you did as a quick line — “then what? then what?” — until it's handed off or done. Add detail later only where it matters.</p>
        </div>
      )}

      {wf.steps.map((s, i) => {
        const open = expanded.has(s.id);
        return (
          <div key={s.id} className="tw-rise" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${s.isPainful ? 'var(--f-rework)' : s.isShadow ? 'var(--f-transfer)' : 'var(--accent-border)'}`,
            borderRadius: 12, boxShadow: 'var(--shadow)', padding: '12px 14px', marginBottom: 10, textAlign: 'left',
          }}>
            {/* skeleton row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 26, height: 26, flexShrink: 0, borderRadius: 8, background: 'var(--warm-grad)',
                color: '#fff', fontWeight: 800, fontSize: '.78rem',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.order}</span>

              <input
                autoFocus={focusId === s.id}
                value={s.action}
                placeholder="What did you do?"
                onChange={(e) => changeStep(s.id, (st) => { st.action = e.target.value; })}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStep(); } }}
                style={{
                  flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none',
                  color: 'var(--text-h)', fontSize: '.95rem', fontWeight: 500, padding: '4px 0',
                }}
              />

              <button
                title={s.isPainful ? 'Marked as the step you dread' : 'Mark the step you dread most'}
                onClick={() => changeStep(s.id, (st) => { st.isPainful = !st.isPainful; })}
                style={{
                  ...miniBtn, fontSize: '1rem',
                  filter: s.isPainful ? 'none' : 'grayscale(1) opacity(.45)',
                }}
              >😖</button>
              <button title="Move up" disabled={i === 0} onClick={() => moveStep(s.id, -1)} style={miniBtn}>↑</button>
              <button title="Move down" disabled={i === wf.steps.length - 1} onClick={() => moveStep(s.id, 1)} style={miniBtn}>↓</button>
              <button
                title={open ? 'Hide detail' : 'Add detail (tool, friction, timing…)'}
                onClick={() => toggleExpand(s.id)}
                style={{ ...miniBtn, color: open ? 'var(--accent)' : 'var(--text)' }}
              >{open ? '⌃' : '⌄'}</button>
              <button title="Delete step" onClick={() => { deleteStep(s.id); setExpanded((p) => { const n = new Set(p); n.delete(s.id); return n; }); }} style={{ ...miniBtn, color: 'var(--f-rework)' }}>✕</button>
            </div>

            {/* collapsed detail hint */}
            {!open && (s.tool || s.frictionTags.length > 0 || s.isShadow) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingLeft: 36, fontSize: '.74rem', color: 'var(--text-soft)' }}>
                {s.tool && <span>via {s.tool}</span>}
                {s.frictionTags.length > 0 && <span>· {s.frictionTags.length} friction flag{s.frictionTags.length > 1 ? 's' : ''}</span>}
                {s.isShadow && <span style={{ color: 'var(--f-transfer)' }}>· shadow</span>}
              </div>
            )}

            {open && <StepEditor wf={wf} step={s} onChange={(fn) => changeStep(s.id, fn)} />}
          </div>
        );
      })}

      <Button variant="primary" onClick={addStep} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
        + {wf.steps.length === 0 ? 'Add the first thing you did' : 'Then what? Add the next step'}
      </Button>

      {wf.steps.length > 0 && (
        <p style={{ fontSize: '.78rem', color: 'var(--text-soft)', marginTop: 12, textAlign: 'center' }}>
          Tip: press <strong>Enter</strong> to add the next step · tap <strong>⌄</strong> to enrich a step · tap <strong>😖</strong> on the one you dread most.
        </p>
      )}
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  width: 28, height: 28, flexShrink: 0, borderRadius: 7, border: '1px solid var(--border)',
  background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '.85rem', lineHeight: 1,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};
