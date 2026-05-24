import type { Workflow } from '../../lib/types';
import { TRIGGER_SUGGESTIONS } from '../../lib/questions';
import { Card, Field, TextArea, ChipRow } from '../../ui';

export default function TriggerStage({ wf, update }: { wf: Workflow; update: (fn: (d: Workflow) => void) => void }) {
  const append = (text: string) => update((d) => {
    d.trigger = d.trigger.trim() ? `${d.trigger.trim()} — ${text}` : text;
  });

  return (
    <Card>
      <Field
        label={`What actually starts "${wf.outputName || 'this work'}"?`}
        hint="The real signal — not the calendar ideal. The thing that makes you go “right, I need to do this now”."
      >
        <TextArea
          value={wf.trigger}
          placeholder="e.g. “a teammate pings me on WhatsApp asking where the numbers are”"
          onChange={(e) => update((d) => { d.trigger = e.target.value; })}
          style={{ minHeight: 90 }}
        />
      </Field>
      <div style={{ fontSize: '.78rem', color: 'var(--text-soft)', marginBottom: 8 }}>Common triggers — tap to add:</div>
      <ChipRow options={TRIGGER_SUGGESTIONS} onPick={append} />
    </Card>
  );
}
