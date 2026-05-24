import { type Workflow, type FrictionTag, FRICTION_TAGS, FREQUENCIES, summarize } from './types';

const tagLabel = (t: FrictionTag) => FRICTION_TAGS.find((x) => x.id === t)?.label ?? t;
const freqLabel = (f: string | null) => FREQUENCIES.find((x) => x.id === f)?.label ?? '—';

export function toMarkdown(wf: Workflow): string {
  const s = summarize(wf);
  const L: string[] = [];
  L.push(`# As-Is Workflow: ${wf.outputName || 'Untitled'}`);
  L.push('');
  L.push(`**Role:** ${wf.role || '—'}  `);
  if (wf.context.trim()) L.push(`**Context:** ${wf.context}  `);
  L.push(`**Trigger:** ${wf.trigger || '—'}  `);
  L.push(`**Documented:** ${new Date(wf.updatedAt).toLocaleString()}`);
  L.push('');
  L.push(`> This is the *practical, as-is* process — what actually happens, not the SOP.`);
  L.push('');
  L.push('## Steps');
  L.push('');
  wf.steps.forEach((st) => {
    L.push(`### ${st.order}. ${st.action || '(unnamed step)'}${st.isShadow ? '  _(shadow / unofficial)_' : ''}`);
    L.push(`- **Tool:** ${st.tool || '—'}`);
    L.push(`- **Needs:** ${st.inputWhat || '—'}${st.inputSource ? ` (from ${st.inputSource})` : ''}`);
    L.push(`- **Produces:** ${st.outputWhat || '—'}${st.outputDestination ? ` → ${st.outputDestination}` : ''}`);
    L.push(`- **Time:** ${st.timeMins != null ? `${st.timeMins} min` : '—'} · **Frequency:** ${freqLabel(st.frequency)}`);
    if (st.frictionTags.length) L.push(`- **Friction:** ${st.frictionTags.map(tagLabel).join(', ')}`);
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

  L.push('## Friction summary');
  L.push('');
  L.push(`- Steps: ${s.totalSteps}`);
  L.push(`- Known hands-on time: ${s.totalMinutes} min`);
  L.push(`- Distinct tools: ${s.toolCount} (tool switches: ${s.toolSwitches})`);
  L.push(`- Handoffs / wait points: ${s.handoffCount}`);
  L.push(`- Shadow steps: ${s.shadowCount}`);
  const tags = (Object.entries(s.tagCounts) as [FrictionTag, number][]).filter(([, n]) => n > 0);
  if (tags.length) L.push(`- Friction flags: ${tags.map(([t, n]) => `${tagLabel(t)} ×${n}`).join(', ')}`);
  L.push('');
  L.push('_Captured with Tracewise — ground truth before automation._');
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
