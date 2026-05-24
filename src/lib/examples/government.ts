// GOVERNMENT — VAO, traffic constable, RTO clerk, sub-registrar clerk, sanitary inspector, BLO, PDS dealer
import { S, mk, type WorkedExample } from './_shared';

const vaoCommunityCertificate = () => mk({
  role: 'Village Administrative Officer (TN Revenue Dept)',
  context: 'A taluk in rural Tamil Nadu; VAO covers three revenue villages; uses TN e-Sevai / CAN portal',
  outputName: 'a community certificate issued through e-Sevai',
  officialVersion: 'Citizen applies on e-Sevai; VAO verifies, recommends; Revenue Inspector / Tahsildar digitally signs; certificate issued within citizen-charter time.',
  instanceAnchor: 'a school admission application from Selvi village, last Tuesday',
  trigger: 'A pending application appears in my e-Sevai VAO queue',
  steps: [
    S(1, { action: 'Log in to e-Sevai portal and pull the new application', tool: 'TN e-Sevai portal', inputSource: 'A system / report', timeMins: 6, frequency: 'daily', frictionTags: ['lookup', 'wait'], notes: 'Office router and state network — both flaky.' }),
    S(2, { action: 'Download applicant documents — Aadhaar, ration card, school certs, parent certs', tool: 'e-Sevai attachments', timeMins: 8, frequency: 'daily', frictionTags: ['lookup'] }),
    S(3, { action: 'Cross-check family name against my village register and parent-side caste records', tool: 'Paper village register + chitta-adangal', inputSource: 'My own notes', timeMins: 15, frequency: 'daily', frictionTags: ['lookup', 'movement'], isShadow: true, needsJudgment: true }),
    S(4, { action: 'Field verification — neighbours, ward member, sometimes school', tool: 'Two-wheeler + voice', timeMins: 90, frequency: 'few-times-a-week', frictionTags: ['movement', 'wait'], needsJudgment: true, notes: 'Family often in fields — go again in evening.' }),
    S(5, { action: 'Where records conflict, make the judgment call defensibly', tool: 'Judgment + elder testimony', needsJudgment: true, isPainful: true, timeMins: 20, frequency: 'few-times-a-week' }),
    S(6, { action: 'Write up verification report, scan / photograph for upload', tool: 'A4 paper + phone scanner', inputSource: 'My own notes', timeMins: 12, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
    S(7, { action: 'Upload and recommend on e-Sevai', tool: 'TN e-Sevai portal', outputDestination: 'Tahsildar', timeMins: 10, frequency: 'few-times-a-week', frictionTags: ['wait', 'manual-transfer'] }),
    S(8, { action: 'Update my personal status notebook because portal view is poor', tool: 'Notebook + WhatsApp', inputSource: 'My own notes', timeMins: 5, frequency: 'daily', isShadow: true }),
    S(9, { action: 'Field calls from applicants asking status', tool: 'Personal mobile', inputSource: 'A client / customer', timeMins: 25, frequency: 'daily', frictionTags: ['chasing', 'wait'], isPainful: true }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Tahsildar', what: 'recommended application for signature', typicalDelay: '1–3 days' },
    { direction: 'wait-on', who: 'Applicant', what: 'missing / corrected documents', typicalDelay: 'days to weeks' },
  ],
  exceptions: [
    { trigger: 'Aadhaar name does not match school records', whatYouDo: 'Ask for affidavit, restart verification', howOften: 'one in three' },
    { trigger: 'Political intermediary pressures to expedite', whatYouDo: 'Stick to queue, document, escalate to Tahsildar if persistent', howOften: 'most weeks' },
  ],
});

const trafficConstable = () => mk({
  role: 'Traffic constable (Chennai junction duty)',
  context: 'A 4-way signalised junction in Chennai; 2-shift posting; e-Challan device + walkie',
  outputName: 'a junction shift run safely and with violations booked',
  officialVersion: 'Arrive at post → traffic management → signal violations / no-helmet / drunk-driving → e-Challan booked → end-shift report.',
  instanceAnchor: 'morning peak shift, last Monday',
  trigger: 'Reach the junction at 7:30 AM',
  steps: [
    S(1, { action: 'Report at junction, take handover from night constable', tool: 'Voice + signal box', outputDestination: 'Self', timeMins: 10, frequency: 'daily' }),
    S(2, { action: 'Direct traffic manually if signal needs override (school bus etc.)', tool: 'Hand signals + whistle', frequency: 'many-times-a-day', needsJudgment: true }),
    S(3, { action: 'Spot violation — signal jump, no helmet, riding triple, mobile use', tool: 'Eyes', frequency: 'many-times-a-day', needsJudgment: true, isShadow: true, notes: 'Spot-pick wisely — chase the chaseable; let the truck through.' }),
    S(4, { action: 'Stop offender, demand DL / RC; check on TN e-Challan app', tool: 'e-Challan device + voice', inputSource: 'A client / customer', timeMins: 6, frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true }),
    S(5, { action: 'Book e-Challan: violation code, photo, fine; print or send SMS', tool: 'e-Challan device', outputWhat: 'an issued challan', outputDestination: 'Offender', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Handle the argument — settle, fine, escalate to PSI', tool: 'Voice', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true }),
    S(7, { action: 'Coordinate with traffic SI / PSI via walkie for major incidents', tool: 'Walkie + phone', outputDestination: 'PSI', frequency: 'daily', frictionTags: ['chasing'] }),
    S(8, { action: 'Maintain log of bookings in personal notebook (numbers + violations)', tool: 'Personal notebook', inputSource: 'My own notes', timeMins: 10, frequency: 'daily', isShadow: true, notes: 'e-Challan device gives me a list — but my notebook tracks the day\'s flow.' }),
    S(9, { action: 'Handover to next shift, brief on hotspots and ongoing issues', tool: 'Voice', outputDestination: 'Next-shift constable', timeMins: 8, frequency: 'daily' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'PSI / Traffic SI', what: 'support for major incidents or VIP movement', typicalDelay: 'minutes' },
    { direction: 'hand-to', who: 'Court / RTO', what: 'unpaid challans batched for further action', typicalDelay: 'weekly' },
  ],
  exceptions: [
    { trigger: 'VIP convoy movement', whatYouDo: 'Clear lane on PSI signal, hold civilian traffic, resume after', howOften: 'few times a week' },
    { trigger: 'Accident at junction', whatYouDo: 'Call ambulance, secure scene, photograph, file FIR support', howOften: 'monthly' },
  ],
});

const rtoClerk = () => mk({
  role: 'RTO clerk (driving license issuance section)',
  context: 'A Chennai RTO office handling LL / DL applications; mix of Sarathi portal + counter',
  outputName: 'a driving license printed and issued',
  officialVersion: 'Online application on Sarathi → fee paid → slot for LL test → DL test → printing → posted / picked up.',
  instanceAnchor: 'a fresh DL test session yesterday afternoon',
  trigger: 'Applicant arrives at counter with their LL and test booking',
  steps: [
    S(1, { action: 'Verify Sarathi application + fee receipt + LL + slot', tool: 'Sarathi portal', inputSource: 'A client / customer', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['lookup'] }),
    S(2, { action: 'Take photo + biometric (thumb) at counter', tool: 'Biometric station', outputWhat: 'biometric record', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(3, { action: 'Direct to test track / panel for the driving test', tool: 'Voice + slip', outputDestination: 'Test inspector', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(4, { action: 'Receive test result from inspector — pass / fail', tool: 'Paper slip', inputSource: 'A colleague', frequency: 'many-times-a-day' }),
    S(5, { action: 'On pass: update Sarathi → trigger printing queue', tool: 'Sarathi portal', outputDestination: 'DL printer', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['manual-transfer', 'wait'] }),
    S(6, { action: 'On fail: re-book test, mark failure reason, refund or carry forward fee', tool: 'Sarathi + receipt book', needsJudgment: true, frequency: 'daily' }),
    S(7, { action: 'Print + lamination → DL handed at counter or posted to address', tool: 'DL printer + envelope', outputDestination: 'A client / customer', timeMins: 8, frequency: 'many-times-a-day' }),
    S(8, { action: 'Field counter queries — license number, status, address change', tool: 'Sarathi + voice', inputSource: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['chasing'], notes: 'Half my day is "sir status please" enquiries.' }),
    S(9, { action: 'EOD: tally printed DLs vs Sarathi log, reconcile fees', tool: 'Sarathi report + receipt book', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Driving test inspector', what: 'test result slip', typicalDelay: 'shift end of test slot' },
    { direction: 'hand-to', who: 'Postal section', what: 'mailed DLs', typicalDelay: 'next day' },
  ],
  exceptions: [
    { trigger: 'Biometric capture fails', whatYouDo: 'Retry with cleaning; escalate to IT; ask applicant to revisit', howOften: 'weekly' },
    { trigger: 'Touts / agents pushing in queue', whatYouDo: 'Stick to Sarathi token; escalate to MVI if persistent', howOften: 'daily' },
  ],
});

const subRegistrarClerk = () => mk({
  role: 'Sub-Registrar office (SRO) clerk',
  context: 'A TN SRO handling property registrations on the TN Registration Dept STAR portal',
  outputName: 'a property document registered and digitally archived',
  officialVersion: 'STAR e-payment of stamp + registration fee → appointment → parties + witnesses present → biometric + photo → SR signs → document scanned + indexed.',
  instanceAnchor: 'a flat sale registration last Wednesday',
  trigger: 'Parties arrive at SRO for their booked slot',
  steps: [
    S(1, { action: 'Verify STAR e-payment receipt and document set (sale deed, ID, EC, patta)', tool: 'STAR portal + paper docs', inputSource: 'A client / customer', timeMins: 12, frequency: 'many-times-a-day', frictionTags: ['lookup'] }),
    S(2, { action: 'Match parties + witnesses to ID, capture biometric + photo', tool: 'Biometric station + camera', timeMins: 10, frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(3, { action: 'Read aloud the operative clause and confirm understanding', tool: 'Voice + sale deed', needsJudgment: true, timeMins: 6, frequency: 'many-times-a-day' }),
    S(4, { action: 'Compute stamp + registration fee + Bhoomi indexing fee on STAR', tool: 'STAR portal', outputWhat: 'final fee', timeMins: 8, frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true, notes: 'Guideline value disputes — judgment in margin of error.' }),
    S(5, { action: 'Sub-Registrar reviews and signs digitally', tool: 'STAR portal + SR digital cert', outputDestination: 'Sub-Registrar', timeMins: 8, frequency: 'many-times-a-day', frictionTags: ['approval', 'wait'] }),
    S(6, { action: 'Scan + index original; issue registered copy with QR', tool: 'Scanner + STAR', outputWhat: 'a registered document', outputDestination: 'A client / customer', timeMins: 15, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(7, { action: 'Handle EC issuance applications during the day', tool: 'STAR portal', frequency: 'many-times-a-day', frictionTags: ['lookup'] }),
    S(8, { action: 'Maintain a personal day-log of pending vs done — STAR queue is unreliable', tool: 'Personal day-log', inputSource: 'My own notes', frequency: 'daily', isShadow: true, notes: 'When applicants come back, my log is faster than the portal.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Sub-Registrar', what: 'review + digital signature', typicalDelay: 'minutes to an hour' },
    { direction: 'hand-to', who: 'Postal / archival', what: 'document copies + index updates', typicalDelay: 'EOD' },
  ],
  exceptions: [
    { trigger: 'Guideline value dispute', whatYouDo: 'Recompute on STAR; escalate to SR; advise top-up payment if short', howOften: 'weekly' },
    { trigger: 'Witness mismatch with ID', whatYouDo: 'Refuse; ask parties to bring proper witness; re-book if needed', howOften: 'weekly' },
  ],
});

const sanitaryInspector = () => mk({
  role: 'Municipal sanitary inspector (TN ULB)',
  context: 'A ward in a TN urban local body; oversees garbage collection, drains, food premises, public toilets',
  outputName: 'a ward inspection round completed and complaints actioned',
  officialVersion: 'Daily round → check SHG / NULM workers → inspect food premises → log complaints on ULB portal → report to Commissioner.',
  instanceAnchor: 'a morning round last Thursday after monsoon rain',
  trigger: 'Shift starts; SHG sanitation workers arrive at depot',
  steps: [
    S(1, { action: 'Roll call of sanitation workers at depot, assign streets', tool: 'Attendance register + voice', outputDestination: 'Workers', timeMins: 15, frequency: 'daily', frictionTags: ['chasing'] }),
    S(2, { action: 'Round of garbage collection — pick truck routes, check skipped streets', tool: 'Two-wheeler + GPS app', timeMins: 90, frequency: 'daily', frictionTags: ['movement'] }),
    S(3, { action: 'Inspect storm-water drains for blockage / overflow post-rain', tool: 'Eyes + flashlight', needsJudgment: true, frequency: 'daily', notes: 'Decide which need de-silting today vs waiting list.' }),
    S(4, { action: 'Spot check 2–3 food premises — kitchen hygiene, water source', tool: 'Inspection checklist', inputSource: 'A client / customer', timeMins: 20, frequency: 'daily', needsJudgment: true }),
    S(5, { action: 'Field public complaint calls — overflowing bin, dead animal, stray dogs', tool: 'Phone + voice', frequency: 'daily', frictionTags: ['chasing'] }),
    S(6, { action: 'Photograph + tag complaint on ULB portal / WhatsApp Commissioner group', tool: 'Phone + ULB portal', outputDestination: 'ULB portal', timeMins: 15, frequency: 'daily', frictionTags: ['manual-transfer'], isShadow: true, notes: 'Commissioner reads WhatsApp faster than the portal — both required.' }),
    S(7, { action: 'Assign resolution — dispatch tractor, fogging team, drain team', tool: 'Phone + ward register', outputDestination: 'Department teams', frequency: 'daily', needsJudgment: true }),
    S(8, { action: 'Note complaint repeats in personal hotspot register', tool: 'Personal register', inputSource: 'My own notes', frequency: 'weekly', isShadow: true, notes: 'My register tracks repeat-offender lanes — official portal does not show pattern.' }),
    S(9, { action: 'EOD report on ULB portal + WhatsApp Commissioner', tool: 'ULB portal + WhatsApp', outputDestination: 'Commissioner', timeMins: 15, frequency: 'daily' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Tractor / drain crew', what: 'response to assigned tasks', typicalDelay: 'hours to a day' },
    { direction: 'hand-to', who: 'Commissioner', what: 'daily report + escalations', typicalDelay: 'EOD' },
  ],
  exceptions: [
    { trigger: 'Flooding from blocked main drain', whatYouDo: 'Emergency call to drain contractor + corporation engineer; mobilise on the spot', howOften: 'monsoon weeks' },
    { trigger: 'Food premises grossly unhygienic', whatYouDo: 'Issue notice, sample seized, escalate to FSSAI for closure if repeat', howOften: 'monthly' },
  ],
});

const blo = () => mk({
  role: 'Booth Level Officer (BLO) — Election Commission',
  context: 'Usually a govt school teacher / panchayat staff doubling as BLO for an assembly booth; runs voter list updates',
  outputName: 'an updated electoral roll for the booth',
  officialVersion: 'Door-to-door survey → new / delete / correction forms (6, 7, 8) → enter into ERONet → publish draft → handle objections.',
  instanceAnchor: 'a special summary revision exercise last month',
  trigger: 'BLO duty assigned by ERO for the SSR window',
  steps: [
    S(1, { action: 'Pull current voter list for the booth from ERONet', tool: 'ERONet + printer', inputSource: 'A system / report', timeMins: 30, frequency: 'monthly', frictionTags: ['lookup'] }),
    S(2, { action: 'Door-to-door survey — match list, mark deceased / shifted / new', tool: 'Printed list + pen', timeMins: 240, frequency: 'monthly', frictionTags: ['movement', 'wait'], isPainful: true }),
    S(3, { action: 'Collect Form 6 (new), Form 7 (deletion), Form 8 (correction) with documents', tool: 'Forms + voice', inputSource: 'A client / customer', frequency: 'monthly', frictionTags: ['chasing'] }),
    S(4, { action: 'Verify documents — age proof, address proof, photo', tool: 'Eyes + checklist', needsJudgment: true, frequency: 'monthly' }),
    S(5, { action: 'Enter into ERONet — slow, batch in evening', tool: 'ERONet', timeMins: 90, frequency: 'monthly', frictionTags: ['manual-transfer', 'wait'], isPainful: true }),
    S(6, { action: 'Handle objections / overlapping entries — escalate to ERO', tool: 'ERONet + phone', needsJudgment: true, frequency: 'monthly', notes: 'Tense cases — political booth captains push back.' }),
    S(7, { action: 'Coordinate with party booth agents during draft publication', tool: 'Voice', frequency: 'monthly', isShadow: true, notes: 'Not in SOP but the real review happens here.' }),
    S(8, { action: 'Submit final entries; print updated roll', tool: 'ERONet', outputDestination: 'ERO', frequency: 'monthly' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'ERO (Electoral Registration Officer)', what: 'objection ruling + approval', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'Polling Officer', what: 'final roll for election day', typicalDelay: 'before polling' },
  ],
  exceptions: [
    { trigger: 'Family refuses to share documents', whatYouDo: 'Explain consequence, leave Form 6 anyway, mark in notes for revisit', howOften: 'daily during SSR' },
    { trigger: 'ERONet down', whatYouDo: 'Collect forms manually, batch entry next day; SOP allows this in revision window', howOften: 'few times during SSR' },
  ],
});

const pdsDealer = () => mk({
  role: 'PDS (ration shop) dealer / Fair Price Shop owner',
  context: 'A TN PDS shop serving ~1000 cards on Smart Ration Card biometric system',
  outputName: "a month's PDS commodities distributed to entitled cardholders",
  officialVersion: 'Stock received from TNCSC godown → cardholder biometric auth on ePOS device → commodity issued per scale → portal log → physical register backup.',
  instanceAnchor: 'this month\'s distribution starting the 1st',
  trigger: 'Monthly stock truck arrives from TNCSC godown',
  steps: [
    S(1, { action: 'Receive and verify TNCSC truck — weight, bag count, sealed condition', tool: 'Weighbridge slip + tally', outputDestination: 'Self-godown', timeMins: 90, frequency: 'monthly', frictionTags: ['movement', 'wait'], needsJudgment: true }),
    S(2, { action: 'Stack stock in godown; reconcile with allotment chart', tool: 'Hand + stock register', timeMins: 60, frequency: 'monthly', frictionTags: ['manual-transfer'] }),
    S(3, { action: 'Boot ePOS biometric device; sync with TNPDS server', tool: 'ePOS device', inputSource: 'A system / report', timeMins: 15, frequency: 'daily', frictionTags: ['wait'] }),
    S(4, { action: 'Cardholder arrives — Aadhaar biometric auth on ePOS', tool: 'ePOS + thumb scanner', inputSource: 'A client / customer', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'Old people thumbs fail often — biggest pain.' }),
    S(5, { action: 'Issue rice / wheat / sugar / kerosene per the scale; weigh out', tool: 'Scoop + scale', outputDestination: 'A client / customer', timeMins: 4, frequency: 'many-times-a-day' }),
    S(6, { action: 'Note in shop register parallel to ePOS log', tool: 'Stock register', inputSource: 'My own notes', timeMins: 1, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'], isShadow: true, notes: 'Insurance against ePOS log corruption — common.' }),
    S(7, { action: 'Handle biometric failure — OTP fallback or family-member auth', tool: 'ePOS OTP flow', needsJudgment: true, frequency: 'daily', isPainful: true }),
    S(8, { action: 'Update digital + paper stock at EOD; reconcile losses', tool: 'ePOS sync + stock register', frequency: 'daily', frictionTags: ['manual-transfer', 'rework'] }),
    S(9, { action: 'Field grievances — entitlement disputes, family additions', tool: 'Voice + TNPDS grievance portal', inputSource: 'A client / customer', frequency: 'daily', frictionTags: ['chasing'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'TNCSC godown', what: 'monthly stock allotment', typicalDelay: '1st week of month' },
    { direction: 'hand-to', who: 'PDS inspector', what: 'monthly compliance review', typicalDelay: 'monthly' },
  ],
  exceptions: [
    { trigger: 'ePOS biometric fails repeatedly', whatYouDo: 'OTP fallback; escalate to TNPDS helpdesk; manual issue with extra docs', howOften: 'daily' },
    { trigger: 'Stock short on weight delivery', whatYouDo: 'Note short in receipt; complaint to TNCSC; bear short loss meanwhile', howOften: 'monthly' },
  ],
});

export const GOVERNMENT: WorkedExample[] = [
  { key: 'vao-community-certificate', label: 'Issuing a community certificate (e-Sevai)', domain: 'Government', region: 'Rural TN', emoji: '🏛',
    summary: 'A VAO from portal queue to village doorstep — paper village registers, evening visits, defensible judgment when records conflict.',
    behavioralContext: 'The trace tags the cross-check against the paper village register as shadow + judgment work — local knowledge no portal holds — and the conflicting-records call as painful because it must stay defensible against later political pressure. The personal status notebook exists because the e-Sevai queue view cannot answer the applicant at the door.',
    fieldSpecificFit: 'Do not automate the caste/family verification — that is the accountable human act. Attack the two friction steps the capture surfaces: an applicant-facing status SMS (from e-Sevai) to kill the "sir status please" calls, and a mobile field-verification form that uploads with the photo, removing the write-up-then-scan handling.',
    build: vaoCommunityCertificate },
  { key: 'traffic-constable', label: 'A traffic constable on junction duty', domain: 'Government', region: 'Chennai, TN', emoji: '🚦',
    summary: 'A constable spotting violations, booking e-Challans, defusing arguments, and keeping a personal notebook of the shift\'s flow.',
    behavioralContext: 'The capture marks "chase the chaseable" and the argument-defusing as judgment steps — split-second reads of what is safely stoppable that auto-enforcement cannot replace. The personal notebook is a shadow step tracking the shift\'s flow, which the device\'s flat challan list never shows.',
    fieldSpecificFit: 'Leave the discretion and de-escalation human. The fit sits upstream and beside: junction cameras for the clear-cut violations (helmet, signal-jump) free the constable for what needs judgment, and a voice-tag on the e-Challan device replaces the notebook without taking their eyes off traffic.',
    build: trafficConstable },
  { key: 'rto-clerk', label: 'Issuing a driving license at the RTO', domain: 'Government', region: 'Chennai, TN', emoji: '🪪',
    summary: 'An RTO clerk between Sarathi, biometric, test inspector and a counter queue made of "sir status please" enquiries.',
    behavioralContext: 'The trace shows the day swallowed by status enquiries and queue-management amid touts — friction tagged chasing — while the Sarathi steps themselves are routine. Citizens crowd the counter because they do not trust that the online status is real.',
    fieldSpecificFit: 'A trustworthy applicant-facing status track with an SMS at each milestone (test booked, passed, printed, posted) removes most counter enquiries and undercuts the touts who sell "status access." Keep biometric and test verification at the counter — the integrity steps the capture shows must stay supervised.',
    build: rtoClerk },
  { key: 'sub-registrar-clerk', label: 'Registering a property at the SRO', domain: 'Government', region: 'Tamil Nadu', emoji: '📜',
    summary: 'An SRO clerk on STAR portal — guideline-value judgment, biometric, scanner, and a personal day-log faster than the portal queue view.',
    behavioralContext: 'The capture tags the guideline-value computation and reading the deed aloud as judgment — accountable legal acts with a defensible margin, not arithmetic to black-box. The personal day-log is a shadow step persisting because STAR\'s queue view cannot reliably tell a returning party where their document is.',
    fieldSpecificFit: 'Do not automate the valuation judgment or the read-aloud. Fix the returning-party problem the trace exposes: a document-status lookup (QR / phone) from STAR so the private day-log is not the only reliable tracker, plus pre-filled fee computation the clerk reviews rather than re-keys.',
    build: subRegistrarClerk },
  { key: 'sanitary-inspector', label: 'Ward round of a municipal sanitary inspector', domain: 'Government', region: 'Tamil Nadu', emoji: '🧹',
    summary: 'An SI between SHG workers, blocked drains, food premises and a Commissioner WhatsApp group read faster than the ULB portal.',
    behavioralContext: 'The trace records reporting twice — ULB portal for the record, Commissioner WhatsApp for action — as a manual-transfer shadow step, because the official channel is slow and decisions happen on WhatsApp. The personal hotspot register exists because the portal logs complaints but never shows the repeat-lane pattern.',
    fieldSpecificFit: 'One photo-tag posting to both the portal and the Commissioner feed kills the double-reporting the capture flags. Turn the private hotspot register into a repeat-complaint heatmap auto-built from portal data, so pattern-spotting stops depending on memory. Which drain to clear first stays the inspector\'s judgment.',
    build: sanitaryInspector },
  { key: 'blo', label: 'A BLO during electoral roll revision', domain: 'Government', region: 'Tamil Nadu', emoji: '🗳',
    summary: 'A BLO going door-to-door with a printed list, collecting Forms 6/7/8, fighting ERONet at night, and managing booth-agent pushback.',
    behavioralContext: 'The capture marks the door-to-door survey and the slow night-time ERONet batch entry as painful — pure overload on a teacher\'s day job — while the real roll-scrub with party booth agents is a shadow step the SOP never acknowledges. Households share documents only on personal trust in the known local BLO.',
    fieldSpecificFit: 'Do not touch the trust-based doorstep collection or the agent reconciliation. Cut the data-entry overload the trace exposes: a mobile capture of Forms 6/7/8 at the door (photo + fields) that syncs to ERONet when the network returns, replacing the printed-list-then-night-batch double handling.',
    build: blo },
  { key: 'pds-dealer', label: 'Monthly PDS distribution at a ration shop', domain: 'Government', region: 'Tamil Nadu', emoji: '🍚',
    summary: 'A PDS dealer between ePOS biometric, scoop scale, OTP fallback for elderly thumbs, and a paper register kept as insurance.',
    behavioralContext: 'The trace tags the parallel paper register as a shadow step that is insurance against ePOS log corruption the dealer has been burned by — not idle duplication — and the elderly-thumb biometric failure as the painful daily step. Cardholders trust the dealer\'s manual issue when the machine refuses a grandmother\'s thumb.',
    fieldSpecificFit: 'Harden the failure paths the capture surfaces, do not add more system: a reliable offline-capable ePOS that reconciles when back online removes the reason for the paper insurance register, and a smoother elderly fallback (face / OTP / nominee) fixes the worst daily friction. The scoop-and-scale issue stays as is.',
    build: pdsDealer },
];
