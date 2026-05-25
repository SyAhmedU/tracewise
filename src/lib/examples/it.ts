// IT SERVICES — software dev, QA, DevOps, data engineering, delivery mgmt, BA, UX, SOC
// Grounded largely in the Indian IT-services / GCC world (onsite-offshore, client TZ overlap).
import { S, mk, type WorkedExample } from './_shared';

const softwareDeveloper = () => mk({
  role: 'Software developer (product / services team, in a Scrum sprint)',
  context: 'A developer in a 2-week sprint on a web product; Jira + Git + CI; standups + a client / PO across time zones',
  outputName: 'a user story shipped to the main branch',
  officialVersion: 'Pick story → understand AC → code → write tests → raise PR → review → merge → deploy via CI → close ticket.',
  instanceAnchor: 'a mid-sprint story with vague acceptance criteria',
  trigger: 'Story assigned / pulled from the sprint board',
  steps: [
    S(1, { action: 'Read the story + acceptance criteria; reconstruct the actual intent', tool: 'Jira + Confluence', inputSource: 'A system / report', timeMins: 20, frequency: 'daily', frictionTags: ['lookup'], needsJudgment: true, notes: 'The ticket says what, rarely why; I infer intent from past tickets + a Slack ping to the PO — the real spec is half-undocumented.' }),
    S(2, { action: 'Read the existing code to find where this fits + what it\'ll break', tool: 'IDE + codebase', timeMins: 40, frequency: 'daily', frictionTags: ['lookup'], needsJudgment: true }),
    S(3, { action: 'Write the implementation', tool: 'IDE', timeMins: 180, frequency: 'daily', needsJudgment: true }),
    S(4, { action: 'Context-switch for standups, Slack pings, "quick" interrupts', tool: 'Slack + meetings', frequency: 'many-times-a-day', frictionTags: ['wait'], isPainful: true, notes: 'Fragmented focus — the interruptions that shred deep-work time are the real productivity drain, not the coding.' }),
    S(5, { action: 'Write / update unit tests, run locally, fix the failures', tool: 'Test runner', timeMins: 45, frequency: 'daily', frictionTags: ['rework'] }),
    S(6, { action: 'Raise PR, write description, wait on + chase a reviewer', tool: 'GitHub / GitLab', outputDestination: 'Another team', frequency: 'daily', frictionTags: ['wait', 'approval', 'chasing'] }),
    S(7, { action: 'Address review comments, re-push, watch CI go green, merge', tool: 'Git + CI', frequency: 'daily', frictionTags: ['rework', 'wait'] }),
    S(8, { action: 'Update ticket status + log hours in the timesheet tool', tool: 'Jira + timesheet', isShadow: true, frequency: 'daily', frictionTags: ['manual-transfer'], notes: 'Status in Jira + hours in a separate tool — duplicate bookkeeping nobody reads until audit.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Product owner / client', what: 'clarification on ambiguous acceptance criteria', typicalDelay: 'hours (TZ overlap)' },
    { direction: 'wait-on', who: 'Reviewer', what: 'PR approval', typicalDelay: 'hours to a day' },
  ],
  exceptions: [
    { trigger: 'Requirement changes mid-implementation', whatYouDo: 'Rework, re-estimate, flag scope creep at standup', howOften: 'most sprints' },
    { trigger: 'CI breaks on something unrelated', whatYouDo: 'Investigate flaky test / env, re-run, escalate to DevOps if infra', howOften: 'weekly' },
  ],
});

const qaEngineer = () => mk({
  role: 'QA engineer (manual + some automation)',
  context: 'A QA in a release team; test cases in a test-management tool; bug tracker; regression before each release',
  outputName: 'a build verified + signed off for release',
  officialVersion: 'Read requirements → write / pick test cases → execute → log defects → retest fixes → regression → sign off.',
  instanceAnchor: 'a regression cycle the day before a release',
  trigger: 'A build is dropped to QA for testing',
  steps: [
    S(1, { action: 'Understand what changed in the build + what it risks', tool: 'Release notes + Jira', inputSource: 'A system / report', timeMins: 30, frequency: 'few-times-a-week', frictionTags: ['lookup'], needsJudgment: true }),
    S(2, { action: 'Decide what to test deeply vs smoke — risk-based prioritisation', tool: 'Experience', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'No time to run everything before release; what to test hard is a risk judgment held in my head, not in the test plan.' }),
    S(3, { action: 'Execute test cases across browsers / devices / data', tool: 'Test tool + apps', timeMins: 180, frequency: 'few-times-a-week', frictionTags: ['movement', 'rework'] }),
    S(4, { action: 'Reproduce + log defects with steps, logs, screenshots', tool: 'Bug tracker', outputDestination: 'Another team', frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(5, { action: 'Chase devs on fixes + clarifications; defend "it is a bug"', tool: 'Slack + tracker', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(6, { action: 'Retest fixes, run regression on impacted areas', tool: 'Test tool', timeMins: 120, frequency: 'few-times-a-week', frictionTags: ['rework'] }),
    S(7, { action: 'Make the go / no-go call under release pressure', tool: 'Judgment + signoff', outputDestination: 'My manager', frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'Signing off knowing some areas are lightly tested, with the release clock ticking — owning that risk is the stress.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Developers', what: 'bug fixes + build re-drops', typicalDelay: 'hours' },
    { direction: 'hand-to', who: 'Release manager', what: 'sign-off + open-risk list', typicalDelay: 'release day' },
  ],
  exceptions: [
    { trigger: 'Critical bug found late', whatYouDo: 'Escalate, push for fix or descope, re-test the patch fast', howOften: 'most releases' },
    { trigger: 'Environment / test-data issue blocks testing', whatYouDo: 'Chase DevOps, use workaround data, note coverage gap', howOften: 'weekly' },
  ],
});

const devopsRelease = () => mk({
  role: 'DevOps engineer (CI/CD + production release)',
  context: 'Owns pipelines + infra for a product; deploys to production on a release window; on-call rotation',
  outputName: 'a release deployed safely to production',
  officialVersion: 'Prepare release → run pipeline → deploy to staging → verify → deploy to prod → smoke test → monitor → rollback if needed.',
  instanceAnchor: 'an evening production deploy after sign-off',
  trigger: 'Release approved; deployment window opens',
  steps: [
    S(1, { action: 'Assemble the release — versions, configs, migrations, env vars', tool: 'Pipeline + config', timeMins: 30, frequency: 'few-times-a-week', frictionTags: ['lookup'], needsJudgment: true }),
    S(2, { action: 'Run pipeline to staging, verify health + smoke', tool: 'CI/CD', timeMins: 25, frequency: 'few-times-a-week', frictionTags: ['wait'] }),
    S(3, { action: 'Get final go from leads; coordinate the window', tool: 'Slack + call', frequency: 'few-times-a-week', frictionTags: ['approval', 'wait'] }),
    S(4, { action: 'Deploy to production, run DB migrations carefully', tool: 'CI/CD + cloud console', frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'The migration + cutover is the held-breath moment — a bad migration can corrupt prod data; I rehearse the rollback mentally first.' }),
    S(5, { action: 'Smoke-test prod, watch dashboards + error rates', tool: 'Monitoring (Grafana / Datadog)', frequency: 'few-times-a-week', needsJudgment: true }),
    S(6, { action: 'Keep a personal runbook of "gotchas" for this system', tool: 'Personal notes', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'The real deploy knowledge — the undocumented order-of-operations + landmines — lives in my own notes, not the wiki.' }),
    S(7, { action: 'Announce success / handle rollback; write release notes', tool: 'Slack + docs', outputDestination: 'Another team', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Dev + QA leads', what: 'final release sign-off', typicalDelay: 'before window' },
    { direction: 'wait-on', who: 'Cloud provider / infra', what: 'resource availability + no incidents', typicalDelay: 'real-time' },
  ],
  exceptions: [
    { trigger: 'Deploy fails / errors spike post-release', whatYouDo: 'Execute rollback, restore DB if needed, root-cause, retry next window', howOften: 'monthly' },
    { trigger: 'Migration runs longer than the window', whatYouDo: 'Decide to wait or abort + rollback; communicate downtime', howOften: 'occasional' },
  ],
});

const dataEngineer = () => mk({
  role: 'Data engineer (ETL / pipeline)',
  context: 'Builds + maintains data pipelines feeding analytics / a warehouse; orchestrator (Airflow) + cloud warehouse; nightly jobs',
  outputName: 'a clean, on-time dataset delivered to the warehouse',
  officialVersion: 'Get source → build pipeline → transform → load to warehouse → validate → schedule → monitor → fix failures.',
  instanceAnchor: 'a morning a nightly pipeline failed and reports are blocked',
  trigger: 'A pipeline failure alert / a new data request',
  steps: [
    S(1, { action: 'Triage the failed job — read logs, find which step broke', tool: 'Airflow + logs', inputSource: 'A system / report', timeMins: 40, frequency: 'daily', frictionTags: ['lookup'], needsJudgment: true, isPainful: true, notes: 'Pipelines fail silently overnight on a schema change upstream; debugging at 9 AM with reports already blocked is the recurring fire.' }),
    S(2, { action: 'Trace the bad data to source — whose schema / API changed', tool: 'Queries + source', frequency: 'daily', frictionTags: ['lookup', 'chasing'], needsJudgment: true }),
    S(3, { action: 'Chase the upstream team about an unannounced schema change', tool: 'Slack + email', outputDestination: 'Another team', frequency: 'weekly', frictionTags: ['chasing', 'wait'] }),
    S(4, { action: 'Patch transform logic, handle nulls / dupes / edge cases', tool: 'SQL / Python', frequency: 'daily', needsJudgment: true, frictionTags: ['rework'] }),
    S(5, { action: 'Backfill the missed window, re-run downstream jobs', tool: 'Airflow', timeMins: 60, frequency: 'few-times-a-week', frictionTags: ['wait', 'rework'] }),
    S(6, { action: 'Validate row counts + key metrics against expectations', tool: 'Queries + dashboards', frequency: 'daily', needsJudgment: true, notes: 'Eyeballing whether the numbers "look right" — a sanity sense built from knowing the data, not a hard rule.', isShadow: true }),
    S(7, { action: 'Confirm to analysts the data is fixed; note the root cause', tool: 'Slack + notes', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Upstream source teams', what: 'stable schemas + change notice', typicalDelay: 'often none' },
    { direction: 'hand-to', who: 'Analysts / BI team', what: 'validated dataset', typicalDelay: 'morning SLA' },
  ],
  exceptions: [
    { trigger: 'Upstream schema changes without notice', whatYouDo: 'Patch fast, add a schema-check, push for contracts / alerts', howOften: 'weekly' },
    { trigger: 'Data volume spikes + job times out', whatYouDo: 'Tune / partition the job, scale resources, optimise the query', howOften: 'monthly' },
  ],
});

const itDeliveryManager = () => mk({
  role: 'IT delivery manager (onsite-offshore client account)',
  context: 'Runs delivery for a client account in an Indian services firm; offshore team in India + onsite coordinators; TZ overlap windows',
  outputName: 'a sprint / milestone delivered + reported to the client',
  officialVersion: 'Plan sprint → allocate team → track progress → manage risks → client status report → demo → invoice / billing → retrospective.',
  instanceAnchor: 'a Friday client status update with a slipping milestone',
  trigger: 'Sprint / reporting cadence + client expectations',
  steps: [
    S(1, { action: 'Gather true status from the team (vs the rosy Jira view)', tool: 'Standups + 1:1s', inputSource: 'Another team', frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'The board says green; I learn the real blockers in side conversations — the actual project truth is gathered informally.' }),
    S(2, { action: 'Re-plan around blockers, leaves, the TZ overlap window', tool: 'Plan + calendar', frequency: 'daily', needsJudgment: true }),
    S(3, { action: 'Shield the team from constant client scope-nudges', tool: 'Email + calls', frequency: 'daily', frictionTags: ['wait'], needsJudgment: true }),
    S(4, { action: 'Prepare the client status report — RAG, risks, asks', tool: 'PPT / Excel', outputDestination: 'A client / customer', timeMins: 60, frequency: 'weekly', frictionTags: ['manual-transfer'], notes: 'Re-packaging Jira data into a client-friendly deck by hand every week — same numbers, new format.' }),
    S(5, { action: 'Run the client call across the TZ overlap, manage expectations', tool: 'Video call', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'Delivering a slip to the client while keeping trust + the account — the relationship tightrope is the heaviest part.' }),
    S(6, { action: 'Track utilisation + billing for the team', tool: 'Timesheets + PMO tool', frequency: 'weekly', frictionTags: ['manual-transfer', 'lookup'] }),
    S(7, { action: 'Escalate / unblock dependencies across other teams + vendors', tool: 'Email + calls', frequency: 'daily', frictionTags: ['chasing', 'approval'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Client stakeholders', what: 'decisions, approvals, environment access', typicalDelay: 'TZ-delayed, often slow' },
    { direction: 'wait-on', who: 'Other delivery teams / vendors', what: 'cross-dependencies', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Key person resigns mid-project', whatYouDo: 'Backfill, knowledge-transfer fast, reassure client, manage the dip', howOften: 'quarterly' },
    { trigger: 'Client escalation on a miss', whatYouDo: 'Own it, present a recovery plan, over-communicate until trust returns', howOften: 'monthly' },
  ],
});

const businessAnalyst = () => mk({
  role: 'Business analyst (requirements → BRD)',
  context: 'Bridges client / business + the dev team; gathers requirements, writes BRDs / user stories, clarifies through build',
  outputName: 'a clear, agreed requirement the team can build',
  officialVersion: 'Elicit requirements → analyse → document BRD / stories → review with stakeholders → hand to dev → clarify → UAT support.',
  instanceAnchor: 'a workshop where stakeholders disagree on what they want',
  trigger: 'A new feature / change request comes from the business',
  steps: [
    S(1, { action: 'Elicit needs from stakeholders who half-know what they want', tool: 'Workshops + interviews', inputSource: 'A client / customer', timeMins: 90, frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'Stakeholders contradict each other + describe solutions not problems; extracting the real need is the hard, political core.' }),
    S(2, { action: 'Reconcile conflicting asks across departments', tool: 'Judgment + follow-ups', frequency: 'few-times-a-week', needsJudgment: true, frictionTags: ['chasing'] }),
    S(3, { action: 'Map the as-is + to-be process, spot gaps + edge cases', tool: 'Diagrams + docs', frequency: 'few-times-a-week', needsJudgment: true }),
    S(4, { action: 'Write the BRD / user stories with acceptance criteria', tool: 'Confluence / Word', outputDestination: 'Another team', timeMins: 120, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
    S(5, { action: 'Walk dev + QA through it; answer the "what about X?" gaps', tool: 'Meetings + Slack', frequency: 'daily', frictionTags: ['wait'] }),
    S(6, { action: 'Keep a personal tracker of decisions + who-said-what', tool: 'Personal notes', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Decisions get made in calls + chats; my private log of who agreed to what is the only audit trail when memory disputes arise.' }),
    S(7, { action: 'Support UAT — triage "is this a bug or as-designed?"', tool: 'Tracker + calls', frequency: 'few-times-a-week', needsJudgment: true, frictionTags: ['rework'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Business stakeholders', what: 'decisions + sign-off on requirements', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'Dev + QA teams', what: 'agreed requirements / stories', typicalDelay: 'per sprint' },
  ],
  exceptions: [
    { trigger: 'Requirement contradicts another already built', whatYouDo: 'Surface the clash, convene stakeholders, document the resolution', howOften: 'weekly' },
    { trigger: 'Scope balloons in "clarification"', whatYouDo: 'Flag as change request, re-baseline, protect the dev team', howOften: 'most projects' },
  ],
});

const uxDesigner = () => mk({
  role: 'UX / product designer',
  context: 'Designs flows + UI for a digital product; Figma; works with PM, devs, research; design-system constraints',
  outputName: 'a designed, dev-ready feature flow',
  officialVersion: 'Understand problem → research → wireframe → design → review → usability test → hand off specs → support build.',
  instanceAnchor: 'designing a checkout flow under a tight ship date',
  trigger: 'A feature needs design before the dev sprint',
  steps: [
    S(1, { action: 'Understand the user problem + business goal behind the ask', tool: 'PM brief + research', inputSource: 'A client / customer', timeMins: 60, frequency: 'few-times-a-week', needsJudgment: true }),
    S(2, { action: 'Sketch flows + wireframes, explore options', tool: 'Figma + paper', timeMins: 120, frequency: 'few-times-a-week', needsJudgment: true }),
    S(3, { action: 'Design hi-fi screens within the design system', tool: 'Figma', timeMins: 180, frequency: 'few-times-a-week', needsJudgment: true }),
    S(4, { action: 'Run design reviews; absorb subjective + conflicting feedback', tool: 'Figma + meetings', frequency: 'daily', frictionTags: ['rework', 'wait'], isPainful: true, notes: 'Everyone has an opinion on visuals; reconciling stakeholder taste vs user evidence + endless revision rounds is the draining churn.' }),
    S(5, { action: 'Quick usability check with a few users if time allows', tool: 'Prototype + users', frequency: 'monthly', needsJudgment: true, isShadow: true, notes: 'Real testing is squeezed out by timelines; I often validate on gut + heuristics instead — an unspoken compromise.' }),
    S(6, { action: 'Spec the design — states, edge cases, redlines for devs', tool: 'Figma + notes', outputDestination: 'Another team', timeMins: 60, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
    S(7, { action: 'Support build, QA the implementation against the design', tool: 'Figma + staging', frequency: 'few-times-a-week', frictionTags: ['rework', 'chasing'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'PM + stakeholders', what: 'aligned feedback + sign-off', typicalDelay: 'days' },
    { direction: 'hand-to', who: 'Developers', what: 'design specs + assets', typicalDelay: 'per sprint' },
  ],
  exceptions: [
    { trigger: 'Devs say the design isn\'t feasible in time', whatYouDo: 'Negotiate a simpler version, protect the core UX, iterate', howOften: 'most features' },
    { trigger: 'Late HiPPO opinion overrides the design', whatYouDo: 'Show user evidence, compromise gracefully, document the call', howOften: 'monthly' },
  ],
});

const socAnalyst = () => mk({
  role: 'SOC analyst (security operations, L1/L2)',
  context: 'Monitors security alerts in a SOC; SIEM + ticketing; 24x7 shifts; alert volume + false positives',
  outputName: 'a security alert triaged + resolved or escalated',
  officialVersion: 'Alert fires → triage → investigate → classify (true / false positive) → contain → escalate if real → document → close.',
  instanceAnchor: 'a shift with an alert storm hiding one real threat',
  trigger: 'An alert fires in the SIEM queue',
  steps: [
    S(1, { action: 'Scan the alert queue, prioritise amid heavy false-positive noise', tool: 'SIEM', inputSource: 'A system / report', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Alert fatigue — sifting hundreds of false positives for the one that matters, knowing a miss is a breach, is the grinding pressure.' }),
    S(2, { action: 'Investigate — logs, source IP, user, asset context', tool: 'SIEM + threat intel', timeMins: 20, frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true }),
    S(3, { action: 'Decide true positive vs false positive vs benign', tool: 'Judgment + playbook', frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Pivot across multiple consoles to build the full picture', tool: 'EDR + firewall + IAM tools', frequency: 'many-times-a-day', frictionTags: ['lookup', 'manual-transfer'] }),
    S(5, { action: 'Contain — isolate host / block IP / disable account if real', tool: 'EDR / firewall', frequency: 'daily', needsJudgment: true, frictionTags: ['approval'] }),
    S(6, { action: 'Escalate confirmed incidents to L3 / IR with a written summary', tool: 'Ticket + Slack', outputDestination: 'Another team', frequency: 'daily', frictionTags: ['manual-transfer', 'wait'] }),
    S(7, { action: 'Document the verdict + reasoning; note tuning to cut the noise', tool: 'Ticketing + notes', isShadow: true, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'], notes: 'Which alerts are chronic false positives + how to tune them is tribal knowledge I jot personally; the rules lag reality.' }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'L3 / incident response', what: 'confirmed incidents for deep response', typicalDelay: 'minutes (critical)' },
    { direction: 'wait-on', who: 'Asset / IT owners', what: 'context on a host / user', typicalDelay: 'minutes to hours' },
  ],
  exceptions: [
    { trigger: 'Confirmed active breach', whatYouDo: 'Trigger IR playbook, contain, escalate, preserve evidence, no delay', howOften: 'rarely but critical' },
    { trigger: 'Alert storm from a misconfig', whatYouDo: 'Identify the noisy source, suppress / tune, avoid masking real alerts', howOften: 'weekly' },
  ],
});

export const IT: WorkedExample[] = [
  { key: 'software-developer', label: 'A developer shipping a story in a sprint', domain: 'IT services', region: 'India', emoji: '💻',
    summary: 'Real intent inferred from a thin ticket plus a Slack ping, deep-work shredded by interruptions, and status duplicated across Jira and a timesheet tool.',
    behavioralContext: 'The capture marks fragmented focus (standups, pings, "quick" interrupts) as the painful productivity drain — not the coding — and tags ticket-intent reconstruction as judgment over a half-undocumented spec, with status/timesheet double-entry as a shadow chore. The inference and design judgment are the skilled part.',
    fieldSpecificFit: 'The trace points the fit at the seams, not the coding: protected focus blocks + async standups to cut the interruption tax, AI-assisted PR descriptions/test scaffolding, and a single source for status that auto-fills the timesheet. The intent-inference and implementation judgment stay the developer\'s.',
    build: softwareDeveloper },
  { key: 'qa-engineer', label: 'A QA running a pre-release regression', domain: 'IT services', region: 'India', emoji: '🐞',
    summary: 'Risk-based "what to test hard" held in the head (never in the plan), then a go/no-go sign-off owning the risk of lightly-tested areas as the clock ticks.',
    behavioralContext: 'The capture tags risk-prioritisation as a shadow judgment (no time to test everything; the call lives in the QA\'s head) and marks the release sign-off as the painful step — owning under-tested risk under deadline. That judgment is exactly the expertise to protect.',
    fieldSpecificFit: 'The trace points the fit at coverage + repetition: automate the stable regression suite to free time for risk-based exploratory testing, and surface change-impact to inform prioritisation. The go/no-go judgment stays human, just better-evidenced.',
    build: qaEngineer },
  { key: 'devops-release', label: 'A DevOps engineer deploying to production', domain: 'IT services', region: 'India', emoji: '🚀',
    summary: 'The held-breath DB migration and cutover, with the real deploy knowledge — undocumented order-of-operations and landmines — living in a personal runbook.',
    behavioralContext: 'The capture marks the migration/cutover as the painful, high-stakes step (a bad migration corrupts prod) and tags the personal "gotchas" runbook as shadow knowledge the wiki lacks. The rollback-readiness judgment is what protects production.',
    fieldSpecificFit: 'The trace points the fit at safety + capturing the shadow knowledge: progressive delivery (canary/blue-green) with automated rollback and migration safety checks, and turning the personal runbook into a shared, executable one. The cutover judgment stays human.',
    build: devopsRelease },
  { key: 'data-engineer', label: 'A data engineer fixing a broken nightly pipeline', domain: 'IT services', region: 'India', emoji: '🗄',
    summary: 'Pipelines failing silently on an unannounced upstream schema change, debugged at 9 AM with reports already blocked, and "does the data look right" judged by feel.',
    behavioralContext: 'The capture marks the morning failure-triage as the painful recurring fire (silent overnight failure on upstream changes) and tags the data sanity-check as a shadow feel built from knowing the data. The root-cause judgment is skilled; the silent failure is avoidable friction.',
    fieldSpecificFit: 'The trace points the fit at contracts + observability: schema-change detection and data-quality checks that alert before downstream breaks, plus data-contract agreements with upstream teams. The validation feel becomes codified expectations; the judgment stays the engineer\'s.',
    build: dataEngineer },
  { key: 'it-delivery-manager', label: 'A delivery manager on an onsite-offshore account', domain: 'IT services', region: 'India', emoji: '📊',
    summary: 'The real project truth gathered in side conversations (the board says green), Jira re-packaged by hand into a weekly client deck, and a slip delivered on the trust tightrope.',
    behavioralContext: 'The capture tags true-status gathering as shadow informal work (vs the rosy board) and marks the client call delivering a slip as the painful relationship tightrope. The expectation-management and team-shielding judgment are the core value.',
    fieldSpecificFit: 'The trace points the fit at the reporting drudgery, not the relationship: auto-generated client status from live project data (killing the weekly hand-rebuild) and surfaced blockers so status isn\'t archaeology. The client-trust and re-planning judgment stay the manager\'s.',
    build: itDeliveryManager },
  { key: 'business-analyst', label: 'A BA turning conflicting asks into a requirement', domain: 'IT services', region: 'India', emoji: '📋',
    summary: 'Extracting the real need from stakeholders who describe solutions and contradict each other, with a private log of who-agreed-to-what as the only audit trail.',
    behavioralContext: 'The capture marks requirement-elicitation as the painful, political core (contradictions, solution-not-problem) and tags the personal decisions log as a shadow audit trail. The reconciliation and gap-spotting judgment are exactly what a template can\'t do.',
    fieldSpecificFit: 'The trace points the fit at the documentation + decision-trail, not the elicitation: AI-assisted BRD/story drafting from notes and a shared, timestamped decision log so "who agreed what" isn\'t a private memory. The stakeholder-reconciliation judgment stays human.',
    build: businessAnalyst },
  { key: 'ux-designer', label: 'A UX designer shipping a feature flow', domain: 'IT services', region: 'India', emoji: '🎨',
    summary: 'Reconciling stakeholder taste against user evidence through endless revision rounds, with real usability testing quietly squeezed out by timelines.',
    behavioralContext: 'The capture marks the subjective-feedback revision churn as the painful drain and tags skipped usability testing (validating on gut/heuristics) as a shadow compromise the timeline forces. The design judgment and user-advocacy are the value.',
    fieldSpecificFit: 'The trace points the fit at the feedback loop + validation gap: structured, consolidated design-review feedback to cut churn, and lightweight always-on usability testing so evidence isn\'t squeezed out. The design judgment stays the designer\'s.',
    build: uxDesigner },
  { key: 'soc-analyst', label: 'A SOC analyst triaging an alert storm', domain: 'IT services', region: 'India', emoji: '🛡',
    summary: 'Alert fatigue — sifting hundreds of false positives for the one breach that matters — across multiple consoles, with tuning knowledge jotted personally as the rules lag reality.',
    behavioralContext: 'The capture marks false-positive sifting as the painful, high-stakes grind (a miss is a breach) and tags the personal tuning notes as shadow tribal knowledge the rules don\'t hold. The true/false-positive judgment is the protected skill.',
    fieldSpecificFit: 'The trace points the fit at noise reduction + context: alert correlation/enrichment and a unified console to kill the cross-tool pivot, plus feeding the analyst\'s tuning knowledge back into detection rules. The threat-verdict judgment stays human — AI triages, it doesn\'t decide.',
    build: socAnalyst },
];
