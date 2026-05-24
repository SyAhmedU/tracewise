import { type Workflow, type FrictionTag, FRICTION_TAGS, FREQUENCIES, summarize } from './types';
import { type WorkflowAnalysis, ARCHETYPES, LOA_LEVEL_LABEL, QUADRANT_LABEL } from './automation';

const tagLabel = (t: FrictionTag) => FRICTION_TAGS.find((x) => x.id === t)?.label ?? t;
const freqLabel = (f: string | null) => FREQUENCIES.find((x) => x.id === f)?.label ?? '—';

export function toMarkdown(wf: Workflow): string {
  const s = summarize(wf);
  const L: string[] = [];
  L.push(`# As-Is Workflow: ${wf.outputName || 'Untitled'}`);
  L.push('');
  L.push(`**Role:** ${wf.role || '—'}  `);
  if (wf.context.trim()) L.push(`**Context:** ${wf.context}  `);
  if (wf.instanceAnchor.trim()) L.push(`**Recalled instance:** ${wf.instanceAnchor}  `);
  L.push(`**Trigger:** ${wf.trigger || '—'}  `);
  if (wf.officialVersion.trim()) L.push(`**Work-as-imagined (official version):** ${wf.officialVersion}  `);
  L.push(`**Documented:** ${new Date(wf.updatedAt).toLocaleString()}`);
  L.push('');
  L.push(`> This is the *practical, as-is* process — what actually happens, not the SOP.`);
  L.push('');
  L.push('## Steps');
  L.push('');
  wf.steps.forEach((st) => {
    const marks = [
      st.isShadow ? 'shadow / articulation work' : '',
      st.needsJudgment ? 'human judgment' : '',
      st.isPainful ? 'dreaded' : '',
    ].filter(Boolean).join(', ');
    L.push(`### ${st.order}. ${st.action || '(unnamed step)'}${marks ? `  _(${marks})_` : ''}`);
    L.push(`- **Tool:** ${st.tool || '—'}`);
    L.push(`- **Needs:** ${st.inputWhat || '—'}${st.inputSource ? ` (from ${st.inputSource})` : ''}`);
    L.push(`- **Produces:** ${st.outputWhat || '—'}${st.outputDestination ? ` → ${st.outputDestination}` : ''}`);
    L.push(`- **Time:** ${st.timeMins != null ? `${st.timeMins} min` : '—'} · **Frequency:** ${freqLabel(st.frequency)}`);
    if (st.frictionTags.length) L.push(`- **Waste (muda):** ${st.frictionTags.map(tagLabel).join(', ')}`);
    if (st.notes.trim()) L.push(`- **Notes:** ${st.notes}`);
    L.push('');
  });

  if (wf.handoffs.length) {
    L.push('## Handoffs & waiting');
    L.push('');
    wf.handoffs.forEach((h) => {
      const verb = h.direction === 'wait-on' ? 'Waits on' : 'Hands to';
      L.push(`- **${verb} ${h.who || '—'}**: ${h.what || '—'}${h.typicalDelay ? ` _(${h.typicalDelay})_` : ''}`);
    });
    L.push('');
  }

  if (wf.exceptions.length) {
    L.push('## When it breaks');
    L.push('');
    wf.exceptions.forEach((ex) => {
      L.push(`- **${ex.trigger || '—'}** → ${ex.whatYouDo || '—'}${ex.howOften ? ` _(${ex.howOften})_` : ''}`);
    });
    L.push('');
  }

  L.push('## Waste profile (Lean muda)');
  L.push('');
  L.push(`- Steps: ${s.totalSteps}`);
  L.push(`- Known hands-on time: ${s.totalMinutes} min`);
  L.push(`- Distinct tools: ${s.toolCount} (tool switches: ${s.toolSwitches})`);
  L.push(`- Handoffs / wait points: ${s.handoffCount}`);
  L.push(`- Steps carrying waste: ${s.wasteSteps}`);
  L.push(`- Shadow (articulation-work) steps: ${s.shadowCount}`);
  L.push(`- Human-judgment steps (preserve): ${s.judgmentCount}`);
  L.push(`- Dreaded steps: ${s.painCount}`);
  const tags = (Object.entries(s.tagCounts) as [FrictionTag, number][]).filter(([, n]) => n > 0);
  if (tags.length) L.push(`- Waste by type: ${tags.map(([t, n]) => `${tagLabel(t)} ×${n}`).join(', ')}`);
  L.push('');
  L.push('_Captured with Tracewise — work-as-done before automation. Method: cognitive task analysis (Klein et al., 1989); Lean waste (Ohno, 1988); work-as-imagined vs work-as-done (Hollnagel, 2014)._');
  return L.join('\n');
}

export function download(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const safe = (s: string) => (s || 'workflow').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 40);

export function exportJson(wf: Workflow) {
  download(`tracewise-${safe(wf.outputName)}.json`, JSON.stringify(wf, null, 2), 'application/json');
}

export function exportMarkdown(wf: Workflow) {
  download(`tracewise-${safe(wf.outputName)}.md`, toMarkdown(wf), 'text/markdown');
}

export function toOpportunitiesMarkdown(wf: Workflow, a: WorkflowAnalysis): string {
  const L: string[] = [];
  L.push(`# Automation Fit: ${wf.outputName || 'Untitled'}`);
  L.push('');
  L.push(`**Role:** ${wf.role || '—'}  `);
  L.push(`**Generated:** ${new Date().toLocaleString()}`);
  L.push('');
  L.push(`> Where AI / automation actually fits, grounded in Task-Technology Fit (Goodhue & Thompson, 1995) and Levels of Automation (Parasuraman, Sheridan & Wickens, 2000). Judgment is preserved, not automated.`);
  L.push('');
  L.push('## Summary');
  L.push('');
  L.push(a.narrative);
  L.push('');
  L.push(`- Total estimated weekly burden: **${a.totalWeeklyMinutes} min/week**`);
  L.push(`- Automation-amenable share: **${a.automatableWeeklyMinutes} min/week**`);
  L.push(`- Quick wins: ${a.counts['quick-win']} · Easy: ${a.counts.easy} · Big bets: ${a.counts['big-bet']} · Leave: ${a.counts.leave} · Protect: ${a.counts.protect}`);
  L.push('');

  if (a.ranked.length) {
    L.push('## Ranked opportunities');
    L.push('');
    a.ranked.forEach((o, i) => {
      const arch = ARCHETYPES[o.archetype];
      L.push(`### ${i + 1}. Step ${o.order}: ${o.action || '(unnamed)'}  _(${QUADRANT_LABEL[o.quadrant]})_`);
      L.push(`- **Fit:** ${arch.label} — ${LOA_LEVEL_LABEL[o.level]}`);
      L.push(`- **Weekly burden:** ~${o.weeklyMinutes} min`);
      L.push(`- **Addresses:** ${o.wasteAddressed.length ? o.wasteAddressed.join(', ') : 'no captured waste'}`);
      L.push(`- **Why:** ${o.rationale}`);
      L.push('');
    });
  }

  if (a.protectedSteps.length) {
    L.push('## Protect (human judgment)');
    L.push('');
    a.protectedSteps.forEach((o) => {
      L.push(`- **Step ${o.order}: ${o.action || '(unnamed)'}** — ${o.rationale}`);
    });
    L.push('');
  }

  const shadows = a.opportunities.filter((o) => o.shadowSignal);
  if (shadows.length) {
    L.push('## Shadow signals (fix the cause, do not paper over)');
    L.push('');
    shadows.forEach((o) => {
      L.push(`- **Step ${o.order}: ${o.action || '(unnamed)'}** — surfaces an unmet need in the official process.`);
    });
    L.push('');
  }

  L.push('_Generated by Tracewise — fit before features._');
  return L.join('\n');
}

export function exportOpportunitiesMarkdown(wf: Workflow, a: WorkflowAnalysis) {
  download(`tracewise-${safe(wf.outputName)}-opportunities.md`, toOpportunitiesMarkdown(wf, a), 'text/markdown');
}
