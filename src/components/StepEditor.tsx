import { useEffect, useRef, useState } from 'react';
import {
  type Step, type Workflow, type FrictionTag, type Frequency,
  FRICTION_TAGS, FREQUENCIES,
} from '../lib/types';
import { TOOL_SUGGESTIONS, SOURCE_SUGGESTIONS, STEP_FIELD_PROMPTS } from '../lib/questions';
import { buildContext, fetchProbes } from '../lib/probe';
import { Field, TextInput, TextArea, ChipRow } from '../ui';

const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

// Detail panel for one step. The step's `action` lives in the skeleton row above;
// this panel enriches everything else. Probes load proactively on open.
export default function StepEditor({
  wf, step, onChange,
}: {
  wf: Workflow;
  step: Step;
  onChange: (fn: (s: Step) => void) => void;
}) {
  const [probes, setProbes] = useState<string[]>([]);
  const [probeSrc, setProbeSrc] = useState<'ai' | 'offline' | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedFor = useRef<string>('');

  const dig = async () => {
    setLoading(true);
    const { probes: p, source } = await fetchProbes(buildContext(wf, step));
    setProbes(p);
    setProbeSrc(source);
    setLoading(false);
  };

  // Proactive: fetch follow-ups automatically the first time this step is opened
  // with a real action, so the hidden work surfaces without anyone pressing a button.
  useEffect(() => {
    if (step.action.trim() && fetchedFor.current !== step.id) {
      fetchedFor.current = step.id;
      void dig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  const toggleTag = (t: FrictionTag) => onChange((s) => {
    s.frictionTags = s.frictionTags.includes(t)
      ? s.frictionTags.filter((x) => x !== t)
      : [...s.frictionTags, t];
  });

  return (
    <div style={{ paddingTop: 14, marginTop: 4, borderTop: '1px dashed var(--border)' }}>
      <Field label={STEP_FIELD_PROMPTS.tool}>
        <TextInput
          value={step.tool}
          placeholder="App, system, or “by hand”"
          onChange={(e) => onChange((s) => { s.tool = e.target.value; })}
        />
        <div style={{ marginTop: 8 }}>
          <ChipRow options={TOOL_SUGGESTIONS} onPick={(v) => onChange((s) => { s.tool = v; })} active={(v) => step.tool === v} />
        </div>
      </Field>

      <div style={rowStyle}>
        <Field label={STEP_FIELD_PROMPTS.inputWhat}>
          <TextInput value={step.inputWhat} placeholder="What you need first" onChange={(e) => onChange((s) => { s.inputWhat = e.target.value; })} />
        </Field>
        <Field label={STEP_FIELD_PROMPTS.inputSource}>
          <TextInput value={step.inputSource} placeholder="Where it comes from" onChange={(e) => onChange((s) => { s.inputSource = e.target.value; })} />
        </Field>
      </div>
      <div style={{ marginTop: -8, marginBottom: 14 }}>
        <ChipRow options={SOURCE_SUGGESTIONS} onPick={(v) => onChange((s) => { s.inputSource = v; })} active={(v) => step.inputSource === v} />
      </div>

      <div style={rowStyle}>
        <Field label={STEP_FIELD_PROMPTS.outputWhat}>
          <TextInput value={step.outputWhat} placeholder="What you produced" onChange={(e) => onChange((s) => { s.outputWhat = e.target.value; })} />
        </Field>
        <Field label={STEP_FIELD_PROMPTS.outputDestination}>
          <TextInput value={step.outputDestination} placeholder="Who/what gets it next" onChange={(e) => onChange((s) => { s.outputDestination = e.target.value; })} />
        </Field>
      </div>

      <div style={{ ...rowStyle, marginBottom: 14 }}>
        <Field label="Roughly how long? (minutes)">
          <TextInput
            type="number" min={0} inputMode="numeric"
            value={step.timeMins ?? ''}
            placeholder="e.g. 15"
            onChange={(e) => onChange((s) => { s.timeMins = e.target.value === '' ? null : Math.max(0, Number(e.target.value)); })}
          />
        </Field>
        <Field label="How often does this step happen?">
          <select
            value={step.frequency ?? ''}
            onChange={(e) => onChange((s) => { s.frequency = (e.target.value || null) as Frequency | null; })}
            style={{
              width: '100%', background: 'var(--bg)', border: '1px solid var(--border-strong)',
              borderRadius: 10, padding: '11px 13px', color: 'var(--text-h)',
            }}
          >
            <option value="">Select…</option>
            {FREQUENCIES.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: 8 }}>
          What is the friction here? (tap any that apply)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {FRICTION_TAGS.map((t) => {
            const on = step.frictionTags.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                title={t.hint}
                onClick={() => toggleTag(t.id)}
                style={{
                  fontSize: '.78rem', fontWeight: 600, padding: '6px 11px', borderRadius: 999, cursor: 'pointer',
                  border: `1px solid ${on ? t.color : 'var(--border-strong)'}`,
                  background: on ? `color-mix(in srgb, ${t.color} 16%, transparent)` : 'transparent',
                  color: on ? t.color : 'var(--text)',
                  transition: 'all .12s',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 10, fontSize: '.85rem', color: 'var(--text)' }}>
        <input
          type="checkbox"
          checked={step.isShadow}
          onChange={(e) => onChange((s) => { s.isShadow = e.target.checked; })}
          style={{ width: 17, height: 17, accentColor: 'var(--f-transfer)' }}
        />
        <span><strong style={{ color: 'var(--f-transfer)' }}>Shadow step</strong> — unofficial, but I couldn't do my job without it <span title="Articulation work — the invisible work that makes formal processes function (Star & Strauss, 1999)" style={{ cursor: 'help', opacity: .6 }}>ⓘ</span></span>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 14, fontSize: '.85rem', color: 'var(--text)' }}>
        <input
          type="checkbox"
          checked={step.needsJudgment}
          onChange={(e) => onChange((s) => { s.needsJudgment = e.target.checked; })}
          style={{ width: 17, height: 17, accentColor: 'var(--f-judgment)' }}
        />
        <span><strong style={{ color: 'var(--f-judgment)' }}>Needs human judgment</strong> — a real decision using context or experience <span title="Function allocation: judgment-heavy work is value to preserve, not waste to automate (Parasuraman, Sheridan & Wickens, 2000)" style={{ cursor: 'help', opacity: .6 }}>ⓘ</span></span>
      </label>

      <Field label={STEP_FIELD_PROMPTS.notes}>
        <TextArea
          value={step.notes}
          placeholder="The workaround, the annoyance, the “I just know to…”"
          onChange={(e) => onChange((s) => { s.notes = e.target.value; })}
          style={{ minHeight: 50 }}
        />
      </Field>

      {/* Proactive AI probes */}
      <div style={{ marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: probes.length || loading ? 10 : 0 }}>
          <span style={{ fontSize: '.74rem', color: 'var(--text-soft)' }}>
            {loading ? 'Looking for hidden work…' : probes.length ? (probeSrc === 'ai' ? 'Follow-ups worth answering:' : 'Follow-ups worth answering (offline):') : ''}
          </span>
          <button
            type="button"
            onClick={dig}
            disabled={loading || !step.action.trim()}
            title="Get fresh follow-ups"
            style={{
              marginLeft: 'auto', fontSize: '.74rem', fontWeight: 600, padding: '4px 10px', borderRadius: 999,
              border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text)',
              cursor: loading ? 'default' : 'pointer', opacity: loading || !step.action.trim() ? .5 : 1,
            }}
          >↻ probe</button>
        </div>
        {probes.map((p, i) => (
          <div key={i} className="tw-fade" style={{
            fontSize: '.85rem', color: 'var(--text-h)', background: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)', borderRadius: 10, padding: '10px 13px', marginBottom: 8, lineHeight: 1.5,
          }}>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
