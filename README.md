# Tracewise

**Map the work you actually do — ground truth before automation.**

Tracewise is a guided tool for documenting the *practical, as-is* workflow of a
role — what actually happens day to day, not the SOP and not the ideal. The
premise: digitalization was often implemented haphazardly, duplicating work and
breeding resistance, and AI is now repeating the same mistake (blanket
subscriptions, wrong tool for the job). The fix is sequencing — **first capture
the real current workflow faithfully, then aim AI/automation only where it
genuinely earns its place.**

Tracewise now has both halves: the **capture engine** (faithful as-is map +
Lean waste profile) and the **Automation-Fit engine** (per-step scoring of where
AI / automation actually belongs, what level of automation fits, and which steps
to leave alone). Judgment is preserved, shadow tools are read as unmet needs.

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
7. **Where AI fits** — the v2 Automation-Fit engine. Each step gets a transparent score (impact × feasibility), an automation **archetype** (data integration, retrieval, orchestration, validation, routing, decision-support, physical-redesign, limited) and a **Level of Automation** (support → partial → high). Quadrants: quick win / easy / big bet / leave / **protect**. On-demand AI suggestions write a concrete, role-specific "try this week" paragraph per opportunity.

Friction = **waste** (candidate to remove/automate). Human judgment is kept
*separate* from waste — it is value to preserve. That distinction is the whole
point: it is what stops "automate everything" from destroying the work.

## Stack

- React 19 + Vite + TypeScript (mirrors `researchflow`).
- `api/probe.js` — Vercel Node function calling Groq (`llama-3.3-70b-versatile`,
  the same provider scalebase/journaltime use) for follow-up probes. **Falls
  back to deterministic heuristic probes when no `GROQ_API_KEY` is set**, so the
  app is fully functional offline.
- `api/recommend.js` — same pattern, layered on top of the deterministic
  scoring in `src/lib/automation.ts` to generate concrete, role-specific
  automation suggestions per step. Same offline-graceful fallback.
- Persistence: `localStorage` — saved workflows under `tw_workflows`, autosave
  under `tw_autosave` (14-day TTL). No backend required for capture.

## Develop

```bash
npm install
npm run dev      # vite dev server (probes use the offline heuristic unless you run `vercel dev`)
npm run build    # tsc -b && vite build
npm run lint
npm test         # vitest run — engine coherence invariants over all 39 examples
```

Set `GROQ_API_KEY` (see `.env.example`) and run via `vercel dev` to get
AI-generated probes locally.

## Worked examples

**39** fully-mapped, real operating-world exemplars ship with the app and load
with one click. They live in `src/lib/examples/`, split per sector
(`food`, `retail`, `hospitality`, `services`, `healthcare`, `government`,
`manufacturing`, `agri`, `logistics`) and aggregated by `index.ts`; the shared
`S()`/`mk()` builders and the `WorkedExample` type are in `examples/_shared.ts`.
Mostly grounded in Tamil Nadu / India and spread right across the economy — each
one shows work-as-done diverging from the SOP, shadow tools, judgement steps,
real handoffs and the exceptions where the unhappy path actually lives:

| Sector | n | Examples |
|---|---|---|
| Food prep | 3 | pani-puri cart, dosa stall, TN sweet shop on Diwali eve |
| Retail | 6 | kirana, petrol pump, mall fashion, TN jewellery showroom, mobile shop, supermarket cashier |
| Hospitality | 7 | café barista, Chennai restaurant, hotel reception, salon stylist, wedding hall, multiplex turnover, real-estate broker |
| Professional services | 3 | motor insurance claim, Coimbatore CA GSTR-3B, L2 P2 incident |
| Healthcare | 8 | PHC ANM antenatal visit, govt OP doctor, ER triage nurse, pharmacist, lab tech, physiotherapist, dentist, counsellor |
| Government | 7 | VAO e-Sevai, traffic constable, RTO clerk, sub-registrar, sanitary inspector, BLO, PDS dealer |
| Manufacturing | 2 | CNC production work order, Tirupur knitwear export |
| Agriculture | 2 | Erode rice mill batch, Madurai jasmine wholesale |
| Logistics | 1 | Chennai 3PL warehouse picker |

Each example also carries two hand-written reads, surfaced on its landing card
and in the *Where AI fits* stage next to the engine's scores:

- **`behavioralContext`** — the field-specific human / cultural / trust dynamic
  any intervention will hit. The shadow tools and personal registers are usually
  *solutions* to this dynamic, not bugs — replacing them mechanically is what
  breeds resistance (Star & Strauss, 1999).
- **`fieldSpecificFit`** — what a realistic, field-appropriate intervention
  actually looks like, anchored in that example's own captured signals (its
  shadow steps, judgment calls and friction). Deliberately specific.

The worked-example library is covered by a Vitest suite
(`src/lib/automation.test.ts`) that asserts the engine never offers a
judgment step as an automation opportunity — across all 39.

## Data model

See `src/lib/types.ts`. A `Workflow` has `role`, `outputName`, `officialVersion`
(work-as-imagined), `instanceAnchor` (the recalled incident), `trigger`,
`steps[]`, `handoffs[]`, `exceptions[]`. Each `Step` carries Lean-waste
`frictionTags` (`wait | rework | manual-transfer | movement | lookup | approval
| chasing`), plus `isShadow` (articulation work), `needsJudgment` (preserve),
`isPainful` (dread), time and frequency. `summarize()` derives the waste profile
that v2's AI-opportunity layer will score. Older records are migrated on load
(the retired `judgment` tag becomes the `needsJudgment` attribute).

## The Automation-Fit engine (v2)

`src/lib/automation.ts` is the explainable scoring substrate. It is pure,
deterministic, and grounded in two specific theories rather than a black box:

- **Task-Technology Fit (Goodhue & Thompson, 1995)** — only recommend technology
  where it fits the task. The per-step `feasibility` = automatability of the
  dominant Lean waste × structuredness of the tool.
- **Levels of Automation (Parasuraman, Sheridan & Wickens, 2000)** — not a
  binary automate-yes/no, but *which* of the four function stages (information
  acquisition → analysis → decision → action) and at what level (support →
  partial → high). Steps marked `needsJudgment` are capped at "decision
  support" — function allocation in action.

Each step receives:

- **Impact** (0–1): weekly burden = frequency × per-occurrence minutes, nudged
  by dread.
- **Feasibility** (0–1): per-waste automatability × tool structuredness, capped
  for judgment.
- **Archetype**: `data-integration | retrieval | orchestration | validation |
  routing | decision-support | physical-redesign | limited`.
- **Quadrant**: `quick-win | easy | big-bet | leave | protect`.
- **Rationale**: a transparent, deterministic explanation.

The AI layer (`api/recommend.js`) takes that scored object and writes the
*concrete* "try this week" paragraph — grounded in the role, the tool, and the
output. Offline fallback is a template built from the same opportunity object,
so the feature works fully without a key.

## Roadmap

- Team capture (multiple contributors → one merged map).
- Voice and image capture modes.
- Track adoption over time — did the suggested change actually stick?

## References

Davis (1989) *MIS Quarterly* 13(3); Goodhue & Thompson (1995) *MIS Quarterly*
19(2); Hollnagel (2014) *Safety-I and Safety-II*; Klein, Calderwood & MacGregor
(1989) *IEEE SMC* 19(3); Crandall, Klein & Hoffman (2006) *Working Minds*; Beyer
& Holtzblatt (1998) *Contextual Design*; Ohno (1988) *Toyota Production System*;
Womack & Jones (1996) *Lean Thinking*; Rother & Shook (1999) *Learning to See*;
Parasuraman, Sheridan & Wickens (2000) *IEEE SMC-A* 30(3); Star & Strauss (1999)
*CSCW* 8; Strauss (1985) *Sociological Quarterly* 26(1); Trist & Bamforth (1951)
*Human Relations* 4(1). Full strings in `src/lib/methodology.ts`.
