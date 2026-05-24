import { type Workflow, type HandoffDirection, newHandoff } from '../../lib/types';
import { Card, Field, TextInput, Button } from '../../ui';

export default function HandoffsStage({ wf, update }: { wf: Workflow; update: (fn: (d: Workflow) => void) => void }) {
  const add = (direction: HandoffDirection) => update((d) => { d.handoffs.push(newHandoff(direction)); });
  const change = (id: string, fn: (h: Workflow['handoffs'][number]) => void) => update((d) => {
    const h = d.handoffs.find((x) => x.id === id); if (h) fn(h);
  });
  const remove = (id: string) => update((d) => { d.handoffs = d.handoffs.filter((x) => x.id !== id); });

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: 'var(--text)', fontSize: '.92rem', lineHeight: 1.6 }}>
          Add the people or teams in this flow. <strong style={{ color: 'var(--text-h)' }}>Waiting</strong> is invisible on a
          step list but it is often the biggest delay — capture it here.
        </p>
      </Card>

      {wf.handoffs.map((h) => (
        <div key={h.id} className="tw-rise" style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
          boxShadow: 'var(--shadow)', padding: 18, marginBottom: 14, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button
              onClick={() => change(h.id, (x) => { x.direction = 'wait-on'; })}
              style={dirBtn(h.direction === 'wait-on')}
            >⏳ I wait on them</button>
            <button
              onClick={() => change(h.id, (x) => { x.direction = 'hand-to'; })}
              style={dirBtn(h.direction === 'hand-to')}
            >➡️ I hand to them</button>
            <button onClick={() => remove(h.id)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: 'var(--f-rework)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label={h.direction === 'wait-on' ? 'Who do you wait on?' : 'Who do you hand to?'}>
              <TextInput value={h.who} placeholder="Person / team" onChange={(e) => change(h.id, (x) => { x.who = e.target.value; })} />
            </Field>
            <Field label={h.direction === 'wait-on' ? 'What are you waiting for?' : 'What do you hand over?'}>
              <TextInput value={h.what} placeholder="The thing passed / awaited" onChange={(e) => change(h.id, (x) => { x.what = e.target.value; })} />
            </Field>
          </div>
          <Field label="How long does that usually take?">
            <TextInput value={h.typicalDelay} placeholder="e.g. “usually a day, sometimes a week”" onChange={(e) => change(h.id, (x) => { x.typicalDelay = e.target.value; })} />
          </Field>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="soft" onClick={() => add('wait-on')} style={{ flex: 1, justifyContent: 'center' }}>+ Someone I wait on</Button>
        <Button variant="soft" onClick={() => add('hand-to')} style={{ flex: 1, justifyContent: 'center' }}>+ Someone I hand to</Button>
      </div>
    </div>
  );
}

function dirBtn(active: boolean): React.CSSProperties {
  return {
    fontSize: '.82rem', fontWeight: 600, padding: '7px 13px', borderRadius: 999, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-strong)'}`,
    background: active ? 'var(--accent-bg)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text)',
  };
}
