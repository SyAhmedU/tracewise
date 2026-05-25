// ITES — IT-enabled services: medical coding, RCM AR-calling, data annotation, transcription,
// content moderation, outbound tele-sales, chat support, KPO research. India delivery context.
import { S, mk, type WorkedExample } from './_shared';

const medicalCoder = () => mk({
  role: 'Medical coder (US healthcare, India delivery)',
  context: 'Codes US patient charts to ICD-10 / CPT for a payer / provider client; coding software + client guidelines; accuracy + productivity targets',
  outputName: 'a patient encounter coded accurately',
  officialVersion: 'Receive chart → read documentation → assign ICD / CPT codes → apply payer rules → flag queries → submit → QA audit.',
  instanceAnchor: 'a complex inpatient chart with ambiguous documentation',
  trigger: 'A chart lands in the coding work-queue',
  steps: [
    S(1, { action: 'Read the physician documentation across the chart', tool: 'EHR / chart viewer', inputSource: 'A system / report', timeMins: 12, frequency: 'many-times-a-day', frictionTags: ['lookup'] }),
    S(2, { action: 'Assign diagnosis + procedure codes from the documentation', tool: 'Coding software + codebooks', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Mapping messy clinical narrative to exact codes is interpretive — the core skill the productivity metric flattens.' }),
    S(3, { action: 'Apply payer-specific + client coding rules + modifiers', tool: 'Client guidelines', frequency: 'many-times-a-day', needsJudgment: true, frictionTags: ['lookup'] }),
    S(4, { action: 'Decide: code from what\'s written vs raise a physician query', tool: 'Judgment', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Under-coding loses revenue, over-coding is fraud risk — that line on ambiguous notes, against a target, is the constant tension.' }),
    S(5, { action: 'Raise a query for unclear / missing documentation', tool: 'Query tool', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['wait', 'chasing'] }),
    S(6, { action: 'Keep personal cheat-sheets of tricky client-specific rules', tool: 'Personal notes', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Each client\'s quirks live in my own notes; the official guideline doc is too generic + slow to update.' }),
    S(7, { action: 'Submit; meet accuracy (QA) + charts-per-hour targets', tool: 'Coding software', frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Provider / physician (via query)', what: 'documentation clarification', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'QA / audit team', what: 'coded charts for accuracy audit', typicalDelay: 'sample-based' },
  ],
  exceptions: [
    { trigger: 'Documentation insufficient to code', whatYouDo: 'Raise a query, hold the chart, code conservatively if forced', howOften: 'daily' },
    { trigger: 'Coding guideline / payer rule changes', whatYouDo: 'Update cheat-sheets, re-learn, adjust; watch for retro denials', howOften: 'quarterly' },
  ],
});

const arCaller = () => mk({
  role: 'AR caller (US healthcare revenue-cycle, India night shift)',
  context: 'Calls US insurance payers to follow up denied / unpaid medical claims; dialer + client billing software; night shift on US hours',
  outputName: 'a denied / pending claim resolved toward payment',
  officialVersion: 'Pull claim → check status → call payer → understand denial → take action (appeal / refile / adjust) → note account → next.',
  instanceAnchor: 'a night-shift queue of aged denied claims',
  trigger: 'A claim appears in the AR follow-up worklist',
  steps: [
    S(1, { action: 'Review the claim, denial code + account history', tool: 'Billing software', inputSource: 'A system / report', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['lookup'] }),
    S(2, { action: 'Call the payer / navigate the IVR + long holds to reach a rep', tool: 'Dialer + phone', frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'], isPainful: true, notes: 'Long IVR mazes + hold times to reach a human, on US night hours — the dead-time wait that productivity targets ignore is the grind.' }),
    S(3, { action: 'Decode the real denial reason behind the generic code', tool: 'Conversation + judgment', frequency: 'many-times-a-day', needsJudgment: true, notes: 'The denial code is vague; getting the rep to reveal what\'s actually needed is the skill that resolves the claim.' }),
    S(4, { action: 'Decide the action — appeal, refile, send records, adjust, write off', tool: 'Judgment + client rules', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Document the call + action in the account notes precisely', tool: 'Billing software', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Keep personal notes on each payer\'s quirks + best call scripts', tool: 'Personal cheat-sheet', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Which payer needs what, who answers faster — payer-handling tricks kept privately, not in any system.' }),
    S(7, { action: 'Hit calls-per-day + resolution targets', tool: 'Dashboard', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Insurance payer rep', what: 'claim status + denial reason', typicalDelay: 'long holds' },
    { direction: 'hand-to', who: 'Coding / billing team', what: 'claims needing code correction / records', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Payer system / portal down', whatYouDo: 'Switch to other payers in the queue, return later, note the attempt', howOften: 'weekly' },
    { trigger: 'Claim past timely-filing limit', whatYouDo: 'Attempt appeal with proof of earlier filing, else flag for write-off', howOften: 'weekly' },
  ],
});

const dataAnnotator = () => mk({
  role: 'Data annotation / labelling specialist (AI training data)',
  context: 'Labels images / text / audio for ML training on a client project; annotation platform; quality + throughput targets; evolving guidelines',
  outputName: 'a batch of data labelled to the guideline',
  officialVersion: 'Get batch + guideline → label each item → handle edge cases → submit → QA review → rework rejections → repeat.',
  instanceAnchor: 'a batch where many items fall in guideline grey zones',
  trigger: 'A labelling batch is assigned',
  steps: [
    S(1, { action: 'Read the (often long, changing) annotation guideline', tool: 'Guideline doc', inputSource: 'A client / customer', timeMins: 30, frequency: 'daily', frictionTags: ['lookup'] }),
    S(2, { action: 'Label each item per the rules', tool: 'Annotation platform', frequency: 'many-times-a-day' }),
    S(3, { action: 'Judge ambiguous edge cases the guideline doesn\'t cover', tool: 'Judgment', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Forcing fuzzy real-world items into rigid label categories, guessing client intent on edge cases — the unresolved ambiguity is the daily friction.' }),
    S(4, { action: 'Maintain consistency with how the team labelled similar items', tool: 'Memory + team chat', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Unwritten team conventions for grey cases — kept by asking each other — matter more than the doc for the model\'s consistency.' }),
    S(5, { action: 'Submit batch; absorb QA rejections + rework', tool: 'Platform', frequency: 'daily', frictionTags: ['rework', 'wait'] }),
    S(6, { action: 'Raise guideline-clarification questions to the client', tool: 'Query channel', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(7, { action: 'Hit throughput + accuracy targets simultaneously', tool: 'Dashboard', frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Client / project lead', what: 'guideline clarifications on edge cases', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'QA reviewers', what: 'labelled batch for review', typicalDelay: 'hours' },
  ],
  exceptions: [
    { trigger: 'Guideline changes mid-project', whatYouDo: 'Re-label affected items, align team, absorb the rework', howOften: 'monthly' },
    { trigger: 'High rejection rate on a batch', whatYouDo: 'Find the misread rule, recalibrate with QA, re-do', howOften: 'weekly' },
  ],
});

const transcriptionist = () => mk({
  role: 'Medical transcriptionist / editor',
  context: 'Transcribes / edits US physician dictation into clinical reports; speech-recognition draft + editing; turnaround + accuracy SLAs',
  outputName: 'a clinical report transcribed + verified',
  officialVersion: 'Receive dictation → transcribe (or edit ASR draft) → apply formatting + medical terms → flag blanks → QA → deliver in TAT.',
  instanceAnchor: 'a heavily-accented dictation with background noise',
  trigger: 'A dictation file enters the queue',
  steps: [
    S(1, { action: 'Listen to the dictation; edit the speech-recognition draft', tool: 'ASR editor + audio', inputSource: 'A system / report', timeMins: 15, frequency: 'many-times-a-day', frictionTags: ['rework'] }),
    S(2, { action: 'Decode accent, mumbling, background noise, fast speech', tool: 'Ears + experience', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Straining to catch a heavily-accented or noisy dictation — the ASR fails exactly here, so the hardest audio is what I must rescue by ear.' }),
    S(3, { action: 'Apply correct medical terminology, drug names, units', tool: 'Med reference + memory', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Choosing the right sound-alike drug / term from context — a clinical-literacy judgment, a wrong word is a patient-safety risk.' }),
    S(4, { action: 'Format to the client report template', tool: 'Template', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(5, { action: 'Flag inaudible segments as blanks for review', tool: 'Editor flags', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['approval'] }),
    S(6, { action: 'Keep personal lists of each doctor\'s speech quirks + pet phrases', tool: 'Personal notes', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Knowing a specific doctor\'s mumble-patterns + favourite phrasings speeds accuracy — private knowledge built per physician.' }),
    S(7, { action: 'Self-QA, deliver within turnaround SLA', tool: 'Editor + clock', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'QA / proofreader', what: 'review of flagged / complex reports', typicalDelay: 'within TAT' },
    { direction: 'hand-to', who: 'Client / provider', what: 'verified report in turnaround time', typicalDelay: 'hours' },
  ],
  exceptions: [
    { trigger: 'Dictation largely inaudible', whatYouDo: 'Flag extensively, escalate, request re-dictation if critical', howOften: 'weekly' },
    { trigger: 'TAT at risk on a backlog', whatYouDo: 'Triage by urgency, focus accuracy on critical reports', howOften: 'daily' },
  ],
});

const contentModerator = () => mk({
  role: 'Content moderator (trust & safety)',
  context: 'Reviews user-reported / flagged content for a platform against policy; moderation queue + policy docs; speed + accuracy + wellbeing risk',
  outputName: 'a piece of content actioned per policy',
  officialVersion: 'Item enters queue → review against policy → decide (allow / remove / restrict / escalate) → log reason → next.',
  instanceAnchor: 'a queue shift with graphic + borderline policy cases',
  trigger: 'Flagged content arrives in the moderation queue',
  steps: [
    S(1, { action: 'View the content + the reported reason', tool: 'Moderation tool', inputSource: 'A system / report', frequency: 'many-times-a-day' }),
    S(2, { action: 'Map it to the right policy among many overlapping rules', tool: 'Policy docs', frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true }),
    S(3, { action: 'Judge context, intent, satire, cultural nuance, borderline cases', tool: 'Judgment', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Policy can\'t encode every context; reading intent + cultural nuance on a borderline post is the irreducible human call.' }),
    S(4, { action: 'Absorb the psychological toll of graphic / disturbing content', tool: 'Self-regulation', frequency: 'many-times-a-day', isPainful: true, notes: 'Repeated exposure to graphic/abusive material is the real, often unspoken, cost of this role — wellbeing, not throughput, is what gives.' }),
    S(5, { action: 'Decide + action — allow / remove / restrict / escalate', tool: 'Moderation tool', frequency: 'many-times-a-day', needsJudgment: true, frictionTags: ['approval'] }),
    S(6, { action: 'Log the policy reason; keep mental notes on grey-area precedents', tool: 'Tool + memory', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'How borderline cases were decided before — informal precedent shared among moderators — guides consistency more than the doc.' }),
    S(7, { action: 'Hit accuracy + handle-time targets; brace for audits / appeals', tool: 'Dashboard', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Senior / policy team', what: 'escalated novel or high-risk cases', typicalDelay: 'hours' },
    { direction: 'wait-on', who: 'Policy team', what: 'rulings on ambiguous new patterns', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Novel content type with no clear policy', whatYouDo: 'Escalate, hold, apply nearest precedent, await ruling', howOften: 'weekly' },
    { trigger: 'A disturbing case affects wellbeing', whatYouDo: 'Use wellness break / support if available; push through is the norm', howOften: 'regularly' },
  ],
});

const outboundTelecaller = () => mk({
  role: 'Outbound tele-sales / lead-gen agent',
  context: 'Calls leads to sell / qualify for a client (loans, edtech, insurance); dialer + CRM script; calls + conversion targets',
  outputName: 'a lead qualified / a sale / appointment booked',
  officialVersion: 'Get lead list → call → pitch per script → handle objections → qualify / close → log disposition → follow up.',
  instanceAnchor: 'an afternoon of cold calls chasing a daily conversion target',
  trigger: 'Leads loaded into the dialer for the day',
  steps: [
    S(1, { action: 'Call leads through the dialer; survive rejections + abuse', tool: 'Dialer + CRM', inputSource: 'A system / report', frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'], isPainful: true, notes: 'Endless rejections, hang-ups + occasional abuse, dozens of dials for one yes — the emotional grind is the real job.' }),
    S(2, { action: 'Pitch per script but adapt tone + words to each person', tool: 'Script + judgment', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Reading whether to push, soften, or drop in the first seconds is the instinct that converts — the script alone doesn\'t.' }),
    S(3, { action: 'Handle objections, judge genuine interest vs time-waster', tool: 'Conversation', frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Qualify / close / book appointment', tool: 'CRM', outputDestination: 'A client / customer', frequency: 'many-times-a-day' }),
    S(5, { action: 'Log disposition + notes for each call', tool: 'CRM', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Keep a private list of warm leads + best call-back times', tool: 'Personal notes', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'When a specific lead is reachable + receptive is my own tracking — the CRM\'s callback field is too blunt.' }),
    S(7, { action: 'Chase daily call + conversion numbers', tool: 'Dashboard', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Sales / closing team', what: 'qualified leads + appointments', typicalDelay: 'same day' },
    { direction: 'wait-on', who: 'Lead-gen / marketing', what: 'fresh, good-quality lead lists', typicalDelay: 'daily' },
  ],
  exceptions: [
    { trigger: 'Lead list is stale / wrong numbers', whatYouDo: 'Flag list quality, work the better leads, manage the target hit', howOften: 'weekly' },
    { trigger: 'Do-not-call / angry customer', whatYouDo: 'Mark DNC, apologise, move on, protect compliance', howOften: 'daily' },
  ],
});

const chatSupport = () => mk({
  role: 'Non-voice chat support agent',
  context: 'Handles concurrent customer chats for a client (telecom / e-commerce / SaaS); chat console + KB + macros; concurrency + CSAT targets',
  outputName: 'a customer chat resolved',
  officialVersion: 'Accept chats → read issue → diagnose → resolve via systems / macros → close → handle next, several at once.',
  instanceAnchor: 'juggling 4 concurrent chats at peak',
  trigger: 'Chats route in from the queue (multiple concurrently)',
  steps: [
    S(1, { action: 'Juggle 3–5 concurrent chats, track each conversation\'s thread', tool: 'Chat console', inputSource: 'A client / customer', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Context-switching between several live chats without mixing them up, while each customer expects instant replies — the cognitive juggling is the strain.' }),
    S(2, { action: 'Diagnose each issue from terse, typo-ridden messages', tool: 'Reading + judgment', frequency: 'many-times-a-day', needsJudgment: true }),
    S(3, { action: 'Pick / adapt canned macros without sounding robotic', tool: 'Macros + KB', frequency: 'many-times-a-day', needsJudgment: true, frictionTags: ['lookup'] }),
    S(4, { action: 'Look up account / order across internal systems', tool: 'CRM + tools', frequency: 'many-times-a-day', frictionTags: ['lookup', 'manual-transfer'] }),
    S(5, { action: 'Resolve / raise ticket / process the request', tool: 'Client systems', frequency: 'many-times-a-day' }),
    S(6, { action: 'Keep personal snippets for tricky answers macros miss', tool: 'Personal snippets', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Hand-crafted reply snippets for situations the official macros handle badly — my own quality + speed hack.' }),
    S(7, { action: 'Close with disposition; protect CSAT + concurrency metrics', tool: 'Console + dashboard', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'L2 / specialist team', what: 'escalated complex chats', typicalDelay: 'minutes to hours' },
    { direction: 'wait-on', who: 'Back-end systems', what: 'order / account action confirmation', typicalDelay: 'minutes' },
  ],
  exceptions: [
    { trigger: 'Chat volume spikes beyond concurrency', whatYouDo: 'Set polite holds, prioritise quick wins, protect CSAT on the rest', howOften: 'daily' },
    { trigger: 'Macro / KB answer is outdated', whatYouDo: 'Improvise a correct reply, flag the macro for update', howOften: 'weekly' },
  ],
});

const kpoResearchAnalyst = () => mk({
  role: 'KPO research analyst (equity / market research support)',
  context: 'Supports an onshore investment / consulting team from India; builds models, decks, research notes; data terminals + Excel; tight turnarounds',
  outputName: 'a research output (model / note / deck) delivered to the onshore team',
  officialVersion: 'Get brief → gather data → analyse / model → draft note or deck → QC → deliver → revise per onshore feedback.',
  instanceAnchor: 'an overnight turnaround on a company update model',
  trigger: 'Onshore team sends a research request (often end of their day)',
  steps: [
    S(1, { action: 'Decode the often-terse brief + the unstated real ask', tool: 'Email + chat', inputSource: 'A client / customer', timeMins: 20, frequency: 'daily', needsJudgment: true, notes: 'A one-line brief from onshore carries unspoken context; inferring what they actually want (so it isn\'t redone) is the key judgment.' }),
    S(2, { action: 'Gather data from terminals, filings, databases', tool: 'Bloomberg / CapIQ + filings', timeMins: 60, frequency: 'daily', frictionTags: ['lookup'] }),
    S(3, { action: 'Build / update the model or analysis', tool: 'Excel', timeMins: 120, frequency: 'daily', needsJudgment: true }),
    S(4, { action: 'Sanity-check the numbers against expectation + prior versions', tool: 'Excel + judgment', frequency: 'daily', needsJudgment: true, notes: 'Knowing when an output "can\'t be right" — the analytical sense that catches errors a checklist misses.' }),
    S(5, { action: 'Draft the note / deck in the onshore house style', tool: 'PPT / Word', outputDestination: 'A client / customer', timeMins: 90, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Work the TZ gap — deliver before onshore morning', tool: 'Clock + email', frequency: 'daily', frictionTags: ['wait'], isPainful: true, notes: 'Compressing a full analysis into the overnight window so it lands by their morning — the time-zone pressure that defines the night.' }),
    S(7, { action: 'Keep personal templates + a checklist of onshore preferences', tool: 'Personal templates', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Each onshore analyst\'s formatting + content preferences kept privately — the firm\'s style guide doesn\'t capture the real expectations.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Onshore team', what: 'brief + feedback + revisions', typicalDelay: 'TZ-gapped, end of their day' },
    { direction: 'hand-to', who: 'QC / senior analyst', what: 'output for review before sending', typicalDelay: 'within window' },
  ],
  exceptions: [
    { trigger: 'Brief was misunderstood', whatYouDo: 'Rework fast in the remaining window, clarify earlier next time', howOften: 'weekly' },
    { trigger: 'Data source down near deadline', whatYouDo: 'Use alternate sources, flag assumptions, deliver with caveats', howOften: 'monthly' },
  ],
});

export const ITES: WorkedExample[] = [
  { key: 'medical-coder', label: 'A medical coder on an ambiguous US chart', domain: 'ITES', region: 'Chennai, TN', emoji: '🏥',
    summary: 'Messy clinical narrative mapped to exact codes, the under-code-vs-over-code line walked on vague notes against a target, with client quirks kept on personal cheat-sheets.',
    behavioralContext: 'The capture marks the code-from-what\'s-written vs raise-a-query decision as the painful tension (under-coding loses revenue, over-coding is fraud risk) and tags the client-quirk cheat-sheets as shadow knowledge the generic guideline lacks. The narrative-to-code interpretation is the protected skill.',
    fieldSpecificFit: 'The trace points the fit at assist + the guideline gap: AI code-suggestion the coder verifies (not auto-codes), and turning personal cheat-sheets into a living client-rules base. The under/over-code judgment and physician-query call stay human — accuracy and compliance ride on it.',
    build: medicalCoder },
  { key: 'ar-caller', label: 'An AR caller chasing a denied US claim', domain: 'ITES', region: 'Chennai, TN', emoji: '☎️',
    summary: 'IVR mazes and long holds on US night hours to reach a rep, decoding the real denial behind a vague code, with payer-handling tricks kept privately.',
    behavioralContext: 'The capture marks the IVR/hold dead-time as the painful grind that targets ignore and tags the payer-quirk notes as shadow knowledge. Getting a rep to reveal what\'s actually needed is the judgment that resolves the claim.',
    fieldSpecificFit: 'The trace points the fit at the dead-time + tribal knowledge: payer-portal automation and IVR-navigation/callback tooling to kill the hold-time waste, plus a shared payer-playbook from the private notes. The denial-decoding and action judgment stay the caller\'s.',
    build: arCaller },
  { key: 'data-annotator', label: 'A data annotator labelling an AI training batch', domain: 'ITES', region: 'India', emoji: '🏷',
    summary: 'Fuzzy real-world items forced into rigid label categories on edge cases the guideline never covers, kept consistent by unwritten team conventions.',
    behavioralContext: 'The capture marks edge-case ambiguity as the painful daily friction (guessing client intent) and tags the unwritten team conventions as shadow knowledge that drives model consistency more than the doc. The edge-case judgment is exactly what trains good models.',
    fieldSpecificFit: 'The trace points the fit at the guideline loop, not the labelling: a fast edge-case escalation channel and a living conventions base that captures team decisions, plus model-assisted pre-labels the annotator corrects. The ambiguity judgment stays human — it\'s the training signal.',
    build: dataAnnotator },
  { key: 'medical-transcriptionist', label: 'A transcriptionist rescuing a noisy dictation', domain: 'ITES', region: 'India', emoji: '🎙',
    summary: 'The hardest, accented, noisy audio — exactly where ASR fails — rescued by ear, sound-alike drug names judged from context, doctor speech-quirks learned privately.',
    behavioralContext: 'The capture marks decoding hard audio as the painful step (ASR fails precisely there) and tags per-physician quirk notes as shadow knowledge. The sound-alike term/drug judgment is a patient-safety call, the protected skill.',
    fieldSpecificFit: 'The trace points the fit at ASR-assist for the easy bulk while routing hard audio to the human editor, and capturing per-doctor speech profiles. The clinical-term judgment and blank-flagging stay human — a wrong drug name is a safety risk, not a productivity stat.',
    build: transcriptionist },
  { key: 'content-moderator', label: 'A content moderator on a borderline queue', domain: 'ITES', region: 'India', emoji: '🛑',
    summary: 'Reading intent and cultural nuance on borderline posts policy can\'t encode, while absorbing the psychological toll of graphic content — the real, unspoken cost.',
    behavioralContext: 'The capture marks repeated exposure to disturbing content as the painful, wellbeing cost (not throughput) and tags informal grey-area precedent as shadow consistency knowledge. The intent/nuance judgment is the irreducible human call.',
    fieldSpecificFit: 'The trace points the fit firmly at wellbeing + the clear-cut bulk: AI auto-actioning unambiguous violations (reducing graphic exposure), graphic-content blurring/wellness safeguards, and a precedent base for grey areas. The nuanced intent judgment stays human, by design — and exposure, not speed, is what to minimise.',
    build: contentModerator },
  { key: 'outbound-telecaller', label: 'A tele-sales agent working a lead list', domain: 'ITES', region: 'India', emoji: '📞',
    summary: 'Dozens of rejections and hang-ups for one yes, reading in seconds whether to push or soften, with warm-lead callback timing tracked privately.',
    behavioralContext: 'The capture marks the rejection grind as the painful emotional core of the job and tags the private warm-lead/callback tracking as shadow knowledge the blunt CRM field misses. The split-second read of how to pitch is the instinct that converts.',
    fieldSpecificFit: 'The trace points the fit at lead quality + the dead dials: better lead scoring/prioritisation and auto-dialing to cut wasted attempts, plus a smarter callback scheduler from the private notes. The conversational read and objection judgment stay the agent\'s — and the emotional load deserves support, not just targets.',
    build: outboundTelecaller },
  { key: 'chat-support', label: 'A chat agent juggling concurrent conversations', domain: 'ITES', region: 'India', emoji: '💬',
    summary: 'Three-to-five live chats tracked without mixing them up, terse typo-ridden messages diagnosed, and personal snippets used where canned macros sound robotic.',
    behavioralContext: 'The capture marks the concurrent-chat cognitive juggling as the painful strain and tags personal reply-snippets as a shadow quality hack the official macros miss. The diagnosis-from-terse-text and macro-adaptation are the judgment that keeps it human.',
    fieldSpecificFit: 'The trace points the fit at context + suggestion: a unified console surfacing account/order context (killing the cross-tool lookup) and AI-suggested replies the agent edits, plus promoting good personal snippets into shared macros. The concurrency judgment and tone stay the agent\'s.',
    build: chatSupport },
  { key: 'kpo-research-analyst', label: 'A KPO analyst on an overnight model turnaround', domain: 'ITES', region: 'India', emoji: '📈',
    summary: 'A terse onshore brief decoded for its unstated ask, a full analysis compressed into the overnight TZ window, and each analyst\'s real preferences kept in private templates.',
    behavioralContext: 'The capture marks the overnight TZ compression as the painful defining pressure and tags per-analyst preference templates as shadow knowledge the house style-guide misses. The brief-decoding and "this can\'t be right" sanity-sense are the protected analytical judgment.',
    fieldSpecificFit: 'The trace points the fit at the brief gap + the grunt work: structured brief templates to cut redo-risk, automated data-pull into models, and capturing onshore preferences as reusable templates. The analytical judgment and error-sense stay the analyst\'s — that\'s the value the onshore team pays for.',
    build: kpoResearchAnalyst },
];
