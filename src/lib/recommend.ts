// Client wrapper for /api/recommend. Same offline-graceful pattern as probe.ts —
// if the endpoint is unavailable or empty, we fall back to a deterministic
// template built from the StepOpportunity object so the user always sees
// something concrete.
import type { Step, Workflow } from './types';
import {
  type StepOpportunity, ARCHETYPES, LOA_LEVEL_LABEL,
} from './automation';

export interface RecommendContext {
  role: string;
  outputName: string;
  step: Step;
  opportunity: {
    archetype: StepOpportunity['archetype'];
    archetypeLabel: string;
    level: StepOpportunity['level'];
    levelLabel: string;
    stages: StepOpportunity['stages'];
    weeklyMinutes: number;
    wasteAddressed: StepOpportunity['wasteAddressed'];
    protect: boolean;
    shadowSignal: boolean;
  };
}

export function buildRecommendContext(wf: Workflow, step: Step, op: StepOpportunity): RecommendContext {
  const meta = ARCHETYPES[op.archetype];
  return {
    role: wf.role,
    outputName: wf.outputName,
    step,
    opportunity: {
      archetype: op.archetype,
      archetypeLabel: meta.label,
      level: op.level,
      levelLabel: LOA_LEVEL_LABEL[op.level],
      stages: op.stages,
      weeklyMinutes: op.weeklyMinutes,
      wasteAddressed: op.wasteAddressed,
      protect: op.protect,
      shadowSignal: op.shadowSignal,
    },
  };
}

/** Deterministic fallback — used inside the API when no key, and inside the
 * client when the API is unreachable. Same template both sides. */
export function offlineSuggestion(ctx: RecommendContext): string {
  const op = ctx.opportunity;
  const step = ctx.step;
  const tool = step.tool.trim() || 'the tool you use here';
  const waste = op.wasteAddressed.length ? op.wasteAddressed.join(', ') : 'the friction here';
  const burden = op.weeklyMinutes > 0 ? ` That's about ${op.weeklyMinutes} min/week you'd get back.` : '';

  if (op.protect) {
    return `This step rests on human judgment — keep the decision with you. What you can safely add is decision support around it: surface the inputs you'd normally hunt for (in ${tool}) on one screen, with the relevant prior cases or rules cited, so you decide faster but still decide. Try this week: list the 3-4 pieces of context you reach for every time you do this, and see if any of them can be pre-loaded for you.${burden}`;
  }
  if (op.archetype === 'physical-redesign') {
    return `This is physical movement, not a software problem — AI is the wrong tool here. The fit is a process/layout change: shorten the path, co-locate the materials, or stage them in advance. Try this week: time the actual walk/transport once, and see whether the destination or the staging location can move closer to where the work happens.`;
  }
  if (op.archetype === 'limited') {
    return `Not much captured waste here, so there isn't a strong automation case yet. Leave it with the human for now and revisit only if frequency or pain rises. If you want to make it easier, the safer wins are template / checklist tweaks rather than AI.`;
  }
  if (op.shadowSignal) {
    return `Before automating this, notice what the shadow tool reveals: the official system doesn't cover ${step.outputWhat || 'what you actually need here'}, so you're working around it. The fit is ${op.archetypeLabel.toLowerCase()} (${op.levelLabel.toLowerCase()}), addressing ${waste}. Try this week: write down the 2-3 things your shadow tool gives you that the official one doesn't, and take that to whoever owns the official system — that's the brief for any AI you'd add on top.${burden}`;
  }

  const firstStep =
    op.archetype === 'data-integration' ? `pick one field you currently re-key from one place to another and ask whether ${tool} (or a small script / Zapier-style flow) can pre-fill it` :
    op.archetype === 'retrieval'        ? `pick the one thing you most often hunt for here and see whether it can be surfaced automatically next to where you need it` :
    op.archetype === 'orchestration'    ? `set up an auto-reminder or status nudge so you stop chasing this manually` :
    op.archetype === 'validation'       ? `add a single automated check on the most common error you have to redo` :
    op.archetype === 'routing'          ? `write down the 1-2 rules that cover the easy approvals, and auto-approve those — escalate only the rest` :
    op.archetype === 'decision-support' ? `list the inputs you usually look up before deciding, and try pulling them into one place` :
    `pick the smallest piece of this step to delegate to a tool and try it once`;

  return `This step looks like a fit for ${op.archetypeLabel.toLowerCase()} (${op.levelLabel.toLowerCase()}), addressing ${waste} in ${tool}.${burden} Try this week: ${firstStep}.`;
}

export async function fetchSuggestion(
  ctx: RecommendContext, signal?: AbortSignal,
): Promise<{ suggestion: string; source: 'ai' | 'offline' }> {
  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ctx),
      signal,
    });
    if (!res.ok) throw new Error(`recommend ${res.status}`);
    const data = await res.json();
    if (typeof data.suggestion === 'string' && data.suggestion.trim()) {
      return { suggestion: data.suggestion.trim(), source: data.source === 'ai' ? 'ai' : 'offline' };
    }
    throw new Error('empty suggestion');
  } catch {
    return { suggestion: offlineSuggestion(ctx), source: 'offline' };
  }
}
