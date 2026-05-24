// FOOD PREP — street food vendor, dosa cart, sweet shop
import { S, mk, type WorkedExample } from './_shared';

const streetFoodVendor = () => mk({
  role: 'Pani-puri / chaat cart vendor (Chennai evening)',
  context: 'Evening cart at a residential park entrance; 5–8 PM peak; one assistant',
  outputName: 'a plate of pani-puri served to a customer',
  officialVersion: 'Set up cart → prep water, masala, puris → take order → assemble → serve → settle UPI / cash → wind up.',
  instanceAnchor: 'a typical Saturday evening cluster',
  trigger: 'First evening walkers gather around the cart',
  steps: [
    S(1, { action: 'Wheel cart to spot, set up, light the LED, fill water cans, lay out katoris', tool: 'Cart + LED + cans', timeMins: 25, frequency: 'daily', frictionTags: ['movement'] }),
    S(2, { action: 'Prep pudina water, tamarind water, ragda, chopped onion / sev', tool: 'Knives + jugs + bowls', timeMins: 20, frequency: 'daily', needsJudgment: true, notes: 'Today\'s mint water is yesterday\'s leftover decision — judgment kept in head.' }),
    S(3, { action: 'Take order — number of plates, spice level (less / medium / extra)', tool: 'Voice', inputSource: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Crack puri, stuff with ragda / onion / sev, dip in water, hand over', tool: 'Hands + ladle', outputDestination: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day' }),
    S(5, { action: 'Keep loose count of how many plates per customer (no POS)', tool: 'Mental tally', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Trust system — disputes cost a plate-extra; rare.' }),
    S(6, { action: 'Take payment — UPI QR sticker or cash', tool: 'UPI QR + cash pouch', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(7, { action: 'Refill puris from box, top water jug, manage queue', tool: 'Storage boxes', frequency: 'many-times-a-day', frictionTags: ['movement', 'chasing'] }),
    S(8, { action: 'Wind up — empty water, wipe cart, count cash + UPI screenshots', tool: 'Cloth + phone', inputSource: 'My own notes', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(9, { action: 'Note tomorrow\'s shopping list — masala low, onion 2 kg, etc.', tool: 'Pocket notebook', inputSource: 'My own notes', timeMins: 5, frequency: 'daily', isShadow: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Wholesale market', what: 'morning fresh stock', typicalDelay: 'daily morning' },
    { direction: 'wait-on', who: 'Mint / coriander vendor', what: 'evening top-up if stock low', typicalDelay: 'minutes — neighbouring stall' },
  ],
  exceptions: [
    { trigger: 'Sudden rain at peak', whatYouDo: 'Throw tarp, hold puris dry, refund water-soaked plates, close early if it persists', howOften: 'monsoon weeks' },
    { trigger: 'Municipal inspector arrives', whatYouDo: 'Show licence if asked, move cart 10 feet if no licence, lose 20 min', howOften: 'monthly' },
  ],
});

const dosaCart = () => mk({
  role: 'Dosa-stall cook-owner (morning shift)',
  context: 'A small dosa + idli stall on a Chennai lane corner, opens 6 AM, closes by 11 AM',
  outputName: 'a hot dosa or idli plate served to a customer',
  officialVersion: 'Batter prepped previous night → tawa hot at 6 AM → take order → pour → serve with chutney + sambar → take cash / UPI.',
  instanceAnchor: 'a weekday morning rush around 8 AM',
  trigger: 'Stall opens — first customers (mostly office-goers) start arriving',
  steps: [
    S(1, { action: 'Open stall, heat tawa, light second stove for sambar, lay out chutney pots', tool: 'Tawa + stove + pots', timeMins: 15, frequency: 'daily' }),
    S(2, { action: 'Take order verbally — plain / masala / podi / onion, with / without ghee', tool: 'Voice', inputSource: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Regulars: I know "anna usual" without asking.' }),
    S(3, { action: 'Pour batter, spread, time the flip, judge crisp', tool: 'Ladle + spatula', timeMins: 2, frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Add filling if masala / onion / cheese; fold; transfer to plate', tool: 'Spatula + plate', timeMins: 1, frequency: 'many-times-a-day' }),
    S(5, { action: 'Ladle sambar + 2 chutneys; pass plate to customer or assistant', tool: 'Ladle', outputDestination: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day' }),
    S(6, { action: 'Take payment — UPI scan, cash; mental tally for groups', tool: 'UPI + cash', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true }),
    S(7, { action: 'Keep stoking sambar, replenish chutney, watch batter level', tool: 'Eyes + ladle', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(8, { action: 'Wind down — wash tawa, empty stove, count cash + UPI, list tomorrow\'s prep', tool: 'Cloth + phone + notebook', inputSource: 'My own notes', timeMins: 30, frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Helper (batter preparer)', what: 'fermented batter from night before', typicalDelay: 'previous night' },
    { direction: 'wait-on', who: 'Vegetable vendor', what: 'morning onion / chilli stock', typicalDelay: 'morning' },
  ],
  exceptions: [
    { trigger: 'Batter under-fermented (cold night)', whatYouDo: 'Add curd, mix, adjust heat; sell as "soft dosa" honestly', howOften: 'winter mornings' },
    { trigger: 'Gas runs out mid-rush', whatYouDo: 'Call cylinder vendor for emergency swap; switch to idli-only for 20 min', howOften: 'monthly' },
  ],
});

const sweetShop = () => mk({
  role: 'Counter-sales staff (TN sweet shop / Adyar Ananda Bhavan-style)',
  context: 'A branded sweets + savouries shop in Chennai; festival peaks (Diwali, Pongal); also doing online / pickup orders',
  outputName: 'a customer\'s sweet box billed and packed',
  officialVersion: 'Greet → weigh per request → POS bill → packing per item type → pickup or delivery handover; loyalty + GST as applicable.',
  instanceAnchor: 'a Diwali-eve evening — customer ordering a 2 kg box gift assortment',
  trigger: 'Customer points to trays in the counter or hands over a written list',
  steps: [
    S(1, { action: 'Greet, take the order — which sweets, which savouries, how much each', tool: 'Voice + counter trays', inputSource: 'A client / customer', timeMins: 5, frequency: 'many-times-a-day', needsJudgment: true, notes: 'For gift box: I suggest mix to balance halwa vs barfi vs murukku.' }),
    S(2, { action: 'Weigh each item on the digital scale, transfer to tray', tool: 'Digital scale + serving spoons', timeMins: 8, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(3, { action: 'Bill at POS — code per item, weight, GST', tool: 'POS + barcode / SKU', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(4, { action: 'Pack per type — paper boxes for halwa, plastic for chips, branded box for gift', tool: 'Boxes + tape + wrap', outputDestination: 'A client / customer', timeMins: 10, frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Diwali peak: queue behind, packing takes longest — biggest stressor.' }),
    S(5, { action: 'Handle online order pickup — Swiggy / Zomato / shop app — match to bay', tool: 'Tablet + bay shelf', inputSource: 'A system / report', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['lookup', 'wait'], isShadow: true, notes: 'Online and counter orders share the same tray — I track which is which in my head.' }),
    S(6, { action: 'Take payment — cash, UPI, card, gift voucher', tool: 'POS + UPI + EDC', timeMins: 3, frequency: 'many-times-a-day' }),
    S(7, { action: 'Hand over with thank-you sticker, exit greeting', tool: 'Carry bag', outputDestination: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day' }),
    S(8, { action: 'Note low-stock items to call out to backroom / kitchen for refill', tool: 'Voice + intercom', outputDestination: 'Backroom', frequency: 'many-times-a-day', isShadow: true, notes: 'POS does not refresh stock fast enough at festival — eye-based replenishment.' }),
    S(9, { action: 'EOD: tally counter takings vs POS report, hand over to manager', tool: 'POS + cash count', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Kitchen / production', what: 'fresh tray refill on a sold-out item', typicalDelay: '20–40 min' },
    { direction: 'hand-to', who: 'Delivery rider (Swiggy / Zomato / brand)', what: 'packed online order at the bay', typicalDelay: 'minutes' },
  ],
  exceptions: [
    { trigger: 'Customer disputes weight at checkout', whatYouDo: 'Re-weigh in front of them, apply tare adjustment if box weight not deducted', howOften: 'weekly' },
    { trigger: 'Counter stock-out of a Diwali bestseller', whatYouDo: 'Suggest alternative, offer to call when restocked and hold; refund if pre-paid', howOften: 'Diwali week' },
  ],
});

export const FOOD: WorkedExample[] = [
  { key: 'street-food-vendor', label: 'An evening pani-puri cart', domain: 'Food prep', region: 'Chennai, TN', emoji: '🍢',
    summary: 'A cart vendor running a trust-system mental tally — UPI sticker, mint water that is yesterday\'s judgment, and a tarp for the monsoon evening.', build: streetFoodVendor },
  { key: 'dosa-cart', label: 'A dosa stall at the morning rush', domain: 'Food prep', region: 'Chennai, TN', emoji: '🥞',
    summary: 'A stall cook on the tawa from 6 AM — order by voice, "anna usual" for regulars, batter judgment when the night was cold.', build: dosaCart },
  { key: 'sweet-shop', label: 'TN sweet shop on Diwali eve', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🍬',
    summary: 'Counter staff balancing online pickups, gift-box assortments and a queue — packing is the bottleneck, eye-based stock the only signal.', build: sweetShop },
];
