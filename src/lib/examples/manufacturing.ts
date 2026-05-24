// MANUFACTURING — CNC production work order, Tirupur knitwear export
import { S, mk, type WorkedExample } from './_shared';

const productionWorkOrder = () => mk({
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
    S(4, { action: 'Set up and change over the CNC machine for this part', tool: 'CNC + setup sheet', inputWhat: 'setup sheet + tooling', inputSource: 'My own notes', outputWhat: 'a machine ready to run', timeMins: 45, frequency: 'daily', frictionTags: ['rework'], isShadow: true, needsJudgment: true, notes: 'I use my own notebook of offsets and machine quirks — the official setup sheet is years out of date.' }),
    S(5, { action: 'Run the first article and measure it on the CMM', tool: 'CMM / calipers', inputWhat: 'first part', outputWhat: 'a verified first-off', timeMins: 20, frequency: 'daily', frictionTags: ['wait'], needsJudgment: true, notes: 'Queue for the one CMM; sometimes wait 20 minutes.' }),
    S(6, { action: 'Run the full batch', tool: 'CNC', inputWhat: 'approved first-off', outputWhat: 'machined parts', timeMins: 120, frequency: 'daily' }),
    S(7, { action: 'In-process check, scrap or rework any defects', tool: 'Calipers + scrap bin', inputWhat: 'machined parts', outputWhat: 'good parts', timeMins: 25, frequency: 'daily', frictionTags: ['rework'], needsJudgment: true }),
    S(8, { action: 'Hand-write the quantities and any deviations on the traveler', tool: 'Paper traveler', inputWhat: 'counts + notes', inputSource: 'My own notes', outputWhat: 'an updated traveler', timeMins: 5, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(9, { action: 'Walk the parts to QC for final sign-off and wait for release', tool: 'QC bench', inputWhat: 'finished parts + traveler', outputWhat: 'released parts', outputDestination: 'QC inspector', timeMins: 30, frequency: 'daily', frictionTags: ['movement', 'wait', 'approval', 'chasing'], isPainful: true, notes: 'QC is the bottleneck; I end up chasing them so the job ships today.' }),
    S(10, { action: 'Key the completed quantities into the ERP', tool: 'ERP terminal', inputWhat: 'numbers from the traveler', inputSource: 'My own notes', outputWhat: 'a booked-off work order', outputDestination: 'ERP', timeMins: 10, frequency: 'daily', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Re-typing what is already on the paper traveler.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Storekeeper', what: 'raw material pulled from stores', typicalDelay: 'minutes to half an hour depending how busy they are' },
    { direction: 'wait-on', who: 'QC inspector', what: 'final inspection and release', typicalDelay: 'same day if chased, otherwise next morning' },
    { direction: 'hand-to', who: 'Dispatch', what: 'released, packed parts', typicalDelay: 'goes on the afternoon van' },
  ],
  exceptions: [
    { trigger: 'Material is short in stores', whatYouDo: "Borrow from another job's allocation to keep running, and sort out the paperwork later", howOften: 'most weeks' },
    { trigger: 'The machine breaks down mid-batch', whatYouDo: 'Call maintenance, move to another job meanwhile, and keep chasing them', howOften: 'a few times a month' },
  ],
});

const tirupurKnitwearOrder = () => mk({
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
    { direction: 'wait-on', who: 'Yarn supplier (Erode spinners)', what: 'dyed-quality yarn delivered on time', typicalDelay: '7–10 days' },
    { direction: 'wait-on', who: 'Dyeing house', what: 'shade-matched fabric back from dye lot', typicalDelay: '5–8 days, longer in monsoon (ZLD load)' },
    { direction: 'wait-on', who: 'Buyer / buying agent', what: 'sample approvals and comments', typicalDelay: 'unpredictable; often the bottleneck' },
    { direction: 'hand-to', who: 'CHA', what: 'cartons + export documents for shipment', typicalDelay: '2–3 days to load at Chennai port' },
  ],
  exceptions: [
    { trigger: 'Shade does not match on the dye lot', whatYouDo: 'Negotiate with the dye house — re-dye or accept with a written buyer waiver; eat the lead-time hit', howOften: 'a couple of styles per season' },
    { trigger: 'Third-party inspection fails on measurements / workmanship', whatYouDo: 'Sort 100%, re-iron, re-pack, request re-inspection — costs a day and a panic', howOften: 'two or three orders a season' },
    { trigger: 'Buyer changes the trims after bulk is in production', whatYouDo: 'Negotiate an air-freight cost share, or push the ship date — depends on the buyer’s leverage', howOften: 'often' },
  ],
});

export const MANUFACTURING: WorkedExample[] = [
  { key: 'production-work-order', label: 'Running a CNC production work order', domain: 'Manufacturing', region: 'Global', emoji: '🏭',
    summary: 'A line coordinator from traveler to ERP — a personal notebook of machine offsets, borrowing material off other jobs, and QC as the bottleneck they chase.',
    behavioralContext: 'The trace tags the machine setup as a shadow step run from the coordinator\'s personal notebook of offsets and quirks, because the official setup sheet is years out of date — articulation work the ERP never captured. QC is the painful bottleneck they chase, and the traveler counts get re-keyed into the ERP at the end.',
    fieldSpecificFit: 'Don\'t replace the setup judgment — capture it: make the personal offsets notebook the living setup record. Kill the end-of-day re-key the trace flags painful by booking quantities at the machine. The real constraint is QC throughput, not the coordinator — a digital QC queue addresses the actual bottleneck.',
    build: productionWorkOrder },
  { key: 'tirupur-knitwear', label: 'Shipping a Tirupur knitwear export order', domain: 'Manufacturing', region: 'Tirupur, TN', emoji: '🧵',
    summary: 'A merchandiser running yarn → knit → dye → cut → sew → ship across in-house lines and job-work units — a personal WIP Excel the ERP cannot replace, and a buying agent on WhatsApp every morning.',
    behavioralContext: 'The capture pins the personal WIP Excel as the shadow step production actually runs on — no ERP spans in-house lines and job-work units — and the twice-daily floor walk as a judgment step, since supervisors\' WhatsApp updates are always rosier than reality. The yarn rate is a morning handshake, not a system price.',
    fieldSpecificFit: 'Give the cross-unit WIP a real home: a shared tracker spanning in-house + job-work that merchandiser and buying agent both see, retiring the personal Excel and the daily-photo chase the trace flags. Keep the lead-time realism, rate negotiation and floor-truth walk human — those are the judgment the capture marks.',
    build: tirupurKnitwearOrder },
];
