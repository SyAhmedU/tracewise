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

## Methodology

Tracewise is, in method terms, a **lightweight cognitive task analysis**. It is
grounded in established theory rather than invented heuristics:

| Theory | Role in Tracewise | Source |
|---|---|---|
| **Work-as-Imagined vs Work-as-Done** | The whole premise: capture the real enactment, not the SOP. The optional "official version" field makes the gap visible. | Hollnagel (2014) |
| **Articulation work / invisible work** | The "shadow step" marker — the unofficial work that makes formal processes actually function. | Strauss (1985); Star & Strauss (1999) |
| **Critical Decision Method (CTA)** | The elicitation method: anchor on one real incident, reconstruct the timeline, then deepen with probes. | Klein, Calderwood & MacGregor (1989); Crandall, Klein & Hoffman (2006); Beyer & Holtzblatt (1998) |
| **Lean waste taxonomy (muda) + SIPOC** | The friction tags (waiting, rework, over-processing, transport, motion) and the per-step input→output model. | Ohno (1988); Womack & Jones (1996); Rother & Shook (1999) |
| **Function allocation / Levels of Automation** | The "needs human judgment" marker — value to preserve, *not* waste to automate. | Parasuraman, Sheridan & Wickens (2000) |
| **Task-Technology Fit & Sociotechnical Systems** | Why mapping the real work must precede aiming AI at it; misfit, imposed technology is what breeds resistance. | Goodhue & Thompson (1995); Trist & Bamforth (1951); Davis (1989) |

The canonical references live in `src/lib/methodology.ts`.

## How the interview works

A hybrid of a **structured backbone** (directional question-with-options) and
**adaptive AI follow-up probes**, sequenced as a Critical Decision Method sweep:

1. **Frame** — your role, the one recurring output, and (optionally) the *work-as-imagined* official version, so the gap to reality is visible.
2. **Trigger** — the real starting cue of the work episode.
3. **Timeline** — the core. Pin one concrete recent instance, then lay down the spine fast ("then what?"), enriching only the steps that matter. Each step is annotated (tool, input→output à la SIPOC, time, frequency, **Lean-waste** tags, **shadow** = articulation work, **needs-judgment** = preserve, dread). Opening a step proactively fetches AI probes.
4. **Handoffs** — who you wait on / hand to (the social system; where waiting waste concentrates).
5. **When it breaks** — performance variability and the everyday adaptation work-as-imagined ignores.
6. **Your map** — the as-is map, the work-as-imagined/done contrast, the Lean **waste profile**, and exports.

Friction = **waste** (candidate to remove/automate). Human judgment is kept
*separate* from waste — it is value to preserve. That distinction is the whole
point: it is what stops "automate everything" from destroying the work.

## Stack

- React 19 + Vite + TypeScript (mirrors `researchflow`).
- `api/probe.js` — Vercel Node function calling Groq (`llama-3.3-70b-versatile`,
  the same provider scalebase/journaltime use) for follow-up probes. **Falls
  back to deterministic heuristic probes when no `GROQ_API_KEY` is set**, so the
  app is fully functional offline.
- Persistence: `localStorage` — saved workflows under `tw_workflows`, autosave
  under `tw_autosave` (14-day TTL). No backend required for capture.

## Develop

```bash
npm install
npm run dev      # vite dev server (probes use the offline heuristic unless you run `vercel dev`)
npm run build    # tsc -b && vite build
npm run lint
```

Set `GROQ_API_KEY` (see `.env.example`) and run via `vercel dev` to get
AI-generated probes locally.

## Worked examples

Two fully-mapped, real operating-world exemplars ship with the app and load with
one click (`src/lib/examples.ts`) — they double as demos and methodological
models:

- **Services** — settling a motor insurance claim (three re-keyings of the same numbers, a shadow tracker the team relies on, an assessor they chase).
- **Manufacturing** — running a production work order (a personal notebook of machine offsets, borrowing material off other jobs, QC as the bottleneck).

## Data model

See `src/lib/types.ts`. A `Workflow` has `role`, `outputName`, `officialVersion`
(work-as-imagined), `instanceAnchor` (the recalled incident), `trigger`,
`steps[]`, `handoffs[]`, `exceptions[]`. Each `Step` carries Lean-waste
`frictionTags` (`wait | rework | manual-transfer | movement | lookup | approval
| chasing`), plus `isShadow` (articulation work), `needsJudgment` (preserve),
`isPainful` (dread), time and frequency. `summarize()` derives the waste profile
that v2's AI-opportunity layer will score. Older records are migrated on load
(the retired `judgment` tag becomes the `needsJudgment` attribute).

## Roadmap

- **v2** — AI-opportunity overlay: score each step for automation suitability
  using the captured waste profile and Task-Technology Fit / Levels-of-Automation,
  protecting judgment steps, and pitch concrete improvements.
- Team capture (multiple contributors → one merged map).
- Voice and image capture modes.

## References

Davis (1989) *MIS Quarterly* 13(3); Goodhue & Thompson (1995) *MIS Quarterly*
19(2); Hollnagel (2014) *Safety-I and Safety-II*; Klein, Calderwood & MacGregor
(1989) *IEEE SMC* 19(3); Crandall, Klein & Hoffman (2006) *Working Minds*; Beyer
& Holtzblatt (1998) *Contextual Design*; Ohno (1988) *Toyota Production System*;
Womack & Jones (1996) *Lean Thinking*; Rother & Shook (1999) *Learning to See*;
Parasuraman, Sheridan & Wickens (2000) *IEEE SMC-A* 30(3); Star & Strauss (1999)
*CSCW* 8; Strauss (1985) *Sociological Quarterly* 26(1); Trist & Bamforth (1951)
*Human Relations* 4(1). Full strings in `src/lib/methodology.ts`.
