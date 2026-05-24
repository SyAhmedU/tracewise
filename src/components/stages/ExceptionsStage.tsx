import { type Workflow, newException } from '../../lib/types';
import { Card, Field, TextInput, TextArea, Button } from '../../ui';

export default function ExceptionsStage({ wf, update }: { wf: Workflow; update: (fn: (d: Workflow) => void) => void }) {
  const add = () => update((d) => { d.exceptions.push(newException()); });
  const change = (id: string, fn: (e: Workflow['exceptions'][number]) => void) => update((d) => {
    const e = d.exceptions.find((x) => x.id === id); if (e) fn(e);
  });
  const remove = (id: string) => update((d) => { d.exceptions = d.exceptions.filter((x) => x.id !== id); });

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: 'var(--text)', fontSize: '.92rem', lineHeight: 1.6 }}>
          When the happy path doesn't happen — missing data, a rejection, a system down — what do you
          <strong style={{ color: 'var(--text-h)' }}> actually do</strong>? These workarounds are gold.
        </p>
      </Card>

      {wf.exceptions.map((ex) => (
        <div key={ex.id} className="tw-rise" style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderLeft: '3px solid var(--f-rework)', borderRadius: 14,
          boxShadow: 'var(--shadow)', padding: 18, marginBottom: 14, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => remove(ex.id)} style={{ border: 'none', background: 'transparent', color: 'var(--f-rework)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          </div>
          <Field label="What goes wrong?">
            <TextInput value={ex.trigger} placeholder="e.g. “the figures from finance arrive late”" onChange={(e) => change(ex.id, (x) => { x.trigger = e.target.value; })} />
          </Field>
          <Field label="What do you actually do about it?">
            <TextArea value={ex.whatYouDo} placeholder="Your real workaround" onChange={(e) => change(ex.id, (x) => { x.whatYouDo = e.target.value; })} style={{ minHeight: 56 }} />
          </Field>
          <Field label="How often does this happen?">
            <TextInput value={ex.howOften} placeholder="e.g. “maybe once a fortnight”" onChange={(e) => change(ex.id, (x) => { x.howOften = e.target.value; })} />
          </Field>
        </div>
      ))}

      <Button variant="soft" onClick={add} style={{ width: '100%', justifyContent: 'center' }}>+ Add something that goes wrong</Button>
    </div>
  );
}
