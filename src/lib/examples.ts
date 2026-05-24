// Twelve pre-built, fully-worked exemplars from the real operating world —
// mixed across services, manufacturing, agri-trade, government, healthcare and
// logistics. Mostly India / Tamil Nadu specific (Tirupur knitwear, Madurai
// Mattuthavani jasmine wholesale, TN VAO e-Sevai, PHC ANM, Coimbatore CA,
// Erode rice mill, Chennai restaurant + 3PL + IT support), plus a few globally
// universal ones (café barista, insurance claim, CNC work order).
//
// Each one double-functions as a demo and as a methodological model: every
// example shows work-as-done diverging from the SOP, articulation/shadow work,
// human-judgment steps, Lean-waste friction, real handoffs and the exceptions
// where the unhappy path actually lives.
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
// SERVICES — motor insurance claim handling (global / India urban back-office)
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
// MANUFACTURING — CNC production work order (global / India small machine shop)
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

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES — café barista, morning rush (global / universal)
// ─────────────────────────────────────────────────────────────────────────────
const cafeBarista = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Café barista (morning shift)',
    context: 'A small specialty café, single bar, two-person morning shift',
    outputName: "a customer's drink served at the bar",
    officialVersion: 'Greet, take order, ring on POS, pull shot to recipe, steam milk to temperature, assemble per spec, call the name, hand over.',
    instanceAnchor: 'the 8:40 AM rush this Tuesday',
    trigger: 'A customer reaches the front of the queue (or a mobile order pings)',
    steps: [
      S(1, { action: 'Greet the customer and take their order', tool: 'POS terminal', inputWhat: 'order request', inputSource: 'A client / customer', outputWhat: 'a confirmed order', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true, notes: 'For regulars I know their usual — saves a minute.' }),
      S(2, { action: 'Ring it through and take payment', tool: 'POS terminal', inputWhat: 'order + card / cash', outputWhat: 'a paid ticket', outputDestination: 'POS queue', timeMins: 1, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'Card terminal sometimes hangs at peak.' }),
      S(3, { action: 'Glance at the mobile-order tablet and slot it into the queue mentally', tool: 'Mobile-order tablet', inputWhat: 'incoming online orders', inputSource: 'A system / report', outputWhat: 'a fair queue order', timeMins: 1, frequency: 'many-times-a-day', isShadow: true, needsJudgment: true, notes: 'No system merges in-store and mobile — I hold the real queue in my head.' }),
      S(4, { action: 'Grind, dose and tamp for the espresso', tool: 'Grinder + portafilter', inputWhat: 'fresh beans', outputWhat: 'a prepared puck', timeMins: 1, frequency: 'many-times-a-day' }),
      S(5, { action: 'Pull the shot and watch the colour and flow', tool: 'Espresso machine', inputWhat: 'puck', outputWhat: 'a quality espresso shot', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true, notes: 'If it pours too fast or pale I scrap and re-grind — that is the judgment call.' }),
      S(6, { action: 'Steam milk to the right texture and temperature', tool: 'Steam wand + jug', inputWhat: 'milk', outputWhat: 'textured milk', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true }),
      S(7, { action: 'Pour and assemble the drink to the cup spec', tool: 'Cup + spoon', inputWhat: 'shot + milk', outputWhat: 'a finished drink', timeMins: 1, frequency: 'many-times-a-day' }),
      S(8, { action: 'Write the name on the cup and call it out', tool: 'Marker + voice', inputWhat: 'finished drink', outputWhat: 'a collected drink', outputDestination: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day' }),
      S(9, { action: 'Wipe the wand, knock the puck, reset the station between drinks', tool: 'Cloth + knock-box', inputWhat: 'used kit', outputWhat: 'a ready station', timeMins: 1, frequency: 'many-times-a-day', frictionTags: ['rework'], notes: 'Skip this and the next shot suffers — quietly enforced.' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Floor partner', what: 'cleared tables and a pass-back of mugs at peak', typicalDelay: 'continuous' },
      { id: uid('ho'), direction: 'hand-to', who: 'Customer', what: 'the finished drink', typicalDelay: 'immediate at the bar' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'A drink is sent back as wrong', whatYouDo: 'Remake immediately, apologise, do not log it anywhere — manager hears about it if it repeats', howOften: 'a few times a shift' },
      { id: uid('ex'), trigger: 'Grinder jams or beans run out mid-rush', whatYouDo: 'Shout for backup beans, pre-grind on the spare, eat the 90 seconds of delay', howOften: 'once or twice a week' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES — Chennai restaurant lunch service, Swiggy + Zomato + dine-in
// ─────────────────────────────────────────────────────────────────────────────
const chennaiRestaurant = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Floor captain (small Chennai restaurant)',
    context: 'A 40-seater mid-range Chennai restaurant doing dine-in plus Swiggy and Zomato; single POS, two tablets',
    outputName: 'a lunch service shift closed cleanly',
    officialVersion: 'POS captures all orders; KOT goes to kitchen; food out within 12 minutes; rider handover under 3 minutes; end-of-day report from POS reconciles cash, card, Swiggy and Zomato.',
    instanceAnchor: 'last Saturday lunch — 1:10 PM to 3:00 PM, the peak hour',
    trigger: 'Lunch service opens at 12:30 and orders start landing from three places at once',
    steps: [
      S(1, { action: 'Boot the POS, the Swiggy tablet and the Zomato tablet, check printer and KOT paper', tool: 'POS + 2 tablets + KOT printer', inputWhat: 'shift opening', outputWhat: 'systems ready for service', timeMins: 8, frequency: 'daily', frictionTags: ['rework'], notes: 'Half the time at least one tablet has logged out overnight.' }),
      S(2, { action: 'Seat walk-in guests and take their order on the captain pad', tool: 'Captain order pad + POS', inputWhat: 'guest order', inputSource: 'A client / customer', outputWhat: 'a dine-in order', timeMins: 4, frequency: 'many-times-a-day', needsJudgment: true, notes: 'I judge the table’s pace — kids hungry vs office lunch — and pace the KOT.' }),
      S(3, { action: 'Re-key the captain pad order into the POS so the KOT prints in kitchen', tool: 'POS', inputWhat: 'captain pad', inputSource: 'My own notes', outputWhat: 'a printed KOT', outputDestination: 'kitchen', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Twice writing the same order — paper, then POS.' }),
      S(4, { action: 'Glance at Swiggy / Zomato tablets, accept the orders within the 30-second window', tool: 'Swiggy tablet + Zomato tablet', inputWhat: 'online orders', inputSource: 'A system / report', outputWhat: 'accepted orders + KOTs', outputDestination: 'kitchen', timeMins: 2, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'Miss the window and the order auto-cancels — your rating drops.' }),
      S(5, { action: 'Walk into the kitchen and shout priorities at the chef so dine-in does not get buried', tool: 'Voice + kitchen pass', inputWhat: 'KOT queue', outputWhat: 'a worked-out priority for kitchen', timeMins: 3, frequency: 'many-times-a-day', isShadow: true, needsJudgment: true, frictionTags: ['movement', 'chasing'], notes: 'Nothing official lets me re-order the kitchen queue — I just yell.' }),
      S(6, { action: 'Plate up and serve the dine-in food, check that it matches the order', tool: 'Tray + table number', inputWhat: 'cooked dishes', outputWhat: 'food on the table', outputDestination: 'A client / customer', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
      S(7, { action: 'Hand the packed Swiggy / Zomato order to the rider, scan the order code', tool: 'Swiggy / Zomato app', inputWhat: 'packed order + rider', outputWhat: 'a dispatched order', outputDestination: 'Delivery rider', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'], notes: 'Rider often arrives before food is ready, or food is ready before rider — both annoying.' }),
      S(8, { action: 'Settle the bill at the table — split, UPI, card, sometimes cash', tool: 'POS + UPI device', inputWhat: 'bill request', inputSource: 'A client / customer', outputWhat: 'a settled bill', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true, notes: 'Splits, complimentary water-bottle taken off — owner trusts my call.' }),
      S(9, { action: 'Note in my own diary any complaint, walkout, missed Swiggy item — the stuff POS does not capture', tool: 'A4 spiral diary', inputWhat: 'service incidents', inputSource: 'My own notes', outputWhat: 'a personal day-log', timeMins: 5, frequency: 'daily', isShadow: true, notes: 'Owner reads this every evening before he reads the POS report.' }),
      S(10, { action: 'End-of-shift reconciliation across POS, Swiggy, Zomato and the cash drawer', tool: 'POS report + Swiggy/Zomato dashboards + cash count', inputWhat: 'shift takings', outputWhat: 'a closed, balanced shift', outputDestination: 'Owner', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer', 'lookup'], isPainful: true, notes: 'Three systems, three totals — I copy each into a WhatsApp message to the owner.' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Kitchen (chef)', what: 'cooked plates within ~12 min', typicalDelay: 'usually 10–15 min, longer at peak' },
      { id: uid('ho'), direction: 'wait-on', who: 'Swiggy / Zomato rider', what: 'arrival to pick up the order', typicalDelay: 'unpredictable — 2 min to 15 min' },
      { id: uid('ho'), direction: 'hand-to', who: 'Owner', what: 'the daily reconciled shift summary', typicalDelay: 'every evening' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Wrong item dispatched to a Swiggy customer', whatYouDo: 'Quietly remake, call the rider back if reachable, otherwise eat the complaint and refund', howOften: 'two or three times a week' },
      { id: uid('ex'), trigger: 'Internet drops and tablets go offline', whatYouDo: 'Switch to my phone hotspot, write incoming orders on the captain pad, key into POS when net returns', howOften: 'every monsoon week' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// IT SERVICES — Chennai L2 production support, P2 incident
// ─────────────────────────────────────────────────────────────────────────────
const itSupportIncident = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'L2 production support engineer (IT services)',
    context: 'A Chennai delivery centre supporting a global retail client on a 24×7 follow-the-sun rota',
    outputName: 'a P2 production incident resolved and documented',
    officialVersion: 'ServiceNow auto-routes the P2 to the on-duty engineer; engineer triages, restores service within SLA (4 hours), writes RCA, closes the ticket, links the KB article.',
    instanceAnchor: 'the order-status API 500-spike incident at 2:14 AM IST last Wednesday',
    trigger: 'A ServiceNow P2 incident pings my mobile and pages me',
    steps: [
      S(1, { action: 'Acknowledge the page and read the ticket description', tool: 'ServiceNow + phone', inputWhat: 'incident summary', inputSource: 'A system / report', outputWhat: 'an acknowledged incident', timeMins: 3, frequency: 'few-times-a-week', frictionTags: ['lookup'], notes: 'Descriptions from L1 are often one sentence — half the context is missing.' }),
      S(2, { action: 'Open Splunk and Grafana to see what the symptoms really are', tool: 'Splunk + Grafana', inputWhat: 'time window + service name', outputWhat: 'an actual picture of the symptom', timeMins: 12, frequency: 'few-times-a-week', frictionTags: ['lookup', 'manual-transfer'], notes: 'I have my own saved Splunk queries — the team-wide ones are out of date.' }),
      S(3, { action: 'Check the deploy log for recent changes on the suspect service', tool: 'Jenkins / GitHub releases', inputWhat: 'service name + last 24h', outputWhat: 'a list of recent deploys', timeMins: 6, frequency: 'few-times-a-week', frictionTags: ['lookup'], notes: 'Not every team tags releases — sometimes I git-diff the branch myself.' }),
      S(4, { action: 'Form a hypothesis about the cause based on logs, deploy timing and my experience', tool: 'My head + OneNote runbook', inputWhat: 'all of the above', inputSource: 'My own notes', outputWhat: 'a working hypothesis', timeMins: 8, frequency: 'few-times-a-week', isShadow: true, needsJudgment: true, notes: 'My personal OneNote runbook of past incidents — far more useful than the official KB.' }),
      S(5, { action: 'Decide: can I fix it now, or do I escalate to the dev team?', tool: 'Judgement + severity rules', inputWhat: 'hypothesis + my permissions', outputWhat: 'an escalation decision', timeMins: 5, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Wake a dev at 3 AM only if I am sure — but slow restoration breaches SLA.' }),
      S(6, { action: 'Apply a mitigation — restart pods, roll back a flag, throttle a queue', tool: 'Kubectl / LaunchDarkly / AWS console', inputWhat: 'the chosen fix', outputWhat: 'a mitigated production', timeMins: 15, frequency: 'few-times-a-week', frictionTags: ['rework'], needsJudgment: true }),
      S(7, { action: 'Wait and watch the dashboards for 10–15 minutes to confirm the symptom is really gone', tool: 'Grafana', inputWhat: 'live metrics', outputWhat: 'service-restored confidence', timeMins: 15, frequency: 'few-times-a-week', frictionTags: ['wait'], needsJudgment: true }),
      S(8, { action: 'DM the dev team lead on Slack with a summary so the morning shift is not blind', tool: 'Slack DM', inputWhat: 'what happened', outputWhat: 'a heads-up', outputDestination: 'Dev team', timeMins: 5, frequency: 'few-times-a-week', isShadow: true, notes: 'Not part of the official process — but every L2 does it. Otherwise the next day is chaos.' }),
      S(9, { action: 'Write the RCA in ServiceNow — symptom, root cause, fix, prevention', tool: 'ServiceNow', inputWhat: 'the incident timeline', outputWhat: 'a written RCA', outputDestination: 'ServiceNow', timeMins: 25, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Re-typing what is already in Slack and Splunk — and the ServiceNow form is clunky.' }),
      S(10, { action: 'Update or create the KB article so this never has to be re-triaged from scratch', tool: 'Confluence', inputWhat: 'the RCA', outputWhat: 'a referenceable article', outputDestination: 'Knowledge base', timeMins: 15, frequency: 'few-times-a-week', frictionTags: ['rework'], notes: 'Often skipped under time pressure — and then we triage the same thing again two months later.' }),
      S(11, { action: 'Close the ticket and hand over to the next shift', tool: 'ServiceNow + shift handover doc', inputWhat: 'closed ticket', outputWhat: 'a clean handover', outputDestination: 'Next shift engineer', timeMins: 8, frequency: 'few-times-a-week' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Dev team lead', what: 'code-side fix when mitigation is not enough', typicalDelay: 'within 30 min for P2, longer at night' },
      { id: uid('ho'), direction: 'hand-to', who: 'Next shift engineer', what: 'open issues, watch-items, and the partial RCA', typicalDelay: 'at the shift boundary' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'L1 mis-routed a P3 as P2 just to wake someone up', whatYouDo: 'Downgrade after a quick check, leave a note, and quietly grumble in the team Slack', howOften: 'once a week' },
      { id: uid('ex'), trigger: 'The fix needs production DB access I do not have', whatYouDo: 'Wake the DBA on-call, sit on a call while they execute, take screenshots for audit', howOften: 'a couple of times a month' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFESSIONAL SERVICES — Coimbatore CA, monthly GSTR-3B filing for a client
// ─────────────────────────────────────────────────────────────────────────────
const gstReturnFiling = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'GST tax practitioner (Coimbatore CA office)',
    context: 'A small CA practice in Coimbatore filing monthly returns for around 90 SME clients',
    outputName: "a client's monthly GSTR-3B filed on the GST portal",
    officialVersion: 'Client shares sales / purchase data; reconcile against auto-drafted GSTR-2B; compute output tax and eligible ITC; client pays challan; file GSTR-3B by the 20th.',
    instanceAnchor: "Sundaram Textiles' April 3B filed on 19th May",
    trigger: 'It is the 8th of the month — time to start collecting data for the previous month',
    steps: [
      S(1, { action: 'WhatsApp the client to send sales register, purchase register and bank statement', tool: 'WhatsApp', inputWhat: 'period reminder', outputWhat: 'a chase message', outputDestination: 'Client', timeMins: 3, frequency: 'monthly', frictionTags: ['chasing'], notes: 'Some clients reply same day, some need three reminders.' }),
      S(2, { action: 'Receive the data — usually a mix of Tally backup, Excel and WhatsApp photos of invoices', tool: 'WhatsApp + email', inputWhat: 'client books', inputSource: 'A client / customer', outputWhat: 'raw monthly data', timeMins: 10, frequency: 'monthly', frictionTags: ['wait', 'manual-transfer'], isPainful: true, notes: 'Invoices as phone photos — I have to type the numbers in by hand.' }),
      S(3, { action: 'Download the GSTR-2B from the GST portal for the period', tool: 'GST portal (gst.gov.in)', inputWhat: 'GSTIN + period', outputWhat: 'a JSON / Excel 2B file', outputDestination: 'My computer', timeMins: 8, frequency: 'monthly', frictionTags: ['wait', 'lookup'], notes: 'Portal OTP, captcha, sometimes session times out — easily 8 min just to log in.' }),
      S(4, { action: 'Reconcile purchase register against 2B in Excel — flag missing invoices and supplier-side mistakes', tool: 'Excel + VLOOKUP', inputWhat: 'purchase data + 2B', outputWhat: 'a reconciled list', timeMins: 35, frequency: 'monthly', frictionTags: ['lookup', 'rework'], needsJudgment: true, notes: 'Vendor PAN typed wrong, invoice number with extra spaces — judgement on whether it is still the same invoice.' }),
      S(5, { action: 'Call or WhatsApp the client about discrepancies and decide what to do with each', tool: 'Phone + WhatsApp', inputWhat: 'reconciled list', outputWhat: 'agreed treatment per mismatch', outputDestination: 'Client', timeMins: 20, frequency: 'monthly', frictionTags: ['wait', 'chasing'], needsJudgment: true }),
      S(6, { action: 'Decide which ITC is eligible — block credits, RCM, personal-use items', tool: 'Judgment + GST rules + my own checklist', inputWhat: 'agreed purchases', inputSource: 'My own notes', outputWhat: 'a final eligible-ITC figure', timeMins: 15, frequency: 'monthly', isShadow: true, needsJudgment: true, notes: 'I keep a personal checklist of common blocked credits — never written down anywhere official.' }),
      S(7, { action: 'Compute output tax, ITC, cash payable and prepare the 3B summary', tool: 'Excel template', inputWhat: 'all of the above', outputWhat: 'a 3B figure-set', timeMins: 12, frequency: 'monthly' }),
      S(8, { action: 'WhatsApp the client the payable figure with a screenshot of the challan to be paid', tool: 'GST portal + WhatsApp', inputWhat: 'payable figure', outputWhat: 'a created challan + a paid challan', outputDestination: 'Client', timeMins: 8, frequency: 'monthly', frictionTags: ['wait'], notes: 'Then I wait for the client to net-bank it — sometimes hours, sometimes the next day.' }),
      S(9, { action: 'Once cash ledger is credited, enter the figures into the 3B on the portal and submit', tool: 'GST portal', inputWhat: 'the 3B summary', outputWhat: 'a submitted 3B', outputDestination: 'GSTN', timeMins: 18, frequency: 'monthly', frictionTags: ['manual-transfer', 'wait'], notes: 'Portal is slow on the 19th and 20th — login fails, session drops, I keep retrying.' }),
      S(10, { action: 'EVC/OTP confirm, download the filed acknowledgement PDF', tool: 'GST portal', inputWhat: 'filed return', outputWhat: 'an acknowledgement PDF', timeMins: 5, frequency: 'monthly', frictionTags: ['wait'] }),
      S(11, { action: 'Send the acknowledgement to the client on WhatsApp and update my own filing tracker', tool: 'WhatsApp + Google Sheet', inputWhat: 'ack PDF', inputSource: 'My own notes', outputWhat: 'a closed-month record', outputDestination: 'Client + my tracker', timeMins: 5, frequency: 'monthly', isShadow: true, notes: 'My personal Google Sheet of which client filed which month — the office software cannot show this view.' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Client', what: 'sales / purchase data and challan payment', typicalDelay: 'days; many clients only respond near the 20th' },
      { id: uid('ho'), direction: 'wait-on', who: 'GST portal (GSTN)', what: 'page response, OTP, ledger update', typicalDelay: 'minutes; much worse on the 19th–20th' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: "Supplier hasn't filed their GSTR-1, so an invoice is missing from 2B", whatYouDo: 'Either chase the supplier through the client, or defer the ITC to next month — judgement call on which is realistic', howOften: 'most clients, most months' },
      { id: uid('ex'), trigger: 'Client misses the 20th deadline', whatYouDo: 'File late with interest, calculate it manually, and warn the client about the late fee', howOften: 'once or twice a month across the practice' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNMENT SERVICE — TN Village Administrative Officer, community certificate
// via the e-Sevai portal
// ─────────────────────────────────────────────────────────────────────────────
const vaoCommunityCertificate = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Village Administrative Officer (TN Revenue Dept)',
    context: 'A taluk in rural Tamil Nadu; the VAO covers three revenue villages and uses TN e-Sevai / CAN portal',
    outputName: 'a community certificate issued through the e-Sevai workflow',
    officialVersion: 'Citizen applies on e-Sevai or through a common-service-centre; VAO verifies, recommends; Revenue Inspector / Tahsildar signs digitally; certificate is issued within the citizen-charter time limit.',
    instanceAnchor: 'a school admission application from Selvi village, processed last Tuesday',
    trigger: 'A pending application appears in my e-Sevai VAO queue',
    steps: [
      S(1, { action: 'Log in to the e-Sevai portal and pull the new application', tool: 'TN e-Sevai portal + browser', inputWhat: 'pending queue', inputSource: 'A system / report', outputWhat: 'the application on screen', timeMins: 6, frequency: 'daily', frictionTags: ['lookup', 'wait'], notes: 'Login depends on the office router and the state network — both flaky.' }),
      S(2, { action: 'Download and read the applicant-submitted documents — Aadhaar, ration card, school certificates, parent certificates', tool: 'e-Sevai attachments', inputWhat: 'application + attachments', outputWhat: 'a sense of the case', timeMins: 8, frequency: 'daily', frictionTags: ['lookup'] }),
      S(3, { action: 'Cross-check the family name against my village register and the old parent-side caste records', tool: 'Paper village register + chitta-adangal', inputWhat: 'applicant family + lineage', inputSource: 'My own notes', outputWhat: 'a confirmed lineage', timeMins: 15, frequency: 'daily', frictionTags: ['lookup', 'movement'], isShadow: true, needsJudgment: true, notes: 'The official records are on paper in the taluk office — my own village register is what I actually use day to day.' }),
      S(4, { action: 'Visit the village for field verification — talk to neighbours, ward member, sometimes the school', tool: 'Two-wheeler + voice', inputWhat: 'address from application', outputWhat: 'a field-verified picture', outputDestination: 'My own notes', timeMins: 90, frequency: 'few-times-a-week', frictionTags: ['movement', 'wait'], needsJudgment: true, notes: 'Family often not home in the day — they are in the fields. I go again in the evening.' }),
      S(5, { action: 'Where caste / parent-side records conflict, make the judgement call on which is correct', tool: 'Judgment + elder testimony + thumb-impression statements', inputWhat: 'conflicting documents', outputWhat: 'a defensible decision', timeMins: 20, frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'This is the hard part — and where any complaint will land back on me.' }),
      S(6, { action: 'Write up the verification report and scan / photograph it for upload', tool: 'A4 paper + smartphone scanner', inputWhat: 'verification findings', inputSource: 'My own notes', outputWhat: 'a scanned report', timeMins: 12, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'], notes: 'Hand-written, then phone-scanned, then uploaded — three steps for one record.' }),
      S(7, { action: 'Upload the report and recommend (or reject) on the e-Sevai portal', tool: 'TN e-Sevai portal', inputWhat: 'scanned report + decision', outputWhat: 'a forwarded application', outputDestination: 'Revenue Inspector / Tahsildar', timeMins: 10, frequency: 'few-times-a-week', frictionTags: ['wait', 'manual-transfer'], notes: 'Portal session times out if I take too long — I have lost a recommendation mid-upload before.' }),
      S(8, { action: 'Update my own log of applications and where they are, because the portal view is poor', tool: 'Personal notebook + WhatsApp', inputWhat: 'today’s actions', inputSource: 'My own notes', outputWhat: 'a personal status tracker', timeMins: 5, frequency: 'daily', isShadow: true, notes: 'When applicants come asking, I look at my notebook — not the portal.' }),
      S(9, { action: 'Field calls from applicants and intermediaries asking for status', tool: 'Personal mobile', inputWhat: 'enquiries', inputSource: 'A client / customer', outputWhat: 'a status update', timeMins: 25, frequency: 'daily', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'My number is everywhere. Half my day is answering "anna, what is the status?".' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'hand-to', who: 'Revenue Inspector / Tahsildar', what: 'the recommended application for digital signature', typicalDelay: '1–3 days, longer if the Tahsildar is on tour' },
      { id: uid('ho'), direction: 'wait-on', who: 'Applicant', what: 'missing or corrected documents', typicalDelay: 'days to weeks' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Name in Aadhaar does not match name in school records', whatYouDo: 'Hold the application, ask applicant for an affidavit, restart the verification with the corrected name', howOften: 'roughly one in three applications' },
      { id: uid('ex'), trigger: 'A local political intermediary pressures me to expedite', whatYouDo: 'Stick to the queue order, document the request in my notebook, escalate up to the Tahsildar if it persists', howOften: 'most weeks' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// HEALTHCARE — PHC / Tamil Nadu rural ANM, antenatal home visit + HMIS reporting
// ─────────────────────────────────────────────────────────────────────────────
const anmAntenatalVisit = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'ANM (Auxiliary Nurse Midwife) at a rural PHC',
    context: 'A sub-centre in rural Tamil Nadu covering three hamlets; one ANM, one ASHA worker per hamlet',
    outputName: 'an antenatal home visit completed and reported',
    officialVersion: 'Per the RCH protocol: weekly home visit for every registered pregnant woman, check BP / weight / Hb / fetal heart, give IFA tablets, counsel, enter in the e-HMS portal same day, escalate any HRP to the medical officer.',
    instanceAnchor: 'Kavitha (G2, 28 weeks), Vellaiyammal Nagar, visited yesterday',
    trigger: 'The weekly visit plan is due — the ASHA tells me Kavitha is at home this morning',
    steps: [
      S(1, { action: 'Pull the week’s beneficiary list from the PHC register and the MCP-card stack', tool: 'PHC paper register + MCP cards', inputWhat: 'beneficiary list', inputSource: 'A system / report', outputWhat: "today’s visit plan", timeMins: 15, frequency: 'weekly', frictionTags: ['lookup'], notes: 'Beneficiaries also exist on the e-HMS portal but the network is too slow to use in the morning.' }),
      S(2, { action: 'WhatsApp / call the ASHA worker for the hamlet and agree the order of visits', tool: 'Mobile phone', inputWhat: 'visit plan', outputWhat: 'an agreed route', outputDestination: 'ASHA worker', timeMins: 10, frequency: 'weekly', frictionTags: ['chasing'], notes: 'ASHA knows who is at home and who is in the field — no system has this.' }),
      S(3, { action: 'Walk / two-wheeler to the hamlet with the visit bag (BP cuff, weighing scale, Hb strip, IFA tablets)', tool: 'Visit bag + two-wheeler', inputWhat: 'visit plan + kit', outputWhat: 'me on site', outputDestination: 'beneficiary house', timeMins: 25, frequency: 'weekly', frictionTags: ['movement', 'wait'] }),
      S(4, { action: 'Measure BP, weight, Hb; check fetal heart with the fetoscope', tool: 'BP cuff, scale, Hb strip, fetoscope', inputWhat: 'the woman herself', inputSource: 'A client / customer', outputWhat: 'a set of antenatal readings', timeMins: 20, frequency: 'weekly' }),
      S(5, { action: 'Decide whether this is high-risk — and if so, refer to the medical officer', tool: 'Judgment + RCH HRP criteria', inputWhat: 'readings + history + my own gut from prior visits', outputWhat: 'a risk decision', timeMins: 5, frequency: 'weekly', needsJudgment: true, notes: 'I have caught BP rises early just from seeing her last week — that comparison is in my head, not the system.' }),
      S(6, { action: 'Counsel her — diet, IFA tablet adherence, danger signs, institutional delivery, JSY benefits', tool: 'Voice + IEC flipbook', inputWhat: 'her situation', outputWhat: 'a counselled mother', timeMins: 15, frequency: 'weekly', needsJudgment: true, notes: 'I tailor it — what works for a first-time mother is not what works for a second-time one.' }),
      S(7, { action: 'Hand over IFA / calcium tablets and update the MCP card', tool: 'IFA stock + MCP card + pen', inputWhat: 'monthly stock', outputWhat: 'tablets dispensed + MCP entry', outputDestination: 'A client / customer', timeMins: 8, frequency: 'weekly', frictionTags: ['manual-transfer'] }),
      S(8, { action: 'At the next house, repeat — and at the end of the round, sit with my own visit diary to record what I saw', tool: 'Personal diary', inputWhat: "the round's observations", inputSource: 'My own notes', outputWhat: 'a personal weekly log', timeMins: 20, frequency: 'weekly', isShadow: true, needsJudgment: true, notes: "I track the high-risk women here — my diary is what I actually use; the portal is for reporting." }),
      S(9, { action: 'Back at the sub-centre, copy the readings into the PHC antenatal register', tool: 'PHC antenatal register', inputWhat: 'the round notes', inputSource: 'My own notes', outputWhat: 'a register entry per visit', timeMins: 20, frequency: 'weekly', frictionTags: ['manual-transfer'], isPainful: true }),
      S(10, { action: 'Open the e-HMS portal on the office tablet and key in the same data for each beneficiary', tool: 'TN e-HMS / RCH portal', inputWhat: 'register entries', outputWhat: 'portal entries', outputDestination: 'TN HMIS', timeMins: 30, frequency: 'weekly', frictionTags: ['manual-transfer', 'wait'], isPainful: true, notes: 'Third time I enter the same numbers. Network drops half the time, I retype the page.' }),
      S(11, { action: 'WhatsApp the medical officer about any HRP cases that need attention', tool: 'WhatsApp', inputWhat: 'HRP list', outputWhat: 'an MO alert', outputDestination: 'PHC Medical Officer', timeMins: 5, frequency: 'weekly', isShadow: true, frictionTags: ['chasing'], notes: 'Not an official channel, but the only one that gets a same-day reply.' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'ASHA worker', what: "today's hamlet route and home availability", typicalDelay: 'morning' },
      { id: uid('ho'), direction: 'hand-to', who: 'PHC Medical Officer', what: 'HRP cases for review and referral', typicalDelay: 'same day if WhatsApp, otherwise weekly review' },
      { id: uid('ho'), direction: 'hand-to', who: 'Block Programme Manager', what: 'monthly coverage and HMIS reports', typicalDelay: 'monthly' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Network is down and e-HMS will not load for two days', whatYouDo: 'Keep the register and the diary current, batch-enter to e-HMS on the third day', howOften: 'most weeks in monsoon' },
      { id: uid('ex'), trigger: 'Beneficiary is not at home twice in a row', whatYouDo: 'Ask the ASHA to set up a definite time, otherwise note as missed visit and follow up the next round', howOften: 'two or three a month per hamlet' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// MANUFACTURING / EXPORTS — Tirupur knitwear export merchandiser
// ─────────────────────────────────────────────────────────────────────────────
const tirupurKnitwearOrder = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Knitwear export merchandiser',
    context: 'A mid-sized Tirupur knitwear export house running orders for European high-street buyers; sourcing yarn from Erode, dyeing at a CETP-linked house, stitching mixed in-house and on job-work units',
    outputName: 'a shipped knitwear export order',
    officialVersion: 'On receipt of the buyer’s tech-pack and PO, plan yarn → knitting → dyeing → cutting → stitching → finishing → final inspection → carton packing → shipment within the agreed lead-time, against the buyer’s costing.',
    instanceAnchor: "the buyer's spring t-shirt order, 18,000 pieces, last shipment",
    trigger: 'A confirmed PO from the buying agent lands in my email with the tech-pack and shipment date',
    steps: [
      S(1, { action: 'Read the tech-pack, costing sheet and PO; build the time-and-action plan back from the ship date', tool: 'Email + Excel time-and-action sheet', inputWhat: 'PO + tech-pack', inputSource: 'A client / customer', outputWhat: 'a working plan back from ship date', timeMins: 90, frequency: 'weekly', needsJudgment: true, notes: 'Buyer always asks for 60 days; I privately know it takes 70.' }),
      S(2, { action: 'Send yarn enquiry to two Erode spinners — count, blend, lot, quantity, due date', tool: 'WhatsApp + email', inputWhat: 'BOM from tech-pack', outputWhat: 'yarn enquiries', outputDestination: 'Yarn suppliers', timeMins: 30, frequency: 'weekly', frictionTags: ['chasing', 'wait'] }),
      S(3, { action: 'Negotiate yarn rate by phone and place the yarn PO', tool: 'Phone + Tally / ERP', inputWhat: 'spinner quotes', outputWhat: 'a yarn purchase order', outputDestination: 'Selected spinner', timeMins: 25, frequency: 'weekly', needsJudgment: true, notes: 'Rate is hand-shake based on market sentiment that morning — not on a system.' }),
      S(4, { action: 'Coordinate yarn delivery and book a slot at the knitting unit', tool: 'WhatsApp + knitting unit log', inputWhat: 'yarn ETA + knitting capacity', outputWhat: 'a knitting slot', outputDestination: 'Knitting unit', timeMins: 20, frequency: 'weekly', frictionTags: ['wait', 'chasing'] }),
      S(5, { action: 'Send approved lab-dip / shade reference to the dyeing house with the greige fabric', tool: 'WhatsApp + dyeing job slip', inputWhat: 'shade card from buyer', outputWhat: 'dyeing instructions', outputDestination: 'Dyeing house', timeMins: 20, frequency: 'weekly', frictionTags: ['wait'], needsJudgment: true, notes: 'Dye houses run by lot — they tell me when, I cannot dictate.' }),
      S(6, { action: 'Track each stage on my personal WIP Excel — yarn, knit, dye, cut, sew, finish, pack', tool: 'Personal Excel WIP tracker', inputWhat: 'daily updates from each vendor', inputSource: 'My own notes', outputWhat: 'a live WIP picture', timeMins: 25, frequency: 'daily', isShadow: true, frictionTags: ['manual-transfer'], notes: 'ERP cannot show WIP across in-house and job-work units. My Excel is what production planning actually runs on.' }),
      S(7, { action: 'WhatsApp the buying agent a daily WIP photo and answer their queries', tool: 'WhatsApp', inputWhat: 'WIP Excel screenshot', outputWhat: 'a daily status update', outputDestination: 'Buying agent', timeMins: 15, frequency: 'daily', frictionTags: ['chasing'] }),
      S(8, { action: 'Submit the size-set and PP sample, then chase the buyer for written comments', tool: 'Courier + email', inputWhat: 'sample garments', outputWhat: 'buyer comments', outputDestination: 'Buyer', timeMins: 25, frequency: 'weekly', frictionTags: ['wait', 'chasing'], isPainful: true, notes: 'Often the buyer comments arrive AFTER bulk cutting has started — judgment call to wait or proceed.' }),
      S(9, { action: 'Allocate cut bundles to in-house lines and to job-work stitching units; balance load across them', tool: 'Cutting plan + job-work registers', inputWhat: 'cut bundles + line capacity', outputWhat: 'an allocation plan', outputDestination: 'Production manager', timeMins: 40, frequency: 'weekly', needsJudgment: true, notes: 'Mix is judgement: in-house for the tricky styles, job-work for the basic ones.' }),
      S(10, { action: 'Walk the floor twice a day to see real progress, not just what is reported', tool: 'Feet + voice', inputWhat: 'reports vs reality', outputWhat: 'a corrected WIP', timeMins: 45, frequency: 'daily', frictionTags: ['movement'], isShadow: true, needsJudgment: true, notes: 'What the supervisors WhatsApp me is always rosier than the floor — I have to see it.' }),
      S(11, { action: 'Coordinate final inspection — internal AQL first, then the buyer-nominated third-party inspection', tool: 'AQL checklist + inspection report', inputWhat: 'finished goods', outputWhat: 'a passed inspection', outputDestination: 'Buyer / inspection agency', timeMins: 90, frequency: 'weekly', frictionTags: ['wait', 'rework', 'approval'], needsJudgment: true, notes: 'Rejection means re-iron, re-pack, re-inspect — bad day.' }),
      S(12, { action: 'Coordinate carton packing, ratio packing per buyer manual, and CHA pick-up to Chennai port', tool: 'Packing list + CHA email', inputWhat: 'inspected goods', outputWhat: 'a dispatched container', outputDestination: 'CHA / shipping line', timeMins: 60, frequency: 'weekly', frictionTags: ['manual-transfer'], notes: 'Ratio packing is fiddly and re-packing for a single mistake costs a day.' }),
      S(13, { action: 'Send shipping documents to the buyer and update the order as shipped in the ERP', tool: 'Email + ERP', inputWhat: 'shipping bill + BL + invoice', outputWhat: 'a closed export order', outputDestination: 'Buyer + ERP', timeMins: 25, frequency: 'weekly', frictionTags: ['manual-transfer'] }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Yarn supplier (Erode spinners)', what: 'dyed-quality yarn delivered on time', typicalDelay: '7–10 days' },
      { id: uid('ho'), direction: 'wait-on', who: 'Dyeing house', what: 'shade-matched fabric back from dye lot', typicalDelay: '5–8 days, longer in monsoon (ZLD load)' },
      { id: uid('ho'), direction: 'wait-on', who: 'Buyer / buying agent', what: 'sample approvals and comments', typicalDelay: 'unpredictable; often the bottleneck' },
      { id: uid('ho'), direction: 'hand-to', who: 'CHA', what: 'cartons + export documents for shipment', typicalDelay: '2–3 days to load at Chennai port' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Shade does not match on the dye lot', whatYouDo: 'Negotiate with the dye house — re-dye or accept with a written buyer waiver; eat the lead-time hit', howOften: 'a couple of styles per season' },
      { id: uid('ex'), trigger: 'Third-party inspection fails on measurements / workmanship', whatYouDo: 'Sort 100%, re-iron, re-pack, request re-inspection — costs a day and a panic', howOften: 'two or three orders a season' },
      { id: uid('ex'), trigger: 'Buyer changes the trims after bulk is in production', whatYouDo: 'Negotiate an air-freight cost share, or push the ship date — depends on the buyer’s leverage', howOften: 'often' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// AGRI-MANUFACTURING — Erode / Tiruchengode rice mill paddy batch
// ─────────────────────────────────────────────────────────────────────────────
const riceMillBatch = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Rice mill operations supervisor',
    context: 'A 4 ton/hr parboiled rice mill in the Erode / Tiruchengode belt; sources paddy from local farmers and brokers, sells to FCI, government PDS and the open market',
    outputName: 'a paddy batch processed and bagged for despatch',
    officialVersion: 'Receive paddy → weigh → moisture and grade check → soak → parboil → dry → de-husk → polish → grade → bag → store / despatch, all with batch-wise records.',
    instanceAnchor: 'a 12-ton ADT-39 paddy lot from a Bhavani-area farmer, processed last Tuesday',
    trigger: 'A lorry arrives at the mill gate with paddy and the broker’s slip',
    steps: [
      S(1, { action: 'Direct the lorry to the weighbridge and record gross weight', tool: 'Weighbridge + register', inputWhat: 'arrived lorry', inputSource: 'A client / customer', outputWhat: 'a gross weight record', timeMins: 10, frequency: 'daily', frictionTags: ['wait'], notes: 'If two lorries arrive together, one waits — single weighbridge.' }),
      S(2, { action: 'Sample paddy from multiple bag points and check moisture with the meter', tool: 'Paddy moisture meter + sampling spike', inputWhat: 'representative sample', outputWhat: 'a moisture reading', timeMins: 12, frequency: 'daily', needsJudgment: true, notes: 'Sampling skill matters — a bad sample changes the rate by a rupee or two a kg.' }),
      S(3, { action: 'Assess variety, broken percentage, foreign matter; agree a deduction or rate cut with the farmer / broker', tool: 'Visual + my own grade chart', inputWhat: 'sample', inputSource: 'My own notes', outputWhat: 'an agreed rate', timeMins: 20, frequency: 'daily', isShadow: true, needsJudgment: true, isPainful: true, notes: "I keep a personal book of typical deductions per variety per season — never written in the mill register." }),
      S(4, { action: 'Direct unloading at the drying yard; if moisture > 14% schedule for sun-drying first', tool: 'Tarpaulin yard + labour', inputWhat: 'graded paddy', outputWhat: 'paddy at drying yard', outputDestination: 'drying yard', timeMins: 60, frequency: 'daily', frictionTags: ['movement', 'wait'] }),
      S(5, { action: 'Re-weigh empty lorry and settle payment terms', tool: 'Weighbridge + cash / cheque', inputWhat: 'tare weight', outputWhat: 'a net weight + payment', outputDestination: 'Farmer / broker', timeMins: 15, frequency: 'daily', frictionTags: ['manual-transfer'] }),
      S(6, { action: 'Once moisture is right, feed paddy into pre-cleaner → soaking tank → parboiling vessel', tool: 'Pre-cleaner + soaking + parboiling line', inputWhat: 'dried paddy', outputWhat: 'parboiled paddy', timeMins: 240, frequency: 'daily', frictionTags: ['wait'], needsJudgment: true, notes: 'Soaking time changes with variety and season — judgement from years of doing it.' }),
      S(7, { action: 'Mechanical or sun drying to bring it back to mill-safe moisture', tool: 'Dryer / sun yard', inputWhat: 'parboiled paddy', outputWhat: 'milling-ready paddy', timeMins: 360, frequency: 'daily', frictionTags: ['wait', 'movement'] }),
      S(8, { action: 'De-husk in the sheller, polish in the polisher, separate broken on the grader', tool: 'Sheller + polisher + grader', inputWhat: 'dry paddy', outputWhat: 'graded rice + by-products (husk, bran, brokens)', timeMins: 180, frequency: 'daily', frictionTags: ['rework'], needsJudgment: true, notes: 'Operator must adjust polish to keep brokens down — too aggressive ruins yield.' }),
      S(9, { action: 'Watch the polish percentage and total milling yield; if yield is off, stop and re-set', tool: 'Yield calculation + my mental benchmark', inputWhat: 'output vs input', inputSource: 'My own notes', outputWhat: 'a corrected setting', timeMins: 25, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'There is no SCADA — I do this by feel and rough Excel.' }),
      S(10, { action: 'Bag the rice — 25 / 50 kg bags as per buyer; hand-sew or stitch-close', tool: 'Bagging machine + stitching machine + labour', inputWhat: 'milled rice', outputWhat: 'bagged rice', timeMins: 90, frequency: 'daily', frictionTags: ['movement'] }),
      S(11, { action: 'Move bags to godown stack; mark lot number and date on the stack', tool: 'Trolley + chalk', inputWhat: 'bags', outputWhat: 'stacked, identified lot', outputDestination: 'Godown', timeMins: 45, frequency: 'daily', frictionTags: ['movement', 'manual-transfer'] }),
      S(12, { action: 'Update the daily mill register and message totals to the owner', tool: 'Paper register + WhatsApp', inputWhat: 'shift totals', inputSource: 'My own notes', outputWhat: 'a closed shift', outputDestination: 'Mill owner', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'TANGEDCO (power supply)', what: 'uninterrupted power for the milling run', typicalDelay: 'unscheduled cuts most weeks; generator covers short ones' },
      { id: uid('ho'), direction: 'wait-on', who: 'Labour gang leader', what: 'unloading and bagging crew availability', typicalDelay: 'usually morning, sometimes late' },
      { id: uid('ho'), direction: 'hand-to', who: 'Transport contractor', what: 'bagged rice loaded for FCI / open market despatch', typicalDelay: 'next day' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Paddy arrives soaked from rain', whatYouDo: 'Refuse, or accept at a big rate cut and double drying time — judgement based on relationship with the farmer', howOften: 'most weeks in monsoon' },
      { id: uid('ex'), trigger: 'Power cut mid-parboil', whatYouDo: 'Switch to generator if short, otherwise extend cycle and re-plan the day’s output', howOften: 'two or three times a week' },
      { id: uid('ex'), trigger: 'Yield comes in below my mental benchmark', whatYouDo: 'Stop, inspect rubber rolls and polisher, adjust and re-run a small lot', howOften: 'a few times a month' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// AGRI-TRADE — Madurai jasmine wholesale commission agent at Mattuthavani
// ─────────────────────────────────────────────────────────────────────────────
const jasmineWholesale = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Jasmine wholesale commission agent (Madurai Malli)',
    context: 'A wholesale flower stall at the Madurai Mattuthavani regulated flower market; deals in GI-tagged Madurai Malli; trades cash, hand-written ledger, opens at 3 AM',
    outputName: "a day's flower trade settled and farmers paid",
    officialVersion: 'Farmer brings flowers → market weighing → wholesale auction / negotiation → retailers pick up → commission deducted → farmer paid; commission as per the market by-laws.',
    instanceAnchor: 'the festival-week trade last Friday before Aadi (heavy demand day)',
    trigger: 'Farmers arrive at the stall from 3 AM with the night-picked flower baskets',
    steps: [
      S(1, { action: 'Open the stall, lay out tarpaulin, prepare the spring scale and the day ledger', tool: 'Stall, tarpaulin, spring balance, ledger', inputWhat: 'day starts', outputWhat: 'an opened stall', timeMins: 20, frequency: 'daily' }),
      S(2, { action: 'Receive farmers as they arrive, weigh each lot, record kg against the farmer’s name', tool: 'Spring balance + ledger', inputWhat: 'farmer baskets', inputSource: 'A client / customer', outputWhat: 'a weighed lot per farmer', timeMins: 60, frequency: 'daily', frictionTags: ['wait'], notes: 'In peak season I can have 30 farmers in two hours — the queue itself becomes the bottleneck.' }),
      S(3, { action: 'Assess freshness, bud size and the variety mix; that decides the morning rate', tool: 'Visual + my hand', inputWhat: 'each lot', inputSource: 'My own notes', outputWhat: 'a grade per lot', timeMins: 30, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'No instrument — it is pure eye and touch, built up over years.' }),
      S(4, { action: 'Set the day’s wholesale rate based on supply at the market, festival calendar, weather and what other agents are calling out', tool: 'Voice + WhatsApp group with other agents', inputWhat: "today's supply + demand signal", inputSource: 'My own notes', outputWhat: 'a working rate range', timeMins: 25, frequency: 'daily', isShadow: true, needsJudgment: true, isPainful: true, notes: 'There is a WhatsApp group of senior agents — that is where the real rate forms, not the market notice board.' }),
      S(5, { action: 'Open the call-out auction / direct negotiation as retailers arrive', tool: 'Voice + cash', inputWhat: 'flowers + retailers', inputSource: 'A client / customer', outputWhat: 'sold lots at a settled price', outputDestination: 'Retailers', timeMins: 120, frequency: 'daily', needsJudgment: true, notes: 'I read each retailer — temple buyer pays differently from wedding decorator from string-maker.' }),
      S(6, { action: 'Bundle and pack sold lots in palm-leaf baskets or plastic crates for the retailer to carry', tool: 'Palm leaf baskets / crates + labour', inputWhat: 'sold lots', outputWhat: 'packed flowers', outputDestination: 'Retailer’s carrier', timeMins: 30, frequency: 'daily', frictionTags: ['movement'] }),
      S(7, { action: 'Collect cash, mark paid against each retailer; allow credit only for trusted regulars', tool: 'Cash + ledger', inputWhat: 'sale + cash', outputWhat: 'a paid (or credited) entry', timeMins: 25, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'My private credit list — never shared with anyone, including my own son.' }),
      S(8, { action: 'Compute each farmer’s due — kg sold × price − my commission; pay in cash, get thumb-impression on the ledger', tool: 'Calculator + ledger + cash', inputWhat: 'day register', inputSource: 'My own notes', outputWhat: 'farmer payments + acknowledgements', outputDestination: 'Farmer', timeMins: 60, frequency: 'daily', frictionTags: ['manual-transfer', 'wait'], isPainful: true, notes: 'All on paper. A mistake here becomes a relationship problem tomorrow.' }),
      S(9, { action: 'Note unsold flowers, decide whether to push them at a cut rate to string-makers or write them off', tool: 'Eye + voice', inputWhat: 'leftover stock', outputWhat: 'a clearance decision', timeMins: 15, frequency: 'daily', needsJudgment: true, notes: 'Flowers do not last past noon — every minute of indecision is value lost.' }),
      S(10, { action: 'Close the day’s ledger — totals in, totals out, commission earned; tally cash drawer', tool: 'Ledger + cash count', inputWhat: 'the day', inputSource: 'My own notes', outputWhat: 'a closed day-book', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Farmers', what: 'fresh flower lots delivered by 5 AM', typicalDelay: 'first hours of the day' },
      { id: uid('ho'), direction: 'hand-to', who: 'Retailers (temples, decorators, string-makers)', what: 'packed lots at settled price', typicalDelay: 'continuous through the morning' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'Rain overnight — supply collapses, prices triple', whatYouDo: 'Ration to regulars first, let walk-ins pay the spot premium, manage farmer expectations on payouts', howOften: 'monsoon weeks' },
      { id: uid('ex'), trigger: 'Trusted retailer fails to pay credit on time', whatYouDo: 'Stop further credit, send a low-key reminder, escalate only if it crosses a threshold I hold in my head', howOften: 'a few retailers a year' },
      { id: uid('ex'), trigger: 'Market officer dispute over weighing accuracy', whatYouDo: 'Switch to the market scale, document the difference, settle the lot under protest', howOften: 'occasional' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS — Chennai 3PL warehouse picker, e-commerce pick list
// ─────────────────────────────────────────────────────────────────────────────
const warehousePicker = (): Workflow => {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: 'Warehouse order picker (3PL near Chennai)',
    context: 'A third-party e-commerce fulfilment warehouse on the Sriperumbudur–Oragadam belt, serving Flipkart / Amazon / D2C brands; handheld scanner-led picking',
    outputName: 'an e-commerce pick list completed and dropped at packing',
    officialVersion: 'WMS allocates a pick list to the next available picker; picker scans bin, scans item, drops at packing station; pick rate target ~120 lines per hour at peak.',
    instanceAnchor: 'a 28-line multi-SKU mobile-accessory batch during last Big Billion Day',
    trigger: 'WMS pushes a new pick list to the handheld at the start of my shift / when I confirm the last one',
    steps: [
      S(1, { action: 'Log in to the handheld scanner and accept the assigned pick list', tool: 'RF handheld + WMS', inputWhat: 'shift start / list assignment', inputSource: 'A system / report', outputWhat: 'an accepted pick list', timeMins: 2, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'Sometimes the handheld is dead-batt or another picker has signed in — small daily friction.' }),
      S(2, { action: 'Walk to the first bin location shown on the screen', tool: 'Feet + scanner', inputWhat: 'bin coordinate', outputWhat: 'me at the bin', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['movement'], notes: 'Aisle layout is not optimised per list — at peak I walk 12+ km a shift.' }),
      S(3, { action: 'Scan the bin label, then scan the item, then drop in the tote', tool: 'RF scanner + tote', inputWhat: 'bin + item', outputWhat: 'a picked line', outputDestination: 'tote', timeMins: 1, frequency: 'many-times-a-day' }),
      S(4, { action: 'If the bin is empty or stock is wrong, raise an exception on the scanner', tool: 'RF scanner exception flow', inputWhat: 'discrepancy', outputWhat: 'an exception ticket', outputDestination: 'Inventory team', timeMins: 5, frequency: 'daily', frictionTags: ['rework', 'wait', 'chasing'], needsJudgment: true, notes: 'Faster to ask a senior peer if a near-by bin has it than to wait on the exception — that is what we all do.' }),
      S(5, { action: 'Ask a senior picker / team-leader where the stock might actually be — they know the restock pattern', tool: 'Voice', inputWhat: 'missing SKU', inputSource: 'A colleague', outputWhat: 'a probable alternate bin', timeMins: 3, frequency: 'daily', isShadow: true, needsJudgment: true, notes: 'Pure tribal knowledge — fastest way to recover an exception.' }),
      S(6, { action: 'Continue picking the next line on the list — repeat scan-bin / scan-item', tool: 'RF scanner + tote', inputWhat: 'next line', outputWhat: 'picked lines', timeMins: 1, frequency: 'many-times-a-day', notes: 'Rate is watched — supervisor pulls anyone below threshold for a chat.' }),
      S(7, { action: 'When the tote is full or the list is done, walk to the drop conveyor at the packing station', tool: 'Trolley + tote', inputWhat: 'full tote', outputWhat: 'tote at packing', outputDestination: 'Packing station', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
      S(8, { action: 'Confirm pick complete on the scanner and wait for the next list', tool: 'RF scanner', inputWhat: 'completed list', outputWhat: 'a ready-for-next state', timeMins: 1, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'WMS sometimes takes 30–60 sec to push the next — dead time.' }),
      S(9, { action: 'At break or shift end, hand over scanner and log any device problems to the team leader', tool: 'Voice + shift log', inputWhat: 'shift end', outputWhat: 'a clean handover', outputDestination: 'Team leader', timeMins: 5, frequency: 'daily' }),
    ],
    handoffs: [
      { id: uid('ho'), direction: 'wait-on', who: 'Inbound / put-away team', what: 'restocking the bins on time', typicalDelay: 'continuous; falls behind at peak' },
      { id: uid('ho'), direction: 'wait-on', who: 'WMS', what: 'next pick list pushed to scanner', typicalDelay: 'seconds; longer in WMS slowdowns' },
      { id: uid('ho'), direction: 'hand-to', who: 'Packing team', what: 'totes of picked items ready to pack', typicalDelay: 'immediate at drop conveyor' },
    ],
    exceptions: [
      { id: uid('ex'), trigger: 'WMS goes down for half an hour', whatYouDo: 'Switch to paper pick lists printed by the team leader, lose pace, catch up after restore', howOften: 'a couple of times a month' },
      { id: uid('ex'), trigger: 'A "ghost" stock — system says 5, bin has 2', whatYouDo: 'Pick what is there, raise exception, supervisor manually adjusts inventory', howOften: 'daily during peak' },
      { id: uid('ex'), trigger: 'A fragile item is broken in the bin', whatYouDo: 'Move to damage cage, raise damage ticket, continue with next line', howOften: 'a few times a week' },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Exported catalogue
// ─────────────────────────────────────────────────────────────────────────────
export interface WorkedExample {
  key: string;
  label: string;
  domain: string;     // services / manufacturing / etc.
  region?: string;    // optional — surfaces on the card chip (e.g. "Tamil Nadu")
  emoji: string;
  summary: string;
  build: () => Workflow;
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    key: 'cafe-barista',
    label: 'Café barista at the morning rush',
    domain: 'Services',
    region: 'Global',
    emoji: '☕',
    summary: 'A barista pulling shots through the 8 AM queue — merging mobile orders into the in-store line in their head, with a quiet judgement on every shot that pours wrong.',
    build: cafeBarista,
  },
  {
    key: 'chennai-restaurant',
    label: 'Lunch service at a Chennai restaurant',
    domain: 'Services',
    region: 'Chennai, TN',
    emoji: '🍛',
    summary: 'A floor captain juggling dine-in, Swiggy and Zomato through the lunch peak — re-keying paper orders into the POS, shouting kitchen priorities, and reconciling three systems at shift end.',
    build: chennaiRestaurant,
  },
  {
    key: 'insurance-claim',
    label: 'Settling a motor insurance claim',
    domain: 'Services',
    region: 'Global',
    emoji: '📄',
    summary: 'A motor claims handler end to end — three re-keyings of the same numbers, a shadow tracker the whole team relies on, and an assessor they keep chasing.',
    build: insuranceClaim,
  },
  {
    key: 'it-support-incident',
    label: 'Resolving a P2 production incident',
    domain: 'IT Services',
    region: 'Chennai, TN',
    emoji: '🛠',
    summary: 'A 2 AM page for an L2 engineer — Splunk, deploy logs, a personal OneNote runbook, a Slack DM nobody officially asked for, and an RCA written for the third time today.',
    build: itSupportIncident,
  },
  {
    key: 'gst-return-filing',
    label: "Filing a client's monthly GSTR-3B",
    domain: 'Professional Services',
    region: 'Coimbatore, TN',
    emoji: '📊',
    summary: 'A tax practitioner chasing WhatsApped invoice photos, reconciling 2B in Excel, judging ITC eligibility, and racing the portal on the 20th.',
    build: gstReturnFiling,
  },
  {
    key: 'vao-community-certificate',
    label: 'Issuing a community certificate (e-Sevai)',
    domain: 'Government',
    region: 'Rural TN',
    emoji: '🏛',
    summary: 'A VAO going from a portal queue to a village doorstep — paper village registers, evening visits because the family was in the fields, a defensible judgement call when records conflict.',
    build: vaoCommunityCertificate,
  },
  {
    key: 'anm-antenatal-visit',
    label: 'PHC antenatal home visit + HMIS',
    domain: 'Healthcare',
    region: 'Rural TN',
    emoji: '🩺',
    summary: 'A village ANM doing the weekly antenatal round with the ASHA — paper register, personal diary of high-risk mothers, and the same readings typed into the e-HMS portal a third time.',
    build: anmAntenatalVisit,
  },
  {
    key: 'warehouse-picker',
    label: 'Picking an e-commerce order at a 3PL warehouse',
    domain: 'Logistics',
    region: 'Sriperumbudur, TN',
    emoji: '📦',
    summary: 'A peak-day picker with an RF scanner — 12 km of walking, ghost stock, tribal knowledge of where the bin actually is, and a rate target watched by the second.',
    build: warehousePicker,
  },
  {
    key: 'production-work-order',
    label: 'Running a CNC production work order',
    domain: 'Manufacturing',
    region: 'Global',
    emoji: '🏭',
    summary: 'A line coordinator from traveler to ERP — a personal notebook of machine offsets, borrowing material off other jobs, and QC as the bottleneck they chase.',
    build: productionWorkOrder,
  },
  {
    key: 'tirupur-knitwear',
    label: 'Shipping a Tirupur knitwear export order',
    domain: 'Manufacturing / Exports',
    region: 'Tirupur, TN',
    emoji: '🧵',
    summary: 'A merchandiser running yarn → knit → dye → cut → sew → ship across in-house lines and job-work units — a personal WIP Excel that the official ERP cannot replace, and a buying agent on WhatsApp every morning.',
    build: tirupurKnitwearOrder,
  },
  {
    key: 'rice-mill-batch',
    label: 'Processing a paddy batch at a rice mill',
    domain: 'Agri-manufacturing',
    region: 'Erode, TN',
    emoji: '🌾',
    summary: 'A mill supervisor from weighbridge to godown — moisture meter, grade by eye, monsoon-soaked paddy, power cuts mid-parboil, and a yield benchmark held entirely in their head.',
    build: riceMillBatch,
  },
  {
    key: 'jasmine-wholesale',
    label: 'A morning of Madurai jasmine wholesale',
    domain: 'Agri-trade',
    region: 'Madurai, TN',
    emoji: '🌼',
    summary: 'A Mattuthavani commission agent from 3 AM — spring balance, grade by hand, a WhatsApp group of senior agents that sets the real rate, and a paper ledger that becomes a relationship problem when wrong.',
    build: jasmineWholesale,
  },
];
