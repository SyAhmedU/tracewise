// RETAIL — kirana, petrol pump, mall fashion, jewellery, mobile shop, supermarket cashier
import { S, mk, type WorkedExample } from './_shared';

const kiranaStore = () => mk({
  role: 'Kirana store owner (neighbourhood grocery)',
  context: 'A single-family kirana in a Chennai residential lane; cash, UPI and credit (paavi/notebook); compete with Big Basket / Zepto',
  outputName: 'a customer served and the day-book balanced',
  officialVersion: 'Customer asks → fetch goods → bill on calculator → take payment → log if credit → restock at day end.',
  instanceAnchor: 'an evening regular doing the weekly grocery, last Sunday',
  trigger: 'A customer walks in or shouts an order from the doorway',
  steps: [
    S(1, { action: 'Take the order — verbal list, sometimes a phone screenshot', tool: 'Voice / phone', inputSource: 'A client / customer', timeMins: 3, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Regulars say "the usual" — I know what that is.' }),
    S(2, { action: 'Fetch each item across shelves and the back godown', tool: 'Hands + memory of shelf layout', timeMins: 8, frequency: 'many-times-a-day', frictionTags: ['movement', 'lookup'] }),
    S(3, { action: 'Weigh loose items (dal, atta, oil) on the electronic scale', tool: 'Digital scale', timeMins: 4, frequency: 'many-times-a-day' }),
    S(4, { action: 'Calculate the bill — sometimes on Vyapar app, sometimes on paper, sometimes in my head', tool: 'Vyapar / calculator / mental math', outputWhat: 'a total', timeMins: 3, frequency: 'many-times-a-day', needsJudgment: true, isShadow: true, notes: 'Vyapar takes too long for small bills; I switch based on bill size.' }),
    S(5, { action: 'Take payment — UPI QR, cash, or "write in the book"', tool: 'UPI QR + cash drawer + credit notebook', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Credit only for trusted families. The book is my judgment.' }),
    S(6, { action: 'Pack into a carry bag, sometimes deliver to upstairs flats myself', tool: 'Carry bags + lift', outputDestination: 'A client / customer', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(7, { action: 'Note items running low for tomorrow\'s order to the distributor', tool: 'Pencil + reorder slip', inputSource: 'My own notes', timeMins: 2, frequency: 'many-times-a-day', isShadow: true }),
    S(8, { action: 'Tally cash, UPI screenshots and the credit book at day end', tool: 'Cash drawer + UPI history + notebook', inputSource: 'My own notes', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Three sources, one number — and it has to match every night.' }),
    S(9, { action: 'WhatsApp distributor for tomorrow\'s order', tool: 'WhatsApp', outputDestination: 'Distributor', timeMins: 8, frequency: 'daily', frictionTags: ['chasing'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Distributor / wholesaler', what: 'morning replenishment delivery', typicalDelay: 'next morning' },
    { direction: 'wait-on', who: 'Credit customers', what: 'monthly settlement', typicalDelay: 'often runs 1–2 months' },
  ],
  exceptions: [
    { trigger: 'Online price war — Zepto undercutting on milk', whatYouDo: 'Match on essentials, hold margin on add-ons, lean on relationship value', howOften: 'continuously' },
    { trigger: 'Credit customer goes overdue past my limit', whatYouDo: 'Polite reminder via the husband / sometimes the son, stop further credit until cleared', howOften: 'few customers a year' },
  ],
});

const petrolPump = () => mk({
  role: 'Petrol pump cashier-attendant (shift in-charge)',
  context: 'A 4-nozzle HPCL / IOCL outlet on a Chennai arterial road; cash, card, UPI, fleet cards',
  outputName: 'a shift closed with cash, dip and meter readings reconciled',
  officialVersion: 'Opening totaliser → fill per customer → take payment → close totaliser → physical dip → reconcile cash + electronic vs sold litres → cash to bank deposit.',
  instanceAnchor: 'the morning rush shift last Friday',
  trigger: 'Shift handover happens at 6 AM — previous attendant gives keys',
  steps: [
    S(1, { action: 'Record opening totaliser reading for each nozzle in the daily sheet', tool: 'Nozzle totaliser + paper register', outputWhat: 'opening reading', timeMins: 10, frequency: 'daily', frictionTags: ['manual-transfer'] }),
    S(2, { action: 'Take the physical tank dip with the dip-rod, note the level', tool: 'Dip rod + chart', inputSource: 'A system / report', outputWhat: 'opening stock', timeMins: 15, frequency: 'daily', frictionTags: ['movement'], needsJudgment: true }),
    S(3, { action: 'Customer arrives — ask amount or full tank, ZERO display, dispense', tool: 'Dispenser + voice', inputSource: 'A client / customer', timeMins: 2, frequency: 'many-times-a-day' }),
    S(4, { action: 'Take payment — UPI scan, card swipe, cash, or fleet card', tool: 'UPI QR + EDC machine + cash bag', timeMins: 2, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'Card terminal flaky at peak — sometimes process twice by mistake.' }),
    S(5, { action: 'For company / fleet bills, write the slip with vehicle number and signature', tool: 'Slip book', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Handle "₹100 only" customer who really wants ₹103 — judge / refund', tool: 'Voice + petty cash', needsJudgment: true, frequency: 'many-times-a-day', notes: 'These small disputes are exhausting; I have a routine.' }),
    S(7, { action: 'At noon and shift end, take the dispenser reading + cash + card sum', tool: 'Totaliser + cash count + EDC report', inputSource: 'A system / report', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer', 'lookup'], isPainful: true, notes: 'Reading minus opening = sold litres; sold litres × price = expected money. Must match.' }),
    S(8, { action: 'If short, retrace — wrong-product fill, leak, fleet slip missing, denomination error', tool: 'Notebook + memory', inputSource: 'My own notes', timeMins: 20, frequency: 'daily', needsJudgment: true, isShadow: true, frictionTags: ['rework'], notes: 'Short = my pocket. Spend the time to find it.' }),
    S(9, { action: 'Hand over cash + reading + UPI / EDC printouts to the manager', tool: 'Cash bag + sheets', outputDestination: 'Outlet manager', timeMins: 10, frequency: 'daily', frictionTags: ['approval'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Outlet manager', what: 'cash collection and sign-off', typicalDelay: 'shift end' },
    { direction: 'hand-to', who: 'Next shift attendant', what: 'closing readings = their opening', typicalDelay: 'immediate' },
  ],
  exceptions: [
    { trigger: 'Wrong-product fill (petrol into a diesel vehicle)', whatYouDo: 'Stop pump, escalate to manager, customer cost-share negotiation, paperwork', howOften: 'a few times a year' },
    { trigger: 'Card terminal double-charges', whatYouDo: 'Print slip, return amount to customer in cash, raise dispute with bank', howOften: 'monthly' },
  ],
});

const mallFashion = () => mk({
  role: 'Floor sales associate (mall fashion brand)',
  context: 'A mid-tier fashion brand outlet in a Chennai mall; commission on monthly target',
  outputName: 'a customer billed and walking out with a bag',
  officialVersion: 'Greet → understand need → suggest → trial → close → POS → loyalty enrolment → exit greeting.',
  instanceAnchor: 'a Sunday afternoon customer who came in for a shirt and left with three',
  trigger: 'A customer walks in through the entry sensor',
  steps: [
    S(1, { action: 'Greet at door, read the customer — alone, family, hurried, browsing', tool: 'Voice + eyes', inputSource: 'A client / customer', timeMins: 2, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Pushy greeting = lost sale. The read is the skill.' }),
    S(2, { action: 'Ask the occasion / need, suggest 2–3 pieces from the right rack', tool: 'My memory of stock + voice', timeMins: 5, frequency: 'many-times-a-day', isShadow: true, notes: 'POS shows stock by SKU; I track new arrivals by what I personally hung up that morning.' }),
    S(3, { action: 'Walk customer to the trial room, hand pieces, suggest a size up / down', tool: 'Trial room', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(4, { action: 'Outside trial room — wait, judge mood when they come out', tool: 'Voice + mirror', frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true }),
    S(5, { action: 'Bring add-ons — belt, accessory, matching kurta — to bump basket size', tool: 'Hands + memory', timeMins: 4, frequency: 'many-times-a-day', needsJudgment: true, notes: 'My commission is on basket, not footfall.' }),
    S(6, { action: 'Close — read the cue ("how much?"), do not over-talk, walk to POS', tool: 'Voice', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Bad close kills good show. Quiet confidence.' }),
    S(7, { action: 'Bill on POS, push loyalty enrolment via OTP, offer the next-buy voucher', tool: 'POS + loyalty app', outputDestination: 'POS', timeMins: 4, frequency: 'many-times-a-day', frictionTags: ['wait'], notes: 'Loyalty target hits my dashboard too.' }),
    S(8, { action: 'Pack into branded carry bag, escort to door, suggest the new collection next week', tool: 'Carry bag + voice', outputDestination: 'A client / customer', timeMins: 2, frequency: 'many-times-a-day' }),
    S(9, { action: 'Log lost-sale reason in my own notebook — size out, price, style', tool: 'Personal pocket notebook', inputSource: 'My own notes', frequency: 'daily', isShadow: true, notes: 'Brand HQ asks for reasons in a weekly form — I copy from my notebook.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Stockroom assistant', what: 'a size from back', typicalDelay: 'minutes' },
    { direction: 'hand-to', who: 'Cashier (if separate)', what: 'customer + items to POS', typicalDelay: 'seconds' },
  ],
  exceptions: [
    { trigger: 'Size not in stock', whatYouDo: 'Suggest alternate cut, offer to ship from another store, take number to call when restocked', howOften: 'daily' },
    { trigger: 'Return / exchange dispute', whatYouDo: 'Apply policy, escalate to store manager if customer pushes, do not argue on floor', howOften: 'weekly' },
  ],
});

const jewelleryShop = () => mk({
  role: 'Sales executive (Tamil Nadu jewellery showroom)',
  context: 'A regional jewellery chain branch — 22k gold, diamond, silver; high-trust, family decision purchases',
  outputName: 'a jewellery sale closed and the bill raised',
  officialVersion: 'Welcome → understand occasion → tray viewing → trial → price quote (gold rate × weight + making + GST) → negotiation → exchange / new → POS → packing → exit puja.',
  instanceAnchor: 'a wedding shopping family from Tirunelveli last Saturday',
  trigger: 'A family enters the showroom, often with grandmother in tow',
  steps: [
    S(1, { action: 'Welcome with water, seat the family in the right counter section', tool: 'Voice + showroom layout', inputSource: 'A client / customer', timeMins: 4, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Decision-maker is rarely the loudest one — read the family first.' }),
    S(2, { action: 'Ask the occasion, budget range gently, weight preference, design family (antique / modern)', tool: 'Voice', timeMins: 5, frequency: 'many-times-a-day', needsJudgment: true }),
    S(3, { action: 'Pull 3–5 trays from the safe, lay out for viewing', tool: 'Trays + safe key', timeMins: 8, frequency: 'many-times-a-day', frictionTags: ['movement', 'lookup'] }),
    S(4, { action: 'Help trial — necklace fit, weight feel, mirror angle for the deciding aunt', tool: 'Mirror + clip', timeMins: 15, frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Quote on the weighing scale + tag — gold rate today × weight + making + stone + GST', tool: 'Tag + scale + calculator + day rate board', outputWhat: 'a final price', timeMins: 6, frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true, notes: 'Gold rate changes daily; making is negotiable; that is the song.' }),
    S(6, { action: 'Negotiate — making charge waiver, ear stud free, exchange of old gold', tool: 'Voice + manager nod', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Bound by manager limits, but I read how far I can stretch.' }),
    S(7, { action: 'For exchange — weigh and assay old gold, deduct wastage, agree net value', tool: 'Weighing scale + assay touchstone', timeMins: 20, frequency: 'few-times-a-week', needsJudgment: true, isShadow: true, notes: 'Assay sometimes calls in the master — judgment + trust between us.' }),
    S(8, { action: 'POS billing — Aadhaar / PAN above ₹2 lakh, GST, scheme / coupon, payment method', tool: 'POS + KYC scanner', timeMins: 12, frequency: 'many-times-a-day', frictionTags: ['manual-transfer', 'wait'] }),
    S(9, { action: 'Engrave / personalise if requested; agree pickup date', tool: 'Engraving counter + job slip', outputDestination: 'Workshop', frequency: 'few-times-a-week', frictionTags: ['wait'] }),
    S(10, { action: 'Pack in branded velvet box, photo with family if they wish, walk to exit', tool: 'Velvet box + camera', outputDestination: 'A client / customer', timeMins: 6, frequency: 'many-times-a-day' }),
    S(11, { action: 'Log in my own register — what the family bought, what they considered, their wedding date', tool: 'Personal register', inputSource: 'My own notes', timeMins: 5, frequency: 'daily', isShadow: true, notes: 'Helps me call them for upcoming muhurthams. CRM does not track this nuance.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Branch manager', what: 'discount approval beyond my limit', typicalDelay: 'minutes during browsing' },
    { direction: 'hand-to', who: 'Workshop', what: 'engraving / resize / repair job slip', typicalDelay: '2–7 days' },
  ],
  exceptions: [
    { trigger: 'Customer leaves without buying after long viewing', whatYouDo: 'Take number, send follow-up WhatsApp with photos that night, log in personal register', howOften: 'most days' },
    { trigger: 'Exchange dispute over wastage %', whatYouDo: 'Re-assay in front of customer, manager joins, settle within policy', howOften: 'weekly' },
  ],
});

const mobileShop = () => mk({
  role: 'Mobile phone shop owner-operator',
  context: 'A small smartphone + accessory shop on a Chennai high street; sells, repairs, takes EMI, deals in old exchange',
  outputName: 'a customer leaving with a working new or repaired phone',
  officialVersion: 'Walk-in → demo → quote → EMI / exchange / cash → activation → data transfer → bill → 7-day return guarantee.',
  instanceAnchor: 'a student upgrading to mid-range, exchange of old phone, last evening',
  trigger: 'Customer walks in asking to see phones in a price range',
  steps: [
    S(1, { action: 'Ask budget, brand preference, primary use (camera, gaming, family elder)', tool: 'Voice', inputSource: 'A client / customer', timeMins: 4, frequency: 'many-times-a-day', needsJudgment: true }),
    S(2, { action: 'Pull 2–3 phones for demo, explain real difference (not the spec sheet)', tool: 'Demo handsets', timeMins: 10, frequency: 'many-times-a-day', needsJudgment: true, isShadow: true, notes: 'I keep a mental map of which phones genuinely beat which at each price point — never on a sticker.' }),
    S(3, { action: 'Quote — sticker price, plus exchange estimate, plus EMI option (Bajaj / HDFC card)', tool: 'Calculator + EMI app + my own exchange chart', inputSource: 'My own notes', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true }),
    S(4, { action: 'Inspect old phone for exchange — screen, battery health, scratches', tool: 'My eyes + diagnostic app', timeMins: 8, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Underquote = lost sale; overquote = my loss when reselling.' }),
    S(5, { action: 'Apply for Bajaj / HDFC EMI on customer\'s phone OTP', tool: 'Bajaj merchant app + customer phone', timeMins: 12, frequency: 'few-times-a-week', frictionTags: ['wait'], notes: 'OTP delay is daily pain — sometimes 3 attempts.' }),
    S(6, { action: 'Pull new phone from drawer, unbox in front of customer, IMEI tally with box', tool: 'Stock drawer + IMEI scanner', timeMins: 5, frequency: 'many-times-a-day', frictionTags: ['lookup'] }),
    S(7, { action: 'Set up — SIM transfer, Google login, WhatsApp transfer from old to new, install basics', tool: 'Cables + SIM tools + transfer app', timeMins: 25, frequency: 'many-times-a-day', frictionTags: ['wait'], needsJudgment: true, isPainful: true, notes: 'WhatsApp transfer is the longest step — and the most cherished by the customer.' }),
    S(8, { action: 'Apply screen guard + back cover (free with most sales)', tool: 'Screen guard + cover', timeMins: 8, frequency: 'many-times-a-day' }),
    S(9, { action: 'Bill on POS / billing app, GST invoice, EMI papers signed', tool: 'Vyapar + EMI papers', outputDestination: 'A client / customer', timeMins: 6, frequency: 'many-times-a-day' }),
    S(10, { action: 'Log old exchange phone for resale, decide repair vs flip vs scrap', tool: 'Old-stock notebook', inputSource: 'My own notes', frequency: 'few-times-a-week', isShadow: true, needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'EMI bank server', what: 'EMI approval OTP', typicalDelay: 'minutes' },
    { direction: 'hand-to', who: 'Repair technician (back room)', what: 'units to be repaired or refurbished', typicalDelay: '1–3 days' },
  ],
  exceptions: [
    { trigger: 'EMI declined for customer', whatYouDo: 'Offer alternate bank, downsell to lower model, or save customer info for next time', howOften: 'daily' },
    { trigger: 'Customer returns within 7 days claiming defect', whatYouDo: 'Test in front of them, if real issue escalate to brand service, otherwise polite no', howOften: 'weekly' },
  ],
});

const supermarketCashier = () => mk({
  role: 'Supermarket cashier (modern trade outlet)',
  context: 'A Nilgiris / Reliance Fresh / DMart-style cashier counter at a Chennai branch',
  outputName: 'a customer billed and out the door with their trolley',
  officialVersion: 'Scan → totalise → loyalty → tender → bag → exit greeting; lane drawer reconciled at end of shift.',
  instanceAnchor: 'a Sunday evening rush with full trolleys',
  trigger: 'A customer rolls a trolley onto my belt',
  steps: [
    S(1, { action: 'Greet, start scanning items off the belt', tool: 'POS + barcode scanner', inputSource: 'A client / customer', timeMins: 5, frequency: 'many-times-a-day' }),
    S(2, { action: 'Weigh and key in PLU for loose veg / fruit that has no barcode', tool: 'Counter scale + PLU sheet', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['lookup'], needsJudgment: true, notes: 'PLU sheet is laminated — but I know top 30 by heart.' }),
    S(3, { action: 'Handle the "no barcode" / "this was on offer" objection mid-scan', tool: 'Voice + price-check intercom', frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'], notes: 'Either call a floor associate to check or do it off the shelf in my head.' }),
    S(4, { action: 'Ask for loyalty number, apply offers and coupons', tool: 'POS loyalty screen', timeMins: 2, frequency: 'many-times-a-day' }),
    S(5, { action: 'Take payment — UPI scan, card swipe, cash; handle change', tool: 'POS + UPI QR + EDC + cash drawer', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(6, { action: 'Pack into branded bags or customer\'s own bag', tool: 'Carry bag', outputDestination: 'A client / customer', timeMins: 3, frequency: 'many-times-a-day' }),
    S(7, { action: 'Print bill, staple sticker on bag, exit greeting', tool: 'POS printer', timeMins: 1, frequency: 'many-times-a-day' }),
    S(8, { action: 'Quick scan of the next customer\'s trolley to set expectation', tool: 'Eyes', frequency: 'many-times-a-day', isShadow: true, needsJudgment: true, notes: 'Pre-judge tender type and total — speeds the next billing.' }),
    S(9, { action: 'EOD drawer reconciliation + EDC settlement + UPI tally', tool: 'POS report + drawer count', timeMins: 25, frequency: 'daily', frictionTags: ['manual-transfer'], isPainful: true, notes: 'Short or over = hold the shift, find it before I leave.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Floor associate', what: 'price check / replacement on a flagged item', typicalDelay: '1–3 min — feels longer with a queue' },
    { direction: 'hand-to', who: 'Cash office', what: 'reconciled drawer at EOD', typicalDelay: 'shift end' },
  ],
  exceptions: [
    { trigger: 'POS hangs mid-bill', whatYouDo: 'Hold queue, call IT helpdesk, switch to manual bill book for the next 4–5 customers', howOften: 'weekly' },
    { trigger: 'Cash short at EOD', whatYouDo: 'Recount, replay top transactions in head, escalate to supervisor; difference docked over week', howOften: 'monthly' },
  ],
});

export const RETAIL: WorkedExample[] = [
  { key: 'kirana-store', label: 'A day at the neighbourhood kirana', domain: 'Retail', region: 'Chennai, TN', emoji: '🏪',
    summary: 'A kirana owner between Vyapar, a credit notebook and a UPI QR — three sources of truth that have to add up every night.', build: kiranaStore },
  { key: 'petrol-pump', label: 'Closing a petrol pump shift', domain: 'Retail', region: 'Chennai, TN', emoji: '⛽',
    summary: 'A pump attendant between totaliser readings, dip rods, card terminals and a cash bag — short = own pocket, so the reconciliation is sacred.', build: petrolPump },
  { key: 'mall-fashion', label: 'Mall fashion floor — Sunday rush', domain: 'Retail', region: 'India urban', emoji: '👕',
    summary: 'A sales associate reading customers, suggesting add-ons, racing a basket-size commission target and logging lost-sale reasons in a personal notebook.', build: mallFashion },
  { key: 'jewellery-shop', label: 'TN jewellery showroom — a wedding family', domain: 'Retail', region: 'Tamil Nadu', emoji: '💍',
    summary: 'A jewellery executive between trays, assay touchstone, daily gold rate, exchange wastage and a personal register of family wedding dates.', build: jewelleryShop },
  { key: 'mobile-shop', label: 'Selling a smartphone with exchange + EMI', domain: 'Retail', region: 'Chennai, TN', emoji: '📱',
    summary: 'A high-street mobile shop owner doing exchange valuation, Bajaj EMI OTP dance, and the longest step of all — the WhatsApp transfer from old phone to new.', build: mobileShop },
  { key: 'supermarket-cashier', label: 'Modern-trade cashier at Sunday peak', domain: 'Retail', region: 'India urban', emoji: '🛒',
    summary: 'A cashier scanning, weighing, applying loyalty and bagging — short drawer at EOD = stay back till it adds up.', build: supermarketCashier },
];
