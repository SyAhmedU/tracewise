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

      <Field label="Where does this happen? (optional)" hint="Team, department, or industry — gives the map some context. Skip if you like.">
        <TextArea
          value={wf.context}
          placeholder="e.g. “operations team at a logistics company”"
          onChange={(e) => update((d) => { d.context = e.target.value; })}
        />
      </Field>
    </Card>
  );
}
