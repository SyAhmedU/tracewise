// SaaS — customer success, account exec, PM, support engineer, onboarding, growth, solutions
// engineer, RevOps. Grounded in the Chennai/India SaaS world (Zoho / Freshworks / Chargebee belt).
import { S, mk, type WorkedExample } from './_shared';

const customerSuccess = () => mk({
  role: 'Customer success manager (B2B SaaS)',
  context: 'Owns a book of SaaS accounts; drives adoption + renewals + upsell; CRM + product usage data; quarterly renewals + churn risk',
  outputName: 'an account renewed (and ideally expanded)',
  officialVersion: 'Onboard → drive adoption → monitor health → run QBRs → spot risk → renew / upsell → handle escalations.',
  instanceAnchor: 'a renewal 60 days out for an account showing declining usage',
  trigger: 'A renewal approaches / a health score dips',
  steps: [
    S(1, { action: 'Read account health from usage data + the relationship feel', tool: 'CRM + product analytics', inputSource: 'A system / report', timeMins: 30, frequency: 'daily', needsJudgment: true, notes: 'The health score says one thing; whether the champion is happy + still employed is the real signal — read off calls + tone, not the dashboard.' }),
    S(2, { action: 'Spot churn risk early — declining logins, a quiet champion', tool: 'Analytics + instinct', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Sensing a wobble before the data shows it — a quiet champion, a missed renewal cue — the early-warning judgment lives in the relationship.' }),
    S(3, { action: 'Prep + run a QBR / value review with the customer', tool: 'Slides + call', outputDestination: 'A client / customer', timeMins: 90, frequency: 'weekly', frictionTags: ['manual-transfer'] }),
    S(4, { action: 'Chase internal teams (product / support) on the customer\'s asks', tool: 'Slack + Jira', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(5, { action: 'Build the renewal case, handle the procurement + budget dance', tool: 'CRM + email', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'Saving a wobbling renewal against budget cuts + a half-engaged champion is the high-stakes stretch the whole quarter rides on.' }),
    S(6, { action: 'Stitch account context from scattered tools + past notes', tool: 'CRM + docs + email', frequency: 'daily', frictionTags: ['lookup', 'manual-transfer'] }),
    S(7, { action: 'Log everything + forecast renewal likelihood for the team', tool: 'CRM', frequency: 'weekly', frictionTags: ['manual-transfer'], needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Product team', what: 'roadmap commitments / feature asks for the account', typicalDelay: 'weeks' },
    { direction: 'wait-on', who: 'Support', what: 'resolution of escalated customer issues', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Champion leaves the customer org', whatYouDo: 'Scramble to find + win a new champion before renewal, re-prove value', howOften: 'quarterly' },
    { trigger: 'Customer threatens to churn over a missing feature', whatYouDo: 'Escalate to product, offer workaround, manage expectations on roadmap', howOften: 'monthly' },
  ],
});

const accountExecutive = () => mk({
  role: 'SaaS account executive (sales)',
  context: 'Closes new-business SaaS deals; inbound + outbound pipeline; CRM + demos; quarterly quota',
  outputName: 'a closed-won deal',
  officialVersion: 'Qualify lead → discovery → demo → proposal → negotiate → close → handoff to onboarding.',
  instanceAnchor: 'a deal stalled in procurement at quarter-end',
  trigger: 'A qualified opportunity enters the pipeline',
  steps: [
    S(1, { action: 'Qualify — budget, authority, need, timeline; judge real intent', tool: 'CRM + calls', inputSource: 'A client / customer', frequency: 'daily', needsJudgment: true, notes: 'Reading whether a prospect is a real buyer or just browsing — the qualification instinct that decides where to spend effort.' }),
    S(2, { action: 'Run discovery — uncover the actual pain + decision process', tool: 'Calls', frequency: 'daily', needsJudgment: true }),
    S(3, { action: 'Tailor + deliver the demo to their use case', tool: 'Demo + product', outputDestination: 'A client / customer', frequency: 'daily', needsJudgment: true }),
    S(4, { action: 'Map the buying committee + navigate internal politics', tool: 'Judgment + CRM', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Who really decides, who can block — the org-map + champion-building lives in my head, the CRM only holds names.' }),
    S(5, { action: 'Update CRM, log activities, keep the forecast honest', tool: 'CRM', frequency: 'daily', frictionTags: ['manual-transfer'], notes: 'Hours of CRM hygiene + activity logging stolen from selling time — the admin tax reps universally resent.' }),
    S(6, { action: 'Negotiate + push deals through procurement at quarter-end', tool: 'Email + calls', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'Deals stalling in legal/procurement against the quota clock — the end-of-quarter scramble to pull them in is the recurring pressure.' }),
    S(7, { action: 'Close, then hand context to onboarding / CS cleanly', tool: 'CRM + handoff doc', outputDestination: 'Another team', frequency: 'weekly', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Prospect\'s procurement / legal', what: 'contract + security review sign-off', typicalDelay: 'weeks' },
    { direction: 'hand-to', who: 'Onboarding / CS', what: 'closed account + deal context', typicalDelay: 'on close' },
  ],
  exceptions: [
    { trigger: 'Deal slips past quarter-end', whatYouDo: 'Keep it warm, re-forecast, protect the relationship over the date', howOften: 'most quarters' },
    { trigger: 'Competitor undercuts late', whatYouDo: 'Re-sell value, involve a champion, escalate for a discount approval', howOften: 'monthly' },
  ],
});

const productManager = () => mk({
  role: 'Product manager (B2B SaaS)',
  context: 'Owns a product area; balances customer asks, data, strategy; backlog in Jira; works with eng, design, sales, CS',
  outputName: 'a prioritised, shipped increment that moves a metric',
  officialVersion: 'Gather inputs → prioritise → write specs → align stakeholders → support build → launch → measure → iterate.',
  instanceAnchor: 'a sprint-planning week with everyone lobbying for their feature',
  trigger: 'Planning cadence + competing demands from all sides',
  steps: [
    S(1, { action: 'Collect inputs — sales asks, CS escalations, support tickets, data, strategy', tool: 'CRM + Jira + analytics + Slack', inputSource: 'A system / report', frequency: 'daily', frictionTags: ['lookup', 'manual-transfer'], needsJudgment: true, notes: 'Stitching signal from a dozen scattered sources into one picture — the synthesis no tool does for me.' }),
    S(2, { action: 'Prioritise ruthlessly against limited eng capacity', tool: 'Judgment + framework', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'Saying no to loud, well-meaning stakeholders — sales, CS, a big customer — while defending the strategy is the core, lonely, political call.' }),
    S(3, { action: 'Write specs / PRDs + acceptance criteria', tool: 'Confluence / docs', outputDestination: 'Another team', timeMins: 120, frequency: 'weekly', frictionTags: ['manual-transfer'] }),
    S(4, { action: 'Align eng, design + stakeholders; defend the "why"', tool: 'Meetings', frequency: 'daily', frictionTags: ['wait'] }),
    S(5, { action: 'Support build — answer the constant scoping + edge-case questions', tool: 'Slack + standups', frequency: 'daily', frictionTags: ['wait'] }),
    S(6, { action: 'Keep a private "promised to whom" + decision-rationale log', tool: 'Personal notes', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'What was promised to which customer/stakeholder + why something was cut — my own trail, since the roadmap tool doesn\'t hold the reasoning.' }),
    S(7, { action: 'Launch + measure adoption; decide iterate / kill', tool: 'Analytics', frequency: 'monthly', needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Engineering', what: 'estimates + delivery', typicalDelay: 'per sprint' },
    { direction: 'wait-on', who: 'Sales / CS', what: 'customer evidence behind requests', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'A big customer demands an off-roadmap feature', whatYouDo: 'Weigh revenue vs strategy, negotiate scope, sometimes say no', howOften: 'monthly' },
    { trigger: 'Launched feature flops on adoption', whatYouDo: 'Investigate why, iterate or sunset, communicate the call', howOften: 'occasional' },
  ],
});

const supportEngineer = () => mk({
  role: 'SaaS technical support engineer',
  context: 'Resolves product support tickets for a SaaS; ticketing + logs + KB; reproduces bugs; tiered SLAs',
  outputName: 'a customer support ticket resolved',
  officialVersion: 'Pick ticket → understand issue → reproduce → diagnose (config / bug / user error) → resolve or escalate → document → close.',
  instanceAnchor: 'a high-priority ticket where the customer "can\'t log in"',
  trigger: 'A ticket arrives / is assigned per priority',
  steps: [
    S(1, { action: 'Read the ticket; ask for the missing details (logs, steps, screenshots)', tool: 'Ticketing', inputSource: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['chasing', 'wait'] }),
    S(2, { action: 'Reproduce the issue in a test / customer-like environment', tool: 'Test env + product', frequency: 'many-times-a-day', needsJudgment: true, notes: '"Cannot reproduce" is the daily wall — recreating the customer\'s exact setup from a vague report is the diagnostic skill.' }),
    S(3, { action: 'Diagnose — config vs real bug vs user error vs integration', tool: 'Logs + product knowledge', frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Resolve directly or write a clean bug report for engineering', tool: 'KB + Jira', outputDestination: 'Another team', frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(5, { action: 'Chase engineering on escalated bugs while customer waits', tool: 'Jira + Slack', frequency: 'daily', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'Stuck between an SLA clock + an escalated bug I can\'t fix myself — managing the waiting customer with no ETA is the squeeze.' }),
    S(6, { action: 'Keep personal notes on undocumented product quirks + fixes', tool: 'Personal notes', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'The real troubleshooting knowledge — known issues, hidden config, workarounds — lives in my notes; the KB lags the product.' }),
    S(7, { action: 'Document the resolution, update KB, close within SLA', tool: 'Ticketing + KB', frequency: 'many-times-a-day', frictionTags: ['manual-transfer', 'wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Engineering', what: 'fixes for escalated product bugs', typicalDelay: 'days to a sprint' },
    { direction: 'wait-on', who: 'Customer', what: 'logs, reproduction details, access', typicalDelay: 'hours' },
  ],
  exceptions: [
    { trigger: 'Cannot reproduce a reported bug', whatYouDo: 'Request more data, screen-share with customer, gather diagnostics', howOften: 'daily' },
    { trigger: 'Outage causes a ticket flood', whatYouDo: 'Post a status update, batch-respond, focus on root cause + comms', howOften: 'monthly' },
  ],
});

const onboardingSpecialist = () => mk({
  role: 'SaaS implementation / onboarding specialist',
  context: 'Onboards new SaaS customers to first value; config + data migration + training; project plan; time-to-value target',
  outputName: 'a new customer live + getting value',
  officialVersion: 'Kickoff → scope setup → configure → migrate data → train users → go live → hand to CS.',
  instanceAnchor: 'an onboarding stalled because the customer is slow to provide data',
  trigger: 'A closed deal is handed over for onboarding',
  steps: [
    S(1, { action: 'Kickoff — understand the customer\'s real workflow + goals', tool: 'Call + discovery', inputSource: 'A client / customer', timeMins: 60, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Sales sold a vision; mapping the customer\'s actual process to the product so it fits their reality is the make-or-break read.' }),
    S(2, { action: 'Configure the product to their workflow', tool: 'Admin console', frequency: 'few-times-a-week', needsJudgment: true }),
    S(3, { action: 'Chase the customer for data, decisions, the right people', tool: 'Email + calls', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'Onboarding stalls on the CUSTOMER\'s side — waiting for their data + sign-offs while my time-to-value clock runs is the helpless wait.' }),
    S(4, { action: 'Migrate + clean their (messy) legacy data', tool: 'Import tools + scripts', frequency: 'few-times-a-week', frictionTags: ['rework', 'manual-transfer'], needsJudgment: true }),
    S(5, { action: 'Train their users; adapt to varying tech-comfort', tool: 'Training sessions', frequency: 'few-times-a-week', needsJudgment: true }),
    S(6, { action: 'Keep a private playbook of what works per customer type', tool: 'Personal notes', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Onboarding tricks per industry / size kept personally — the official onboarding doc is too one-size-fits-all.' }),
    S(7, { action: 'Go live, confirm value, hand off to CS with context', tool: 'Checklist + CRM', outputDestination: 'Another team', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Customer', what: 'data, decisions, user availability', typicalDelay: 'days to weeks' },
    { direction: 'hand-to', who: 'Customer success', what: 'live account + onboarding context', typicalDelay: 'on go-live' },
  ],
  exceptions: [
    { trigger: 'Customer goes quiet mid-onboarding', whatYouDo: 'Re-engage the champion, escalate to sales / CS, keep the plan alive', howOften: 'monthly' },
    { trigger: 'Product can\'t do what sales implied', whatYouDo: 'Find a workaround, set honest expectations, loop in product', howOften: 'monthly' },
  ],
});

const growthMarketer = () => mk({
  role: 'Growth / digital marketer (SaaS)',
  context: 'Runs demand-gen for a SaaS — campaigns, content, paid, funnel; analytics + martech stack; MQL / pipeline targets',
  outputName: 'a campaign run that generates qualified pipeline',
  officialVersion: 'Plan campaign → create assets → set up + launch → track funnel → optimise → report attribution → iterate.',
  instanceAnchor: 'a campaign under-performing mid-flight against a pipeline target',
  trigger: 'A campaign / pipeline target for the quarter',
  steps: [
    S(1, { action: 'Plan the campaign — audience, message, channel, offer', tool: 'Brief + data', frequency: 'weekly', needsJudgment: true }),
    S(2, { action: 'Create / brief assets — copy, landing page, ads, emails', tool: 'CMS + design + email tool', timeMins: 180, frequency: 'weekly', frictionTags: ['rework'] }),
    S(3, { action: 'Wire up tracking across the martech stack', tool: 'GA + CRM + ad platforms', frequency: 'weekly', frictionTags: ['manual-transfer', 'lookup'], notes: 'Stitching UTMs, pixels + CRM fields so attribution actually works — fiddly plumbing that breaks silently.' }),
    S(4, { action: 'Launch + monitor the funnel daily', tool: 'Dashboards', frequency: 'daily', frictionTags: ['lookup'] }),
    S(5, { action: 'Judge what to optimise from noisy, partial data', tool: 'Analytics + instinct', frequency: 'daily', needsJudgment: true, notes: 'Deciding if a dip is signal or noise, which lever to pull — the read of imperfect funnel data is the real skill.' }),
    S(6, { action: 'Defend marketing\'s pipeline contribution in attribution debates', tool: 'Reports + meetings', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'Proving which pipeline marketing "caused" against sales + a broken attribution model — the credit fight is the recurring frustration.' }),
    S(7, { action: 'Keep a private record of what messaging / channel actually worked', tool: 'Personal notes', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Hard-won learnings on what converts for this product live in my own notes, not the always-incomplete reports.' }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Sales / SDR team', what: 'MQLs + campaign context', typicalDelay: 'real-time' },
    { direction: 'wait-on', who: 'Design / content', what: 'campaign assets', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Tracking breaks / attribution is wrong', whatYouDo: 'Debug the pipeline, reconcile manually, caveat the numbers', howOften: 'monthly' },
    { trigger: 'Campaign underperforms', whatYouDo: 'A/B test, shift budget, pivot message, salvage the target', howOften: 'most campaigns' },
  ],
});

const solutionsEngineer = () => mk({
  role: 'Solutions / sales engineer (SaaS pre-sales)',
  context: 'The technical partner in SaaS sales; demos, POCs, RFP / security answers; bridges sales + product / eng',
  outputName: 'a technical win that unblocks a deal',
  officialVersion: 'Join deal → technical discovery → tailored demo → run POC → answer security / RFP → resolve blockers → support close.',
  instanceAnchor: 'a POC where the customer hits an integration limitation',
  trigger: 'Sales pulls in technical help on a deal',
  steps: [
    S(1, { action: 'Technical discovery — the customer\'s stack, constraints, must-haves', tool: 'Calls + questionnaire', inputSource: 'A client / customer', frequency: 'few-times-a-week', needsJudgment: true }),
    S(2, { action: 'Build + deliver a demo tailored to their real use case', tool: 'Product + demo env', outputDestination: 'A client / customer', timeMins: 120, frequency: 'few-times-a-week', needsJudgment: true }),
    S(3, { action: 'Run a POC; make the product work against their data / systems', tool: 'Product + integrations', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'When the POC hits a real product gap, bridging "what they need" vs "what it does" honestly — without losing the deal — is the tightrope.' }),
    S(4, { action: 'Answer security questionnaires + RFPs (repetitive, detailed)', tool: 'RFP docs + repository', frequency: 'weekly', frictionTags: ['manual-transfer', 'rework', 'lookup'], notes: 'Re-answering the same security/RFP questions across deals by copy-paste-adapt — high-volume repetition that eats the week.' }),
    S(5, { action: 'Relay real product gaps to PM as field feedback', tool: 'Slack + Jira', outputDestination: 'Another team', frequency: 'weekly', frictionTags: ['chasing'] }),
    S(6, { action: 'Keep a private library of demo scripts + RFP answers + workarounds', tool: 'Personal repo', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Battle-tested demo flows + the honest workaround for each known limitation — my own kit, more current than any enablement doc.' }),
    S(7, { action: 'Hand technical context to onboarding on close', tool: 'Handoff doc', outputDestination: 'Another team', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Product / engineering', what: 'answers on feasibility + gaps', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'Onboarding', what: 'technical setup context on won deals', typicalDelay: 'on close' },
  ],
  exceptions: [
    { trigger: 'POC reveals a hard product limitation', whatYouDo: 'Find a workaround, set honest scope, escalate to product for roadmap', howOften: 'monthly' },
    { trigger: 'Custom security/legal requirement', whatYouDo: 'Pull in security + legal, answer precisely, avoid over-promising', howOften: 'monthly' },
  ],
});

const revOps = () => mk({
  role: 'RevOps / subscription-billing analyst (SaaS)',
  context: 'Owns subscription billing, renewals, MRR / churn reporting; billing system (Chargebee-style) + CRM + finance; month-end close',
  outputName: 'accurate subscription billing + revenue reporting',
  officialVersion: 'Manage subscriptions → process billing → handle changes (upgrade / downgrade / churn) → reconcile → report MRR / churn → close.',
  instanceAnchor: 'a month-end close with mismatches between CRM, billing + finance',
  trigger: 'Billing cycle / month-end / a subscription change request',
  steps: [
    S(1, { action: 'Process subscription changes — upgrades, downgrades, add-ons, proration', tool: 'Billing system', inputSource: 'A system / report', frequency: 'daily', needsJudgment: true, notes: 'Mid-cycle changes + proration + custom contract terms create edge cases the system handles badly — judgment per oddity.' }),
    S(2, { action: 'Reconcile CRM deals vs billing vs finance — hunt mismatches', tool: 'CRM + billing + Excel', frequency: 'weekly', frictionTags: ['lookup', 'rework', 'manual-transfer'], isPainful: true, notes: 'Three systems that disagree on what a customer pays; chasing down every mismatch at close is the dreaded, error-prone grind.' }),
    S(3, { action: 'Handle failed payments + dunning / collections', tool: 'Billing + email', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(4, { action: 'Compute MRR, churn, expansion, net revenue retention', tool: 'Excel / BI', frequency: 'monthly', needsJudgment: true, notes: 'Deciding how to treat ambiguous cases (a paused account, a partial churn) so the metrics are honest — definitional judgment.' }),
    S(5, { action: 'Produce the revenue report for leadership / board', tool: 'BI + slides', outputDestination: 'My manager', timeMins: 120, frequency: 'monthly', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Keep a private map of contract quirks + how each is billed', tool: 'Personal sheet', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Non-standard deals + their billing treatment tracked privately — the billing system can\'t express every bespoke contract.' }),
    S(7, { action: 'Close the cycle, archive, prep for the next', tool: 'Billing + finance', frequency: 'monthly', frictionTags: ['wait', 'approval'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Finance / accounting', what: 'revenue recognition + reconciliation sign-off', typicalDelay: 'at close' },
    { direction: 'wait-on', who: 'Sales / CS', what: 'clarity on deal terms + changes', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Billing mismatch found at close', whatYouDo: 'Trace across CRM/billing/finance, fix root cause, adjust + document', howOften: 'most months' },
    { trigger: 'Custom contract the system can\'t model', whatYouDo: 'Handle manually, track separately, flag for finance review', howOften: 'monthly' },
  ],
});

export const SAAS: WorkedExample[] = [
  { key: 'customer-success-manager', label: 'A CSM saving a wobbling renewal', domain: 'SaaS', region: 'Chennai, TN', emoji: '🤝',
    summary: 'Account health read off calls and tone (not just the score), a churn wobble sensed before the data shows it, and a renewal saved against budget cuts and a half-engaged champion.',
    behavioralContext: 'The capture tags early churn-sensing as a shadow relationship judgment (the health score lags the human signal) and marks the renewal save as the painful, quarter-defining stretch. The relationship read is exactly the value a dashboard can\'t replace.',
    fieldSpecificFit: 'The trace points the fit at the data-stitching, not the relationship: a unified account view (usage + support + comms) and churn-risk signals to back the CSM\'s instinct, plus auto-pulled QBR decks. The relationship judgment and renewal negotiation stay human.',
    build: customerSuccess },
  { key: 'account-executive', label: 'A SaaS AE pushing a deal through procurement', domain: 'SaaS', region: 'India', emoji: '💼',
    summary: 'The buying-committee org-map and champion-building held in the head, hours of CRM hygiene stolen from selling, and a quarter-end scramble against deals stalled in procurement.',
    behavioralContext: 'The capture tags the buying-committee map as shadow knowledge (the CRM only holds names) and marks the quarter-end procurement scramble as the painful pressure, with CRM admin as the resented tax. The qualification and political-navigation judgment are the selling skill.',
    fieldSpecificFit: 'The trace points the fit at the admin tax + deal visibility: auto-logged activities and AI CRM updates from call notes (reclaiming selling time), plus deal-stage/risk surfacing. The qualification instinct and committee navigation stay the AE\'s.',
    build: accountExecutive },
  { key: 'product-manager', label: 'A PM prioritising against everyone\'s asks', domain: 'SaaS', region: 'India', emoji: '🧭',
    summary: 'Signal stitched from a dozen scattered sources, the lonely political call to say no to loud stakeholders, with "promised to whom and why" kept in a private log.',
    behavioralContext: 'The capture marks ruthless prioritisation (saying no while defending strategy) as the painful, lonely core and tags the private promises/rationale log as shadow knowledge the roadmap tool lacks. The synthesis and trade-off judgment are the irreducible PM skill.',
    fieldSpecificFit: 'The trace points the fit at input-synthesis + the decision trail: auto-aggregated customer signal (tickets, asks, usage) into one view, and a decision log capturing the why. The prioritisation judgment and stakeholder no\'s stay the PM\'s — that\'s the job.',
    build: productManager },
  { key: 'support-engineer', label: 'A support engineer stuck on "cannot reproduce"', domain: 'SaaS', region: 'India', emoji: '🔧',
    summary: 'Recreating a customer\'s exact setup from a vague report, then caught between an SLA clock and an escalated bug only engineering can fix, with real fixes kept in personal notes.',
    behavioralContext: 'The capture marks managing a waiting customer with no ETA (escalated bug, ticking SLA) as the painful squeeze and tags personal quirk/workaround notes as shadow knowledge the lagging KB misses. The reproduction-and-diagnosis is the protected skill.',
    fieldSpecificFit: 'The trace points the fit at reproduction + knowledge capture: session-replay/diagnostic capture to kill the "cannot reproduce" wall, AI-suggested KB answers, and promoting personal notes into the KB. The diagnosis judgment and customer comms stay the engineer\'s.',
    build: supportEngineer },
  { key: 'onboarding-specialist', label: 'A SaaS onboarding stalled on the customer side', domain: 'SaaS', region: 'India', emoji: '🚦',
    summary: 'Mapping the customer\'s actual process to the product (sales sold a vision), helplessly waiting on their data and sign-offs while the time-to-value clock runs.',
    behavioralContext: 'The capture marks the customer-side stall (waiting on their data while TTV runs) as the painful helpless wait and tags per-customer-type onboarding tricks as shadow knowledge the one-size doc misses. The process-mapping read is make-or-break.',
    fieldSpecificFit: 'The trace points the fit at the customer-side bottleneck: a self-serve onboarding portal with data-upload, task reminders and progress visibility so the stall is the customer\'s to see, plus migration tooling. The process-fit judgment and training stay human.',
    build: onboardingSpecialist },
  { key: 'growth-marketer', label: 'A growth marketer defending pipeline contribution', domain: 'SaaS', region: 'India', emoji: '📣',
    summary: 'Attribution plumbing that breaks silently, optimisation judged from noisy partial data, and a recurring fight to prove which pipeline marketing actually caused.',
    behavioralContext: 'The capture marks the attribution credit-fight (against sales and a broken model) as the painful recurring frustration and tags hard-won "what converts" learnings as shadow knowledge the incomplete reports miss. Reading signal-vs-noise is the real skill.',
    fieldSpecificFit: 'The trace points the fit at the plumbing + the learning record: robust tracking/attribution setup that doesn\'t break silently and a captured library of what worked. The signal-vs-noise optimisation judgment stays the marketer\'s.',
    build: growthMarketer },
  { key: 'solutions-engineer', label: 'A solutions engineer on a POC hitting a product gap', domain: 'SaaS', region: 'India', emoji: '🛠',
    summary: 'Bridging "what they need" vs "what it does" honestly without losing the deal, while re-answering the same security/RFP questions by copy-paste across deals.',
    behavioralContext: 'The capture marks the POC product-gap tightrope as the painful step and tags the personal demo/RFP/workaround repo as shadow knowledge more current than enablement docs, with RFP repetition as friction. The honest gap-bridging is the trust the deal rides on.',
    fieldSpecificFit: 'The trace points the fit at the RFP repetition + knowledge: an AI-assisted security/RFP answer library (killing the copy-paste) and a shared demo/workaround repo. The POC gap-bridging judgment and honest scoping stay the SE\'s.',
    build: solutionsEngineer },
  { key: 'revops-billing', label: 'A RevOps analyst reconciling a month-end close', domain: 'SaaS', region: 'Chennai, TN', emoji: '🧮',
    summary: 'Three systems disagreeing on what a customer pays, proration and custom-contract edge cases the billing system handles badly, and bespoke deals tracked in a private sheet.',
    behavioralContext: 'The capture marks the CRM/billing/finance reconciliation as the painful, error-prone grind and tags the private contract-quirk map as shadow knowledge the billing system can\'t express. The metric-definition and edge-case judgment keep the numbers honest.',
    fieldSpecificFit: 'The trace points the fit at the reconciliation + edge cases: an integrated quote-to-cash flow that keeps CRM, billing and finance in sync (killing the mismatch hunt) and configurable handling of common proration cases. The metric-definition and bespoke-contract judgment stay the analyst\'s.',
    build: revOps },
];
