import { useState } from 'react';
import {
  type Step, type Workflow, type FrictionTag, type Frequency,
  FRICTION_TAGS, FREQUENCIES,
} from '../lib/types';
import { TOOL_SUGGESTIONS, SOURCE_SUGGESTIONS, STEP_FIELD_PROMPTS } from '../lib/questions';
import { buildContext, fetchProbes } from '../lib/probe';
import { Field, TextInput, TextArea, ChipRow, Button } from '../ui';

const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

export default function StepEditor({
  wf, step, isFirst, isLast, onChange, onMove, onDelete,
}: {
  wf: Workflow;
  step: Step;
  isFirst: boolean;
  isLast: boolean;
  onChange: (fn: (s: Step) => void) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const [probes, setProbes] = useState<string[]>([]);
  const [probeSrc, setProbeSrc] = useState<'ai' | 'offline' | null>(null);
  const [loading, setLoading] = useState(false);

  const dig = async () => {
    setLoading(true);
    const { probes: p, source } = await fetchProbes(buildContext(wf, step));
    setProbes(p);
    setProbeSrc(source);
    setLoading(false);
  };

  const toggleTag = (t: FrictionTag) => onChange((s) => {
    s.frictionTags = s.frictionTags.includes(t)
      ? s.frictionTags.filter((x) => x !== t)
      : [...s.frictionTags, t];
  });

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${step.isShadow ? 'var(--f-transfer)' : 'var(--accent-border)'}`,
      borderRadius: 14,
      boxShadow: 'var(--shadow)',
      padding: 20,
      marginBottom: 16,
      textAlign: 'left',
    }} className="tw-rise">
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: 'var(--warm-grad)', color: '#fff', fontWeight: 800, fontSize: '.85rem',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{step.order}</span>
        <strong style={{ fontSize: '.92rem', color: 'var(--text-h)' }}>
          {step.action.trim() || `Step ${step.order}`}
        </strong>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button title="Move up" disabled={isFirst} onClick={() => onMove(-1)} style={iconBtn(isFirst)}>↑</button>
          <button title="Move down" disabled={isLast} onClick={() => onMove(1)} style={iconBtn(isLast)}>↓</button>
          <button title="Delete step" onClick={onDelete} style={{ ...iconBtn(false), color: 'var(--f-rework)' }}>✕</button>
        </div>
      </div>

      <Field label={STEP_FIELD_PROMPTS.action}>
        <TextArea
          value={step.action}
          placeholder="What you literally do…"
          onChange={(e) => onChange((s) => { s.action = e.target.value; })}
          style={{ minHeight: 56 }}
        />
      </Field>

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

      {/* time + frequency */}
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

      {/* friction tags */}
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

      {/* shadow toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 14, fontSize: '.85rem', color: 'var(--text)' }}>
        <input
          type="checkbox"
          checked={step.isShadow}
          onChange={(e) => onChange((s) => { s.isShadow = e.target.checked; })}
          style={{ width: 17, height: 17, accentColor: 'var(--f-transfer)' }}
        />
        This is a <strong style={{ color: 'var(--f-transfer)' }}>shadow step</strong> — unofficial, but I couldn't do my job without it.
      </label>

      <Field label={STEP_FIELD_PROMPTS.notes}>
        <TextArea
          value={step.notes}
          placeholder="The workaround, the annoyance, the “I just know to…”"
          onChange={(e) => onChange((s) => { s.notes = e.target.value; })}
          style={{ minHeight: 50 }}
        />
      </Field>

      {/* AI probes */}
      <div style={{ marginTop: 6, paddingTop: 14, borderTop: '1px dashed var(--border)' }}>
        <Button variant="soft" onClick={dig} disabled={loading || !step.action.trim()} style={{ fontSize: '.83rem' }}>
          {loading ? 'Thinking…' : '🔍 Dig deeper into this step'}
        </Button>
        {probes.length > 0 && (
          <div style={{ marginTop: 12 }} className="tw-fade">
            <div style={{ fontSize: '.74rem', color: 'var(--text-soft)', marginBottom: 7 }}>
              {probeSrc === 'ai' ? 'Follow-ups to consider:' : 'Follow-ups to consider (offline):'}
            </div>
            {probes.map((p, i) => (
              <div key={i} style={{
                fontSize: '.85rem', color: 'var(--text-h)', background: 'var(--accent-bg)',
                border: '1px solid var(--accent-border)', borderRadius: 10, padding: '10px 13px', marginBottom: 8,
                lineHeight: 1.5,
              }}>
                {p}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function iconBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border-strong)',
    background: 'transparent', color: 'var(--text)', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .35 : 1, fontSize: '.9rem', lineHeight: 1,
  };
}
