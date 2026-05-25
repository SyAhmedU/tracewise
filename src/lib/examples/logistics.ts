// LOGISTICS — Chennai 3PL e-commerce warehouse picker
import { S, mk, type WorkedExample } from './_shared';

const lastMileRider = () => mk({
  role: 'Last-mile delivery rider (e-commerce / food)',
  context: 'A gig / fleet rider delivering an e-commerce batch off a routing app on a two-wheeler; paid per delivery; SLA + COD',
  outputName: 'a parcel delivered + marked complete',
  officialVersion: 'Pick up batch → app routes stops → reach address → call / deliver → capture POD / OTP → collect COD → mark delivered → next.',
  instanceAnchor: 'a peak-hour batch in a dense neighbourhood with vague addresses',
  trigger: 'A delivery batch is assigned on the app',
  steps: [
    S(1, { action: 'Pick up + scan the batch, load by my own delivery sequence', tool: 'Hub + scanner', timeMins: 20, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(2, { action: 'Re-order the app\'s route by real knowledge of one-ways, lanes, traffic', tool: 'Routing app + local knowledge', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'The app\'s sequence ignores one-ways + shortcuts; I silently re-route by what I know — never captured.' }),
    S(3, { action: 'Find the actual address — call customer, ask shops, decode "near the temple"', tool: 'Phone + asking around', frequency: 'many-times-a-day', frictionTags: ['lookup', 'wait'], isPainful: true, notes: 'Bad/vague addresses + uncontactable customers are the daily time-sink that wrecks the per-delivery economics.' }),
    S(4, { action: 'Deliver, capture OTP / photo POD', tool: 'App', outputDestination: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['approval'] }),
    S(5, { action: 'Collect + reconcile COD cash against the app', tool: 'Cash + app', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Handle failed delivery — reattempt logic, customer reschedule', tool: 'App + phone', frequency: 'many-times-a-day', frictionTags: ['rework', 'chasing'] }),
    S(7, { action: 'Return undelivered + COD cash to hub, reconcile', tool: 'Hub', outputDestination: 'My manager', timeMins: 20, frequency: 'daily', frictionTags: ['wait', 'manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Hub / sort centre', what: 'batch ready + correctly sorted', typicalDelay: 'morning' },
    { direction: 'wait-on', who: 'Customer', what: 'answering the call / being available', typicalDelay: 'minutes, often not' },
  ],
  exceptions: [
    { trigger: 'Customer unreachable / not home', whatYouDo: 'Call twice, wait briefly, mark for reattempt, move on to protect SLA', howOften: 'every batch' },
    { trigger: 'COD short at reconciliation', whatYouDo: 'Account from memory of each stop; absorb gaps to avoid hub disputes', howOften: 'weekly' },
  ],
});

const longHaulLorry = () => mk({
  role: 'Long-haul lorry driver (interstate freight)',
  context: 'Drives consignments interstate (e.g. Chennai–Bengaluru–Hyderabad); manages docs, checkposts, fuel, the truck; paid per trip',
  outputName: 'a consignment delivered safely across states',
  officialVersion: 'Load + collect docs → drive route → clear checkposts / tolls → rest per rules → reach → unload → get POD → return / next load.',
  instanceAnchor: 'an overnight interstate run with a delivery appointment',
  trigger: 'Consignment loaded + dispatch documents handed over',
  steps: [
    S(1, { action: 'Verify load + collect LR, e-way bill, invoices', tool: 'Documents + phone', inputSource: 'A system / report', timeMins: 30, frequency: 'few-times-a-week', frictionTags: ['lookup', 'approval'] }),
    S(2, { action: 'Plan route, fuel stops, rest, ETA against the delivery slot', tool: 'Experience + maps', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Where to fuel cheap, eat, sleep safe + which roads avoid trouble — a route-craft held in the head, not the app.' }),
    S(3, { action: 'Drive the haul, manage fatigue + night driving', tool: 'Truck', timeMins: 600, frequency: 'few-times-a-week', frictionTags: ['movement'], needsJudgment: true, isPainful: true, notes: 'Fatigue against a tight delivery appointment is the dangerous, draining core — pushing through is the unspoken pressure.' }),
    S(4, { action: 'Clear checkposts, tolls, RTO / police checks; produce papers', tool: 'Documents + FASTag', frequency: 'few-times-a-week', frictionTags: ['wait', 'approval', 'chasing'] }),
    S(5, { action: 'Handle breakdowns / tyre / minor repairs on the road', tool: 'Tools + mechanics', frequency: 'weekly', frictionTags: ['wait'] }),
    S(6, { action: 'Reach, wait for unloading slot + labour, unload', tool: 'Dock', frequency: 'few-times-a-week', frictionTags: ['wait'] }),
    S(7, { action: 'Get POD signed / stamped, send proof, settle trip expenses', tool: 'POD + phone', outputDestination: 'A client / customer', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Consignor / loading point', what: 'load + correct documents', typicalDelay: 'at dispatch' },
    { direction: 'wait-on', who: 'Consignee dock', what: 'unloading slot + labour', typicalDelay: 'hours of waiting' },
  ],
  exceptions: [
    { trigger: 'Document / e-way bill issue at checkpost', whatYouDo: 'Call office for corrected docs, wait, sometimes settle on the spot', howOften: 'weekly' },
    { trigger: 'Breakdown mid-route', whatYouDo: 'Call fleet + roadside mechanic, secure cargo, inform consignee of delay', howOften: 'monthly' },
  ],
});

const courierBranch = () => mk({
  role: 'Courier branch clerk (booking + sorting)',
  context: 'A franchise courier branch (DTDC / Professional-style); books parcels, sorts inbound, assigns delivery boys; manual + branch software',
  outputName: 'a parcel booked / sorted + moved toward delivery',
  officialVersion: 'Book parcel → weigh + price → manifest → bag to hub → receive inbound → sort by area → assign delivery → update tracking.',
  instanceAnchor: 'a morning with inbound sorting clashing with booking walk-ins',
  trigger: 'Customer walks in to book / an inbound bag arrives from the hub',
  steps: [
    S(1, { action: 'Book parcel — weigh, measure, destination, price by zone', tool: 'Branch software + scale', inputSource: 'A client / customer', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(2, { action: 'Judge packing adequacy + restricted items', tool: 'Eye', frequency: 'many-times-a-day', needsJudgment: true }),
    S(3, { action: 'Manifest + bag outbound to the hub', tool: 'Software + bags', frequency: 'daily', frictionTags: ['movement', 'manual-transfer'] }),
    S(4, { action: 'Receive inbound bag, scan, sort parcels by delivery area', tool: 'Scanner + racks', timeMins: 40, frequency: 'daily', frictionTags: ['movement', 'lookup'] }),
    S(5, { action: 'Assign parcels to delivery boys by area + load', tool: 'Run sheets', outputDestination: 'Another team', frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'Who covers which area + how much each can clear is a balancing call I make by knowing the boys + the localities.' }),
    S(6, { action: 'Field "where is my parcel" calls, chase the hub / delivery boy', tool: 'Phone + tracking', frequency: 'many-times-a-day', frictionTags: ['chasing', 'lookup'], isPainful: true, notes: 'Tracking status lags reality; I become the human tracker, calling around to answer anxious customers — the constant interruption.' }),
    S(7, { action: 'Reconcile delivered / undelivered + COD at day end', tool: 'Software + cash', frequency: 'daily', frictionTags: ['manual-transfer', 'wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Sorting hub', what: 'inbound bags + correct manifests', typicalDelay: 'daily, variable' },
    { direction: 'hand-to', who: 'Delivery boys', what: 'sorted parcels + run sheets', typicalDelay: 'morning' },
  ],
  exceptions: [
    { trigger: 'Parcel mis-sorted / lost', whatYouDo: 'Trace through hub scans, file query, pacify customer, escalate', howOften: 'weekly' },
    { trigger: 'Delivery boy absent', whatYouDo: 'Redistribute his area among others or hold low-priority parcels', howOften: 'weekly' },
  ],
});

const customsClearing = () => mk({
  role: 'Customs house agent (CHA) executive (import clearance)',
  context: 'Clears import containers at Chennai port / CFS; files Bill of Entry on ICEGATE, coordinates customs + CFS + transport',
  outputName: 'an import container cleared + delivered to the importer',
  officialVersion: 'Get docs → file Bill of Entry → assessment → duty payment → examination → Out-of-Charge → CFS delivery order → transport → deliver.',
  instanceAnchor: 'a container with demurrage building while a query is raised',
  trigger: 'Importer sends shipping documents for a landed container',
  steps: [
    S(1, { action: 'Collect + verify docs — invoice, packing list, BL, certificates', tool: 'Email + documents', inputSource: 'A client / customer', timeMins: 40, frequency: 'daily', frictionTags: ['lookup'] }),
    S(2, { action: 'Classify goods under the right HSN, decide duty + compliance', tool: 'Customs tariff + experience', frequency: 'daily', needsJudgment: true, notes: 'HSN classification + valuation decides duty + risk of a query — the judgment that defines the whole clearance.' }),
    S(3, { action: 'File Bill of Entry on ICEGATE', tool: 'ICEGATE portal', outputDestination: 'A system / report', timeMins: 30, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(4, { action: 'Chase assessment + clear customs queries / examination', tool: 'Customs + portal', frequency: 'daily', frictionTags: ['wait', 'approval', 'chasing'], isPainful: true, notes: 'A query or exam stalls the container while demurrage + detention charges tick — the costly waiting I chase to cut short.' }),
    S(5, { action: 'Arrange duty payment, get Out-of-Charge', tool: 'Bank + portal', frequency: 'daily', frictionTags: ['approval', 'wait'] }),
    S(6, { action: 'Get CFS delivery order, arrange transport + container movement', tool: 'CFS + transporter', frequency: 'daily', frictionTags: ['chasing', 'movement'] }),
    S(7, { action: 'Deliver to importer, file documents, bill the job', tool: 'Documents + invoice', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Customs (assessing officer)', what: 'assessment + Out-of-Charge', typicalDelay: 'hours to days' },
    { direction: 'wait-on', who: 'CFS + transporter', what: 'delivery order + container movement', typicalDelay: 'hours' },
  ],
  exceptions: [
    { trigger: 'Customs raises a valuation / classification query', whatYouDo: 'Submit clarifications + documents, follow up hard to limit demurrage', howOften: 'weekly' },
    { trigger: 'Examination finds a mismatch', whatYouDo: 'Coordinate with importer, amend, pay differential duty / penalty', howOften: 'monthly' },
  ],
});

const taxiDriver = () => mk({
  role: 'App-cab driver (Ola / Uber)',
  context: 'Drives a cab on aggregator apps in a metro; juggles app rides + offline regulars; incentives + ratings + fuel economics',
  outputName: 'a ride completed + paid',
  officialVersion: 'Go online → accept ride → reach pickup → drive route → end ride → collect fare → rate → next; chase daily incentive target.',
  instanceAnchor: 'a morning shift chasing the trip-count incentive',
  trigger: 'A ride request pings on the app',
  steps: [
    S(1, { action: 'Decide whether to accept — distance to pickup, drop area, surge, fuel', tool: 'App + judgment', frequency: 'many-times-a-day', needsJudgment: true, isShadow: true, notes: 'Whether a ride is worth taking (dead-mileage to pickup, bad drop zone) is a quick economics call the app hides from its own metrics.' }),
    S(2, { action: 'Navigate to pickup, call customer if location is off', tool: 'Maps + phone', frequency: 'many-times-a-day', frictionTags: ['lookup', 'wait'] }),
    S(3, { action: 'Confirm OTP, start ride', tool: 'App', inputSource: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['approval'] }),
    S(4, { action: 'Drive the route, balance app-route vs known shortcuts', tool: 'Cab + maps', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'End ride, collect fare (UPI / cash), handle fare disputes', tool: 'App + UPI', outputDestination: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(6, { action: 'Watch incentive progress, decide to keep driving / reposition', tool: 'Driver app', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Chasing the trip-target incentive (the real income) by repositioning + grinding long hours is the pressure that defines the day.' }),
    S(7, { action: 'Track fuel + commission vs earnings to know real take-home', tool: 'Notebook / mental', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'The app shows gross; my real margin after fuel + commission is a private calculation.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Aggregator platform', what: 'ride allocation + incentive payout', typicalDelay: 'real-time / weekly' },
    { direction: 'wait-on', who: 'Customer', what: 'being at the pickup point', typicalDelay: 'minutes' },
  ],
  exceptions: [
    { trigger: 'Customer cancels after I reach pickup', whatYouDo: 'Claim cancellation fee if eligible, swallow the dead mileage', howOften: 'daily' },
    { trigger: 'Low-ride day', whatYouDo: 'Reposition to a demand hotspot, work offline regulars, extend hours', howOften: 'weekly' },
  ],
});

const packersMovers = () => mk({
  role: 'Packers-and-movers job supervisor',
  context: 'Runs household / office shifting jobs; survey, pack, load, transport, unload, unpack; crew + truck per job',
  outputName: 'a household shifted + unpacked at the new home',
  officialVersion: 'Survey → quote → schedule → pack → inventory → load → transport → unload → unpack → settle + handle claims.',
  instanceAnchor: 'a 2-BHK intercity shift on a committed date',
  trigger: 'Customer confirms a shifting job + date',
  steps: [
    S(1, { action: 'Survey the home, estimate volume, fragile items, access (lift / stairs)', tool: 'Eye + checklist', inputSource: 'A client / customer', timeMins: 30, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Quoting volume + effort from a walk-through — underestimate and the job runs at a loss.' }),
    S(2, { action: 'Quote + schedule crew + truck for the date', tool: 'Phone + sheet', frequency: 'few-times-a-week', frictionTags: ['chasing'] }),
    S(3, { action: 'Pack room by room, wrap fragiles, label cartons', tool: 'Materials + crew', timeMins: 240, frequency: 'few-times-a-week', frictionTags: ['movement'] }),
    S(4, { action: 'Make an inventory list of cartons + items', tool: 'Paper list / app', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'A handwritten item list is the only proof against damage / loss claims — kept carefully, my own protection.' }),
    S(5, { action: 'Load truck — sequence + secure to avoid damage', tool: 'Truck + crew', frequency: 'few-times-a-week', needsJudgment: true, frictionTags: ['movement'], isPainful: true, notes: 'Loading fragiles + heavy items safely under time + access pressure is where damage (and disputes) happen — the high-stress step.' }),
    S(6, { action: 'Transport, coordinate arrival + building permissions', tool: 'Truck + phone', frequency: 'few-times-a-week', frictionTags: ['wait', 'movement'] }),
    S(7, { action: 'Unload, unpack, check inventory, settle payment + any claims', tool: 'Crew + list', outputDestination: 'A client / customer', frequency: 'few-times-a-week', frictionTags: ['manual-transfer', 'approval'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Customer + building management', what: 'access, lift booking, parking at both ends', typicalDelay: 'on the day' },
    { direction: 'wait-on', who: 'Crew + truck', what: 'turn-up on the committed date', typicalDelay: 'scheduled' },
  ],
  exceptions: [
    { trigger: 'Damage discovered at unloading', whatYouDo: 'Check against inventory, negotiate / claim insurance, repair goodwill', howOften: 'monthly' },
    { trigger: 'Access blocked (no lift / narrow stairs)', whatYouDo: 'Carry by hand, arrange external lift, renegotiate extra charge', howOften: 'weekly' },
  ],
});

const coldChainReefer = () => mk({
  role: 'Cold-chain reefer dispatch coordinator',
  context: 'Coordinates refrigerated transport of perishables / pharma; manages temperature integrity, routing, time-critical delivery',
  outputName: 'a temperature-sensitive load delivered within spec',
  officialVersion: 'Receive load + temp spec → pre-cool reefer → load → monitor temperature en route → deliver in window → log the cold chain.',
  instanceAnchor: 'a pharma load with a strict 2–8°C window and a delivery deadline',
  trigger: 'A temperature-controlled consignment is booked',
  steps: [
    S(1, { action: 'Confirm load, exact temperature band + delivery window', tool: 'Order + spec sheet', inputSource: 'A client / customer', timeMins: 20, frequency: 'daily', frictionTags: ['lookup'] }),
    S(2, { action: 'Pre-cool the reefer, verify the unit + data logger work', tool: 'Reefer + logger', frequency: 'daily', needsJudgment: true }),
    S(3, { action: 'Supervise quick loading to avoid temperature excursion', tool: 'Dock + crew', frequency: 'daily', frictionTags: ['movement', 'wait'], needsJudgment: true, notes: 'Every minute the door is open risks an excursion — the loading-speed judgment protects the whole load.' }),
    S(4, { action: 'Plan route + driver for least transit + safe stops', tool: 'Maps + driver', frequency: 'daily', needsJudgment: true }),
    S(5, { action: 'Monitor temperature en route, react to alarms / reefer faults', tool: 'Telematics / driver calls', frequency: 'many-times-a-day', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'A reefer breakdown or excursion mid-transit means a whole pharma/perishable load can be condemned — the constant high-value worry.' }),
    S(6, { action: 'Deliver within window, hand over with temperature log', tool: 'POD + data log', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['approval', 'manual-transfer'] }),
    S(7, { action: 'Archive the cold-chain record for compliance / audit', tool: 'Logger data + file', isShadow: true, frequency: 'daily', frictionTags: ['manual-transfer'], notes: 'The temperature log is the proof of integrity for audits + claims — kept meticulously.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Loading point', what: 'load ready at the right temperature', typicalDelay: 'on schedule' },
    { direction: 'hand-to', who: 'Consignee (pharmacy / processor)', what: 'in-spec load + temperature log', typicalDelay: 'delivery window' },
  ],
  exceptions: [
    { trigger: 'Reefer unit fails mid-transit', whatYouDo: 'Divert to nearest cold store / swap reefer, escalate, document for claim', howOften: 'monthly' },
    { trigger: 'Temperature excursion logged', whatYouDo: 'Quarantine load, inform client, await disposition decision', howOften: 'monthly' },
  ],
});

const lorryBookingAgent = () => mk({
  role: 'Lorry-booking commission agent (transport broker)',
  context: 'A roadside transport booking office matching loads to lorries; commission on each match; phone-driven + a register',
  outputName: 'a load matched to a lorry + dispatched',
  officialVersion: 'Take load enquiry → find a suitable lorry → negotiate freight → confirm both sides → load → dispatch → settle commission + advance.',
  instanceAnchor: 'a load needing a lorry the same evening',
  trigger: 'A party calls with a load / a lorry driver calls looking for a return load',
  steps: [
    S(1, { action: 'Take the load details — type, weight, destination, when', tool: 'Phone + register', inputSource: 'A client / customer', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(2, { action: 'Match to an available lorry from my network of drivers / owners', tool: 'Phone + contacts', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'The whole business is the contact book in my head + phone — who is reliable, who is where, who pays. Calling around to match is the relentless core.' }),
    S(3, { action: 'Negotiate freight between party + lorry, set my commission', tool: 'Phone', frequency: 'many-times-a-day', needsJudgment: true, frictionTags: ['chasing'] }),
    S(4, { action: 'Confirm both sides, take advance, note in the register', tool: 'Register + cash', frequency: 'many-times-a-day', frictionTags: ['manual-transfer', 'wait'] }),
    S(5, { action: 'Coordinate loading point + timing', tool: 'Phone', frequency: 'many-times-a-day', frictionTags: ['chasing', 'wait'] }),
    S(6, { action: 'Track dispatch + confirm safe loading / departure', tool: 'Phone', outputDestination: 'Another team', frequency: 'many-times-a-day', frictionTags: ['chasing'] }),
    S(7, { action: 'Settle commission + advance reconciliation, chase pending dues', tool: 'Register + cash', inputSource: 'My own notes', frequency: 'daily', frictionTags: ['manual-transfer', 'chasing'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Lorry owners / drivers', what: 'availability + agreed freight', typicalDelay: 'minutes by phone' },
    { direction: 'hand-to', who: 'Consignor', what: 'a confirmed lorry at the loading point', typicalDelay: 'same day' },
  ],
  exceptions: [
    { trigger: 'Lorry backs out after confirming', whatYouDo: 'Scramble the network for a replacement fast to keep the party', howOften: 'weekly' },
    { trigger: 'Freight dispute after delivery', whatYouDo: 'Mediate between party + driver from my register notes, protect both relationships', howOften: 'weekly' },
  ],
});

const warehousePicker = () => mk({
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
    { direction: 'wait-on', who: 'Inbound / put-away team', what: 'restocking the bins on time', typicalDelay: 'continuous; falls behind at peak' },
    { direction: 'wait-on', who: 'WMS', what: 'next pick list pushed to scanner', typicalDelay: 'seconds; longer in WMS slowdowns' },
    { direction: 'hand-to', who: 'Packing team', what: 'totes of picked items ready to pack', typicalDelay: 'immediate at drop conveyor' },
  ],
  exceptions: [
    { trigger: 'WMS goes down for half an hour', whatYouDo: 'Switch to paper pick lists printed by the team leader, lose pace, catch up after restore', howOften: 'a couple of times a month' },
    { trigger: 'A "ghost" stock — system says 5, bin has 2', whatYouDo: 'Pick what is there, raise exception, supervisor manually adjusts inventory', howOften: 'daily during peak' },
    { trigger: 'A fragile item is broken in the bin', whatYouDo: 'Move to damage cage, raise damage ticket, continue with next line', howOften: 'a few times a week' },
  ],
});

export const LOGISTICS: WorkedExample[] = [
  { key: 'last-mile-rider', label: 'A last-mile rider on a peak-hour batch', domain: 'Logistics', region: 'India urban', emoji: '🛵',
    summary: 'The app\'s route silently re-ordered by real knowledge of one-ways and lanes, while vague addresses and uncontactable customers wreck the per-delivery economics.',
    behavioralContext: 'The capture tags the manual re-routing as a shadow step (the rider\'s local knowledge beats the app, uncaptured) and marks address-finding as the painful time-sink that breaks the pay-per-delivery model. The local knowledge is value the system ignores.',
    fieldSpecificFit: 'The trace points the fit at the address problem, not the riding: better address resolution (saved geocodes, customer-pinned locations, verified landmarks) and routing that learns the rider\'s one-way corrections. The local-knowledge judgment should be captured and credited, not overridden.',
    build: lastMileRider },
  { key: 'long-haul-lorry', label: 'A long-haul driver on an interstate run', domain: 'Logistics', region: 'India', emoji: '🚛',
    summary: 'Route-craft (cheap fuel, safe sleep, roads that avoid trouble) held in the head, and fatigue against a tight delivery appointment as the dangerous, draining core.',
    behavioralContext: 'The capture tags the route/rest planning as shadow road-craft and marks fatigued driving against a tight slot as the painful, dangerous step. Squeezing ETAs without respecting rest is how accidents happen — the human limit is the thing to protect.',
    fieldSpecificFit: 'The trace points the fit at the seams, not faster driving: digital document/e-way handling to cut checkpost waits, realistic ETA-and-rest planning that builds in safe stops, and unloading-slot coordination. The fatigue limit and road-craft stay the driver\'s — honoured, not pressured.',
    build: longHaulLorry },
  { key: 'courier-branch', label: 'A courier branch clerk sorting and booking', domain: 'Logistics', region: 'Tamil Nadu', emoji: '📮',
    summary: 'Delivery-boy assignment balanced by knowing the boys and the localities, while lagging tracking turns the clerk into a human parcel-tracker on the phone all day.',
    behavioralContext: 'The capture tags the area-assignment as a shadow balancing judgment (who covers where, by knowing people + localities) and marks the "where is my parcel" chasing as the painful constant interruption — tracking lags reality, so the clerk becomes the tracker.',
    fieldSpecificFit: 'The trace aims the fix at the tracking gap: real-time scan-based status (so customers self-serve instead of calling) and a load-balanced assignment aid that respects the clerk\'s area knowledge. The boy-to-area judgment stays human, just better informed.',
    build: courierBranch },
  { key: 'customs-clearing', label: 'A CHA executive clearing an import container', domain: 'Logistics', region: 'Chennai, TN', emoji: '🚢',
    summary: 'HSN classification and valuation that define the whole clearance, then chasing customs queries while demurrage and detention charges tick on a stalled container.',
    behavioralContext: 'The capture marks HSN classification as the core judgment (it sets duty + query risk) and the query/examination chase as the painful step — costly waiting outside the agent\'s control. The classification expertise is exactly what protects the importer.',
    fieldSpecificFit: 'The trace points the fit at the document flow and the wait: classification-assist + document validation to cut query-triggering errors before filing, and milestone tracking so demurrage-driving delays are visible early. The HSN/valuation judgment stays the expert\'s.',
    build: customsClearing },
  { key: 'app-cab-driver', label: 'An app-cab driver chasing the trip incentive', domain: 'Logistics', region: 'India urban', emoji: '🚕',
    summary: 'A hidden accept/reject economics call on every ride (dead-mileage, drop zone, fuel), and grinding long hours to hit the incentive that is the real income.',
    behavioralContext: 'The capture tags the accept-decision and the real-margin calculation as shadow steps the app hides from its own metrics, and marks incentive-chasing as the painful pressure that defines the day. The driver\'s economics judgment is invisible to the platform that depends on it.',
    fieldSpecificFit: 'The trace points the honest fit at transparency for the driver, not more nudging: clear net-earnings (after fuel + commission) and demand/positioning info so the accept call and repositioning are informed, not guessed. This is a driver-empowerment fit, explicitly not a squeeze-more-hours one.',
    build: taxiDriver },
  { key: 'packers-movers', label: 'A packers-and-movers supervisor on a home shift', domain: 'Logistics', region: 'India urban', emoji: '🏠',
    summary: 'Volume and effort quoted from a walk-through (underestimate = loss), a handwritten inventory as the only proof against claims, and loading fragiles under time pressure as the high-stress step.',
    behavioralContext: 'The capture marks safe loading under time/access pressure as the painful step where damage and disputes happen, and tags the inventory list as a shadow self-protection against claims. The survey-quote and loading judgment are craft that volume tools only assist.',
    fieldSpecificFit: 'The trace points the fit at the quote and the proof: a photo-survey-assisted volume estimate to de-risk pricing, and a digital photo-inventory that settles damage claims fairly. The packing and load-sequencing judgment stays the supervisor\'s.',
    build: packersMovers },
  { key: 'cold-chain-reefer', label: 'A cold-chain coordinator moving a pharma load', domain: 'Logistics', region: 'India', emoji: '❄️',
    summary: 'Door-open loading speed judged to avoid an excursion, then the constant high-value worry of a reefer fault condemning a whole pharma load mid-transit.',
    behavioralContext: 'The capture marks en-route temperature monitoring as the painful, high-stakes worry (a breakdown condemns the load) and tags the meticulous cold-chain log as a shadow compliance proof. The loading-speed and routing calls protect load integrity.',
    fieldSpecificFit: 'The trace points squarely at the monitoring gap: real-time reefer telematics with proactive alarms (so a fault is caught before condemnation) and automated, audit-ready cold-chain logging. The loading and contingency judgment stays the coordinator\'s.',
    build: coldChainReefer },
  { key: 'lorry-booking-agent', label: 'A transport broker matching a load to a lorry', domain: 'Logistics', region: 'Tamil Nadu', emoji: '📋',
    summary: 'The entire business is a contact book in the head and phone — who is reliable, who is where, who pays — worked by relentless calling-around to match each load.',
    behavioralContext: 'The capture marks the load-to-lorry matching as the painful core (built on a personal trust network) and tags it as a shadow step — the relationships, reliability and payment-history live in the broker\'s head, not a system. That trust map is the whole value.',
    fieldSpecificFit: 'The trace points the fit at amplifying the network, not disintermediating it: a digital load-board + matching that surfaces available lorries faster while keeping the broker\'s reliability/payment judgment central. A blunt marketplace that cuts out the trust relationship would be quietly rejected.',
    build: lorryBookingAgent },
  { key: 'warehouse-picker', label: 'Picking an e-commerce order at a 3PL warehouse', domain: 'Logistics', region: 'Sriperumbudur, TN', emoji: '📦',
    summary: 'A peak-day picker with an RF scanner — 12 km of walking, ghost stock, tribal knowledge of where the bin actually is, and a rate target watched by the second.',
    behavioralContext: 'The capture marks the fastest exception-recovery as a shadow step — asking a senior picker who knows the real restock pattern — because the WMS exception flow is slower than tribal knowledge. The 12 km of walking comes from pick lists the WMS does not path-optimise, and ghost stock turns picking into a daily guessing game.',
    fieldSpecificFit: 'This is where automation genuinely fits — but on the system, not the picker: WMS path-optimised pick routes cut the walking the trace flags, and a live bin-accuracy / ghost-stock feed turns the tribal "where is it really" knowledge into shared data. Don\'t gamify the rate target harder; fix the routing and the stock truth.',
    build: warehousePicker },
];
