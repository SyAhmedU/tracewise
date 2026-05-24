// PROFESSIONAL SERVICES — motor insurance claim, Coimbatore CA GSTR-3B, L2 IT incident
import { S, mk, type WorkedExample } from './_shared';

const insuranceClaim = () => mk({
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
    { direction: 'wait-on', who: 'External assessor', what: 'the damage assessment report', typicalDelay: 'usually 2–4 days, sometimes a week' },
    { direction: 'wait-on', who: 'Team leader', what: 'sign-off on settlements over my authority limit', typicalDelay: 'same day if they are in, otherwise next morning' },
    { direction: 'hand-to', who: 'Payments team', what: 'the approved payment instruction', typicalDelay: 'paid in the nightly run' },
  ],
  exceptions: [
    { trigger: 'The customer sends incomplete documents', whatYouDo: 'Email them a checklist, pause the claim, and put a sticky note on my monitor to chase in 3 days', howOften: 'roughly one claim in four' },
    { trigger: 'The policy has lapsed', whatYouDo: 'Stop, escalate to underwriting, and hold the email until they reply', howOften: 'a couple of times a month' },
  ],
});

const gstReturnFiling = () => mk({
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
    { direction: 'wait-on', who: 'Client', what: 'sales / purchase data and challan payment', typicalDelay: 'days; many clients only respond near the 20th' },
    { direction: 'wait-on', who: 'GST portal (GSTN)', what: 'page response, OTP, ledger update', typicalDelay: 'minutes; much worse on the 19th–20th' },
  ],
  exceptions: [
    { trigger: "Supplier hasn't filed their GSTR-1, so an invoice is missing from 2B", whatYouDo: 'Either chase the supplier through the client, or defer the ITC to next month — judgement call on which is realistic', howOften: 'most clients, most months' },
    { trigger: 'Client misses the 20th deadline', whatYouDo: 'File late with interest, calculate it manually, and warn the client about the late fee', howOften: 'once or twice a month across the practice' },
  ],
});

const itSupportIncident = () => mk({
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
    { direction: 'wait-on', who: 'Dev team lead', what: 'code-side fix when mitigation is not enough', typicalDelay: 'within 30 min for P2, longer at night' },
    { direction: 'hand-to', who: 'Next shift engineer', what: 'open issues, watch-items, and the partial RCA', typicalDelay: 'at the shift boundary' },
  ],
  exceptions: [
    { trigger: 'L1 mis-routed a P3 as P2 just to wake someone up', whatYouDo: 'Downgrade after a quick check, leave a note, and quietly grumble in the team Slack', howOften: 'once a week' },
    { trigger: 'The fix needs production DB access I do not have', whatYouDo: 'Wake the DBA on-call, sit on a call while they execute, take screenshots for audit', howOften: 'a couple of times a month' },
  ],
});

export const SERVICES: WorkedExample[] = [
  { key: 'insurance-claim', label: 'Settling a motor insurance claim', domain: 'Professional services', region: 'Global', emoji: '📄',
    summary: 'A motor claims handler end to end — three re-keyings of the same numbers, a shadow tracker the whole team relies on, and an assessor they keep chasing.',
    behavioralContext: 'The trace exposes the same numbers re-keyed three times (email → CMS → payments) and a personal Excel the whole team secretly depends on because the CMS dashboard is unreliable — articulation work plugging a system gap — plus a private "which garages over-quote" list that is real underwriting judgment.',
    fieldSpecificFit: 'Attack the triple re-keying the capture flags painful: parse the claim email into the CMS, and pass the approved figure straight to payments — no human retype. Replace the shadow Excel with a CMS open-claims view the team can trust. Keep the cover-wording interpretation and garage judgment human.',
    build: insuranceClaim },
  { key: 'gst-return-filing', label: "Filing a client's monthly GSTR-3B", domain: 'Professional services', region: 'Coimbatore, TN', emoji: '📊',
    summary: 'A tax practitioner chasing WhatsApped invoice photos, reconciling 2B in Excel, judging ITC eligibility, and racing the portal on the 20th.',
    behavioralContext: 'The trace tags the ITC-eligibility call and the "is this the same invoice despite a typo\'d PAN" reconciliation as judgment, and surfaces two shadow tools — a personal blocked-credits checklist and a Google Sheet of who-filed-which-month — because the office software shows neither. Chasing clients and hand-typing WhatsApped invoice photos are the painful drag.',
    fieldSpecificFit: 'Automate the data drudgery the capture flags: OCR the WhatsApped invoice photos into the purchase register, and auto-reconcile against the 2B with mismatches flagged for the practitioner\'s judgment. Turn the private filing-tracker Sheet into a practice-wide deadline dashboard. The ITC-eligibility call stays the CA\'s.',
    build: gstReturnFiling },
  { key: 'it-support-incident', label: 'Resolving a P2 production incident', domain: 'Professional services', region: 'Chennai, TN', emoji: '🛠',
    summary: 'A 2 AM page for an L2 engineer — Splunk, deploy logs, a personal OneNote runbook, a Slack DM nobody officially asked for, and an RCA written for the third time today.',
    behavioralContext: 'The capture shows the real knowledge living in a personal OneNote runbook and an unofficial Slack DM to the dev lead — articulation work every L2 does because the official KB is stale and the process has no heads-up channel. The escalate-vs-fix call at 3 AM is irreducible judgment.',
    fieldSpecificFit: 'Don\'t automate the triage judgment. Cut the documentation friction the trace marks painful: assemble the RCA draft from the Splunk / Slack / deploy timeline already captured, and make the personal runbook the actual KB — searchable, owned by the engineer. Formalise the shift heads-up so it stops being a private DM.',
    build: itSupportIncident },
];
