// Vercel Node function — concrete, role-specific automation suggestions for a
// single scored step. The deterministic engine (src/lib/automation.ts) supplies
// the WHAT and WHY (archetype, LoA stages, level, transparent rationale). This
// endpoint adds the HOW: a one-paragraph, plain-language suggestion the worker
// could actually act on.
//
// POST body:
//   { role, outputName, step:{action,tool,inputWhat,outputWhat,outputDestination,
//                            frictionTags,timeMins,frequency,isShadow,needsJudgment,notes},
//     opportunity:{archetype, archetypeLabel, level, levelLabel, stages,
//                  weeklyMinutes, wasteAddressed, protect, shadowSignal} }
// Returns: { suggestion: string, source: 'ai' | 'offline' }
//
// Same Groq pattern as api/probe.js; falls back to a deterministic template when
// no GROQ_API_KEY is set so the feature works fully offline.

const MODEL = process.env.TRACEWISE_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM = `You advise on where AI / automation actually FITS in someone's real day-to-day work.

You will receive ONE workflow step the person actually does, along with a deterministic fit assessment (the automation archetype, the function-allocation level, and the Lean waste it addresses). Your job: write ONE short, concrete paragraph (3-5 sentences) telling the person what to try, anchored in their tool / output / role.

Hard rules:
- Be SPECIFIC to their step, tool, and output. No generic "use AI" lines.
- Honour the supplied automation archetype and level. If level is "support" or the step is marked protect/judgment, DO NOT suggest replacing the decision — only augmenting it. If shadowSignal is true, name the unmet need; do not just paper over with automation.
- If the archetype is "physical-redesign" or "limited", say so honestly — recommend a non-software fix or "leave with the human for now".
- Plain language. No buzzwords (no "leverage", "synergy", "transform"). No headings, no bullet lists, just a paragraph.
- Name a concrete first step they could try this week.

Respond with ONLY valid JSON, no prose: {"suggestion": "..."}`;

function offlineSuggestion(ctx) {
  const op = ctx.opportunity || {};
  const step = ctx.step || {};
  const tool = (step.tool || '').trim() || 'the tool you use here';
  const waste = (op.wasteAddressed || []).join(', ') || 'the friction here';
  const wkMin = op.weeklyMinutes || 0;
  const burden = wkMin > 0 ? `That's about ${wkMin} min/week you'd get back.` : '';

  if (op.protect) {
    return `This step rests on human judgment — keep the decision with you. What you can safely add is decision support around it: surface the inputs you'd normally hunt for (in ${tool}) on one screen, with the relevant prior cases or rules cited, so you decide faster but still decide. Try this week: list the 3-4 pieces of context you reach for every time you do this, and see if any of them can be pre-loaded for you. ${burden}`.trim();
  }
  if (op.archetype === 'physical-redesign') {
    return `This is physical movement, not a software problem — AI is the wrong tool here. The fit is a process/layout change: shorten the path, co-locate the materials, or stage them in advance. Try this week: time the actual walk/transport once, and see whether the destination or the staging location can move closer to where the work happens.`;
  }
  if (op.archetype === 'limited') {
    return `Not much captured waste here, so there isn't a strong automation case yet. Leave it with the human for now and revisit only if frequency or pain rises. If you want to make it easier, the safer wins are template / checklist tweaks rather than AI.`;
  }
  if (op.shadowSignal) {
    return `Before automating this, notice what the shadow tool reveals: the official system doesn't cover ${step.outputWhat || 'what you actually need here'}, so you're working around it. The fit is ${op.archetypeLabel || op.archetype} (${op.levelLabel || op.level}), addressing ${waste}. Try this week: write down the 2-3 things your shadow tool gives you that the official one doesn't, and take that to whoever owns the official system — that's the brief for any AI you'd add on top. ${burden}`.trim();
  }

  const archetype = (op.archetypeLabel || op.archetype || 'a small automation').toLowerCase();
  const level = (op.levelLabel || op.level || '').toLowerCase();
  const firstStep =
    op.archetype === 'data-integration' ? `pick one field you currently re-key from one place to another and ask whether ${tool} (or a small script / Zapier-style flow) can pre-fill it` :
    op.archetype === 'retrieval'        ? `pick the one thing you most often hunt for here and see whether it can be surfaced automatically next to where you need it` :
    op.archetype === 'orchestration'    ? `set up an auto-reminder or status nudge so you stop chasing this manually` :
    op.archetype === 'validation'       ? `add a single automated check on the most common error you have to redo` :
    op.archetype === 'routing'          ? `write down the 1-2 rules that cover the easy approvals, and auto-approve those — escalate only the rest` :
    op.archetype === 'decision-support' ? `list the inputs you usually look up before deciding, and try pulling them into one place` :
    `pick the smallest piece of this step to delegate to a tool and try it once`;

  return `This step looks like a fit for ${archetype}${level ? ` (${level})` : ''}, addressing ${waste} in ${tool}. ${burden} Try this week: ${firstStep}.`.trim();
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
  const key = (process.env.GROQ_API_KEY || '').replace(/[^\x21-\x7E]/g, '');

  if (!key) {
    res.json({ suggestion: offlineSuggestion(ctx), source: 'offline' });
    return;
  }

  const step = ctx.step || {};
  const op = ctx.opportunity || {};
  const userMsg = [
    `Role: ${ctx.role || 'unspecified'}`,
    `Output: ${ctx.outputName || 'unspecified'}`,
    '',
    'The step:',
    `- Action: ${step.action || '(blank)'}`,
    `- Tool/system: ${step.tool || '(blank)'}`,
    `- Needs to start: ${step.inputWhat || '(blank)'}`,
    `- Produces: ${step.outputWhat || '(blank)'}${step.outputDestination ? ` → ${step.outputDestination}` : ''}`,
    `- Time per occurrence: ${step.timeMins != null ? `${step.timeMins} min` : 'unspecified'}`,
    `- Frequency: ${step.frequency || 'unspecified'}`,
    `- Friction (Lean waste): ${(step.frictionTags || []).join(', ') || 'none'}`,
    `- Is shadow / unofficial: ${step.isShadow ? 'yes' : 'no'}`,
    `- Needs human judgment: ${step.needsJudgment ? 'yes (PROTECT — do not replace the decision)' : 'no'}`,
    step.notes ? `- Notes: ${step.notes}` : '',
    '',
    'Deterministic fit assessment:',
    `- Archetype: ${op.archetypeLabel || op.archetype || 'unspecified'}`,
    `- Function-allocation level: ${op.levelLabel || op.level || 'unspecified'}`,
    `- LoA stages touched: ${(op.stages || []).join(', ') || 'none'}`,
    `- Estimated weekly burden: ${op.weeklyMinutes || 0} min/week`,
    `- Waste this would address: ${(op.wasteAddressed || []).join(', ') || 'none'}`,
    op.protect ? '- PROTECT: this is a judgment step. Suggest decision support only.' : '',
    op.shadowSignal ? '- SHADOW: an unmet need is showing. Name it; do not just paper over.' : '',
    '',
    'Write the suggestion now as JSON.',
  ].filter(Boolean).join('\n');

  try {
    const r = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: userMsg },
        ],
      }),
    });
    if (!r.ok) throw new Error(`groq ${r.status}`);
    const data = await r.json();
    const text = (data.choices?.[0]?.message?.content || '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    const suggestion = typeof parsed.suggestion === 'string' ? parsed.suggestion.trim() : '';
    if (!suggestion) {
      res.json({ suggestion: offlineSuggestion(ctx), source: 'offline' });
      return;
    }
    res.json({ suggestion, source: 'ai' });
  } catch {
    res.json({ suggestion: offlineSuggestion(ctx), source: 'offline' });
  }
}
