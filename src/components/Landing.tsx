import { useEffect, useState } from 'react';
import { type Workflow, summarize } from '../lib/types';
import { SECTORS, type WorkedExample } from '../lib/examples';
import { Button } from '../ui';

export default function Landing({
  workflows, onNew, onOpen, onDelete, resumeAvailable, onResume, onLoadExample,
}: {
  workflows: Workflow[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  resumeAvailable: boolean;
  onResume: () => void;
  onLoadExample: (ex: WorkedExample) => void;
}) {
  // 'all' or a sector id. Default to the first sector so the page shows real
  // cards immediately while loading only ONE chunk, not the whole library.
  const [active, setActive] = useState<string>(SECTORS[0].id);
  const [cache, setCache] = useState<Record<string, WorkedExample[]>>({});
  const [loading, setLoading] = useState(false);

  // Lazy-load whatever the active filter needs, once.
  useEffect(() => {
    const targets = active === 'all' ? SECTORS : SECTORS.filter((s) => s.id === active);
    const missing = targets.filter((s) => !cache[s.id]);
    if (missing.length === 0) return;
    let cancelled = false;
    setLoading(true);
    Promise.all(missing.map((s) => s.load().then((arr) => [s.id, arr] as const)))
      .then((pairs) => { if (!cancelled) setCache((prev) => ({ ...prev, ...Object.fromEntries(pairs) })); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [active, cache]);

  const visible: WorkedExample[] = active === 'all'
    ? SECTORS.flatMap((s) => cache[s.id] ?? [])
    : (cache[active] ?? []);

  const allLoaded = SECTORS.every((s) => cache[s.id]);
  const totalLoaded = SECTORS.reduce((n, s) => n + (cache[s.id]?.length ?? 0), 0);

  const chips: { id: string; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: allLoaded ? totalLoaded : undefined },
    ...SECTORS.map((s) => ({ id: s.id, label: s.domain, count: cache[s.id]?.length })),
  ];

  return (
    <div style={{ textAlign: 'left' }}>
      {/* hero */}
      <div style={{ textAlign: 'center', padding: '36px 0 28px' }} className="tw-rise">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '.78rem', fontWeight: 600,
          color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
          borderRadius: 999, padding: '5px 13px', marginBottom: 20,
        }}>
          ✦ Ground truth before automation
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.1rem)', lineHeight: 1.08, letterSpacing: '-.025em', marginBottom: 16 }}>
          Map the work you <span style={{ background: 'var(--warm-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>actually</span> do.
        </h1>
        <p style={{ maxWidth: 560, margin: '0 auto 26px', color: 'var(--text-soft)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Not the SOP. Not the ideal. The real A→B→C→D you live every day. Capture it honestly, and you can finally
          aim AI and automation where they genuinely help — instead of bolting tools onto a process no one has ever written down.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={onNew} style={{ padding: '13px 24px', fontSize: '1rem' }}>
            Document a workflow →
          </Button>
          {resumeAvailable && (
            <Button variant="ghost" onClick={onResume} style={{ padding: '13px 24px', fontSize: '1rem' }}>
              ⟳ Resume where I left off
            </Button>
          )}
        </div>
      </div>

      {/* why */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '8px 0 36px' }}>
        {[
          ['🎯', 'Real, not ideal', 'We ask about the last time you did it — workarounds, shadow spreadsheets and all.'],
          ['🧩', 'Find the friction', 'Every step is tagged for waiting, rework, manual transfer and judgment calls.'],
          ['🤖', 'Then aim AI', 'A faithful map is the only honest place to decide where automation actually earns its keep.'],
        ].map(([icon, title, body]) => (
          <div key={title} style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{icon}</div>
            <div style={{ fontWeight: 700, color: 'var(--text-h)', marginBottom: 5 }}>{title}</div>
            <div style={{ fontSize: '.86rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>{body}</div>
          </div>
        ))}
      </div>

      {/* worked examples */}
      <div style={{ marginBottom: 36 }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Start from a worked example</h3>
        <p style={{ fontSize: '.86rem', color: 'var(--text-soft)', marginBottom: 14, lineHeight: 1.5 }}>
          Real operating-world workflows across {SECTORS.length} domains — food, retail, hospitality, professional services,
          healthcare, government, manufacturing, agriculture, logistics, IT services, ITES, SaaS and academia, mostly grounded
          in Tamil Nadu / India. Each card reads off the same capture: the ground-level dynamic the trace surfaces (its shadow
          steps, judgment calls and friction) and where AI actually fits because of it. Pick a domain to explore — they load on
          demand — then open one to see the method in action, edit it, or build your own.
        </p>
        {/* domain filter chips (static — render instantly; cards lazy-load on select) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {chips.map(({ id, label, count }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                style={{
                  font: 'inherit', cursor: 'pointer',
                  fontSize: '.74rem', fontWeight: 600,
                  color: isActive ? '#fff' : 'var(--text-soft)',
                  background: isActive ? 'var(--accent)' : 'var(--code-bg)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
                  borderRadius: 999, padding: '5px 13px', transition: 'background .12s',
                }}
              >
                {label}{count != null && <span style={{ opacity: 0.7 }}> {count}</span>}
              </button>
            );
          })}
        </div>

        {loading && visible.length === 0 ? (
          <div style={{ padding: '28px 0', textAlign: 'center', color: 'var(--text-soft)', fontSize: '.9rem' }}>
            Loading examples…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, opacity: loading ? 0.6 : 1, transition: 'opacity .15s' }}>
            {visible.map((ex) => (
              <button
                key={ex.key}
                onClick={() => onLoadExample(ex)}
                style={{
                  textAlign: 'left', cursor: 'pointer', font: 'inherit',
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
                  padding: 18, boxShadow: 'var(--shadow)', transition: 'transform .12s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.3rem' }}>{ex.emoji}</span>
                  <span style={{
                    fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em',
                    color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
                    borderRadius: 999, padding: '2px 9px',
                  }}>{ex.domain}</span>
                  {ex.region && (
                    <span style={{
                      fontSize: '.66rem', fontWeight: 600, letterSpacing: '.04em',
                      color: 'var(--text-soft)', background: 'var(--code-bg)', border: '1px solid var(--border-strong)',
                      borderRadius: 999, padding: '2px 9px',
                    }}>📍 {ex.region}</span>
                  )}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-h)', marginBottom: 5 }}>{ex.label}</div>
                <div style={{ fontSize: '.84rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>{ex.summary}</div>

                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{
                    fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em',
                    color: 'var(--text-soft)', marginBottom: 3,
                  }}>Ground-level dynamic</div>
                  <div style={{ fontSize: '.79rem', color: 'var(--text-soft)', lineHeight: 1.5, marginBottom: 10 }}>
                    {ex.behavioralContext}
                  </div>
                  <div style={{
                    fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em',
                    color: 'var(--accent)', marginBottom: 3,
                  }}>Where AI fits</div>
                  <div style={{ fontSize: '.79rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
                    {ex.fieldSpecificFit}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* saved */}
      {workflows.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Your captured workflows</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {workflows.map((wf) => {
              const s = summarize(wf);
              return (
                <div key={wf.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
                  padding: '16px 18px', boxShadow: 'var(--shadow)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-h)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {wf.outputName || 'Untitled workflow'}
                    </div>
                    <div style={{ fontSize: '.82rem', color: 'var(--text-soft)', marginTop: 3 }}>
                      {wf.role || '—'} · {s.totalSteps} steps · {s.handoffCount} handoffs
                      {s.shadowCount > 0 && <span style={{ color: 'var(--f-transfer)' }}> · {s.shadowCount} shadow</span>}
                      {' · '}{new Date(wf.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="soft" onClick={() => onOpen(wf.id)}>Open</Button>
                  <button
                    onClick={() => onDelete(wf.id)}
                    title="Delete"
                    style={{ border: 'none', background: 'transparent', color: 'var(--f-rework)', cursor: 'pointer', fontSize: '1rem', padding: 6 }}
                  >🗑</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* methodology footnote — theory under the hood */}
      <div style={{ marginTop: 40, paddingTop: 18, borderTop: '1px solid var(--border)', fontSize: '.76rem', color: 'var(--text-soft)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text)' }}>How this works.</strong> Tracewise is a lightweight cognitive task analysis. It captures
        work-as-done rather than work-as-imagined (Hollnagel, 2014), surfaces the articulation work that keeps processes running
        (Star &amp; Strauss, 1999), elicits it by anchoring on one real incident and probing — the Critical Decision Method (Klein
        et al., 1989) — and classifies friction with the Lean waste taxonomy (Ohno, 1988). That evidence is the prerequisite for
        deciding where automation actually fits (Goodhue &amp; Thompson, 1995), instead of bolting AI onto a process no one mapped.
      </div>
    </div>
  );
}
