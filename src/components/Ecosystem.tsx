// v3 Ecosystem view. Stitches the saved per-role captures into one connected
// map and runs the "what breaks first at 10-15x?" stress test live on a slider.
// Read-only over ground truth: edges come only from confirmed handoff links,
// unmapped dependencies show as blind spots, never invented nodes.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Workflow } from '../lib/types';
import {
  buildEcosystem, breaksFirst, roleStateAt, STATE_COLOR,
  CONSTRAINT_LABEL, analyzeLoops, edgeSignAt, EDGE_SIGN_COLOR,
  type RoleNode, type FindingSeverity, type EdgeSign,
} from '../lib/ecosystem';
import { Button, Card } from '../ui';

interface SimNode extends RoleNode { x: number; y: number; vx: number; vy: number; }

const SEV_COLOR: Record<FindingSeverity, string> = { risk: '#c0392b', warn: '#FF9656', info: 'var(--accent)' };

export default function Ecosystem({
  workflows, onBack, onLink, onOpen,
}: {
  workflows: Workflow[];
  onBack: () => void;
  onLink: (workflowId: string, handoffId: string, targetId: string | null) => void;
  onOpen: (id: string) => void;
}) {
  const [mult, setMult] = useState(10);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const eco = useMemo(() => buildEcosystem(workflows), [workflows]);
  const ranked = useMemo(() => breaksFirst(eco.nodes), [eco.nodes]);
  const maxDemand = useMemo(() => Math.max(1, ...eco.nodes.map((n) => n.demandWeeklyMin)), [eco.nodes]);
  const nodeById = useMemo(() => new Map(eco.nodes.map((n) => [n.id, n])), [eco.nodes]);

  // reinforcing-loop layer — recomputed live as the slider moves
  const loops = useMemo(() => analyzeLoops(eco, mult), [eco, mult]);
  const viciousLoops = useMemo(() => loops.filter((l) => l.reinforcing), [loops]);
  const viciousEdgeIds = useMemo(() => {
    const s = new Set<string>();
    for (const l of viciousLoops) for (const e of l.edges) s.add(e.handoffId);
    return s;
  }, [viciousLoops]);
  const leverageEdgeIds = useMemo(() => {
    const s = new Set<string>();
    for (const l of viciousLoops) if (l.leverageEdge) s.add(l.leverageEdge.handoffId);
    return s;
  }, [viciousLoops]);

  // ---- force-directed layout (pure React, no d3 — mirrors theoryscope's map) ----
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [, tick] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  const sim = useMemo<SimNode[]>(() => {
    const N = eco.nodes.length || 1;
    const r = 200;
    return eco.nodes.map((n, i) => ({
      ...n,
      x: r * Math.cos((i / N) * 2 * Math.PI),
      y: r * Math.sin((i / N) * 2 * Math.PI),
      vx: 0, vy: 0,
    }));
    // re-seed only when the set of roles changes, not when the slider moves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eco.nodes.map((n) => n.id).join('|')]);

  useEffect(() => {
    const idMap = new Map(sim.map((n) => [n.id, n]));
    const REPULSE = 16000, SPRING = 0.02, SPRING_LEN = 130, DAMP = 0.82;
    let stop = false, frame = 0;
    function step() {
      for (const a of sim) {
        let fx = 0, fy = 0;
        for (const b of sim) {
          if (a === b) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy + 30;
          const f = REPULSE / d2;
          fx += (dx / Math.sqrt(d2)) * f;
          fy += (dy / Math.sqrt(d2)) * f;
        }
        fx += -a.x * 0.006; fy += -a.y * 0.006;
        a.vx = (a.vx + fx * 0.0008) * DAMP;
        a.vy = (a.vy + fy * 0.0008) * DAMP;
      }
      for (const e of eco.edges) {
        const a = idMap.get(e.fromId), b = idMap.get(e.toId);
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - SPRING_LEN) * SPRING;
        const ux = dx / d, uy = dy / d;
        a.vx += ux * f; a.vy += uy * f; b.vx -= ux * f; b.vy -= uy * f;
      }
      for (const a of sim) { a.x += a.vx; a.y += a.vy; }
      tick((t) => t + 1);
    }
    function loop() { if (stop) return; step(); if (++frame < 220) requestAnimationFrame(loop); }
    loop();
    return () => { stop = true; };
  }, [sim, eco.edges]);

  const W = 1000, H = 560;
  const radius = (n: RoleNode) => 8 + 18 * Math.sqrt(n.demandWeeklyMin / maxDemand);

  const visibleSuggestions = eco.suggestions.filter((s) => !dismissed.has(s.handoffId));
  const firstToBreak = ranked.find((n) => isFinite(n.breaksAt));

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <span style={{ marginLeft: 'auto', fontSize: '.78rem', color: 'var(--text-soft)' }}>
          {eco.nodes.length} roles · {eco.edges.length} confirmed handoffs
        </span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '.76rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>
          The ecosystem · stress test
        </div>
        <h2 style={{ fontSize: '1.55rem', lineHeight: 1.2, letterSpacing: '-.01em', marginBottom: 8 }}>
          If this had to grow {mult}× in 18 months, what breaks first?
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: '.95rem', lineHeight: 1.55 }}>
          Stitched from the roles you captured — only where a real handoff was confirmed. Drag the load and watch
          which roles saturate. This scales volume-linked work linearly with load; fixed overhead does not really
          grow that way, so read it as a directional answer, not a forecast.
        </p>
      </div>

      {/* stress slider */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1.4rem', minWidth: 70 }}>{mult}× load</div>
          <input
            type="range" min={1} max={15} step={1} value={mult}
            onChange={(e) => setMult(Number(e.target.value))}
            style={{ flex: 1, minWidth: 200, accentColor: 'var(--accent)' }}
          />
          <div style={{ fontSize: '.84rem', color: 'var(--text-soft)' }}>
            {firstToBreak
              ? <>First to break: <strong style={{ color: STATE_COLOR[roleStateAt(firstToBreak, mult)] }}>{firstToBreak.role}</strong> at ≈{firstToBreak.breaksAt.toFixed(1)}×</>
              : 'No load captured yet — add step times and frequencies.'}
          </div>
        </div>
      </Card>

      {/* the map */}
      {eco.nodes.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
          boxShadow: 'var(--shadow)', padding: 8, marginBottom: 18, overflow: 'hidden',
        }}>
          <svg ref={svgRef} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'grab' }}>
            <defs>
              {(Object.keys(EDGE_SIGN_COLOR) as EdgeSign[]).map((s) => (
                <marker key={s} id={`eco-arrow-${s}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill={EDGE_SIGN_COLOR[s]} />
                </marker>
              ))}
            </defs>
            {eco.edges.map((e, i) => {
              const a = sim.find((n) => n.id === e.fromId);
              const b = sim.find((n) => n.id === e.toId);
              if (!a || !b) return null;
              const sign = edgeSignAt(e, nodeById, mult);
              const vicious = viciousEdgeIds.has(e.handoffId);
              const lever = leverageEdgeIds.has(e.handoffId);
              // stop the arrow at the target node's edge so the head shows
              const dx = b.x - a.x, dy = b.y - a.y;
              const d = Math.sqrt(dx * dx + dy * dy) || 1;
              const rb = radius(b);
              const ex = b.x - (dx / d) * (rb + 4), ey = b.y - (dy / d) * (rb + 4);
              return (
                <line key={i} x1={a.x} y1={a.y} x2={ex} y2={ey}
                  stroke={EDGE_SIGN_COLOR[sign]}
                  strokeWidth={vicious ? 2.6 : 1.3}
                  strokeOpacity={vicious ? 0.95 : 0.5}
                  strokeDasharray={lever ? '7 4' : undefined}
                  markerEnd={`url(#eco-arrow-${sign})`} />
              );
            })}
            {sim.map((n) => {
              const state = roleStateAt(n, mult);
              const big = hovered === n.id;
              const r = radius(n);
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
                  onClick={() => onOpen(n.id)}>
                  <circle r={r} fill={STATE_COLOR[state]} fillOpacity={0.85}
                    stroke={n.headcount === 1 && n.inDegree >= 2 ? '#fff' : 'none'} strokeWidth={2} />
                  {n.headcount > 1 && (
                    <text textAnchor="middle" dy="0.35em" fill="#fff" fontSize={Math.min(r, 13)} fontWeight={700}>{n.headcount}</text>
                  )}
                  <text y={-r - 5} textAnchor="middle" fill="var(--text-h)" fontSize={big ? 13 : 11} fontWeight={big ? 700 : 600}>
                    {n.role}
                  </text>
                  {big && (
                    <text y={r + 15} textAnchor="middle" fill="var(--text-soft)" fontSize={10}>
                      breaks ≈{isFinite(n.breaksAt) ? n.breaksAt.toFixed(1) + '×' : '—'} · {CONSTRAINT_LABEL[n.constraint]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '6px 12px 4px', fontSize: '.74rem', color: 'var(--text-soft)' }}>
            <Legend color={STATE_COLOR.ok} label={`Holds at ${mult}×`} />
            <Legend color={STATE_COLOR.near} label="Near saturation" />
            <Legend color={STATE_COLOR.broken} label="Breaks" />
            <span>○ size = weekly burden · number = headcount · white ring = single point of failure</span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '0 12px 6px', fontSize: '.74rem', color: 'var(--text-soft)' }}>
            <Legend color={EDGE_SIGN_COLOR.relieving} label="→ flows through (target has room)" />
            <Legend color={EDGE_SIGN_COLOR.reinforcing} label="→ back-pressure (target stressed)" />
            <span>thick = part of a vicious loop · dashed = the edge to cut</span>
          </div>
        </div>
      )}

      {/* what breaks first — ranked */}
      <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>What breaks first</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
        {ranked.map((n) => {
          const state = roleStateAt(n, mult);
          return (
            <div key={n.id} onClick={() => onOpen(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', boxShadow: 'var(--shadow)',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: STATE_COLOR[state], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-h)' }}>{n.role}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-soft)' }}>
                  {n.outputName} · {n.headcount} {n.headcount === 1 ? 'person' : 'people'} · {Math.round(n.demandWeeklyMin)} min/wk · {CONSTRAINT_LABEL[n.constraint]}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: STATE_COLOR[state] }}>
                  {isFinite(n.breaksAt) ? `≈${n.breaksAt.toFixed(1)}×` : 'no load'}
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--text-soft)' }}>
                  {n.utilizationNow > 0 ? `${Math.round(n.utilizationNow * 100)}% today` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* reinforcing loops — the "why" behind a non-linear break */}
      {loops.length > 0 && (
        <>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>
            Reinforcing loops {viciousLoops.length > 0 ? `at ${mult}×` : ''}
          </h3>
          <p style={{ fontSize: '.84rem', color: 'var(--text-soft)', marginBottom: 12, lineHeight: 1.5 }}>
            {viciousLoops.length > 0
              ? 'Why the break is non-linear: when a role in a loop saturates, the work it cannot clear backs up onto the others, which chase it, which loads it further. Cut one edge (dashed) and the whole loop slackens. Inferred from saturation + handoffs — directional, not a forecast.'
              : 'These role loops are stable at this load — no role in them is saturated yet. Drag the load up and watch which one ignites first.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
            {loops.map((l, i) => {
              const live = l.reinforcing;
              return (
                <div key={i} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderLeft: `3px solid ${live ? '#c0392b' : 'var(--border-strong)'}`,
                  borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow)',
                  opacity: live ? 1 : 0.7,
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-h)', marginBottom: 3 }}>
                    {live ? '🔁 Vicious loop' : '○ Latent loop'}: {l.roleNames.join(' → ')} → {l.roleNames[0]}
                  </div>
                  <div style={{ fontSize: '.84rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
                    {l.saturatedCount}/{l.roleIds.length} roles stressed at {mult}×
                    {l.totalDelayHours > 0 && <> · ≈{l.totalDelayHours}h of delay circulating</>}.
                    {live && l.leverageRationale && (
                      <> <strong style={{ color: 'var(--text-h)' }}>{l.leverageRationale}</strong></>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* findings */}
      {eco.findings.length > 0 && (
        <>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>What the stitched map reveals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
            {eco.findings.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `3px solid ${SEV_COLOR[f.severity]}`,
                borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow)',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-h)', marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: '.84rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>{f.detail}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* suggested links — suggest-and-confirm */}
      {visibleSuggestions.length > 0 && (
        <>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Connect these roles?</h3>
          <p style={{ fontSize: '.84rem', color: 'var(--text-soft)', marginBottom: 12, lineHeight: 1.5 }}>
            A handoff names someone who looks like a role you also captured. Confirm only if it is genuinely the same role —
            edges should reflect real flows, not lucky name matches.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
            {visibleSuggestions.map((s) => (
              <div key={s.handoffId} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', boxShadow: 'var(--shadow)',
              }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: '.86rem', color: 'var(--text)' }}>
                  <strong style={{ color: 'var(--text-h)' }}>{s.fromRole}</strong> hands to / waits on “{s.who}”.
                  Same as captured role <strong style={{ color: 'var(--accent)' }}>{s.candidateRole}</strong>?
                </div>
                <Button variant="soft" onClick={() => onLink(s.sourceWorkflowId, s.handoffId, s.candidateId)}>Link</Button>
                <button onClick={() => setDismissed((d) => new Set(d).add(s.handoffId))}
                  title="Not the same" style={{ border: 'none', background: 'transparent', color: 'var(--text-soft)', cursor: 'pointer', fontSize: '1rem', padding: 6 }}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* blind spots */}
      {eco.blindSpots.length > 0 && (
        <>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Blind spots · unmapped dependencies</h3>
          <p style={{ fontSize: '.84rem', color: 'var(--text-soft)', marginBottom: 12, lineHeight: 1.5 }}>
            These roles are depended on but nobody has captured them. Each is a part of the ecosystem you cannot yet see —
            and the count is a fair measure of how well the work is actually understood.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
            {eco.blindSpots.map((b, i) => (
              <span key={i} style={{
                fontSize: '.8rem', color: 'var(--text)', background: 'var(--code-bg)',
                border: '1px dashed var(--border-strong)', borderRadius: 999, padding: '6px 12px',
              }}>
                {b.direction === 'wait-on' ? '⏳' : '➡️'} {b.who} <span style={{ color: 'var(--text-soft)' }}>· from {b.fromRole}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} /> {label}
    </span>
  );
}
