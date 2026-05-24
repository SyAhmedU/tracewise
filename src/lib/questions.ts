// The structured backbone of the interview. Directional, option-led questions
// phrased to pull people OFF the official SOP and into what they ACTUALLY do.
// AI follow-up probes (lib/probe.ts) layer on top of this per step.

export interface StageMeta {
  id: string;
  label: string;       // short nav label
  title: string;       // big question / heading
  blurb: string;       // one-line framing under the title
  basis: string;       // short theoretical grounding, shown as a subtle note/tooltip
}

export const STAGES: StageMeta[] = [
  {
    id: 'frame',
    label: 'Frame',
    title: 'What is the one thing you are most often on the hook for?',
    blurb: 'Pick a single recurring output and document that — not your whole job. One thing, start to finish.',
    basis: 'Work-as-done vs work-as-imagined (Hollnagel, 2014): we document the real enactment, and note the official version only to see the gap.',
  },
  {
    id: 'trigger',
    label: 'Trigger',
    title: 'What kicks it off?',
    blurb: 'The real signal that starts the work — a request, a time of day, an email, an event.',
    basis: 'The starting cue of the work episode — the entry point of the Critical Decision Method timeline (Klein et al., 1989).',
  },
  {
    id: 'steps',
    label: 'Timeline',
    title: 'Walk me through the last time you actually did this.',
    blurb: 'Not the way it is supposed to be done — what you literally did, step by step, including the messy parts.',
    basis: 'Critical Decision Method (Klein et al., 1989; Crandall et al., 2006): anchor on one real incident, reconstruct the timeline, then deepen with probes.',
  },
  {
    id: 'handoffs',
    label: 'Handoffs',
    title: 'Who do you wait on, and who waits on you?',
    blurb: 'The seams between people and systems are where time disappears.',
    basis: 'The social half of the sociotechnical system (Trist & Bamforth, 1951); handoffs are where waiting waste concentrates.',
  },
  {
    id: 'exceptions',
    label: 'When it breaks',
    title: 'What goes wrong — and what do you actually do when it does?',
    blurb: 'The unhappy path. This is often where the real effort hides.',
    basis: 'Performance variability and everyday adaptation — the resilience that work-as-done supplies but work-as-imagined ignores (Hollnagel, 2014).',
  },
  {
    id: 'review',
    label: 'Your map',
    title: 'Here is the work, as you actually do it.',
    blurb: 'Check it, fix it, and keep it. This is the honest "as-is" — the ground truth.',
    basis: 'The as-is map and Lean waste profile (Ohno, 1988; Womack & Jones, 1996) — the evidence base for deciding where automation fits (Goodhue & Thompson, 1995).',
  },
];

export const STAGE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s.id, i]));

/** Quick-pick chips offered alongside free text, to make answering fast and directional. */
export const TRIGGER_SUGGESTIONS = [
  'Someone messages / emails me',
  'It is scheduled (a set time)',
  'A ticket / request comes in',
  'A meeting ends',
  'A previous step finishes',
  'A deadline approaches',
];

export const TOOL_SUGGESTIONS = [
  'Email', 'Excel / Sheets', 'WhatsApp', 'A web portal',
  'Word / Docs', 'A database / ERP', 'On paper / by hand', 'Phone call',
];

export const SOURCE_SUGGESTIONS = [
  'A colleague', 'My manager', 'A client / customer',
  'Another team', 'A system / report', 'My own notes',
];

/** Per-step reflective prompts that frame each field in "what you actually do" terms. */
export const STEP_FIELD_PROMPTS = {
  action: 'In plain words, what do you do at this step?',
  tool: 'What do you use to do it?',
  inputWhat: 'What do you need before you can start this step?',
  inputSource: 'Where does that come from?',
  outputWhat: 'What have you produced when this step is done?',
  outputDestination: 'Where does it go next — who or what receives it?',
  notes: 'Anything else true about this step (the workaround, the annoyance)?',
};
