// The academic backbone of Tracewise, kept in one place so the UI tooltips,
// stage framing, and the README all draw from the same source of truth.
//
// Tracewise is, methodologically, a lightweight Cognitive Task Analysis: it
// elicits work-as-done (not work-as-imagined), surfaces articulation work, and
// classifies friction with the Lean waste taxonomy — the prerequisite evidence
// for deciding where automation actually fits.

export interface Citation {
  key: string;
  ref: string;
}

export const CITATIONS: Citation[] = [
  { key: 'hollnagel2014', ref: 'Hollnagel, E. (2014). Safety-I and Safety-II: The Past and Future of Safety Management. Ashgate.' },
  { key: 'strauss1985', ref: 'Strauss, A. (1985). Work and the division of labor. The Sociological Quarterly, 26(1), 1–19.' },
  { key: 'starStrauss1999', ref: 'Star, S. L., & Strauss, A. (1999). Layers of silence, arenas of voice: The ecology of visible and invisible work. CSCW, 8, 9–30.' },
  { key: 'klein1989', ref: 'Klein, G. A., Calderwood, R., & MacGregor, D. (1989). Critical decision method for eliciting knowledge. IEEE Transactions on Systems, Man, and Cybernetics, 19(3), 462–472.' },
  { key: 'crandall2006', ref: 'Crandall, B., Klein, G., & Hoffman, R. R. (2006). Working Minds: A Practitioner’s Guide to Cognitive Task Analysis. MIT Press.' },
  { key: 'beyer1998', ref: 'Beyer, H., & Holtzblatt, K. (1998). Contextual Design: Defining Customer-Centered Systems. Morgan Kaufmann.' },
  { key: 'ohno1988', ref: 'Ohno, T. (1988). Toyota Production System: Beyond Large-Scale Production. Productivity Press.' },
  { key: 'womack1996', ref: 'Womack, J. P., & Jones, D. T. (1996). Lean Thinking. Simon & Schuster.' },
  { key: 'rother1999', ref: 'Rother, M., & Shook, J. (1999). Learning to See: Value Stream Mapping. Lean Enterprise Institute.' },
  { key: 'goodhue1995', ref: 'Goodhue, D. L., & Thompson, R. L. (1995). Task-technology fit and individual performance. MIS Quarterly, 19(2), 213–236.' },
  { key: 'parasuraman2000', ref: 'Parasuraman, R., Sheridan, T. B., & Wickens, C. D. (2000). A model for types and levels of human interaction with automation. IEEE Transactions on Systems, Man, and Cybernetics—Part A, 30(3), 286–297.' },
  { key: 'trist1951', ref: 'Trist, E. L., & Bamforth, K. W. (1951). Some social and psychological consequences of the Longwall method of coal-getting. Human Relations, 4(1), 3–38.' },
  { key: 'davis1989', ref: 'Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319–340.' },
];

export interface TheoryNote {
  concept: string;
  whatItIs: string;
  appliesTo: string;   // which part of Tracewise it grounds
  citeKeys: string[];
}

export const THEORY: Record<string, TheoryNote> = {
  workAsDone: {
    concept: 'Work-as-Imagined vs Work-as-Done',
    whatItIs: 'The formally documented process (imagined) almost always diverges from how work is really enacted (done). Capturing the latter is the point.',
    appliesTo: 'The whole tool; the optional "official version" field makes the gap explicit.',
    citeKeys: ['hollnagel2014'],
  },
  articulation: {
    concept: 'Articulation work / invisible work',
    whatItIs: 'The unofficial, often invisible work that bridges the gaps in a formal process so it actually functions — the personal sheet, the WhatsApp thread, the "I just know to…".',
    appliesTo: 'The "shadow step" marker.',
    citeKeys: ['strauss1985', 'starStrauss1999'],
  },
  cdm: {
    concept: 'Critical Decision Method (Cognitive Task Analysis)',
    whatItIs: 'Elicit expertise by recalling one specific past incident, reconstructing its timeline, then deepening with structured probes — far more accurate than asking "what do you usually do?".',
    appliesTo: 'The instance anchor, the step-by-step timeline, and the AI follow-up probes.',
    citeKeys: ['klein1989', 'crandall2006', 'beyer1998'],
  },
  muda: {
    concept: 'Lean waste taxonomy (muda)',
    whatItIs: 'Activity is either value-adding or waste. The classic waste types — waiting, defects/rework, over-processing, transport, motion — are the lens for friction.',
    appliesTo: 'The friction tags and the friction summary.',
    citeKeys: ['ohno1988', 'womack1996', 'rother1999'],
  },
  functionAllocation: {
    concept: 'Function allocation / Levels of Automation',
    whatItIs: 'Not everything should be automated. Tasks needing human judgment, context, or accountability should stay with people; automation suits structured, repetitive work.',
    appliesTo: 'The "needs human judgment" marker (value to preserve, not waste to remove).',
    citeKeys: ['parasuraman2000'],
  },
  fitAndAdoption: {
    concept: 'Task-Technology Fit & Sociotechnical Systems',
    whatItIs: 'Technology improves performance only when it fits the task; imposing misfit technology onto a process no one mapped is what breeds resistance and duplicated work.',
    appliesTo: 'The rationale for capturing the real workflow before aiming AI at it (v2).',
    citeKeys: ['goodhue1995', 'trist1951', 'davis1989'],
  },
};

export function citationFor(...keys: string[]): string {
  return keys
    .map((k) => CITATIONS.find((c) => c.key === k)?.ref)
    .filter(Boolean)
    .join('  ');
}
