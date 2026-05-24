import { type Workflow, type FrictionTag, FRICTION_TAGS, summarize } from '../../lib/types';
import { exportJson, exportMarkdown } from '../../lib/export';
import { Button, Pill } from '../../ui';

const tagMeta = (t: FrictionTag) => FRICTION_TAGS.find((x) => x.id === t)!;

export default function ReviewStage({ wf }: { wf: Workflow }) {
  const s = summarize(wf);
  const activeTags = (Object.entries(s.tagCounts) as [FrictionTag, number][]).filter(([, n]) => n > 0);

  return (
    <div className="print-doc">
      {/* ---- the as-is map ---- */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        boxShadow: 'var(--shadow)', padding: 24, marginBottom: 20, textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.15rem' }}>{wf.outputName || 'Your workflow'}</h3>
          <span style={{ fontSize: '.8rem', color: 'var(--text-soft)' }}>{wf.role}</span>
        </div>

        {/* trigger */}
        <Node kind="trigger" label="Triggered by" text={wf.trigger || '—'} />
        <Connector />

        {wf.steps.map((st, i) => (
          <div key={st.id}>
            <div style={{
              display: 'flex', gap: 13, alignItems: 'flex-start',
              background: st.isShadow ? 'color-mix(in srgb, var(--f-transfer) 7%, var(--bg))' : 'var(--bg)',
              border: `1px solid ${st.isShadow ? 'color-mix(in srgb, var(--f-transfer) 35%, transparent)' : 'var(--border)'}`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <span style={{
                width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: 'var(--warm-grad)',
                color: '#fff', fontWeight: 800, fontSize: '.82rem',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{st.order}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: 3 }}>
                  {st.action || '(unnamed step)'}
                  {st.isShadow && <span style={{ marginLeft: 8, fontSize: '.7rem', color: 'var(--f-transfer)', fontWeight: 700 }}>SHADOW</span>}
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--text-soft)' }}>
                  {st.tool && <span>via <strong style={{ color: 'var(--text)' }}>{st.tool}</strong></span>}
                  {st.outputDestination && <span> → {st.outputDestination}</span>}
                  {st.timeMins != null && <span> · {st.timeMins} min</span>}
                </div>
                {st.frictionTags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {st.frictionTags.map((t) => {
                      const m = tagMeta(t);
                      return <Pill key={t} color={m.color}>{m.label}</Pill>;
                    })}
                  </div>
                )}
              </div>
            </div>
            {i < wf.steps.length - 1 && <Connector />}
          </div>
        ))}

        {wf.steps.length === 0 && <p style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>No steps captured yet.</p>}

        <Connector />
        <Node kind="done" label="Output delivered" text={wf.outputName || 'done'} />

        {/* handoffs */}
        {wf.handoffs.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <h4 style={{ fontFamily: 'var(--heading)', fontSize: '.9rem', color: 'var(--text-soft)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Handoffs & waiting</h4>
            {wf.handoffs.map((h) => (
              <div key={h.id} style={{ fontSize: '.86rem', color: 'var(--text)', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--text-h)' }}>{h.direction === 'wait-on' ? '⏳ Waits on' : '➡️ Hands to'} {h.who || '—'}</strong>
                {h.what && <span> — {h.what}</span>}
                {h.typicalDelay && <span style={{ color: 'var(--text-soft)' }}> ({h.typicalDelay})</span>}
              </div>
            ))}
          </div>
        )}

        {/* exceptions */}
        {wf.exceptions.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <h4 style={{ fontFamily: 'var(--heading)', fontSize: '.9rem', color: 'var(--text-soft)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>When it breaks</h4>
            {wf.exceptions.map((ex) => (
              <div key={ex.id} style={{ fontSize: '.86rem', color: 'var(--text)', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--f-rework)' }}>{ex.trigger || '—'}</strong> → {ex.whatYouDo || '—'}
                {ex.howOften && <span style={{ color: 'var(--text-soft)' }}> ({ex.howOften})</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- friction summary (counts only — v2 turns these into AI opportunities) ---- */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        boxShadow: 'var(--shadow)', padding: 24, marginBottom: 20, textAlign: 'left',
      }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Friction summary</h3>
        <p style={{ fontSize: '.82rem', color: 'var(--text-soft)', marginBottom: 18 }}>
          A snapshot of where effort and waiting live. Tracewise does not recommend tools yet — it shows you the ground truth first.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: activeTags.length ? 20 : 0 }}>
          <Stat n={s.totalSteps} label="steps" />
          <Stat n={s.totalMinutes} label="min hands-on" />
          <Stat n={s.toolCount} label="tools" sub={`${s.toolSwitches} switches`} />
          <Stat n={s.handoffCount} label="handoffs" />
          <Stat n={s.shadowCount} label="shadow steps" accent={s.shadowCount > 0} />
        </div>
        {activeTags.length > 0 && (
          <div>
            <div style={{ fontSize: '.78rem', color: 'var(--text-soft)', marginBottom: 10 }}>Friction flags raised:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeTags.sort((a, b) => b[1] - a[1]).map(([t, n]) => {
                const m = tagMeta(t);
                const max = Math.max(...activeTags.map(([, c]) => c));
                return (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 110, fontSize: '.8rem', color: 'var(--text)', flexShrink: 0 }}>{m.label}</span>
                    <div style={{ flex: 1, height: 8, background: 'var(--code-bg)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${(n / max) * 100}%`, height: '100%', background: m.color, borderRadius: 999 }} />
                    </div>
                    <span style={{ width: 22, textAlign: 'right', fontSize: '.8rem', fontWeight: 700, color: m.color }}>{n}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ---- exports ---- */}
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Button variant="primary" onClick={() => window.print()}>🖨️ Print / PDF</Button>
        <Button variant="soft" onClick={() => exportMarkdown(wf)}>↓ Markdown</Button>
        <Button variant="soft" onClick={() => exportJson(wf)}>↓ JSON</Button>
      </div>
    </div>
  );
}

function Stat({ n, label, sub, accent }: { n: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: accent ? 'var(--f-transfer)' : 'var(--text-h)', fontFamily: 'var(--heading)', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: '.76rem', color: 'var(--text-soft)', marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontSize: '.68rem', color: 'var(--text-soft)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Node({ kind, label, text }: { kind: 'trigger' | 'done'; label: string; text: string }) {
  const color = kind === 'trigger' ? 'var(--accent-2)' : 'var(--f-lookup)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      border: `1.5px dashed color-mix(in srgb, ${color} 50%, transparent)`,
      background: `color-mix(in srgb, ${color} 8%, var(--bg))`,
      borderRadius: 12, padding: '12px 16px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>{kind === 'trigger' ? '▶' : '✓'}</span>
      <div>
        <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.06em', color, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: '.9rem', color: 'var(--text-h)' }}>{text}</div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <div style={{ width: 2, height: 18, background: 'var(--border-strong)' }} />
    </div>
  );
}
