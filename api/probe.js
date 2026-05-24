// Vercel Node function — adaptive follow-up probes for the step trace.
// POST body: { role, outputName, trigger, priorSteps:[{action,tool}], step:{...} }
// Returns: { probes: string[], source: 'ai' | 'offline' }
//
// Uses Anthropic (Claude Haiku — fast + cheap, probes are short). With no
// ANTHROPIC_API_KEY set it returns deterministic heuristic probes, so the app
// works fully without configuration. No SDK dependency — plain fetch.

const MODEL = process.env.TRACEWISE_MODEL || 'claude-haiku-4-5-20251001';

const SYSTEM = `You are an expert process-discovery interviewer. Your single job is to pull a working person OFF the official SOP / "how it is supposed to be done" and into what they ACTUALLY do, day to day.

You are given one workflow step the person just described. Ask at most TWO short, sharp follow-up questions that surface HIDDEN FRICTION:
- manual data transfer (copy/re-typing between systems)
- waiting on a person, system, or approval
- rework / doing something twice
- shadow tools (personal spreadsheets, WhatsApp threads, sticky notes they rely on but aren't official)
- judgment calls that need human context
- hunting for information across places

Rules:
- Anchor on the specific, concrete, last-time-they-did-it instance. Never "in general".
- Never ask about the ideal or the documented process. Only the real one.
- Be concrete and specific to THIS step, never generic.
- Each question must be one sentence, plain language, answerable in a few words.
- If the step is already richly described, ask the single highest-value probe only.
- Respond with ONLY valid JSON, no prose: {"probes": ["...", "..."]}`;

function heuristicProbes(step) {
  const out = [];
  const a = (step.action || '').toLowerCase();
  const tool = (step.tool || '').toLowerCase();
  const has = (s) => (s || '').trim().length > 0;

  if (has(step.action) && !has(step.tool)) {
    out.push('What do you use to do that — a specific app or system, or is it done by hand?');
  }
  if (/\b(approv|sign[\s-]?off|review|authoris|authoriz)\b/.test(a)) {
    out.push('How do you send it for that approval, and how long do you usually wait to hear back?');
  }
  if (/\b(email|excel|sheet|whatsapp|notepad|sticky|personal)\b/.test(a + ' ' + tool)) {
    out.push('Is that the official system, or a personal sheet / thread you rely on that is not really part of the process?');
  }
  if (has(step.action) && !has(step.outputDestination)) {
    out.push('Once this step is done, where does the result go next — who or what receives it?');
  }
  if ((!step.frictionTags || step.frictionTags.length === 0) && has(step.action)) {
    out.push('When you did this last, did anything slow you down, make you wait, or make you redo it?');
  }
  if ((step.timeMins === null || step.timeMins === undefined) && has(step.action)) {
    out.push('Roughly how long does this take when you actually sit down to do it?');
  }
  if (out.length === 0 && has(step.action)) {
    out.push('Think of the last specific time you did this — did anything go differently from the official way?');
  }
  return out.slice(0, 2);
}

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body) {
      resolve(typeof req.body === 'string' ? safeParse(req.body) : req.body);
      return;
    }
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => resolve(safeParse(raw)));
    req.on('error', () => resolve({}));
  });
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.json({ error: 'POST only' });
    return;
  }

  const ctx = (await readBody(req)) || {};
  const step = ctx.step || {};
  const key = process.env.ANTHROPIC_API_KEY;

  // No key configured → deterministic probes.
  if (!key) {
    res.json({ probes: heuristicProbes(step), source: 'offline' });
    return;
  }

  const prior = Array.isArray(ctx.priorSteps)
    ? ctx.priorSteps.map((s, i) => `${i + 1}. ${s.action}${s.tool ? ` (using ${s.tool})` : ''}`).join('\n')
    : '';

  const userMsg = [
    `Role: ${ctx.role || 'unspecified'}`,
    `Output being documented: ${ctx.outputName || 'unspecified'}`,
    ctx.trigger ? `Triggered by: ${ctx.trigger}` : '',
    prior ? `Steps so far:\n${prior}` : '',
    '',
    'The step they just described:',
    `- Action: ${step.action || '(blank)'}`,
    `- Tool/system: ${step.tool || '(blank)'}`,
    `- Needs to start: ${step.inputWhat || '(blank)'}${step.inputSource ? ` from ${step.inputSource}` : ''}`,
    `- Produces: ${step.outputWhat || '(blank)'}${step.outputDestination ? ` -> ${step.outputDestination}` : ''}`,
    `- Friction noted: ${(step.frictionTags || []).join(', ') || 'none yet'}`,
    `- Marked as shadow/unofficial: ${step.isShadow ? 'yes' : 'no'}`,
    step.notes ? `- Notes: ${step.notes}` : '',
    '',
    'Give your follow-up probe(s) now as JSON.',
  ].filter(Boolean).join('\n');

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    if (!r.ok) throw new Error(`anthropic ${r.status}`);
    const data = await r.json();
    const text = (data.content || []).map((b) => b.text || '').join('').trim();
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : { probes: [] };
    const probes = Array.isArray(parsed.probes) ? parsed.probes.filter((p) => typeof p === 'string' && p.trim()).slice(0, 2) : [];

    if (probes.length === 0) {
      res.json({ probes: heuristicProbes(step), source: 'offline' });
      return;
    }
    res.json({ probes, source: 'ai' });
  } catch {
    // Any failure → graceful heuristic fallback.
    res.json({ probes: heuristicProbes(step), source: 'offline' });
  }
}
