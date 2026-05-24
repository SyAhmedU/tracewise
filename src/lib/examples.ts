// Two pre-built, fully-worked exemplars from the real operating world — one
// services, one manufacturing. They double as a demo and as a methodological
// model: each shows work-as-done diverging from the SOP, articulation/shadow
// work, human-judgment steps, Lean-waste friction, handoffs and exceptions.
import {
  type Workflow, type Step, type Frequency, type FrictionTag,
  SCHEMA_VERSION, uid,
} from './types';

type StepSpec = Partial<Step> & { action: string };

function S(order: number, p: StepSpec): Step {
  return {
    id: uid('st'), order,
    action: p.action,
    tool: p.tool ?? '',
    inputWhat: p.inputWhat ?? '',
    inputSource: p.inputSource ?? '',
    outputWhat: p.outputWhat ?? '',
    outputDestination: p.outputDestination ?? '',
    timeMins: p.timeMins ?? null,
    frequency: (p.frequency ?? null) as Frequency | null,
    frictionTags: (p.frictionTags ?? []) as FrictionTag[],
    isShadow: p.isShadow ?? false,
    needsJudgment: p.needsJudgment ?? false,
    isPainful: p.isPainful ?? false,
    notes: p.notes ?? '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES — motor insurance claim handling
// ─────────────────────────────────────────────────────────────────────────────
const insuranceClaim = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Motor claims handler',
    context: 'Back office of a general insurer; small team handling motor claims',
    outputName: 'a settled motor insurance claim',
    officialVersion: 'The claims manual: log the claim, verify the policy, assign an assessor if needed, approve and settle within 5 working days.',
    instanceAnchor: 'the Sharma windscreen claim, last Thursday morning',
    trigger: 'A claim notification email lands in the shared team inbox',
    steps: [
      S(1, { action: 'Open the claim email in the shared inbox and read what happened', tool: 'Shared Outlook inbox', inputWhat: 'claim notification', inputSource: 'A client / customer', outputWhat: 'understanding of the claim', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['lookup'], notes: 'The shared inbox is chaotic — finding the right thread takes longer than reading it.' }),
      S(2, { action: 'Re-type the claim details into the claims system', tool: 'Claims system (CMS)', inputWhat: 'claim details from the email', inputSource: 'A client / customer', outputWhat: 'a logged claim record', outputDestination: 'CMS', timeMins: 12, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Everything is already in the email; I just re-key it.' }),
      S(3, { action: 'Check the policy is active and actually covers this incident', tool: 'Policy database (separate system)', inputWhat: 'policy number', inputSource: 'A system / report', outputWhat: 'a cover decision', timeMins: 8, frequency: 'many-times-a-day', frictionTags: ['lookup', 'manual-transfer'], needsJudgment: true, notes: 'Cover wording is ambiguous on glass — I have to interpret it.' }),
      S(4, { action: 'Save the photos and the repair quote from the email into the claim folder', tool: 'Shared drive', inputWhat: 'attachments', inputSource: 'A client / customer', outputWhat: 'filed evidence', outputDestination: 'claim folder', timeMins: 6, frequency: 'many-times-a-day', frictionTags: ['movement', 'manual-transfer'] }),
      S(5, { action: 'Update my own spreadsheet that tracks where each open claim is', tool: 'Personal Excel sheet', inputWhat: 'claim status', inputSource: 'My own notes', outputWhat: 'an up-to-date personal tracker', timeMins: 4, frequency: 'daily', isShadow: true, notes: "The CMS dashboard is unreliable, so the whole team secretly relies on my sheet to know what's open." }),
      S(6, { action: 'Decide whether it needs an assessor or can be fast-tracked', tool: 'Judgement + garage history', inputWhat: 'claim + my experience', inputSource: 'My own notes', outputWhat: 'a routing decision', timeMins: 5, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'I keep a private list of which garages over-quote — not official anywhere.' }),
      S(7, { action: 'Email the assessor and wait for their report to come back', tool: 'Email', inputWhat: 'claim pack', outputWhat: 'assessor request', outputDestination: 'External assessor', timeMins: 10, frequency: 'few-times-a-week', frictionTags: ['wait', 'chasing'], notes: 'Often have to chase twice before anything comes back.' }),
      S(8, { action: 'Calculate the settlement and check it against my authority limit', tool: 'CMS + authority matrix', inputWhat: 'assessor report', inputSource: 'A system / report', outputWhat: 'a settlement figure', timeMins: 9, frequency: 'few-times-a-week', frictionTags: ['lookup'], needsJudgment: true }),
      S(9, { action: 'Send anything over my limit to the team leader for sign-off', tool: 'Email', inputWhat: 'settlement figure', outputWhat: 'an approval request', outputDestination: 'Team leader', timeMins: 5, frequency: 'few-times-a-week', frictionTags: ['approval', 'wait'] }),
      S(10, { action: 'Re-key the approved settlement into the payments system', tool: 'Payments system', inputWhat: 'approved figure', inputSource: 'Team leader', outputWhat: 'a payment instruction', outputDestination: 'Payments system', timeMins: 8, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Third time I have typed the same numbers.' }),
      S(11, { action: 'Email the customer the outcome', tool: 'Email', inputWhat: 'final decision', outputWhat: 'a settled, closed claim', outputDestination: 'A client / customer', timeMins: 6, frequency: 'few-times-a-week' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'External assessor', what: 'the damage assessment report', typicalDelay: 'usually 2–4 days, sometimes a week' },
      { id: uid('ho'), direction: 'wait-on', who: 'Team leader', what: 'sign-off on settlements over my authority limit', typicalDelay: 'same day if they are in, otherwise next morning' },
      { id: uid('ho'), direction: 'hand-to', who: 'Payments team', what: 'the approved payment instruction', typicalDelay: 'paid in the nightly run' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'The customer sends incomplete documents', whatYouDo: 'Email them a checklist, pause the claim, and put a sticky note on my monitor to chase in 3 days', howOften: 'roughly one claim in four' },
      { id: uid('ex'), trigger: 'The policy has lapsed', whatYouDo: 'Stop, escalate to underwriting, and hold the email until they reply', howOften: 'a couple of times a month' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// MANUFACTURING — production work order on a small-batch machine shop
// ─────────────────────────────────────────────────────────────────────────────
const productionWorkOrder = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Production line coordinator',
    context: 'Small-batch CNC machine shop making precision parts to order',
    outputName: 'a completed, inspected production batch',
    officialVersion: 'The traveler/router: pull material, set up, run, in-process check, final QC, pack, book off in ERP — per the work instruction.',
    instanceAnchor: 'the Acme bracket order, batch 412, yesterday morning',
    trigger: 'A printed work order (traveler) lands in my tray from planning',
    steps: [
      S(1, { action: 'Pick up the traveler and read the spec and quantity', tool: 'Paper traveler', inputWhat: 'the work order', inputSource: 'Another team', outputWhat: 'understanding of the job', timeMins: 5, frequency: 'daily' }),
      S(2, { action: 'Walk to stores and pull the raw material for the batch', tool: 'Stores / racking', inputWhat: 'material request', inputSource: 'A colleague', outputWhat: 'raw bar stock at the machine', outputDestination: 'the machine', timeMins: 15, frequency: 'daily', frictionTags: ['movement', 'wait'], notes: 'Storekeeper is often on a forklift; I wait or hunt for the bin myself.' }),
      S(3, { action: 'Check the material grade and cert match the order', tool: 'Cert folder + label', inputWhat: 'material cert', inputSource: 'A system / report', outputWhat: 'a go/no-go on material', timeMins: 6, frequency: 'daily', frictionTags: ['lookup'], needsJudgment: true }),
      S(4, { action: 'Set up and change over the CNC machine for this part', tool: 'CNC + setup sheet', inputWhat: 'setup sheet + tooling', inputSource: 'My own notes', outputWhat: 'a machine ready to run', timeMins: 45, frequency: 'daily', frictionTags: ['rework'], isShadow: true, needsJudgment: true, notes: "I use my own notebook of offsets and machine quirks — the official setup sheet is years out of date." }),
      S(5, { action: 'Run the first article and measure it on the CMM', tool: 'CMM / calipers', inputWhat: 'first part', outputWhat: 'a verified first-off', timeMins: 20, frequency: 'daily', frictionTags: ['wait'], needsJudgment: true, notes: 'Queue for the one CMM; sometimes wait 20 minutes.' }),
      S(6, { action: 'Run the full batch', tool: 'CNC', inputWhat: 'approved first-off', outputWhat: 'machined parts', timeMins: 120, frequency: 'daily' }),
      S(7, { action: 'In-process check, scrap or rework any defects', tool: 'Calipers + scrap bin', inputWhat: 'machined parts', outputWhat: 'good parts', timeMins: 25, frequency: 'daily', frictionTags: ['rework'], needsJudgment: true }),
      S(8, { action: 'Hand-write the quantities and any deviations on the traveler', tool: 'Paper traveler', inputWhat: 'counts + notes', inputSource: 'My own notes', outputWhat: 'an updated traveler', timeMins: 5, frequency: 'daily', frictionTags: ['manual-transfer'] }),
      S(9, { action: 'Walk the parts to QC for final sign-off and wait for release', tool: 'QC bench', inputWhat: 'finished parts + traveler', outputWhat: 'released parts', outputDestination: 'QC inspector', timeMins: 30, frequency: 'daily', frictionTags: ['movement', 'wait', 'approval', 'chasing'], isPainful: true, notes: 'QC is the bottleneck; I end up chasing them so the job ships today.' }),
      S(10, { action: 'Key the completed quantities into the ERP', tool: 'ERP terminal', inputWhat: 'numbers from the traveler', inputSource: 'My own notes', outputWhat: 'a booked-off work order', outputDestination: 'ERP', timeMins: 10, frequency: 'daily', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Re-typing what is already on the paper traveler.' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Storekeeper', what: 'raw material pulled from stores', typicalDelay: 'minutes to half an hour depending how busy they are' },
      { id: uid('ho'), direction: 'wait-on', who: 'QC inspector', what: 'final inspection and release', typicalDelay: 'same day if chased, otherwise next morning' },
      { id: uid('ho'), direction: 'hand-to', who: 'Dispatch', what: 'released, packed parts', typicalDelay: 'goes on the afternoon van' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Material is short in stores', whatYouDo: "Borrow from another job's allocation to keep running, and sort out the paperwork later", howOften: 'most weeks' },
      { id: uid('ex'), trigger: 'The machine breaks down mid-batch', whatYouDo: 'Call maintenance, move to another job meanwhile, and keep chasing them', howOften: 'a few times a month' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

export interface WorkedExample {
  key: string;
  label: string;
  domain: string;
  emoji: string;
  summary: string;
  build: () => Workflow;
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    key: 'insurance-claim',
    label: 'Settling an insurance claim',
    domain: 'Services',
    emoji: '📄',
    summary: 'A motor claims handler, end to end — three re-keyings of the same numbers, a shadow tracker the whole team relies on, and an assessor they keep chasing.',
    build: insuranceClaim,
  },
  {
    key: 'production-work-order',
    label: 'Running a production work order',
    domain: 'Manufacturing',
    emoji: '🏭',
    summary: 'A line coordinator from traveler to ERP — a personal notebook of machine offsets, borrowing material off other jobs, and QC as the bottleneck they chase.',
    build: productionWorkOrder,
  },
];
