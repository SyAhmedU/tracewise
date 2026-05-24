// Adaptive follow-up probes for a step. Calls /api/probe (Anthropic-backed);
// if the endpoint is unavailable (e.g. `vite dev` without `vercel dev`, or no
// API key), falls back to deterministic heuristic probes so the interview is
// always functional offline — same philosophy as researchflow's mock fallback.
import type { Step, Workflow } from './types';

export interface ProbeContext {
  role: string;
  outputName: string;
  trigger: string;
  priorSteps: { action: string; tool: string }[];
  step: Step;
}

export function buildContext(wf: Workflow, step: Step): ProbeContext {
  return {
    role: wf.role,
    outputName: wf.outputName,
    trigger: wf.trigger,
    priorSteps: wf.steps
      .filter((s) => s.order < step.order && s.action.trim())
      .map((s) => ({ action: s.action, tool: s.tool })),
    step,
  };
}

/** Deterministic probes — used as offline fallback and inside the API when no key. */
export function heuristicProbes(step: Step): string[] {
  const out: string[] = [];
  const a = step.action.toLowerCase();
  const tool = step.tool.toLowerCase();

  if (step.action.trim() && !step.tool.trim()) {
    out.push('What do you use to do that — a specific app or system, or is it done by hand?');
  }
  if (/\b(approv|sign[\s-]?off|review|authoris|authoriz)\b/.test(a)) {
    out.push('How do you send it for that approval, and how long do you usually wait to hear back?');
  }
  if (/\b(email|excel|sheet|whatsapp|notepad|sticky|personal)\b/.test(a + ' ' + tool)) {
    out.push('Is that the official system, or a personal sheet / thread you rely on that is not really part of the process?');
  }
  if (step.action.trim() && !step.outputDestination.trim()) {
    out.push('Once this step is done, where does the result go next — who or what receives it?');
  }
  if (step.frictionTags.length === 0 && step.action.trim()) {
    out.push('When you did this last, did anything slow you down, make you wait, or make you redo it?');
  }
  if (step.timeMins === null && step.action.trim()) {
    out.push('Roughly how long does this take when you actually sit down to do it?');
  }
  if (out.length === 0 && step.action.trim()) {
    out.push('Think of the last specific time you did this — did anything go differently from the official way?');
  }
  return out.slice(0, 2);
}

export async function fetchProbes(ctx: ProbeContext, signal?: AbortSignal): Promise<{ probes: string[]; source: 'ai' | 'offline' }> {
  try {
    const res = await fetch('/api/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ctx),
      signal,
    });
    if (!res.ok) throw new Error(`probe ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.probes) && data.probes.length > 0) {
      return { probes: data.probes.slice(0, 2), source: data.source === 'ai' ? 'ai' : 'offline' };
    }
    throw new Error('empty probes');
  } catch {
    return { probes: heuristicProbes(ctx.step), source: 'offline' };
  }
}
