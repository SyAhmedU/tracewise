import type { Workflow } from '../../lib/types';
import { Card, Field, TextInput, TextArea } from '../../ui';

export default function FrameStage({ wf, update }: { wf: Workflow; update: (fn: (d: Workflow) => void) => void }) {
  return (
    <Card>
      <Field label="Your role" hint="No need for your name — just what you do here (e.g. “admissions coordinator”, “QA analyst”).">
        <TextInput
          value={wf.role}
          placeholder="What is your role?"
          onChange={(e) => update((d) => { d.role = e.target.value; })}
        />
      </Field>

      <Field label="The one output you are documenting" hint="One recurring thing you are responsible for delivering — not your whole job. We trace this end to end.">
        <TextInput
          value={wf.outputName}
          placeholder="e.g. “the weekly sales report”, “onboarding a new client”, “a processed refund”"
          onChange={(e) => update((d) => { d.outputName = e.target.value; })}
        />
      </Field>

      <Field
        label="How many people do this role? (optional)"
        hint="Just this role — how many of you do this same job. Defaults to 1. We use it later to stress-test what breaks first if the work has to scale up."
      >
        <TextInput
          type="number"
          min={1}
          value={wf.headcount ?? 1}
          style={{ maxWidth: 140 }}
          onChange={(e) => update((d) => {
            const n = parseInt(e.target.value, 10);
            d.headcount = Number.isFinite(n) && n > 0 ? n : 1;
          })}
        />
      </Field>

      <Field label="Where does this happen? (optional)" hint="Team, department, or industry — gives the map some context. Skip if you like.">
        <TextArea
          value={wf.context}
          placeholder="e.g. “operations team at a logistics company”"
          onChange={(e) => update((d) => { d.context = e.target.value; })}
        />
      </Field>

      <Field
        label="Is there an official version? (optional)"
        hint="The SOP, the process doc, “how it’s supposed to work”. We won’t follow it — we capture it only to see how far reality has drifted from it."
      >
        <TextArea
          value={wf.officialVersion}
          placeholder="e.g. “The manual says: log it, verify, approve within 5 days.” Or “there’s no written process.”"
          onChange={(e) => update((d) => { d.officialVersion = e.target.value; })}
        />
      </Field>
    </Card>
  );
}
