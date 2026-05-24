# Tracewise

**Map the work you actually do — ground truth before automation.**

Tracewise is a guided tool for documenting the *practical, as-is* workflow of a
role — what actually happens day to day, not the SOP and not the ideal. The
premise: digitalization was often implemented haphazardly, duplicating work and
breeding resistance, and AI is now repeating the same mistake (blanket
subscriptions, wrong tool for the job). The fix is sequencing — **first capture
the real current workflow faithfully, then aim AI/automation only where it
genuinely earns its place.**

This is v1: the **capture engine**. It produces a faithful as-is map and a
friction summary. The AI-opportunity scoring layer is deferred to v2 — but the
data model already records everything that layer will need.

## How the interview works

A hybrid of a **structured backbone** (directional question-with-options, the
mode Syed prefers) and **adaptive AI follow-up probes** that dig into the messy
reality of each step. Six stages:

1. **Frame** — your role + the one recurring output to document (not your whole job).
2. **Trigger** — what really kicks it off.
3. **Step trace** — the core. "What did you *actually* do last time?" → annotate each step (tool, input/source, output/destination, time, frequency, friction tags, shadow flag) → "then what?" until done. "Dig deeper" fetches AI probes per step.
4. **Handoffs** — who you wait on / hand to (where time disappears).
5. **When it breaks** — the unhappy path and your real workarounds.
6. **Your map** — the assembled A→B→C→D map, friction summary, and exports.

The questions are phrased to pull people *off* the official process: anchor on a
concrete recent instance, follow the artifact, interrogate the seams, name the
friction, hunt the shadow tools.

## Stack

- React 19 + Vite + TypeScript (mirrors `researchflow`).
- `api/probe.js` — Vercel Node function calling Anthropic (Claude Haiku) for
  follow-up probes. **Falls back to deterministic heuristic probes when no
  `ANTHROPIC_API_KEY` is set**, so the app is fully functional offline.
- Persistence: `localStorage` — saved workflows under `tw_workflows`, autosave
  under `tw_autosave` (14-day TTL). No backend required for capture.

## Develop

```bash
npm install
npm run dev      # vite dev server (probes use the offline heuristic unless you run `vercel dev`)
npm run build    # tsc -b && vite build
npm run lint
```

Set `ANTHROPIC_API_KEY` (see `.env.example`) and run via `vercel dev` to get
AI-generated probes locally.

## Data model

See `src/lib/types.ts`. A `Workflow` has `role`, `outputName`, `trigger`,
`steps[]`, `handoffs[]`, `exceptions[]`. Each `Step` carries `frictionTags`
(`wait | rework | manual-transfer | approval | lookup | judgment`), an
`isShadow` flag, time and frequency. `summarize()` derives the counts that v2's
AI-opportunity layer will score.

## Roadmap

- **v2** — AI-opportunity overlay: score each step/segment for automation
  suitability from the captured friction, and pitch concrete improvements.
- Team capture (multiple contributors → one merged map).
- Voice and image capture modes.
