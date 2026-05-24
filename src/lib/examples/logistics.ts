// LOGISTICS — Chennai 3PL e-commerce warehouse picker
import { S, mk, type WorkedExample } from './_shared';

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
  { key: 'warehouse-picker', label: 'Picking an e-commerce order at a 3PL warehouse', domain: 'Logistics', region: 'Sriperumbudur, TN', emoji: '📦',
    summary: 'A peak-day picker with an RF scanner — 12 km of walking, ghost stock, tribal knowledge of where the bin actually is, and a rate target watched by the second.',
    behavioralContext: 'The capture marks the fastest exception-recovery as a shadow step — asking a senior picker who knows the real restock pattern — because the WMS exception flow is slower than tribal knowledge. The 12 km of walking comes from pick lists the WMS does not path-optimise, and ghost stock turns picking into a daily guessing game.',
    fieldSpecificFit: 'This is where automation genuinely fits — but on the system, not the picker: WMS path-optimised pick routes cut the walking the trace flags, and a live bin-accuracy / ghost-stock feed turns the tribal "where is it really" knowledge into shared data. Don\'t gamify the rate target harder; fix the routing and the stock truth.',
    build: warehousePicker },
];
