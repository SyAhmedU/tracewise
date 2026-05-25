// ACADEMIA — college lecturer, exam valuation, PhD scholar, research supervisor, NAAC/IQAC,
// school teacher, placement officer, admissions counsellor. Indian higher-ed context
// (affiliated colleges, Anna University-style exams, NAAC/NBA, AICTE, TNEA counselling).
import { S, mk, type WorkedExample } from './_shared';

const collegeLecturer = () => mk({
  role: 'College lecturer (affiliated arts & science / engineering college)',
  context: 'Teaches several sections under an affiliating university; lectures + internal assessment + attendance + NAAC/IQAC records; LMS partly used',
  outputName: 'a topic taught + the related records updated',
  officialVersion: 'Plan lecture → teach → take attendance → set + grade internal tests → enter marks → maintain NAAC/IQAC records → mentor students.',
  instanceAnchor: 'a teaching day with an internal-assessment deadline + a NAAC file due',
  trigger: 'Class timetable + assessment / documentation deadlines',
  steps: [
    S(1, { action: 'Prepare the lecture, adapt to the university syllabus + student level', tool: 'Notes + slides + textbook', timeMins: 45, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Teach; read the room + re-explain where students are lost', tool: 'Board + voice', outputDestination: 'A client / customer', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Sensing confused faces + reteaching on the fly — the pedagogical judgment that actually lands the concept.' }),
    S(3, { action: 'Take + maintain attendance (often on paper AND a portal)', tool: 'Register + portal', frequency: 'many-times-a-day', frictionTags: ['manual-transfer', 'rework'], notes: 'Attendance kept on paper then re-keyed into the portal — duplicate record-keeping that eats teaching time.' }),
    S(4, { action: 'Set + grade internal-assessment tests; judge borderline scripts', tool: 'Question paper + scripts', timeMins: 120, frequency: 'few-times-a-week', needsJudgment: true }),
    S(5, { action: 'Enter internal marks into the university portal before the deadline', tool: 'University portal', outputDestination: 'A system / report', frequency: 'few-times-a-week', frictionTags: ['wait', 'manual-transfer', 'approval'], notes: 'Clunky portal that crashes near deadlines — the entry window is a recurring scramble.' }),
    S(6, { action: 'Compile NAAC/IQAC documentation — lesson plans, attainment, evidence', tool: 'Word / Excel + files', timeMins: 90, frequency: 'weekly', frictionTags: ['manual-transfer', 'rework'], isPainful: true, notes: 'Endless accreditation paperwork — reformatting the same teaching evidence into NAAC/NBA formats — is the dreaded load that steals time from students.' }),
    S(7, { action: 'Mentor / counsel assigned students; track their progress', tool: 'Conversation + notes', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Knowing which student is struggling at home / risk of dropping out — pastoral knowledge held personally, not in any system.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Affiliating university', what: 'syllabus, exam schedule, portal windows', typicalDelay: 'per semester' },
    { direction: 'hand-to', who: 'HOD / IQAC', what: 'marks + accreditation documentation', typicalDelay: 'deadlines' },
  ],
  exceptions: [
    { trigger: 'University portal down at the marks deadline', whatYouDo: 'Keep paper records, retry, escalate to HOD, enter in bulk later', howOften: 'every semester' },
    { trigger: 'Surprise NAAC/NBA inspection', whatYouDo: 'Pull all files into order overnight, fill documentation gaps fast', howOften: 'accreditation cycle' },
  ],
});

const examValuation = () => mk({
  role: 'Exam-cell coordinator / answer-script valuer (university exams)',
  context: 'Runs semester exam conduct for a college + does central / digital valuation for the affiliating university; strict confidentiality + timelines',
  outputName: 'an exam conducted + scripts valued + marks submitted',
  officialVersion: 'Receive papers → conduct exam → pack scripts → send to valuation → value to scheme → enter marks → handle revaluation.',
  instanceAnchor: 'a central valuation day with a large bundle + a scheme that doesn\'t fit every answer',
  trigger: 'University exam schedule / valuation camp dates',
  steps: [
    S(1, { action: 'Conduct exam — seating, question-paper secrecy, invigilation, malpractice watch', tool: 'Hall plan + papers', frequency: 'few-times-a-week', needsJudgment: true, frictionTags: ['approval'] }),
    S(2, { action: 'Pack, code + dispatch scripts maintaining confidentiality', tool: 'Bundles + dummy numbers', outputDestination: 'A system / report', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
    S(3, { action: 'Value scripts against the scheme; judge partial credit fairly', tool: 'Scheme + scripts', frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'A student\'s mark + future ride on my pen; judging a half-right or differently-worded answer against a rigid scheme, fast, in bulk, is the weight.' }),
    S(4, { action: 'Total + cross-check marks per script; avoid totalling errors', tool: 'Calculator + script', frequency: 'few-times-a-week', frictionTags: ['rework'], needsJudgment: true }),
    S(5, { action: 'Enter / upload marks into the university system', tool: 'University portal', frequency: 'few-times-a-week', frictionTags: ['manual-transfer', 'wait', 'approval'] }),
    S(6, { action: 'Keep personal notes on scheme ambiguities + chief-examiner rulings', tool: 'Personal notes', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'How the chief examiner said to treat a borderline answer — verbal rulings kept privately to value consistently across the bundle.' }),
    S(7, { action: 'Handle revaluation / re-totalling requests', tool: 'Scripts + portal', frequency: 'monthly', frictionTags: ['rework', 'wait'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Affiliating university', what: 'question papers, schemes, valuation camp logistics', typicalDelay: 'per exam' },
    { direction: 'wait-on', who: 'Chief examiner', what: 'rulings on scheme ambiguities', typicalDelay: 'at the camp' },
  ],
  exceptions: [
    { trigger: 'Answer doesn\'t fit the scheme', whatYouDo: 'Consult chief examiner, apply ruling consistently, note it', howOften: 'every camp' },
    { trigger: 'Malpractice during exam', whatYouDo: 'Follow protocol, document, report, separate the candidate calmly', howOften: 'occasional' },
  ],
});

const phdScholar = () => mk({
  role: 'PhD research scholar (experimental discipline)',
  context: 'A doctoral scholar running experiments + writing papers under a supervisor; lab + literature + journal submissions; funding + timeline pressure',
  outputName: 'a research result written up + submitted',
  officialVersion: 'Frame question → review literature → design experiment → run → analyse → write paper → submit → revise per reviewers.',
  instanceAnchor: 'an experiment that keeps failing weeks before a conference deadline',
  trigger: 'Research milestone / paper deadline / supervisor meeting',
  steps: [
    S(1, { action: 'Read + track literature; find the real gap', tool: 'Journals + ref manager', timeMins: 120, frequency: 'weekly', needsJudgment: true }),
    S(2, { action: 'Design + run experiments; troubleshoot when they fail', tool: 'Lab + equipment', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'Experiments fail for unknown reasons for weeks; the grind of debugging a setup with a deadline looming + funding finite is the core anguish.' }),
    S(3, { action: 'Keep the lab notebook / data records meticulously', tool: 'Notebook + files', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'The messy reality of what was actually tried — failed runs, tweaks, hunches — lives in my notebook; only the clean version reaches the paper.' }),
    S(4, { action: 'Analyse data, run stats, judge if the result is real', tool: 'Python / R / stats', frequency: 'weekly', needsJudgment: true }),
    S(5, { action: 'Write the paper; iterate heavily on supervisor feedback', tool: 'LaTeX / Word', outputDestination: 'My manager', frequency: 'weekly', frictionTags: ['rework', 'wait', 'chasing'] }),
    S(6, { action: 'Format + submit to a journal / conference per its template', tool: 'Submission portal', outputDestination: 'A system / report', frequency: 'monthly', frictionTags: ['manual-transfer', 'rework'], notes: 'Reformatting the same paper for each venue\'s template + portal quirks — repetitive plumbing on top of the science.' }),
    S(7, { action: 'Wait months for review; revise + resubmit per reviewers', tool: 'Portal + manuscript', frequency: 'rarely', frictionTags: ['wait', 'rework'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Supervisor', what: 'feedback, direction, sign-off', typicalDelay: 'days to weeks' },
    { direction: 'wait-on', who: 'Journal reviewers', what: 'peer review decision', typicalDelay: 'months' },
  ],
  exceptions: [
    { trigger: 'Experiment won\'t replicate', whatYouDo: 'Re-check protocol, isolate variables, consult supervisor / peers', howOften: 'often' },
    { trigger: 'Paper rejected', whatYouDo: 'Address reviews, reframe, resubmit elsewhere, manage morale', howOften: 'most papers' },
  ],
});

const researchSupervisor = () => mk({
  role: 'Research supervisor / professor (PhD guidance + grants)',
  context: 'Guides several scholars, runs a lab, chases funding (DST/SERB/UGC), teaches + does heavy admin; competing demands',
  outputName: 'research advanced — a scholar progressed / a grant won / a paper out',
  officialVersion: 'Guide scholars → review work → write grant proposals → manage lab + funds → publish → teach → committee / admin duties.',
  instanceAnchor: 'a week with a grant deadline colliding with scholar reviews + teaching',
  trigger: 'Grant call / scholar milestone / teaching + admin cadence',
  steps: [
    S(1, { action: 'Review scholars\' work + give direction across different projects', tool: 'Meetings + drafts', inputSource: 'Another team', frequency: 'weekly', needsJudgment: true, notes: 'Holding the thread of several scholars\' projects + steering each — the intellectual juggling that is the real supervision.' }),
    S(2, { action: 'Write grant proposals — fit the funder\'s format + priorities', tool: 'Proposal + portal', timeMins: 240, frequency: 'monthly', needsJudgment: true, isPainful: true, notes: 'Crafting a fundable proposal against a deadline, with the lab\'s funding (and scholars\' stipends) riding on it — the high-stakes scramble.' }),
    S(3, { action: 'Manage grant admin — budgets, utilisation certificates, audits', tool: 'Finance forms + portal', frequency: 'monthly', frictionTags: ['manual-transfer', 'approval', 'chasing'], notes: 'Bureaucratic fund-utilisation + UC paperwork that eats research time — the administrative drag of running funded work in India.' }),
    S(4, { action: 'Edit + co-write scholars\' papers; handle authorship', tool: 'Manuscripts', frequency: 'weekly', frictionTags: ['rework'], needsJudgment: true }),
    S(5, { action: 'Teach + prepare courses alongside research', tool: 'Slides + classroom', frequency: 'weekly', needsJudgment: true }),
    S(6, { action: 'Sit on committees, do institutional admin + NAAC/NBA duties', tool: 'Meetings + files', frequency: 'weekly', frictionTags: ['wait', 'manual-transfer'] }),
    S(7, { action: 'Keep a private map of each scholar\'s strengths + where they\'re stuck', tool: 'Personal notes', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Who needs pushing vs space, who is near a breakthrough or burnout — mentoring knowledge held personally.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Funding agency (DST/SERB/UGC)', what: 'grant decisions + fund release', typicalDelay: 'months' },
    { direction: 'wait-on', who: 'Institution admin / finance', what: 'fund disbursement + approvals', typicalDelay: 'weeks' },
  ],
  exceptions: [
    { trigger: 'Grant not renewed / delayed', whatYouDo: 'Find bridge funding, reprioritise lab work, protect scholars\' stipends', howOften: 'periodically' },
    { trigger: 'A scholar stalls / considers quitting', whatYouDo: 'Mentor closely, adjust the project, support personally', howOften: 'occasionally' },
  ],
});

const naacCoordinator = () => mk({
  role: 'IQAC / NAAC accreditation coordinator',
  context: 'Drives accreditation (NAAC / NBA) documentation for a college; collects data + evidence from every department; criteria-wise SSR; cyclical deadlines',
  outputName: 'an accreditation report (SSR / AQAR) compiled + submitted',
  officialVersion: 'Map criteria → collect data + evidence from departments → compile criteria-wise → verify → write SSR → submit → prep for peer visit.',
  instanceAnchor: 'an SSR submission window with departments slow to send data',
  trigger: 'Accreditation cycle / AQAR annual deadline',
  steps: [
    S(1, { action: 'Map NAAC criteria + metrics to what data each department must give', tool: 'NAAC manual + templates', frequency: 'monthly', needsJudgment: true }),
    S(2, { action: 'Chase every department for data + evidence in the right format', tool: 'Email + WhatsApp + visits', outputDestination: 'Another team', frequency: 'weekly', frictionTags: ['chasing', 'wait', 'rework'], isPainful: true, notes: 'Begging dozens of faculty for data they keep differently + send late — the relentless chasing across departments is the dreaded core.' }),
    S(3, { action: 'Clean + standardise inconsistent data into criteria formats', tool: 'Excel', frequency: 'weekly', frictionTags: ['manual-transfer', 'rework'], needsJudgment: true }),
    S(4, { action: 'Judge how to present data to best (honestly) meet metrics', tool: 'Judgment + manual', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Knowing how assessors read each metric + framing the college\'s real work to score well — interpretive know-how built over cycles.' }),
    S(5, { action: 'Compile criteria-wise documents + hyperlinked evidence', tool: 'Word / PDF + drive', timeMins: 240, frequency: 'monthly', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Write the SSR narrative; verify every claim has evidence', tool: 'SSR template', outputDestination: 'A system / report', frequency: 'rarely', needsJudgment: true, frictionTags: ['rework'] }),
    S(7, { action: 'Prep departments + mock-drill for the peer-team visit', tool: 'Meetings + walkthrough', frequency: 'rarely', frictionTags: ['chasing'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'All departments / faculty', what: 'data + evidence in usable format', typicalDelay: 'weeks, with chasing' },
    { direction: 'hand-to', who: 'NAAC / NBA (assessors)', what: 'SSR / AQAR + evidence', typicalDelay: 'cycle deadline' },
  ],
  exceptions: [
    { trigger: 'Department data missing / inconsistent', whatYouDo: 'Reconstruct from records, follow up hard, fill gaps before submission', howOften: 'every cycle' },
    { trigger: 'Metric definition changes between cycles', whatYouDo: 'Re-learn the manual, re-collect affected data, adjust framing', howOften: 'each cycle' },
  ],
});

const schoolTeacher = () => mk({
  role: 'School teacher (CBSE / state board)',
  context: 'Teaches multiple sections; lessons + continuous assessment + exams + heavy registers + parent communication; partial digital systems',
  outputName: 'a lesson taught + its assessment + records done',
  officialVersion: 'Plan lesson → teach → assess (FA/SA/CCE) → grade → record marks → report to parents → maintain registers + admin.',
  instanceAnchor: 'an exam-result + report-card period with registers due',
  trigger: 'Timetable + assessment / reporting calendar',
  steps: [
    S(1, { action: 'Plan the lesson to the syllabus + the class\'s mixed levels', tool: 'Textbook + plan', timeMins: 30, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Teach + manage a large class; keep weaker students with the pace', tool: 'Board + activities', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Pitching to a 40+ mixed-ability class + spotting who is lost — the classroom judgment that no plan fully scripts.' }),
    S(3, { action: 'Set + grade assessments (FA / SA / CCE rubrics)', tool: 'Papers + rubric', timeMins: 120, frequency: 'few-times-a-week', needsJudgment: true }),
    S(4, { action: 'Record marks + attendance in multiple registers AND a portal', tool: 'Registers + portal', frequency: 'daily', frictionTags: ['manual-transfer', 'rework'], isPainful: true, notes: 'The same marks + attendance copied into several registers + a portal — the duplicate clerical load is the dreaded, time-eating part.' }),
    S(5, { action: 'Prepare report cards + CCE descriptors per child', tool: 'Report format', frequency: 'monthly', frictionTags: ['manual-transfer'], needsJudgment: true }),
    S(6, { action: 'Communicate with parents — progress, behaviour, concerns', tool: 'Diary + WhatsApp + meetings', outputDestination: 'A client / customer', frequency: 'weekly', needsJudgment: true }),
    S(7, { action: 'Track each child\'s real situation — home issues, learning gaps', tool: 'Memory + notes', isShadow: true, frequency: 'weekly', needsJudgment: true, notes: 'Knowing a child is quiet because of trouble at home — pastoral knowledge carried personally, central to teaching them.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'School admin / board', what: 'syllabus, exam schedule, report formats', typicalDelay: 'per term' },
    { direction: 'hand-to', who: 'Parents + next class teacher', what: 'report cards + student context', typicalDelay: 'term-end' },
  ],
  exceptions: [
    { trigger: 'Behaviour / wellbeing issue with a child', whatYouDo: 'Counsel, involve parents + counsellor, document sensitively', howOften: 'regularly' },
    { trigger: 'Register / portal audit', whatYouDo: 'Reconcile all records, fill gaps, ensure consistency overnight', howOften: 'periodically' },
  ],
});

const placementOfficer = () => mk({
  role: 'Training & placement officer (college T&P cell)',
  context: 'Runs campus placements — company relations, student prep, drive logistics; portal + spreadsheets; placement-percentage pressure',
  outputName: 'students placed through a recruitment drive',
  officialVersion: 'Build company relations → invite + schedule drives → prep + shortlist students → run the drive → coordinate offers → report placements.',
  instanceAnchor: 'a drive day juggling the company, students + last-minute changes',
  trigger: 'A company confirms a campus drive / placement season',
  steps: [
    S(1, { action: 'Build + maintain company relationships to bring drives', tool: 'Calls + email + visits', inputSource: 'A client / customer', frequency: 'weekly', needsJudgment: true, isPainful: true, notes: 'Convincing companies to recruit here + keeping them coming back — the relationship hustle the whole placement record depends on.' }),
    S(2, { action: 'Match company criteria to eligible students; shortlist', tool: 'Spreadsheets + records', frequency: 'weekly', frictionTags: ['lookup', 'manual-transfer'], needsJudgment: true }),
    S(3, { action: 'Prep students — aptitude, GD, interview, resumes', tool: 'Training sessions', frequency: 'weekly', needsJudgment: true }),
    S(4, { action: 'Schedule + run drive logistics — rooms, tests, panels, students', tool: 'Calendar + halls', frequency: 'weekly', frictionTags: ['chasing', 'movement', 'wait'] }),
    S(5, { action: 'Coordinate the day — herd students, manage company expectations', tool: 'Phone + on-foot', frequency: 'weekly', frictionTags: ['chasing', 'wait'] }),
    S(6, { action: 'Track offers, manage multi-offer + dream-job student choices', tool: 'Spreadsheet', needsJudgment: true, frequency: 'weekly', notes: 'Balancing a student\'s ambition vs the placement-percentage metric — whom to nudge to accept is a quiet judgment.' }),
    S(7, { action: 'Report placement stats for NAAC / NIRF / management', tool: 'Excel + portal', outputDestination: 'My manager', frequency: 'monthly', frictionTags: ['manual-transfer'], isShadow: true, notes: 'Placement numbers feed accreditation + rankings; reconciling offers vs joins vs higher-studies into the "percentage" is fiddly definitional work.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Recruiting companies', what: 'drive dates, criteria, offer decisions', typicalDelay: 'days to weeks' },
    { direction: 'hand-to', who: 'Management / IQAC', what: 'placement statistics', typicalDelay: 'season-end' },
  ],
  exceptions: [
    { trigger: 'Company cancels / postpones a drive', whatYouDo: 'Rebook students, find a replacement company, manage morale', howOften: 'every season' },
    { trigger: 'Student rejects an offer late', whatYouDo: 'Counsel, manage the company relationship, protect the cell\'s credibility', howOften: 'regularly' },
  ],
});

const admissionsCounsellor = () => mk({
  role: 'Admissions counsellor (college / engineering counselling)',
  context: 'Guides prospective students + parents through admission — eligibility, course choice, fees, scholarships; centralised counselling (TNEA-style) + management quota; season-bound',
  outputName: 'a student admitted into a suitable course',
  officialVersion: 'Enquiry → assess eligibility + interest → guide course choice → explain fees / scholarships → process application → confirm admission.',
  instanceAnchor: 'a counselling-season day with anxious parents weighing options',
  trigger: 'A prospective student / parent enquiry during admission season',
  steps: [
    S(1, { action: 'Understand the student — marks, interest, family means, anxieties', tool: 'Conversation', inputSource: 'A client / customer', timeMins: 30, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Reading what the student actually wants vs parental pressure vs marks reality — the human counselling at the core.' }),
    S(2, { action: 'Check eligibility, cut-offs, category / community, seat matrix', tool: 'TNEA / portal + rules', frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true }),
    S(3, { action: 'Guide realistic course + college choices honestly', tool: 'Counselling + data', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Balancing honest guidance for the student vs the institution\'s pressure to fill seats — the ethical tension is the heaviest part.' }),
    S(4, { action: 'Explain fees, scholarships, loans, hostel, documents', tool: 'Fee structure + schemes', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Process application + documents; verify originals', tool: 'Forms + portal', frequency: 'many-times-a-day', frictionTags: ['manual-transfer', 'approval'] }),
    S(6, { action: 'Follow up fence-sitters; coordinate with management on quota seats', tool: 'Phone + CRM', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(7, { action: 'Keep personal notes on each enquiry\'s status + real intent', tool: 'Personal tracker', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Who is serious, who is comparing, what each family is really weighing — a private tracker the official admission system doesn\'t hold.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Counselling authority (TNEA) / university', what: 'seat allotment + rules', typicalDelay: 'per round' },
    { direction: 'wait-on', who: 'Management', what: 'decisions on quota seats + fee concessions', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Student\'s rank doesn\'t get the wanted course', whatYouDo: 'Counsel realistic alternatives, explain later-round chances honestly', howOften: 'daily in season' },
    { trigger: 'Document / eligibility discrepancy', whatYouDo: 'Guide to rectify, check alternate categories, escalate genuine cases', howOften: 'weekly' },
  ],
});

export const ACADEMIA: WorkedExample[] = [
  { key: 'college-lecturer', label: 'A college lecturer between a class and a NAAC file', domain: 'Academia', region: 'Tamil Nadu', emoji: '👩‍🏫',
    summary: 'Reteaching on the fly from confused faces, attendance kept on paper then re-keyed, and endless NAAC/NBA paperwork that steals time from students.',
    behavioralContext: 'The capture marks the accreditation documentation as the painful, student-time-stealing load, tags pastoral student-knowledge as shadow (who is at risk, held personally), and flags attendance/marks double-entry as rework. The reteaching read is the protected pedagogical judgment.',
    fieldSpecificFit: 'The trace points the fit at the duplication + documentation: a single record system that auto-generates NAAC/NBA evidence from routine teaching data (killing the reformatting) and one-entry attendance/marks. The teaching judgment and mentoring stay human.',
    build: collegeLecturer },
  { key: 'exam-valuation', label: 'An examiner valuing scripts against a rigid scheme', domain: 'Academia', region: 'Tamil Nadu', emoji: '📝',
    summary: 'A student\'s future riding on the pen — judging half-right and differently-worded answers against a rigid scheme, fast and in bulk — with chief-examiner rulings kept privately.',
    behavioralContext: 'The capture marks fair partial-credit valuation as the painful, high-weight judgment and tags the chief-examiner ruling notes as shadow knowledge for consistency. The fairness call on borderline answers is exactly what must stay human.',
    fieldSpecificFit: 'The trace points the fit at the clerical risk, not the judgment: auto-totalling and totalling-error checks, digital script handling, and capturing scheme rulings in a shared note for consistency. The partial-credit valuation judgment stays firmly the examiner\'s — a student\'s future rides on it.',
    build: examValuation },
  { key: 'phd-scholar', label: 'A PhD scholar debugging a failing experiment', domain: 'Academia', region: 'India', emoji: '🔬',
    summary: 'Weeks debugging an experiment that fails for unknown reasons with a deadline looming, the messy real trail of failed runs in a notebook, and reformatting the paper per each venue.',
    behavioralContext: 'The capture marks the experiment-debugging grind as the core anguish (deadline + finite funding) and tags the lab notebook\'s messy reality as shadow knowledge only the clean version reaches. The result-is-it-real judgment is the science.',
    fieldSpecificFit: 'The trace points the fit at the plumbing, not the science: AI-assisted literature tracking, reference and multi-venue formatting automation, and better experiment/data logging. The experimental troubleshooting and result judgment stay the scholar\'s.',
    build: phdScholar },
  { key: 'research-supervisor', label: 'A professor between a grant deadline and scholar reviews', domain: 'Academia', region: 'India', emoji: '🎓',
    summary: 'A fundable proposal crafted against a deadline with stipends riding on it, bureaucratic fund-utilisation paperwork eating research time, and each scholar\'s strengths mapped privately.',
    behavioralContext: 'The capture marks grant-writing as the painful high-stakes scramble (funding + stipends at risk), tags the per-scholar mentoring map as shadow knowledge, and flags UC/fund admin as bureaucratic drag. The guidance and proposal judgment are the value.',
    fieldSpecificFit: 'The trace points the fit at the admin drag: streamlined grant-admin/UC workflows and AI-assisted proposal drafting/formatting, freeing time for guidance. The scholar-mentoring and research-direction judgment stay the supervisor\'s.',
    build: researchSupervisor },
  { key: 'naac-coordinator', label: 'An IQAC coordinator compiling the SSR', domain: 'Academia', region: 'Tamil Nadu', emoji: '🏅',
    summary: 'Relentlessly chasing dozens of faculty for data they keep differently and send late, then framing the college\'s real work to score well against how assessors read each metric.',
    behavioralContext: 'The capture marks cross-department data-chasing as the dreaded core and tags metric-framing know-how as shadow interpretive skill built over cycles. The honest-presentation judgment is real expertise; the chasing is avoidable friction.',
    fieldSpecificFit: 'The trace points the fit squarely at the collection bottleneck: a continuous data-capture system where departments log evidence year-round in NAAC format (ending the deadline chase) and auto-compiled criteria documents. The framing judgment stays the coordinator\'s.',
    build: naacCoordinator },
  { key: 'school-teacher', label: 'A school teacher in a report-card and register crunch', domain: 'Academia', region: 'India', emoji: '🍎',
    summary: 'Pitching to a 40+ mixed-ability class and spotting who is lost, the same marks copied into several registers and a portal, and each child\'s home situation carried personally.',
    behavioralContext: 'The capture marks the multi-register + portal duplicate entry as the painful clerical load and tags pastoral child-knowledge as shadow (a child quiet from home trouble). The mixed-ability classroom read is the protected teaching judgment.',
    fieldSpecificFit: 'The trace points the fit at the clerical duplication: one-entry marks/attendance that flows to registers, report cards and the portal (killing the copying), and auto-generated CCE descriptors as a draft. The classroom and pastoral judgment stay the teacher\'s.',
    build: schoolTeacher },
  { key: 'placement-officer', label: 'A placement officer running a campus drive', domain: 'Academia', region: 'Tamil Nadu', emoji: '🧑‍💼',
    summary: 'The company-relationship hustle the whole placement record depends on, herding students through drive logistics, and reconciling offers-vs-joins into the "percentage" for NAAC/NIRF.',
    behavioralContext: 'The capture marks company-relationship building as the painful core hustle and tags the placement-stat reconciliation as shadow definitional work feeding accreditation/rankings. The whom-to-nudge and relationship judgment are the value.',
    fieldSpecificFit: 'The trace points the fit at logistics + reporting: a placement portal handling eligibility-matching, drive scheduling and student comms, with auto-reconciled placement stats for NAAC/NIRF. The company relationships and student counselling stay the officer\'s.',
    build: placementOfficer },
  { key: 'admissions-counsellor', label: 'An admissions counsellor with an anxious family', domain: 'Academia', region: 'Tamil Nadu', emoji: '🎒',
    summary: 'Reading what the student wants vs parental pressure vs marks reality, on the ethical tightrope between honest guidance and pressure to fill seats, with real intent tracked privately.',
    behavioralContext: 'The capture marks the honest-guidance-vs-fill-seats tension as the painful ethical core and tags the per-enquiry intent tracker as shadow knowledge the admission system lacks. The student-reading and counselling are the irreducibly human part.',
    fieldSpecificFit: 'The trace points the fit at the lookup + follow-up, not the counselling: eligibility/cut-off/seat-matrix lookup and scholarship matching to speed the factual layer, plus an enquiry-tracking CRM. The course-guidance and ethical judgment stay the counsellor\'s — the human call that shouldn\'t be a sales funnel.',
    build: admissionsCounsellor },
];
