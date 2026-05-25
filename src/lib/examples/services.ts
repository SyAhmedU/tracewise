// PROFESSIONAL SERVICES — motor insurance claim, Coimbatore CA GSTR-3B, L2 IT incident
import { S, mk, type WorkedExample } from './_shared';

const bankLoanOfficer = () => mk({
  role: 'Bank loan officer (MSME / home loan)',
  context: 'A branch credit desk processing MSME + home loan files; core banking + a separate loan-origination portal',
  outputName: 'a loan application moved to sanction (or rejection)',
  officialVersion: 'Receive application → verify KYC + documents → appraise + score → field visit → recommend → credit committee sanction → disburse.',
  instanceAnchor: 'an MSME working-capital file for a small Coimbatore unit',
  trigger: 'Applicant submits a loan request with documents',
  steps: [
    S(1, { action: 'Collect + check KYC, financials, GST returns, bank statements', tool: 'Branch + scanner', inputSource: 'A client / customer', timeMins: 40, frequency: 'daily', frictionTags: ['lookup'] }),
    S(2, { action: 'Key the same data into core banking AND the LOS portal', tool: 'Core banking + LOS', timeMins: 30, frequency: 'daily', frictionTags: ['manual-transfer', 'rework'], notes: 'Two systems that don\'t talk — I type the customer twice.' }),
    S(3, { action: 'Read the real business — judge cash-flow, intent, local reputation', tool: 'Experience + market sense', frequency: 'daily', needsJudgment: true, notes: 'The numbers say one thing; knowing the trade + the person says another — that read is the actual credit call.' }),
    S(4, { action: 'Field visit — see the unit, stock, verify it exists + operates', tool: 'Site visit', timeMins: 90, frequency: 'few-times-a-week', frictionTags: ['movement'], needsJudgment: true }),
    S(5, { action: 'Write appraisal note + recommendation, attach to file', tool: 'Word / template', outputDestination: 'Another team', timeMins: 45, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Chase missing documents + internal approvals up the chain', tool: 'Phone + email', frequency: 'daily', frictionTags: ['chasing', 'approval', 'wait'], isPainful: true, notes: 'The file sits in someone\'s inbox; I keep ringing to keep it moving — the slowest, most thankless part.' }),
    S(7, { action: 'On sanction, prep disbursement + compliance docs; on reject, explain to customer', tool: 'Core banking', frequency: 'daily', needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Credit committee / regional office', what: 'sanction approval above branch limit', typicalDelay: 'days to weeks' },
    { direction: 'wait-on', who: 'Legal / valuation vendor', what: 'title + property valuation report', typicalDelay: 'a week' },
  ],
  exceptions: [
    { trigger: 'Document mismatch surfaces late', whatYouDo: 'Send file back for re-submission; the clock restarts; customer frets', howOften: 'weekly' },
    { trigger: 'Good borrower, weak paperwork', whatYouDo: 'Guide them to fix docs informally so a sound case isn\'t lost to format', howOften: 'weekly' },
  ],
});

const caBookkeeping = () => mk({
  role: 'Accountant at a CA firm (SME bookkeeping + compliance)',
  context: 'A CA firm doing monthly books, TDS, and filings for a roster of SME clients; Tally + portals',
  outputName: 'a client\'s month closed and statutory filings done',
  officialVersion: 'Collect vouchers → enter in Tally → reconcile bank → compute TDS / GST → file → share reports → archive.',
  instanceAnchor: 'a month-end close for a trading client with messy bills',
  trigger: 'Month ends; client sends (or is chased for) the month\'s bills',
  steps: [
    S(1, { action: 'Chase the client for bills, bank statements, missing vouchers', tool: 'WhatsApp + email + phone', inputSource: 'A client / customer', timeMins: 60, frequency: 'monthly', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'Half the month is spent extracting documents from clients — the dreaded, repeating tussle.' }),
    S(2, { action: 'Sort a pile of mixed bills — what\'s expense, asset, personal, GST-eligible', tool: 'Eye + judgment', frequency: 'monthly', needsJudgment: true }),
    S(3, { action: 'Enter vouchers into Tally, tag ledgers', tool: 'Tally', timeMins: 120, frequency: 'monthly', frictionTags: ['manual-transfer'] }),
    S(4, { action: 'Reconcile bank statement against entries, hunt mismatches', tool: 'Tally + statement', timeMins: 60, frequency: 'monthly', frictionTags: ['lookup', 'rework'] }),
    S(5, { action: 'Compute TDS / GST, decide treatment of grey items', tool: 'Tally + knowledge', frequency: 'monthly', needsJudgment: true, notes: 'Whether an expense is allowable / which head — the judgment that protects the client in scrutiny.' }),
    S(6, { action: 'File returns on the GST / TDS portals before due date', tool: 'Govt portals', outputDestination: 'A system / report', timeMins: 40, frequency: 'monthly', frictionTags: ['wait', 'approval'] }),
    S(7, { action: 'Share P&L + filing proofs with client; archive working papers', tool: 'PDF + email + drive', outputDestination: 'A client / customer', timeMins: 30, frequency: 'monthly', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Client', what: 'bills + bank statements + clarifications', typicalDelay: 'days, with chasing' },
    { direction: 'wait-on', who: 'Reviewing CA (partner)', what: 'sign-off before filing', typicalDelay: 'a day' },
  ],
  exceptions: [
    { trigger: 'Bills arrive after the due date', whatYouDo: 'File on best estimate, revise later, or pay late fee — flag to client', howOften: 'monthly' },
    { trigger: 'Portal down near deadline', whatYouDo: 'Retry through the night, keep screenshots as proof of attempt', howOften: 'filing-deadline months' },
  ],
});

const advocateFiling = () => mk({
  role: 'Advocate\'s clerk (district / high court litigation)',
  context: 'A litigation lawyer\'s office; drafting, filing and listing cases; court e-filing + physical filing sections',
  outputName: 'a case filed and listed for hearing',
  officialVersion: 'Take brief → draft → client approves → pay court fee → file in registry → cure defects → get listing → note next date.',
  instanceAnchor: 'filing a civil suit with a deadline before limitation expires',
  trigger: 'Client gives a brief / a matter must be filed before limitation',
  steps: [
    S(1, { action: 'Understand the matter, gather documents, settle the cause of action', tool: 'Brief + client', inputSource: 'A client / customer', timeMins: 90, frequency: 'few-times-a-week', needsJudgment: true }),
    S(2, { action: 'Draft pleadings, adapt from past templates + precedents', tool: 'Word + precedent bank', timeMins: 120, frequency: 'few-times-a-week', needsJudgment: true, frictionTags: ['lookup'] }),
    S(3, { action: 'Get client to read, approve, sign + attest documents', tool: 'Print + signature', frequency: 'few-times-a-week', frictionTags: ['wait', 'approval'] }),
    S(4, { action: 'Compute + pay court fee, prepare filing set with annexures', tool: 'Court-fee + photocopy', timeMins: 40, frequency: 'few-times-a-week', frictionTags: ['movement'] }),
    S(5, { action: 'File at registry / e-filing portal; take diary number', tool: 'Registry + e-filing', outputDestination: 'A system / report', timeMins: 60, frequency: 'few-times-a-week', frictionTags: ['wait', 'approval'] }),
    S(6, { action: 'Cure registry "defects" — margin, index, court-fee objections', tool: 'Registry counter', frequency: 'few-times-a-week', frictionTags: ['rework', 'movement', 'chasing'], isPainful: true, notes: 'Registry returns the bundle over format trivia; repeated counter trips to clear objections is the maddening part.' }),
    S(7, { action: 'Track listing, note the next hearing date, diarise + tell client', tool: 'Cause-list + diary', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Watching the cause list + keeping every matter\'s next date is a personal diary system, not a firm system.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Court registry', what: 'acceptance / defect clearance + listing', typicalDelay: 'days' },
    { direction: 'wait-on', who: 'Client', what: 'signed documents + fee', typicalDelay: 'a day or two' },
  ],
  exceptions: [
    { trigger: 'Filing rejected on a defect near limitation', whatYouDo: 'Cure + re-file same day, file a delay-condonation petition if needed', howOften: 'monthly' },
    { trigger: 'Matter listed at short notice', whatYouDo: 'Rearrange the day, brief the counsel, rush documents to court', howOften: 'weekly' },
  ],
});

const recruitmentConsultant = () => mk({
  role: 'Recruitment consultant (IT / staffing agency)',
  context: 'A staffing firm filling client roles on commission; ATS + LinkedIn + Naukri + WhatsApp',
  outputName: 'a candidate placed and joined at a client',
  officialVersion: 'Take requirement → source → screen → shortlist → schedule interviews → manage offer → ensure joining → invoice.',
  instanceAnchor: 'a client demanding 3 shortlists in 48 hours for a niche role',
  trigger: 'Client sends a job requirement to fill',
  steps: [
    S(1, { action: 'Decode the real requirement behind the JD — must-have vs nice-to-have, budget, culture', tool: 'Call + JD', inputSource: 'A client / customer', timeMins: 30, frequency: 'daily', needsJudgment: true, notes: 'The JD and what the manager will actually accept are different — reading that is the edge.' }),
    S(2, { action: 'Source candidates across Naukri / LinkedIn / own database', tool: 'Job portals + ATS', timeMins: 90, frequency: 'daily', frictionTags: ['lookup'] }),
    S(3, { action: 'Screen calls — skills, notice period, expectation, genuineness', tool: 'Phone', frequency: 'daily', needsJudgment: true }),
    S(4, { action: 'Format CVs to client template, write a fit summary per candidate', tool: 'Word', outputDestination: 'A client / customer', timeMins: 40, frequency: 'daily', frictionTags: ['manual-transfer', 'rework'] }),
    S(5, { action: 'Coordinate interview slots between candidate + client calendars', tool: 'Email + phone + WhatsApp', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(6, { action: 'Manage the offer — counter-offers, negotiation, keep candidate warm', tool: 'Phone', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'Candidates ghost or take counter-offers after I\'ve invested weeks — the offer-to-join gap is where deals (and commission) die.' }),
    S(7, { action: 'Follow up to actual joining, then raise the client invoice', tool: 'ATS + invoice', outputDestination: 'A client / customer', frequency: 'few-times-a-week', frictionTags: ['chasing'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Client hiring manager', what: 'shortlist feedback + interview slots', typicalDelay: 'days, often slow' },
    { direction: 'wait-on', who: 'Candidate', what: 'commitment through to joining', typicalDelay: 'weeks (notice period)' },
  ],
  exceptions: [
    { trigger: 'Candidate accepts then drops out', whatYouDo: 'Keep 2 backups warm per role; restart sourcing fast', howOften: 'weekly' },
    { trigger: 'Client freezes the role mid-process', whatYouDo: 'Park candidates, redeploy to other open roles, absorb the sunk effort', howOften: 'monthly' },
  ],
});

const payrollProcessing = () => mk({
  role: 'Payroll executive (SME / outsourced payroll)',
  context: 'Runs monthly payroll for several SME clients; attendance + statutory (PF/ESI/PT/TDS); Excel + portals',
  outputName: 'a client\'s monthly payroll run and salaries credited',
  officialVersion: 'Collect attendance + changes → compute gross → deduct statutory → generate payslips → bank transfer → file PF/ESI/TDS.',
  instanceAnchor: 'a month-end run for a 120-employee client with last-minute changes',
  trigger: 'Month-end; client sends attendance + new joiners / exits / changes',
  steps: [
    S(1, { action: 'Chase + collect attendance, leave, new joiners, exits, increments', tool: 'Email + WhatsApp + Excel', inputSource: 'A client / customer', timeMins: 60, frequency: 'monthly', frictionTags: ['chasing', 'wait'] }),
    S(2, { action: 'Reconcile attendance data — fix gaps, decode "adjust his LOP" notes', tool: 'Excel', frequency: 'monthly', needsJudgment: true, frictionTags: ['rework'], notes: 'Informal verbal adjustments from the client become judgment calls I encode.' }),
    S(3, { action: 'Compute gross, allowances, overtime, arrears per employee', tool: 'Excel formulas', timeMins: 90, frequency: 'monthly', frictionTags: ['manual-transfer'] }),
    S(4, { action: 'Apply PF / ESI / PT / TDS rules, handle slab + ceiling edge cases', tool: 'Excel + rules', frequency: 'monthly', needsJudgment: true, isPainful: true, notes: 'Statutory edge cases (ESI ceiling crossings, TDS projections) are where a silent error becomes a compliance notice — the high-stakes worry.' }),
    S(5, { action: 'Generate payslips, get client sign-off on the register', tool: 'Excel / payroll tool', outputDestination: 'A client / customer', frequency: 'monthly', frictionTags: ['approval', 'wait'] }),
    S(6, { action: 'Prepare bank transfer file in the bank\'s exact format', tool: 'Bank template', frequency: 'monthly', frictionTags: ['manual-transfer', 'rework'] }),
    S(7, { action: 'File PF / ESI / TDS returns on portals + share challans', tool: 'Govt portals', outputDestination: 'A system / report', timeMins: 50, frequency: 'monthly', frictionTags: ['wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Client HR', what: 'attendance + changes + register approval', typicalDelay: 'days, near deadline' },
    { direction: 'wait-on', who: 'Bank portal', what: 'salary transfer processing', typicalDelay: 'same / next day' },
  ],
  exceptions: [
    { trigger: 'Client sends a change after the register is approved', whatYouDo: 'Re-run affected employees, re-issue payslips, re-make bank file', howOften: 'most months' },
    { trigger: 'Statutory rate / slab changes mid-year', whatYouDo: 'Update the master, recompute, watch for retro-effect months', howOften: 'a few times a year' },
  ],
});

const bpoAgent = () => mk({
  role: 'Customer-support agent (voice / chat BPO)',
  context: 'An inbound support process for a telecom / bank / e-commerce client; CRM + knowledge base + call queue; AHT + CSAT targets',
  outputName: 'a customer query resolved on a contact',
  officialVersion: 'Take contact → verify identity → diagnose → resolve via systems → log disposition → close within AHT, hit CSAT.',
  instanceAnchor: 'a back-to-back queue afternoon with an irate billing complaint',
  trigger: 'A call / chat lands from the auto-distributor',
  steps: [
    S(1, { action: 'Greet, verify identity per script + security questions', tool: 'CRM + script', inputSource: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day', frictionTags: ['approval'] }),
    S(2, { action: 'Diagnose the actual problem under the stated one', tool: 'Listening + CRM history', frequency: 'many-times-a-day', needsJudgment: true, notes: 'The first sentence is rarely the real issue — drawing it out is the skill the scorecard ignores.' }),
    S(3, { action: 'Search knowledge base + flip between 3–4 internal systems', tool: 'KB + multiple tools', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['lookup', 'manual-transfer'], isPainful: true, notes: 'Toggling tabs while the customer waits and AHT ticks — the swivel-chair scramble is the daily grind.' }),
    S(4, { action: 'Calm an angry customer while still moving toward a fix', tool: 'Soft skills', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Apply the fix / raise a ticket / process the request in the system', tool: 'CRM + client systems', frequency: 'many-times-a-day' }),
    S(6, { action: 'Log disposition + notes, pick the right wrap-up code', tool: 'CRM', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'], notes: 'Choosing a disposition code that is never quite right for a messy real call.' }),
    S(7, { action: 'Watch AHT, hit after-call work limit, brace for the CSAT survey', tool: 'Agent dashboard', frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'L2 / specialist team', what: 'escalated tickets beyond agent scope', typicalDelay: 'hours to days' },
    { direction: 'wait-on', who: 'Back-end / client system', what: 'request processing confirmation', typicalDelay: 'minutes to days' },
  ],
  exceptions: [
    { trigger: 'Issue needs a system the agent can\'t access', whatYouDo: 'Raise an internal ticket, set expectation, follow up — customer dislikes the wait', howOften: 'daily' },
    { trigger: 'System outage spikes the queue', whatYouDo: 'Use a holding script, manage tempers, accept AHT blowing out', howOften: 'weekly' },
  ],
});

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
  { key: 'bank-loan-officer', label: 'A bank officer moving an MSME loan to sanction', domain: 'Professional services', region: 'Coimbatore, TN', emoji: '🏦',
    summary: 'The same customer keyed into core banking and the LOS twice, a credit call that is really a read of the trade and the person, and endless chasing of the file up the chain.',
    behavioralContext: 'The capture marks the double data-entry as rework, the credit read as the core judgment (numbers vs knowing the trade and borrower), and the up-the-chain chasing as the painful step. The relationship-and-reputation read is exactly what a pure credit score misses.',
    fieldSpecificFit: 'The trace points the fix at the plumbing and the wait, not the judgment: integrate core-banking and LOS to kill the re-keying, and a file-status tracker so chasing approvals becomes visible instead of phone-around. The field read and credit decision stay the officer\'s.',
    build: bankLoanOfficer },
  { key: 'ca-bookkeeping', label: 'A CA-firm accountant closing an SME month', domain: 'Professional services', region: 'Tamil Nadu', emoji: '🧾',
    summary: 'Half the month spent extracting bills from clients, then ledger judgment on grey items, then a race to file before the portal deadline.',
    behavioralContext: 'The capture pins the painful step at chasing clients for documents and tags the allowable-expense / head-classification as the protected judgment that shields the client in scrutiny. The extraction tussle is a relationship problem, not just a data one.',
    fieldSpecificFit: 'The fit the trace supports is the intake bottleneck: a client document-collection app (photograph the bill, auto-reminders, a running checklist) feeding Tally, so the month doesn\'t start with a chase. The grey-item treatment and partner sign-off stay human judgment.',
    build: caBookkeeping },
  { key: 'advocate-filing', label: 'An advocate\'s clerk filing a case before limitation', domain: 'Professional services', region: 'Tamil Nadu', emoji: '⚖️',
    summary: 'Drafting from a precedent bank, then repeated counter-trips to cure registry "defects" over format trivia, with every matter\'s next date kept in a personal diary.',
    behavioralContext: 'The capture marks defect-curing as the painful, repetitive step and tags cause-list watching + date-keeping as a shadow personal system (not the firm\'s). The drafting and cause-of-action judgment are legal craft to protect.',
    fieldSpecificFit: 'The trace aims the tool at the defect loop and the diary: a pre-filing checklist that catches the registry\'s common format objections before the trip, and a shared matter-tracker that pulls next-hearing dates off the cause list. Drafting stays the advocate\'s judgment.',
    build: advocateFiling },
  { key: 'recruitment-consultant', label: 'A recruiter placing a candidate on commission', domain: 'Professional services', region: 'Chennai, TN', emoji: '🧑‍💼',
    summary: 'Reading what a manager will actually accept vs the JD, reformatting CVs per client, and an offer-to-join gap where deals (and commission) quietly die.',
    behavioralContext: 'The capture tags the requirement-read as judgment (JD vs real acceptance) and marks offer management as the painful step — candidates ghost or take counter-offers after weeks of work. The human read and candidate-warming are where the value sits.',
    fieldSpecificFit: 'Keep the screening and offer-stage relationship human. The trace points the tool at the churn: CV-to-template formatting, interview-slot coordination, and an offer-stage pipeline that flags at-risk candidates early. Sourcing assist helps; the "will this manager hire this person" call stays the recruiter\'s.',
    build: recruitmentConsultant },
  { key: 'payroll-processing', label: 'A payroll executive running an SME month-end', domain: 'Professional services', region: 'India urban', emoji: '💸',
    summary: 'Verbal "adjust his LOP" notes encoded as judgment, statutory edge cases where a silent error becomes a notice, and a re-run every time a change lands after sign-off.',
    behavioralContext: 'The capture marks the statutory edge-case handling (ESI ceiling, TDS projection) as the painful, high-stakes judgment and tags informal client adjustments as judgment calls being encoded. Mechanical automation that ignores the edge cases is exactly how compliance notices happen.',
    fieldSpecificFit: 'The trace supports automating the deterministic core — gross/statutory computation, payslip and bank-file generation in the right formats — while surfacing edge cases for human review. The "what did the client mean" adjustments stay a judgment step, not a silent rule.',
    build: payrollProcessing },
  { key: 'bpo-support-agent', label: 'A support agent through a back-to-back queue', domain: 'Professional services', region: 'Chennai, TN', emoji: '🎧',
    summary: 'Diagnosing the real issue under the stated one while toggling four systems against a ticking AHT, then forcing a messy call into a wrap-up code.',
    behavioralContext: 'The capture pins the painful step at the swivel-chair scramble across multiple tools while the customer waits, and tags the real-problem diagnosis + de-escalation as judgment the scorecard ignores. Squeezing AHT without fixing the tool-sprawl just punishes the agent.',
    fieldSpecificFit: 'The fit the trace points to is a unified agent desktop that surfaces customer context + KB answer in one place (killing the toggle), plus AI-assisted disposition coding. The listening, judgment and de-escalation — the part the scorecard underrates — stay firmly human.',
    build: bpoAgent },
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
