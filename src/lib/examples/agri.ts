// AGRICULTURE — Erode rice mill paddy batch, Madurai jasmine wholesale
import { S, mk, type WorkedExample } from './_shared';

const riceMillBatch = () => mk({
  role: 'Rice mill operations supervisor',
  context: 'A 4 ton/hr parboiled rice mill in the Erode / Tiruchengode belt; sources paddy from local farmers and brokers, sells to FCI, government PDS and the open market',
  outputName: 'a paddy batch processed and bagged for despatch',
  officialVersion: 'Receive paddy → weigh → moisture and grade check → soak → parboil → dry → de-husk → polish → grade → bag → store / despatch, all with batch-wise records.',
  instanceAnchor: 'a 12-ton ADT-39 paddy lot from a Bhavani-area farmer, processed last Tuesday',
  trigger: 'A lorry arrives at the mill gate with paddy and the broker’s slip',
  steps: [
    S(1, { action: 'Direct the lorry to the weighbridge and record gross weight', tool: 'Weighbridge + register', inputWhat: 'arrived lorry', inputSource: 'A client / customer', outputWhat: 'a gross weight record', timeMins: 10, frequency: 'daily', frictionTags: ['wait'], notes: 'If two lorries arrive together, one waits — single weighbridge.' }),
    S(2, { action: 'Sample paddy from multiple bag points and check moisture with the meter', tool: 'Paddy moisture meter + sampling spike', inputWhat: 'representative sample', outputWhat: 'a moisture reading', timeMins: 12, frequency: 'daily', needsJudgment: true, notes: 'Sampling skill matters — a bad sample changes the rate by a rupee or two a kg.' }),
    S(3, { action: 'Assess variety, broken percentage, foreign matter; agree a deduction or rate cut with the farmer / broker', tool: 'Visual + my own grade chart', inputWhat: 'sample', inputSource: 'My own notes', outputWhat: 'an agreed rate', timeMins: 20, frequency: 'daily', isShadow: true, needsJudgment: true, isPainful: true, notes: 'I keep a personal book of typical deductions per variety per season — never written in the mill register.' }),
    S(4, { action: 'Direct unloading at the drying yard; if moisture > 14% schedule for sun-drying first', tool: 'Tarpaulin yard + labour', inputWhat: 'graded paddy', outputWhat: 'paddy at drying yard', outputDestination: 'drying yard', timeMins: 60, frequency: 'daily', frictionTags: ['movement', 'wait'] }),
    S(5, { action: 'Re-weigh empty lorry and settle payment terms', tool: 'Weighbridge + cash / cheque', inputWhat: 'tare weight', outputWhat: 'a net weight + payment', outputDestination: 'Farmer / broker', timeMins: 15, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Once moisture is right, feed paddy into pre-cleaner → soaking tank → parboiling vessel', tool: 'Pre-cleaner + soaking + parboiling line', inputWhat: 'dried paddy', outputWhat: 'parboiled paddy', timeMins: 240, frequency: 'daily', frictionTags: ['wait'], needsJudgment: true, notes: 'Soaking time changes with variety and season — judgement from years of doing it.' }),
    S(7, { action: 'Mechanical or sun drying to bring it back to mill-safe moisture', tool: 'Dryer / sun yard', inputWhat: 'parboiled paddy', outputWhat: 'milling-ready paddy', timeMins: 360, frequency: 'daily', frictionTags: ['wait', 'movement'] }),
    S(8, { action: 'De-husk in the sheller, polish in the polisher, separate broken on the grader', tool: 'Sheller + polisher + grader', inputWhat: 'dry paddy', outputWhat: 'graded rice + by-products (husk, bran, brokens)', timeMins: 180, frequency: 'daily', frictionTags: ['rework'], needsJudgment: true, notes: 'Operator must adjust polish to keep brokens down — too aggressive ruins yield.' }),
    S(9, { action: 'Watch the polish percentage and total milling yield; if yield is off, stop and re-set', tool: 'Yield calculation + my mental benchmark', inputWhat: 'output vs input', inputSource: 'My own notes', outputWhat: 'a corrected setting', timeMins: 25, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'There is no SCADA — I do this by feel and rough Excel.' }),
    S(10, { action: 'Bag the rice — 25 / 50 kg bags as per buyer; hand-sew or stitch-close', tool: 'Bagging machine + stitching machine + labour', inputWhat: 'milled rice', outputWhat: 'bagged rice', timeMins: 90, frequency: 'daily', frictionTags: ['movement'] }),
    S(11, { action: 'Move bags to godown stack; mark lot number and date on the stack', tool: 'Trolley + chalk', inputWhat: 'bags', outputWhat: 'stacked, identified lot', outputDestination: 'Godown', timeMins: 45, frequency: 'daily', frictionTags: ['movement', 'manual-transfer'] }),
    S(12, { action: 'Update the daily mill register and message totals to the owner', tool: 'Paper register + WhatsApp', inputWhat: 'shift totals', inputSource: 'My own notes', outputWhat: 'a closed shift', outputDestination: 'Mill owner', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'TANGEDCO (power supply)', what: 'uninterrupted power for the milling run', typicalDelay: 'unscheduled cuts most weeks; generator covers short ones' },
    { direction: 'wait-on', who: 'Labour gang leader', what: 'unloading and bagging crew availability', typicalDelay: 'usually morning, sometimes late' },
    { direction: 'hand-to', who: 'Transport contractor', what: 'bagged rice loaded for FCI / open market despatch', typicalDelay: 'next day' },
  ],
  exceptions: [
    { trigger: 'Paddy arrives soaked from rain', whatYouDo: 'Refuse, or accept at a big rate cut and double drying time — judgement based on relationship with the farmer', howOften: 'most weeks in monsoon' },
    { trigger: 'Power cut mid-parboil', whatYouDo: 'Switch to generator if short, otherwise extend cycle and re-plan the day’s output', howOften: 'two or three times a week' },
    { trigger: 'Yield comes in below my mental benchmark', whatYouDo: 'Stop, inspect rubber rolls and polisher, adjust and re-run a small lot', howOften: 'a few times a month' },
  ],
});

const jasmineWholesale = () => mk({
  role: 'Jasmine wholesale commission agent (Madurai Malli)',
  context: 'A wholesale flower stall at the Madurai Mattuthavani regulated flower market; deals in GI-tagged Madurai Malli; trades cash, hand-written ledger, opens at 3 AM',
  outputName: "a day's flower trade settled and farmers paid",
  officialVersion: 'Farmer brings flowers → market weighing → wholesale auction / negotiation → retailers pick up → commission deducted → farmer paid; commission as per the market by-laws.',
  instanceAnchor: 'the festival-week trade last Friday before Aadi (heavy demand day)',
  trigger: 'Farmers arrive at the stall from 3 AM with the night-picked flower baskets',
  steps: [
    S(1, { action: 'Open the stall, lay out tarpaulin, prepare the spring scale and the day ledger', tool: 'Stall, tarpaulin, spring balance, ledger', inputWhat: 'day starts', outputWhat: 'an opened stall', timeMins: 20, frequency: 'daily' }),
    S(2, { action: 'Receive farmers as they arrive, weigh each lot, record kg against the farmer’s name', tool: 'Spring balance + ledger', inputWhat: 'farmer baskets', inputSource: 'A client / customer', outputWhat: 'a weighed lot per farmer', timeMins: 60, frequency: 'daily', frictionTags: ['wait'], notes: 'In peak season I can have 30 farmers in two hours — the queue itself becomes the bottleneck.' }),
    S(3, { action: 'Assess freshness, bud size and the variety mix; that decides the morning rate', tool: 'Visual + my hand', inputWhat: 'each lot', inputSource: 'My own notes', outputWhat: 'a grade per lot', timeMins: 30, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'No instrument — it is pure eye and touch, built up over years.' }),
    S(4, { action: 'Set the day’s wholesale rate based on supply at the market, festival calendar, weather and what other agents are calling out', tool: 'Voice + WhatsApp group with other agents', inputWhat: "today's supply + demand signal", inputSource: 'My own notes', outputWhat: 'a working rate range', timeMins: 25, frequency: 'daily', isShadow: true, needsJudgment: true, isPainful: true, notes: 'There is a WhatsApp group of senior agents — that is where the real rate forms, not the market notice board.' }),
    S(5, { action: 'Open the call-out auction / direct negotiation as retailers arrive', tool: 'Voice + cash', inputWhat: 'flowers + retailers', inputSource: 'A client / customer', outputWhat: 'sold lots at a settled price', outputDestination: 'Retailers', timeMins: 120, frequency: 'daily', needsJudgment: true, notes: 'I read each retailer — temple buyer pays differently from wedding decorator from string-maker.' }),
    S(6, { action: 'Bundle and pack sold lots in palm-leaf baskets or plastic crates for the retailer to carry', tool: 'Palm leaf baskets / crates + labour', inputWhat: 'sold lots', outputWhat: 'packed flowers', outputDestination: 'Retailer’s carrier', timeMins: 30, frequency: 'daily', frictionTags: ['movement'] }),
    S(7, { action: 'Collect cash, mark paid against each retailer; allow credit only for trusted regulars', tool: 'Cash + ledger', inputWhat: 'sale + cash', outputWhat: 'a paid (or credited) entry', timeMins: 25, frequency: 'daily', needsJudgment: true, isShadow: true, notes: 'My private credit list — never shared with anyone, including my own son.' }),
    S(8, { action: 'Compute each farmer’s due — kg sold × price − my commission; pay in cash, get thumb-impression on the ledger', tool: 'Calculator + ledger + cash', inputWhat: 'day register', inputSource: 'My own notes', outputWhat: 'farmer payments + acknowledgements', outputDestination: 'Farmer', timeMins: 60, frequency: 'daily', frictionTags: ['manual-transfer', 'wait'], isPainful: true, notes: 'All on paper. A mistake here becomes a relationship problem tomorrow.' }),
    S(9, { action: 'Note unsold flowers, decide whether to push them at a cut rate to string-makers or write them off', tool: 'Eye + voice', inputWhat: 'leftover stock', outputWhat: 'a clearance decision', timeMins: 15, frequency: 'daily', needsJudgment: true, notes: 'Flowers do not last past noon — every minute of indecision is value lost.' }),
    S(10, { action: 'Close the day’s ledger — totals in, totals out, commission earned; tally cash drawer', tool: 'Ledger + cash count', inputWhat: 'the day', inputSource: 'My own notes', outputWhat: 'a closed day-book', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Farmers', what: 'fresh flower lots delivered by 5 AM', typicalDelay: 'first hours of the day' },
    { direction: 'hand-to', who: 'Retailers (temples, decorators, string-makers)', what: 'packed lots at settled price', typicalDelay: 'continuous through the morning' },
  ],
  exceptions: [
    { trigger: 'Rain overnight — supply collapses, prices triple', whatYouDo: 'Ration to regulars first, let walk-ins pay the spot premium, manage farmer expectations on payouts', howOften: 'monsoon weeks' },
    { trigger: 'Trusted retailer fails to pay credit on time', whatYouDo: 'Stop further credit, send a low-key reminder, escalate only if it crosses a threshold I hold in my head', howOften: 'a few retailers a year' },
    { trigger: 'Market officer dispute over weighing accuracy', whatYouDo: 'Switch to the market scale, document the difference, settle the lot under protest', howOften: 'occasional' },
  ],
});

export const AGRI: WorkedExample[] = [
  { key: 'rice-mill-batch', label: 'Processing a paddy batch at a rice mill', domain: 'Agriculture', region: 'Erode, TN', emoji: '🌾',
    summary: 'A mill supervisor from weighbridge to godown — moisture meter, grade by eye, monsoon-soaked paddy, power cuts mid-parboil, and a yield benchmark held entirely in their head.',
    behavioralContext: 'The trace tags grading-by-eye and the personal per-variety deduction book as a shadow judgment step never written in the mill register, and the yield-by-feel monitoring as judgment done without any SCADA. These are decades of tacit skill, not gaps to digitise away — and the rate cut they drive is a farmer-relationship matter.',
    fieldSpecificFit: 'Don\'t automate the grade or the deduction call — that\'s the relationship and the skill. Add instrumentation where the capture shows blind spots: a simple yield/moisture log (replacing the rough Excel and mental benchmark) so drift is visible, and power-cut-aware scheduling. The eye and the handshake stay the supervisor\'s.',
    build: riceMillBatch },
  { key: 'jasmine-wholesale', label: 'A morning of Madurai jasmine wholesale', domain: 'Agriculture', region: 'Madurai, TN', emoji: '🌼',
    summary: 'A Mattuthavani commission agent from 3 AM — spring balance, grade by hand, a WhatsApp group of senior agents that sets the real rate, and a paper ledger that becomes a relationship problem when wrong.',
    behavioralContext: 'The capture shows the day\'s real rate forming in a WhatsApp group of senior agents — a shadow step, not the market board — and the private credit list the agent will not share even with his son. Grading by hand and reading each retailer are judgment. The paper farmer-payout is painful precisely because an arithmetic error becomes tomorrow\'s broken trust.',
    fieldSpecificFit: 'The fit is the paper payout the trace flags painful: a simple kg × rate − commission calculator with a thumb-impression receipt removes the error that costs a relationship — without touching the rate-setting, grading or credit judgment, which are the agent\'s social capital. The WhatsApp price discovery stays where it is.',
    build: jasmineWholesale },
];
