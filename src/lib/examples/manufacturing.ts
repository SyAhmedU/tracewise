// MANUFACTURING — CNC production work order, Tirupur knitwear export
import { S, mk, type WorkedExample } from './_shared';

const leatherTannery = () => mk({
  role: 'Tannery production supervisor (finished leather)',
  context: 'A leather finishing unit (Ambur / Vaniyambadi belt) processing hides for export buyers; wet + finishing sections; ZLD effluent norms',
  outputName: 'a hide lot finished to a buyer\'s spec',
  officialVersion: 'Receive lot → soak / tan / dye → dry → finish to shade + feel → QC → grade → pack for the buyer.',
  instanceAnchor: 'a European buyer\'s lot needing an exact shade match',
  trigger: 'A tanned lot reaches the finishing section against a buyer order',
  steps: [
    S(1, { action: 'Read the buyer\'s spec — shade swatch, feel, thickness, finish', tool: 'Swatch + order sheet', inputSource: 'A client / customer', timeMins: 15, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Mix dye / chemicals to hit the shade — adjust by eye against the swatch', tool: 'Dye drums + experience', frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'The recipe is "book" but the final match is the master\'s eye + a splash more — never fully written.' }),
    S(3, { action: 'Run drums / spray / press; monitor temperature + timing', tool: 'Drums + spray line', timeMins: 180, frequency: 'daily', frictionTags: ['movement'] }),
    S(4, { action: 'Check shade + feel against swatch under daylight, re-process if off', tool: 'Eye + hands', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'A whole lot can be rejected on a shade the buyer says is "not quite" — the re-do or rejection risk is the constant dread.' }),
    S(5, { action: 'Manage effluent / ZLD compliance for the batch', tool: 'ETP logs', frictionTags: ['approval', 'manual-transfer'], frequency: 'daily', needsJudgment: true }),
    S(6, { action: 'Grade hides (A/B/C) by defects, sort + count', tool: 'Eye + sorting', frequency: 'daily', needsJudgment: true }),
    S(7, { action: 'Pack + label per buyer, prep export documents handoff', tool: 'Packing + paperwork', outputDestination: 'Another team', timeMins: 40, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Wet-section / tanning', what: 'tanned hides into finishing', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'Export documentation team', what: 'graded, packed lot + counts', typicalDelay: 'same day' },
  ],
  exceptions: [
    { trigger: 'Buyer rejects shade on a sample', whatYouDo: 'Re-process the lot, re-match, absorb chemical + time loss', howOften: 'monthly' },
    { trigger: 'Effluent / pollution-board inspection', whatYouDo: 'Halt, show ZLD logs, demonstrate compliance, lose production hours', howOften: 'monthly' },
  ],
});

const autoComponentJit = () => mk({
  role: 'Production in-charge, tier-2 auto-component unit',
  context: 'A small unit supplying machined parts to an OEM / tier-1 on JIT schedules (Hosur / Sriperumbudur belt); strict PPM + delivery windows',
  outputName: 'a day\'s parts made to spec and delivered to the OEM window',
  officialVersion: 'Get schedule → plan machines → produce → in-process QC → final inspection → pack in OEM bins → dispatch to delivery window.',
  instanceAnchor: 'a day with an OEM pulling extra quantity at short notice',
  trigger: 'OEM releases / revises the JIT delivery schedule',
  steps: [
    S(1, { action: 'Read the OEM schedule (often revised) + map to machines + manpower', tool: 'OEM portal + whiteboard', inputSource: 'A system / report', timeMins: 30, frequency: 'daily', frictionTags: ['lookup'], needsJudgment: true, notes: 'Sequencing jobs across machines to hit windows is a planning juggle held on a whiteboard + in the head.' }),
    S(2, { action: 'Set up machines, load programs, first-piece approval', tool: 'CNC + setup', timeMins: 45, frequency: 'daily', frictionTags: ['approval'], needsJudgment: true }),
    S(3, { action: 'Run production, watch tool wear + cycle time', tool: 'CNC line', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(4, { action: 'In-process QC — gauge critical dimensions, log SPC', tool: 'Gauges + SPC sheet', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'], needsJudgment: true }),
    S(5, { action: 'Chase material / fix breakdowns to protect the window', tool: 'Phone + maintenance', frequency: 'daily', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'A machine down or material short against a fixed OEM window — the firefight to avoid a line-stop penalty is the daily stress.' }),
    S(6, { action: 'Final inspection, pack in OEM-specified bins + Kanban cards', tool: 'Inspection + bins', frequency: 'daily', frictionTags: ['approval'] }),
    S(7, { action: 'Dispatch to delivery window; update OEM portal + invoice', tool: 'Vehicle + portal', outputDestination: 'A client / customer', timeMins: 30, frequency: 'daily', frictionTags: ['manual-transfer', 'wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Raw-material / forging supplier', what: 'castings / bar stock on time', typicalDelay: 'daily, sometimes short' },
    { direction: 'hand-to', who: 'OEM receiving dock', what: 'parts in the delivery window', typicalDelay: 'fixed slot' },
  ],
  exceptions: [
    { trigger: 'OEM pulls extra quantity at short notice', whatYouDo: 'Reshuffle machines, run overtime, prioritise the window over others', howOften: 'weekly' },
    { trigger: 'Reject found at OEM (PPM hit)', whatYouDo: 'Send containment stock, do 8D root-cause, sort suspect lots', howOften: 'monthly' },
  ],
});

const powerloomWeaver = () => mk({
  role: 'Powerloom unit operator-owner (textiles)',
  context: 'A small powerloom shed (Erode / Salem belt) weaving sarees / shirting on job-work for a master weaver; 4–8 looms',
  outputName: 'a woven cloth beam completed to the order',
  officialVersion: 'Get warp beam + design → set loom → weave → watch for breaks / defects → cut + fold → hand to master weaver → get job rate.',
  instanceAnchor: 'a job-work order of a checked design with a tight delivery',
  trigger: 'Master weaver supplies the warp beam + yarn + design for an order',
  steps: [
    S(1, { action: 'Mount warp beam, draw threads, set the design / card', tool: 'Loom + reed', timeMins: 120, frequency: 'few-times-a-week', needsJudgment: true, frictionTags: ['movement'] }),
    S(2, { action: 'Start looms, set pick + tension, run a test length', tool: 'Powerloom', timeMins: 30, frequency: 'few-times-a-week', needsJudgment: true }),
    S(3, { action: 'Patrol looms for warp / weft breaks, knot + restart fast', tool: 'Ears + hands', frequency: 'many-times-a-day', frictionTags: ['movement', 'chasing'], needsJudgment: true, notes: 'I hear a loom stop by its sound from across the shed — break-detection is trained ears, not a sensor.', isShadow: true }),
    S(4, { action: 'Watch for weaving defects — float, miss-pick, stains', tool: 'Eye', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Manage power cuts / load — run when 3-phase is on, plan around cuts', tool: 'Meter + generator', frequency: 'daily', frictionTags: ['wait'], isPainful: true, notes: 'Production is hostage to power supply; planning the shift around cuts is the chronic frustration.' }),
    S(6, { action: 'Cut, fold + measure finished cloth, count metres', tool: 'Scissors + tape', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
    S(7, { action: 'Hand to master weaver, record metres + defects for job rate', tool: 'Notebook', outputDestination: 'A client / customer', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Master weaver', what: 'warp beam, yarn, design + job rate', typicalDelay: 'per order' },
    { direction: 'wait-on', who: 'Power supply (TANGEDCO)', what: 'uninterrupted 3-phase power', typicalDelay: 'cut schedule' },
  ],
  exceptions: [
    { trigger: 'Frequent yarn breaks (poor yarn)', whatYouDo: 'Slow the loom, knot constantly, flag yarn quality to master weaver', howOften: 'weekly' },
    { trigger: 'Long power cut', whatYouDo: 'Switch to generator if order is urgent (costly), else wait it out', howOften: 'weekly' },
  ],
});

const foundry = () => mk({
  role: 'Foundry shift in-charge (iron castings)',
  context: 'A jobbing foundry (Coimbatore belt) pouring iron castings for pumps / motors; melting + moulding + fettling; one cupola / induction furnace',
  outputName: 'a casting batch poured, cleaned and cleared',
  officialVersion: 'Plan heat → prepare moulds → melt to spec → pour → cool / knock-out → fettle → inspect → dispatch.',
  instanceAnchor: 'a morning heat pouring a pump-casing batch',
  trigger: 'A heat is planned against pending casting orders',
  steps: [
    S(1, { action: 'Plan the heat — which castings, mould count, metal grade', tool: 'Order list + experience', inputSource: 'A system / report', timeMins: 30, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Prepare sand moulds + cores, set in the pouring line', tool: 'Sand + pattern', timeMins: 120, frequency: 'daily', frictionTags: ['movement'] }),
    S(3, { action: 'Charge furnace, melt, judge temperature + composition by eye + tests', tool: 'Furnace + spectro', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'Calling the metal ready — tap too early/late and the whole heat is scrap; the highest-stakes judgment, partly by the colour of the melt.' }),
    S(4, { action: 'Pour into moulds at the right temperature + speed', tool: 'Ladle', frequency: 'daily', needsJudgment: true, frictionTags: ['movement'] }),
    S(5, { action: 'Cool, knock out castings, shake out sand', tool: 'Knock-out station', frequency: 'daily', frictionTags: ['movement', 'wait'] }),
    S(6, { action: 'Fettle — cut runners, grind, clean the castings', tool: 'Grinders', frequency: 'daily', frictionTags: ['movement'] }),
    S(7, { action: 'Inspect for blowholes / cracks, decide accept / rework / scrap, log yield', tool: 'Eye + notebook', outputDestination: 'My own notes', frequency: 'daily', needsJudgment: true, frictionTags: ['manual-transfer'], isShadow: true, notes: 'Heat yield + defect causes tracked in a personal book — the real process memory lives there, not in a system.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Pattern / core shop', what: 'patterns + cores ready for the heat', typicalDelay: 'before pour' },
    { direction: 'hand-to', who: 'Machining customer', what: 'cleaned castings for machining', typicalDelay: 'next day' },
  ],
  exceptions: [
    { trigger: 'Composition off-spec after melt', whatYouDo: 'Adjust with additions if possible, else hold the heat / re-melt', howOften: 'weekly' },
    { trigger: 'High reject rate on a batch', whatYouDo: 'Trace to mould / metal / pour, fix the cause, re-pour scrapped count', howOften: 'weekly' },
  ],
});

const fireworksUnit = () => mk({
  role: 'Fireworks unit floor supervisor (Sivakasi)',
  context: 'A licensed fireworks manufacturing unit; chemical mixing + filling + finishing across separated sheds; strict PESO safety + seasonal Diwali peak',
  outputName: 'a batch of crackers made safely to order',
  officialVersion: 'Issue chemicals → mix → fill → dry → finish + label → QC + safety check → pack → store in licensed magazine.',
  instanceAnchor: 'a pre-Diwali peak day filling a large order under safety limits',
  trigger: 'A production order is released against the Diwali demand',
  steps: [
    S(1, { action: 'Issue chemicals in licensed quantities, log against the magazine register', tool: 'Magazine register', frictionTags: ['approval', 'manual-transfer'], frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Supervise mixing of compositions to exact ratios', tool: 'Mixing shed', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'A wrong ratio or a spark is a fatal-accident risk — the safety judgment over every step is the heaviest, most constant weight.' }),
    S(3, { action: 'Limit workers + material per shed to within safety norms', tool: 'Headcount + spacing', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Balancing the Diwali output pressure against the legal/safety person-and-quantity limits per shed — a constant unwritten trade-off.' }),
    S(4, { action: 'Oversee filling + ramming of crackers', tool: 'Filling tools', frequency: 'daily', frictionTags: ['movement'] }),
    S(5, { action: 'Sun-dry batches, manage by weather + space', tool: 'Drying yard', timeMins: 240, frequency: 'daily', frictionTags: ['wait', 'movement'] }),
    S(6, { action: 'Finish, label, QC sample-fire a few for quality', tool: 'Finishing + test', frequency: 'daily', needsJudgment: true }),
    S(7, { action: 'Pack + move finished stock to the licensed magazine, update stock', tool: 'Magazine + register', outputDestination: 'A system / report', frequency: 'daily', frictionTags: ['movement', 'manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Chemical supplier', what: 'licensed raw chemicals', typicalDelay: 'per order' },
    { direction: 'hand-to', who: 'Dispatch / distributor', what: 'finished, labelled stock', typicalDelay: 'Diwali season' },
  ],
  exceptions: [
    { trigger: 'PESO / safety inspection', whatYouDo: 'Show licences, register, shed limits; halt anything non-compliant', howOften: 'seasonal' },
    { trigger: 'Rain during drying', whatYouDo: 'Move batches under cover fast, lose drying time, reschedule', howOften: 'monsoon overlap' },
  ],
});

const offsetPress = () => mk({
  role: 'Offset printing press operator-owner',
  context: 'A small offset press doing wedding cards, textbooks, brochures, boxes; design + plate + print + finishing; job-work pricing',
  outputName: 'a print job delivered to the customer',
  officialVersion: 'Take job → finalise design / proof → make plates → set machine → print → finish (cut / bind / laminate) → deliver.',
  instanceAnchor: 'a wedding-card order with a fixed event date',
  trigger: 'Customer brings a job with content + a deadline',
  steps: [
    S(1, { action: 'Understand the job — quantity, paper, colours, finish, date', tool: 'Counter + samples', inputSource: 'A client / customer', timeMins: 15, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Design / typeset or adapt the customer\'s file; share a proof', tool: 'CorelDRAW / Photoshop', timeMins: 45, frequency: 'daily', frictionTags: ['rework'], needsJudgment: true }),
    S(3, { action: 'Get proof approved — chase the customer for sign-off on text + colour', tool: 'WhatsApp + print proof', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['wait', 'approval', 'chasing'], isPainful: true, notes: 'Wrong name spelling / colour after printing means a full reprint at my cost — extracting a clear approval is the nerve-wracking gate.' }),
    S(4, { action: 'Make plates (CTP / image-setter)', tool: 'Plate-maker', timeMins: 30, frequency: 'daily' }),
    S(5, { action: 'Set machine — ink, registration, run a few sheets, match colour', tool: 'Offset machine', timeMins: 40, frequency: 'daily', needsJudgment: true, notes: 'Colour matching on press is by eye against the proof — a craft adjustment.' }),
    S(6, { action: 'Print the run, watch registration + ink density', tool: 'Offset machine', timeMins: 60, frequency: 'daily', frictionTags: ['movement'] }),
    S(7, { action: 'Finish — cut, fold, laminate, bind; quality-check + deliver', tool: 'Cutter + binder', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['movement'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Customer', what: 'final approved proof (text + colour)', typicalDelay: 'hours to a day' },
    { direction: 'wait-on', who: 'Paper / lamination supplier', what: 'specific stock for the job', typicalDelay: '1–2 days' },
  ],
  exceptions: [
    { trigger: 'Error spotted after printing', whatYouDo: 'Reprint at own cost if my fault; renegotiate if customer file was wrong', howOften: 'monthly' },
    { trigger: 'Rush wedding job', whatYouDo: 'Jump the queue, run overtime, sometimes outsource finishing', howOften: 'wedding season' },
  ],
});

const spinningMill = () => mk({
  role: 'Spinning-mill shift supervisor (ring frame)',
  context: 'A cotton spinning mill (Coimbatore / Dindigul belt) running 3 shifts; blow-room to ring-frame to cone; count + quality targets',
  outputName: 'a shift\'s yarn spun to count + quality',
  officialVersion: 'Take shift handover → run the line to the count plan → monitor breaks + quality → doff + label → log production → hand over next shift.',
  instanceAnchor: 'a night shift running a fine-count order',
  trigger: 'Shift starts; handover received from the previous shift',
  steps: [
    S(1, { action: 'Take handover — running counts, machine status, pending issues', tool: 'Handover register', inputSource: 'Another team', timeMins: 15, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(2, { action: 'Check the line is set to the right count + speed plan', tool: 'Frames + plan', frequency: 'daily', needsJudgment: true }),
    S(3, { action: 'Patrol frames, watch end-breaks + idle spindles', tool: 'Eyes + ears', frequency: 'many-times-a-day', frictionTags: ['movement', 'chasing'], needsJudgment: true, isShadow: true, notes: 'High breakage on a frame is spotted by walking + listening; which frame is "playing up" is operator knowledge, not a dashboard.' }),
    S(4, { action: 'Manage humidity / temperature for the cotton', tool: 'Humidification', frequency: 'daily', needsJudgment: true }),
    S(5, { action: 'Pull quality checks — count, CV, yarn faults; adjust', tool: 'Lab + Uster', frequency: 'daily', needsJudgment: true, frictionTags: ['wait'] }),
    S(6, { action: 'Coordinate doffing, label cones, move to packing', tool: 'Doffers + trolley', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(7, { action: 'Log shift production + breakdowns; hand over to next shift', tool: 'Production register', outputDestination: 'Another team', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Reconciling production + downtime + labour into the register at shift-end, tired, is the grind that decides the count efficiency number.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Previous shift', what: 'clean handover of running state', typicalDelay: 'at shift change' },
    { direction: 'hand-to', who: 'Next shift + packing', what: 'running line + doffed cones', typicalDelay: 'at shift change' },
  ],
  exceptions: [
    { trigger: 'Spike in end-breakage on a count', whatYouDo: 'Check roving, humidity, spindle tape; slow speed; call maintenance', howOften: 'weekly' },
    { trigger: 'Cotton-mixing variation hits quality', whatYouDo: 'Flag to mixing, adjust process, segregate suspect cones', howOften: 'weekly' },
  ],
});

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
  { key: 'leather-tannery', label: 'A tannery finishing a hide lot to a buyer shade', domain: 'Manufacturing', region: 'Ambur, TN', emoji: '🟫',
    summary: 'Dye matched by the master\'s eye against a swatch (the recipe is never fully written), with a whole-lot rejection risk on a shade the buyer says is "not quite".',
    behavioralContext: 'The capture tags shade-mixing as a shadow judgment (book recipe + the eye + "a splash more") and marks the shade check as the painful step — an entire lot can be rejected on a subjective call. The colour-match craft is what the export relationship is built on.',
    fieldSpecificFit: 'The trace points the tool at consistency support, not replacing the eye: spectrophotometer shade-logging to make matches repeatable across lots, and digitised ETP/ZLD records for the frequent inspections. The master\'s final daylight judgment stays the deciding call.',
    build: leatherTannery },
  { key: 'auto-component-jit', label: 'A tier-2 unit meeting an OEM JIT window', domain: 'Manufacturing', region: 'Hosur, TN', emoji: '⚙️',
    summary: 'Machine sequencing juggled on a whiteboard against revised schedules, then a daily firefight — a machine down or material short against a fixed window and a line-stop penalty.',
    behavioralContext: 'The capture tags schedule-to-machine planning as judgment held on a whiteboard and marks the material/breakdown firefight as the painful step (a fixed OEM window, penalty looming). The planning juggle is real expertise the system should support, not override.',
    fieldSpecificFit: 'The trace aims the fix at visibility: live schedule-to-machine planning and material/maintenance alerts so the firefight becomes early warning, plus SPC capture off the gauges. The first-piece approval and sequencing judgment stay the in-charge\'s.',
    build: autoComponentJit },
  { key: 'powerloom-weaver', label: 'A powerloom shed weaving a job-work order', domain: 'Manufacturing', region: 'Erode, TN', emoji: '🧶',
    summary: 'Loom-stops heard by ear across the shed, defects caught by eye, and production held hostage to the 3-phase power-cut schedule.',
    behavioralContext: 'The capture tags break-detection as shadow skill (the weaver hears a loom stop by its sound) and marks power-cut planning as the painful, chronic constraint. The trained ear and defect-eye are craft; the power dependency is an infrastructure problem, not a process one.',
    fieldSpecificFit: 'The trace points the realistic fit at the power constraint and break-visibility: loom stop-motion sensors + a simple efficiency log so breakage patterns are seen, and shift planning around the published cut schedule (or generator economics). The weaving judgment stays with the operator.',
    build: powerloomWeaver },
  { key: 'iron-foundry', label: 'A foundry pouring an iron-casting batch', domain: 'Manufacturing', region: 'Coimbatore, TN', emoji: '🔥',
    summary: 'Calling the metal ready partly by the colour of the melt — tap too early or late and the heat is scrap — with yield and defect causes kept in a personal book.',
    behavioralContext: 'The capture marks the melt-ready call as the painful, highest-stakes judgment (partly visual) and tags the yield/defect log as a shadow personal record where the real process memory lives. The pour judgment is decades of feel a sensor only assists.',
    fieldSpecificFit: 'The trace supports instrumenting the judgment, not replacing it: spectro + temperature data alongside the supervisor\'s eye, and digitising the personal yield/defect book into shared process memory for root-cause work. The tap decision stays human.',
    build: foundry },
  { key: 'fireworks-unit', label: 'A Sivakasi fireworks unit filling a Diwali order', domain: 'Manufacturing', region: 'Sivakasi, TN', emoji: '🧨',
    summary: 'Safety judgment over every step where a wrong ratio or spark is fatal, and a constant unwritten trade-off between Diwali output pressure and legal person-and-quantity shed limits.',
    behavioralContext: 'The capture marks the safety supervision as the painful, life-critical judgment and tags the output-vs-shed-limits balancing as a shadow trade-off. Any automation that pushes throughput without honouring the safety limits is actively dangerous here.',
    fieldSpecificFit: 'The trace points the fit at safety + compliance, never at speeding the hazardous steps: digital magazine/chemical-issue logs and shed occupancy/quantity tracking that enforce the legal limits, freeing the supervisor to focus on the physical safety judgment that must stay human.',
    build: fireworksUnit },
  { key: 'offset-press', label: 'An offset press running a wedding-card job', domain: 'Manufacturing', region: 'Tamil Nadu', emoji: '🖨',
    summary: 'Colour matched on press by eye against the proof, but a wrong name-spelling or shade after printing means a full reprint at the press\'s own cost.',
    behavioralContext: 'The capture marks proof-approval chasing as the painful gate (a mistake = costly reprint borne by the press) and tags on-press colour matching as craft judgment. The approval extraction is a trust/communication problem; the colour eye is skill.',
    fieldSpecificFit: 'The trace aims the tool squarely at the approval gate: a digital proof with explicit, logged sign-off on text + colour before plates are made, killing the reprint risk. The on-press colour matching and finishing stay the operator\'s craft.',
    build: offsetPress },
  { key: 'spinning-mill', label: 'A spinning-mill night shift on the ring frame', domain: 'Manufacturing', region: 'Coimbatore, TN', emoji: '🧵',
    summary: 'A misbehaving frame spotted by walking and listening (not a dashboard), then a tired shift-end reconciliation of production and downtime into the register.',
    behavioralContext: 'The capture tags break-spotting as shadow operator knowledge (which frame is "playing up" by ear) and marks the shift-end production/downtime reconciliation as the painful grind that drives the efficiency number. The patrol judgment is experiential; the logging is avoidable friction.',
    fieldSpecificFit: 'The trace points the fix at the logging and visibility: machine-level break/idle-spindle monitoring to back the operator\'s ear, and auto-compiled shift production so the tired manual reconciliation disappears. The quality and humidity judgment stays the supervisor\'s.',
    build: spinningMill },
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
