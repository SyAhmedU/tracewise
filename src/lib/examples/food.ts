// FOOD PREP — street food vendor, dosa cart, sweet shop
import { S, mk, type WorkedExample } from './_shared';

const messCook = () => mk({
  role: 'Military-hotel / mess cook-owner (TN non-veg mess)',
  context: 'A small "military hotel" doing biryani, parotta, kari dosai, fish; lunch peak; limited day-stock cooked fresh, sells out by design',
  outputName: 'a day\'s mess meals cooked + sold out',
  officialVersion: 'Plan the day\'s dishes → buy meat + veg → cook in batches → sell through lunch + dinner → close when sold out.',
  instanceAnchor: 'a Sunday lunch rush, the biggest day of the week',
  trigger: 'Open the mess; first lunch crowd builds by 12',
  steps: [
    S(1, { action: 'Decide the day\'s quantity per dish from the day + weather + feel', tool: 'Experience', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'How much mutton vs chicken vs fish to cook is a daily gamble — cook short and lose sales, cook over and waste perishable meat.' }),
    S(2, { action: 'Buy fresh meat + vegetables in the morning', tool: 'Market', timeMins: 60, frequency: 'daily', frictionTags: ['movement', 'chasing'] }),
    S(3, { action: 'Cook gravies + biryani in big batches; hold quality across the batch', tool: 'Cauldrons + dum', timeMins: 180, frequency: 'daily', needsJudgment: true }),
    S(4, { action: 'Judge spice + salt by taste for the whole vessel', tool: 'Palate', frequency: 'daily', needsJudgment: true }),
    S(5, { action: 'Serve the lunch rush — plate, parcel, manage the crowd', tool: 'Counter + helpers', outputDestination: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['wait'], isPainful: true, notes: 'The 1–2 PM crush — orders, parcels + dine-in at once with limited hands — is the daily pressure spike.' }),
    S(6, { action: 'Take cash / UPI; keep a loose count of plates sold', tool: 'Cash + UPI', frequency: 'many-times-a-day' }),
    S(7, { action: 'Track what sold out first + leftover, to tune tomorrow\'s quantity', tool: 'Memory + notebook', inputSource: 'My own notes', frequency: 'daily', isShadow: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Meat + fish supplier', what: 'fresh morning stock', typicalDelay: 'daily morning' },
    { direction: 'wait-on', who: 'Parotta master', what: 'parotta supply at peak', typicalDelay: 'continuous at lunch' },
  ],
  exceptions: [
    { trigger: 'A dish sells out at peak', whatYouDo: 'Push the alternatives, promise it tomorrow, lose some customers', howOften: 'most days' },
    { trigger: 'Slow day, cooked too much', whatYouDo: 'Discount evening, parcel for staff, absorb the meat loss', howOften: 'weekly' },
  ],
});

const muttonButcher = () => mk({
  role: 'Mutton-stall butcher (retail meat)',
  context: 'A roadside mutton / chicken stall; live + fresh-cut; festival + Sunday peaks; whole-carcass economics',
  outputName: 'a customer\'s meat cut, weighed + sold',
  officialVersion: 'Buy carcass / birds → display → cut to customer ask → weigh → price → take payment.',
  instanceAnchor: 'a Sunday morning queue with everyone wanting the good cuts',
  trigger: 'Customer asks for a quantity + cut',
  steps: [
    S(1, { action: 'Buy the day\'s carcass / live birds; judge quality + price', tool: 'Supplier', inputSource: 'Another team', timeMins: 30, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Cut to the customer\'s ask — curry cut, boneless, liver, with/without fat', tool: 'Cleaver + block', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Each customer wants specific bone/meat/fat ratio — reading + cutting to it is the craft + the loyalty.' }),
    S(3, { action: 'Balance whole-carcass sale so prime + less-wanted cuts both move', tool: 'Mental balancing', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Everyone wants the prime cut; getting the whole carcass sold (bones, fat, offal too) before it spoils is the daily margin worry.' }),
    S(4, { action: 'Weigh, price per kg, adjust for the cut', tool: 'Scale', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(5, { action: 'Take cash / UPI; mark regulars\' occasional credit', tool: 'Cash + UPI', frequency: 'many-times-a-day', isShadow: true }),
    S(6, { action: 'Manage the queue + freshness through the day', tool: 'Display + ice', frequency: 'many-times-a-day', frictionTags: ['chasing', 'movement'] }),
    S(7, { action: 'End-of-day: clear remaining stock, tally, plan tomorrow\'s buy', tool: 'Memory + cash', inputSource: 'My own notes', frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Carcass / livestock supplier', what: 'fresh stock + price', typicalDelay: 'daily dawn' },
    { direction: 'hand-to', who: 'Restaurants / mess (bulk)', what: 'standing bulk orders', typicalDelay: 'morning' },
  ],
  exceptions: [
    { trigger: 'Only prime cuts wanted, bones pile up', whatYouDo: 'Bundle bones cheap, sell to mess / dog-feed buyers, protect margin', howOften: 'daily' },
    { trigger: 'Festival demand spike', whatYouDo: 'Buy extra, pre-take orders, manage a long queue + price rise', howOften: 'festivals' },
  ],
});

const biryaniShop = () => mk({
  role: 'Biryani shop owner (dum + parcel + online)',
  context: 'A specialist biryani shop; dine-in + heavy parcel + Swiggy/Zomato; sells by the "pot" — finite dum batches per day',
  outputName: 'a biryani order served / parcelled',
  officialVersion: 'Prep + layer → dum-cook pots → take orders (counter / parcel / app) → serve from the pot → settle → cook next pot.',
  instanceAnchor: 'a weekend dinner when a pot runs low with orders still coming',
  trigger: 'Orders arrive across counter, phone + apps',
  steps: [
    S(1, { action: 'Marinate + layer; set dum pots on a timed schedule', tool: 'Pots + dum', timeMins: 90, frequency: 'daily', needsJudgment: true }),
    S(2, { action: 'Judge how many pots to cook for the day\'s expected demand', tool: 'Experience', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'Biryani can\'t be made instantly — guessing the day\'s pots right is the core call; a sold-out pot means turning away money.' }),
    S(3, { action: 'Take orders across counter, phone + app tablets', tool: 'Counter + phone + tablets', inputSource: 'A system / report', frequency: 'many-times-a-day', frictionTags: ['lookup'], notes: 'Three order streams drawing from the same finite pot — I allocate in my head who gets served from what\'s left.' }),
    S(4, { action: 'Serve to order — portion rice + meat fairly from the pot', tool: 'Ladle + plate', outputDestination: 'A client / customer', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Manage the pot-running-low moment against pending orders', tool: 'Judgment', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'When a pot empties with parcels + app orders queued, deciding who waits for the next pot vs who to refund is the stress point.' }),
    S(6, { action: 'Pack parcels, hand app orders to riders', tool: 'Boxes', outputDestination: 'Delivery rider', frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'] }),
    S(7, { action: 'Settle payments; note pots sold + sell-out time to tune tomorrow', tool: 'UPI + notebook', inputSource: 'My own notes', frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Aggregator riders', what: 'parcel pickup', typicalDelay: 'minutes' },
    { direction: 'wait-on', who: 'Meat + rice supplier', what: 'daily fresh stock', typicalDelay: 'morning' },
  ],
  exceptions: [
    { trigger: 'Pot sells out with orders pending', whatYouDo: 'Pause app, give next-pot ETA, refund app orders that can\'t wait', howOften: 'weekends' },
    { trigger: 'App order spike vs counter queue', whatYouDo: 'Throttle app, protect dine-in + standing parcel customers', howOften: 'daily' },
  ],
});

const jigarthandaStall = () => mk({
  role: 'Juice / jigarthanda stall operator',
  context: 'A cold-drinks + fresh-juice + jigarthanda stall near a college / market; summer + evening peaks; perishable fruit + milk',
  outputName: 'a fresh juice / jigarthanda served',
  officialVersion: 'Prep fruit + base → take order → blend / assemble → serve → take payment → manage stock + ice.',
  instanceAnchor: 'a hot summer evening rush',
  trigger: 'Customers gather in the evening heat',
  steps: [
    S(1, { action: 'Prep — cut fruit, make jigarthanda base, set syrups + ice', tool: 'Knives + jars', timeMins: 40, frequency: 'daily', frictionTags: ['movement'] }),
    S(2, { action: 'Take order — juice type, sugar level, ice, add-ons', tool: 'Voice', inputSource: 'A client / customer', frequency: 'many-times-a-day', needsJudgment: true }),
    S(3, { action: 'Blend / assemble to taste; judge ripeness + sweetness balance', tool: 'Mixer + hands', frequency: 'many-times-a-day', needsJudgment: true, notes: 'Adjusting sugar to the fruit\'s natural ripeness so it tastes right — a per-batch palate call.' }),
    S(4, { action: 'Serve + take cash / UPI', tool: 'Glass + UPI', outputDestination: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(5, { action: 'Judge how much perishable fruit to stock vs spoilage', tool: 'Experience', isShadow: true, frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'Cut fruit + milk spoil fast in the heat; stocking to demand without same-day waste is the constant perishable gamble.' }),
    S(6, { action: 'Keep ice + cold stock going through the peak', tool: 'Ice box', frequency: 'many-times-a-day', frictionTags: ['movement', 'chasing'] }),
    S(7, { action: 'Wind up — clean, discard spoilables, tally, plan tomorrow\'s fruit', tool: 'Cloth + notebook', inputSource: 'My own notes', frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Fruit + milk supplier', what: 'fresh daily stock', typicalDelay: 'morning' },
    { direction: 'wait-on', who: 'Ice supplier', what: 'ice through the day', typicalDelay: 'as needed' },
  ],
  exceptions: [
    { trigger: 'Sudden rain kills the evening crowd', whatYouDo: 'Cut losses, refrigerate what keeps, discard cut fruit', howOften: 'monsoon' },
    { trigger: 'Power cut stops the mixer / fridge', whatYouDo: 'Switch to non-blended items, ice down stock, wait it out', howOften: 'summer' },
  ],
});

const chaiKadai = () => mk({
  role: 'Tea-shop owner (roadside chai kadai)',
  context: 'A roadside tea + snacks shop near a bus stand; opens 5 AM; bus crowd + daily regulars, many on credit',
  outputName: 'a glass of tea served and settled',
  officialVersion: 'Boil decoction → take order → pour + mix → serve snack → take cash / UPI → settle at end of day.',
  instanceAnchor: 'a 7–9 AM bus-stand rush on a weekday',
  trigger: 'Bus pulls in / a regular walks up and nods',
  steps: [
    S(1, { action: 'Light stove, boil milk + decoction, set out bun, biscuit, vada', tool: 'Stove + kettle', timeMins: 30, frequency: 'daily' }),
    S(2, { action: 'Take order — strong / light / less-sugar; regulars get "usual" unsaid', tool: 'Voice', inputSource: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Each regular has a remembered sugar/strength — never written.' }),
    S(3, { action: 'Pour, pull tea between tumblers for froth, serve with snack', tool: 'Tumbler + filter', outputDestination: 'A client / customer', timeMins: 1, frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Mark a regular\'s tea on the kadan (credit) page — who owes what', tool: 'Credit notebook', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Auto-driver pays Saturday, mechanic on the 1st — who gets credit is a trust call, not a rule.' }),
    S(5, { action: 'Take cash / UPI from walk-ins; make change from a tin', tool: 'Cash tin + UPI QR', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(6, { action: 'Keep decoction topped, wash tumblers, refill snack tray', tool: 'Hands', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(7, { action: 'EOD: tot cash + UPI, reconcile against kadan page, chase old credit gently', tool: 'Notebook + phone', inputSource: 'My own notes', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer', 'chasing'], isPainful: true, notes: 'The credit follow-up is the part I dread — it strains the very relationship that brings them daily.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Milk supplier', what: 'morning milk cans', typicalDelay: 'before 5 AM' },
    { direction: 'wait-on', who: 'Bakery van', what: 'bun / rusk delivery', typicalDelay: 'alternate mornings' },
  ],
  exceptions: [
    { trigger: 'A long-credit regular goes quiet / stops coming', whatYouDo: 'Absorb the loss, mention it once if I see them, never push hard', howOften: 'monthly' },
    { trigger: 'Milk turns in summer heat', whatYouDo: 'Switch to black tea, send boy for emergency packet milk', howOften: 'summer weeks' },
  ],
});

const tiffinCentre = () => mk({
  role: 'Home-tiffin centre owner (idli / dosa / parcel)',
  context: 'A house-front tiffin kitchen; counter walk-ins + WhatsApp parcel orders + a few Swiggy orders; 6–10 AM, 6–9 PM',
  outputName: 'a tiffin parcel packed and handed over',
  officialVersion: 'Batter + sides prepped → take counter / WhatsApp / app order → cook → pack → hand to customer or rider → settle.',
  instanceAnchor: 'a weekday 8 AM with parcels and counter overlapping',
  trigger: 'Counter customer arrives or a WhatsApp order pings',
  steps: [
    S(1, { action: 'Steam idli, keep dosa batter ready, make sambar + 2 chutneys', tool: 'Steamer + tawa', timeMins: 45, frequency: 'daily' }),
    S(2, { action: 'Read WhatsApp orders, mentally merge with counter queue and app tickets', tool: 'WhatsApp + phone', inputSource: 'A client / customer', timeMins: 2, frequency: 'many-times-a-day', frictionTags: ['lookup'], isShadow: true, needsJudgment: true, notes: 'Three channels, one stove — I sequence them in my head by who is waiting + travel time.' }),
    S(3, { action: 'Cook to order — count idlis, pour dosas, judge done-ness', tool: 'Tawa + steamer', timeMins: 4, frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Pack — banana leaf / box / foil; label parcel for who', tool: 'Boxes + foil', outputDestination: 'A client / customer', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(5, { action: 'Hand to counter customer, or stage app/WhatsApp parcels for pickup', tool: 'Hands', outputDestination: 'Delivery rider', frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'], isPainful: true, notes: 'Rider arrives before food is ready, or food goes cold before rider comes — the timing mismatch is the daily stress.' }),
    S(6, { action: 'Take payment — UPI for WhatsApp, app settles later, cash at counter', tool: 'UPI + app dashboard', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(7, { action: 'Note who reordered, what sold out, tomorrow\'s extra batter need', tool: 'Notebook', inputSource: 'My own notes', timeMins: 10, frequency: 'daily', isShadow: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Swiggy rider', what: 'pickup of staged parcels', typicalDelay: '5–15 min, unpredictable' },
    { direction: 'hand-to', who: 'Regular WhatsApp customers', what: 'parcel + UPI request', typicalDelay: 'minutes' },
  ],
  exceptions: [
    { trigger: 'App order spike clashes with counter rush', whatYouDo: 'Pause accepting app orders from the dashboard, clear counter first', howOften: 'weekly' },
    { trigger: 'Batter runs short before close', whatYouDo: 'Switch remaining orders to idli / uttapam, message WhatsApp regulars early', howOften: 'few times a week' },
  ],
});

const cloudKitchen = () => mk({
  role: 'Cloud-kitchen operator (Swiggy / Zomato-only, multi-brand)',
  context: 'A delivery-only kitchen running 3 virtual brands off one menu; no dine-in; tablets per platform',
  outputName: 'an online food order cooked, packed and dispatched',
  officialVersion: 'Order drops on platform tablet → accept → cook → pack with brand sticker → mark ready → hand to assigned rider.',
  instanceAnchor: 'a Friday 9 PM dinner peak across all three brands',
  trigger: 'A new order chimes on one of the platform tablets',
  steps: [
    S(1, { action: 'Accept order on the right tablet, read items + customizations', tool: 'Swiggy + Zomato tablets', inputSource: 'A system / report', timeMins: 1, frequency: 'many-times-a-day', frictionTags: ['lookup'], notes: 'Three tablets + three brand names for one kitchen — eyes ping-pong between them.' }),
    S(2, { action: 'Mentally batch overlapping items across brands to cook together', tool: 'Mental sequencing', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Two brands share a gravy base — I cook once, plate twice; no system knows this.' }),
    S(3, { action: 'Cook to ticket, judge spice / portion per customization note', tool: 'Range + kadai', timeMins: 8, frequency: 'many-times-a-day', needsJudgment: true }),
    S(4, { action: 'Pack — leak-proof box, brand sticker, cutlery, seal sticker', tool: 'Packaging + stickers', outputDestination: 'A client / customer', timeMins: 3, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(5, { action: 'Mark ready; match the waiting rider to the right order + brand', tool: 'Tablet + order slip', outputDestination: 'Delivery rider', frequency: 'many-times-a-day', frictionTags: ['wait', 'chasing'], isPainful: true, notes: 'Rider-late or wrong-rider pickups hit my prep-time rating, which I cannot control but get penalised for.' }),
    S(6, { action: 'Watch prep-time clock + reject/accept toggle to protect rating', tool: 'Platform dashboard', frequency: 'many-times-a-day', needsJudgment: true, frictionTags: ['approval'] }),
    S(7, { action: 'EOD: reconcile platform payouts vs orders, flag missing / refunded', tool: 'Partner app + sheet', inputSource: 'A system / report', timeMins: 30, frequency: 'daily', frictionTags: ['manual-transfer', 'rework'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Aggregator rider', what: 'order pickup within prep window', typicalDelay: '2–12 min' },
    { direction: 'wait-on', who: 'Platform support', what: 'refund / penalty dispute resolution', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Item out of stock mid-peak', whatYouDo: 'Mark unavailable on all three tablets fast before more orders land', howOften: 'daily' },
    { trigger: 'Customer reports missing item → auto-refund', whatYouDo: 'Dispute with packing photo if I have one; usually eat the loss', howOften: 'weekly' },
  ],
});

const bakery = () => mk({
  role: 'Neighbourhood bakery counter + custom-cake taker',
  context: 'A local bakery selling bread, puffs, buns plus made-to-order birthday cakes; counter + phone orders',
  outputName: 'a custom birthday cake made and handed to the customer',
  officialVersion: 'Take cake order (flavour, weight, message, date) → bake base → decorate → store chilled → hand over on pickup with payment.',
  instanceAnchor: 'a Saturday pickup for an evening birthday, ordered two days prior',
  trigger: 'Customer comes to counter / calls to order a cake for a date',
  steps: [
    S(1, { action: 'Take order — flavour, weight, egg/eggless, message, photo print, date/time', tool: 'Order book + phone', inputSource: 'A client / customer', timeMins: 6, frequency: 'few-times-a-week', frictionTags: ['lookup'], needsJudgment: true, notes: 'Eggless + "not too sweet" + a regional spelling on the message — details that go wrong if mis-heard.' }),
    S(2, { action: 'Jot the order + advance on a slip, slot it into the day\'s bake plan in my head', tool: 'Slip + memory', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'No calendar — pickup times for the day live as a remembered sequence.' }),
    S(3, { action: 'Bake sponge, cool, prep cream / fondant', tool: 'Oven + mixer', timeMins: 90, frequency: 'daily' }),
    S(4, { action: 'Decorate to brief — piping, message, photo print, theme', tool: 'Piping + edible print', timeMins: 40, frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'Match the customer\'s mental picture from a vague phone description — the redo risk is highest here.' }),
    S(5, { action: 'Box, chill, label with name + pickup time', tool: 'Box + fridge', timeMins: 5, frequency: 'few-times-a-week', frictionTags: ['movement'] }),
    S(6, { action: 'On pickup: show cake for approval, settle balance, pack with candles', tool: 'Counter + UPI', outputDestination: 'A client / customer', timeMins: 6, frequency: 'few-times-a-week', frictionTags: ['wait'] }),
    S(7, { action: 'Run the regular counter sale of bread / puffs alongside all this', tool: 'POS / cash', frequency: 'many-times-a-day' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Edible-print shop', what: 'photo print on icing sheet', typicalDelay: 'same day if ordered early' },
    { direction: 'wait-on', who: 'Ingredient supplier', what: 'cream / fondant restock', typicalDelay: 'weekly' },
  ],
  exceptions: [
    { trigger: 'Customer wants design change at pickup', whatYouDo: 'Do quick on-the-spot fixes; bigger changes need 30 min and they wait', howOften: 'weekly' },
    { trigger: 'Two cakes due same hour', whatYouDo: 'Start the harder one earlier, call one customer to shift pickup 30 min', howOften: 'weekends' },
  ],
});

const cateringCook = () => mk({
  role: 'Function-catering cook-contractor (samayal master)',
  context: 'A small catering outfit cooking on-site for functions of 150–400; team of helpers; rented vessels + gas',
  outputName: 'a full meal cooked and served on time for a function',
  officialVersion: 'Confirm headcount + menu → procure → set up on-site → cook in sequence → serve in time with the event → wind up vessels.',
  instanceAnchor: 'a 250-guest wedding lunch with a fixed muhurtham serving time',
  trigger: 'Function date locked; final headcount + menu confirmed a day before',
  steps: [
    S(1, { action: 'Estimate quantities per dish from headcount using remembered ratios', tool: 'Mental ratios', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Rice/sambar/sweet per 100 heads is decades of feel — over-cook = loss, under-cook = disgrace.' }),
    S(2, { action: 'Buy vegetables, provisions, order vessels + gas, assign helpers', tool: 'Market + phone', timeMins: 180, frequency: 'few-times-a-week', frictionTags: ['movement', 'chasing'] }),
    S(3, { action: 'Set up temporary stoves + vessels on-site at dawn', tool: 'Gas + cauldrons', timeMins: 90, frequency: 'few-times-a-week', frictionTags: ['movement'] }),
    S(4, { action: 'Cook in sequence so everything peaks at the serving hour', tool: 'Cauldrons + ladles', timeMins: 240, frequency: 'few-times-a-week', needsJudgment: true, isPainful: true, notes: 'The serving time is fixed by the muhurtham — backward-timing every dish to land hot at once is the whole game, all in the head.' }),
    S(5, { action: 'Taste + adjust salt / spice across batches for consistency', tool: 'Palate', frequency: 'few-times-a-week', needsJudgment: true }),
    S(6, { action: 'Coordinate serving line with the host\'s banana-leaf servers', tool: 'Voice', outputDestination: 'Another team', frequency: 'few-times-a-week', frictionTags: ['wait', 'chasing'] }),
    S(7, { action: 'Wind up — count + return rented vessels, settle helper wages, tally cost vs quote', tool: 'Cash + memory', inputSource: 'My own notes', timeMins: 60, frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Vessel-rental supplier', what: 'cauldrons + serving vessels on time', typicalDelay: 'morning of' },
    { direction: 'hand-to', who: 'Host\'s serving team', what: 'cooked dishes to the serving line', typicalDelay: 'at muhurtham' },
  ],
  exceptions: [
    { trigger: 'Guest count jumps on the day', whatYouDo: 'Stretch with extra rasam / rice, send helper for emergency provisions', howOften: 'most functions' },
    { trigger: 'Gas cylinder empties mid-cook', whatYouDo: 'Keep a spare always; swap in 5 min; never let the cauldron cool', howOften: 'monthly' },
  ],
});

const fishVendor = () => mk({
  role: 'Fish vendor (harbour-buy, market-sell)',
  context: 'Buys at the morning landing auction (Kasimedu-style), sells through the day at a wet-market slab; ice + weighing scale',
  outputName: 'fish bought at auction and sold to a customer',
  officialVersion: 'Buy at landing auction → ice + transport to slab → clean / cut to order → weigh + sell → end-of-day clear stock.',
  instanceAnchor: 'a weekday from the 5 AM auction to a midday slab sale',
  trigger: 'Boats land at dawn; auction starts',
  steps: [
    S(1, { action: 'Judge the catch — freshness, size, likely day-demand — and bid at auction', tool: 'Eye + voice bid', inputSource: 'Another team', timeMins: 40, frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'Buy price is a gamble on a price I cannot see yet — over-bid and the day is a loss; the single riskiest call.' }),
    S(2, { action: 'Ice the lot, load auto, haul to the market slab', tool: 'Ice + auto', timeMins: 45, frequency: 'daily', frictionTags: ['movement'] }),
    S(3, { action: 'Set price per kg by species + freshness, adjust through the day', tool: 'Mental pricing', isShadow: true, frequency: 'many-times-a-day', needsJudgment: true, notes: 'Price drops as the day ages + stock stays — a live markdown curve held in the head.' }),
    S(4, { action: 'Clean, gut, cut to customer\'s ask (curry cut / fry slice)', tool: 'Knife + board', timeMins: 4, frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Weigh, bargain, take cash / UPI', tool: 'Scale + cash + UPI', outputDestination: 'A client / customer', timeMins: 2, frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(6, { action: 'Keep stock iced; push slow-moving species with a discount call', tool: 'Ice + voice', frequency: 'many-times-a-day', frictionTags: ['chasing'] }),
    S(7, { action: 'EOD: clear remaining stock cheap or to dry-fish maker; tally buy vs sell', tool: 'Cash + memory', inputSource: 'My own notes', timeMins: 20, frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Boat owners / auctioneer', what: 'the morning catch + auction', typicalDelay: 'dawn, weather-dependent' },
    { direction: 'hand-to', who: 'Dry-fish maker', what: 'unsold stock at day end', typicalDelay: 'evening' },
  ],
  exceptions: [
    { trigger: 'Rough sea — no catch / sky-high prices', whatYouDo: 'Buy little or skip, sell yesterday\'s iced stock, take the slow day', howOften: 'monsoon / ban season' },
    { trigger: 'Unsold fish near spoilage', whatYouDo: 'Deep discount last hour, divert to dry-fish, absorb the loss', howOften: 'weekly' },
  ],
});

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
    S(4, { action: 'Pack per type — paper boxes for halwa, plastic for chips, branded box for gift', tool: 'Boxes + tape + wrap', outputDestination: 'A client / customer', timeMins: 10, frequency: 'many-times-a-day', frictionTags: ['movement'], isPainful: true, notes: 'Diwali peak: queue behind, packing takes longest — biggest stressor. A throughput bottleneck, not a judgment call.' }),
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
  { key: 'chai-kadai', label: 'A roadside tea shop at bus-stand rush', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🫖',
    summary: 'A chai kadai running on remembered "usuals" and a hand-written kadan (credit) book — where the dreaded step is chasing old credit, not making tea.',
    behavioralContext: 'The capture tags the credit notebook as both shadow and judgment, and marks the end-of-day credit chase as the single painful step. Who gets kadan and how hard you ask is the relationship that brings them back daily — a collections app that auto-nags would burn exactly that trust.',
    fieldSpecificFit: 'Leave the brewing and the "usual" alone — those judgment steps are the regulars\' loyalty. Touch only the friction the trace names: a dead-simple ledger that records each kadan entry by voice and shows a gentle weekly total, so the dreaded chase becomes a glance, not a confrontation.',
    build: chaiKadai },
  { key: 'tiffin-centre', label: 'A home tiffin centre juggling three order channels', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🍱',
    summary: 'Idli-dosa parcels off one stove with counter, WhatsApp and Swiggy all live at once — the stress is rider/food timing, not cooking.',
    behavioralContext: 'The trace flags channel-merging as a shadow + judgment step and pins the painful point at rider–food timing. The owner already sequences three queues in their head by who-is-waiting and travel time; a system that just dumps tickets without that timing sense would make it worse.',
    fieldSpecificFit: 'Do not automate the cooking. Aim at the timing seam the capture marks painful: one screen that merges the three channels into a single time-ordered queue with rider-ETA, so parcels are cooked to arrival instead of going cold or keeping a rider idle. The stove stays the cook\'s.',
    build: tiffinCentre },
  { key: 'cloud-kitchen', label: 'A delivery-only multi-brand cloud kitchen at peak', domain: 'Food prep', region: 'India urban', emoji: '🛵',
    summary: 'Three virtual brands off one kitchen, eyes ping-ponging across platform tablets — penalised for rider lateness it cannot control.',
    behavioralContext: 'The capture marks cross-brand batching as a shadow step (one gravy, two brands — no system knows) and the painful step as rating damage from rider lateness the operator cannot control. Optimising prep without fixing the penalty structure just shifts blame onto the kitchen.',
    fieldSpecificFit: 'The real fit the trace points to is upstream of cooking: a single consolidated ticket-board across all platforms that recognises shared sub-recipes, plus packing-photo capture to win the refund disputes flagged as rework. The cooking judgment and the platform rating fight are left where they sit.',
    build: cloudKitchen },
  { key: 'bakery', label: 'A neighbourhood bakery taking a custom cake order', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🎂',
    summary: 'Birthday cakes to a vague phone brief, pickup times remembered not written — the redo risk lives in decoration, not baking.',
    behavioralContext: 'The trace tags the order-slot memory as a shadow step and decoration as the painful one: matching a customer\'s mental picture from a vague description is where rework happens. The risk is mis-heard detail, not throughput.',
    fieldSpecificFit: 'The capture points the tool at intake, not the oven: a simple order form that pins down flavour/eggless/spelling/photo and a reference image at the counter, with pickups on a shared day-timeline. It kills the mis-hear and the remembered-schedule risk; the piping stays the baker\'s hand.',
    build: bakery },
  { key: 'catering-cook', label: 'A catering master cooking a 250-guest wedding lunch', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🍲',
    summary: 'Quantities from decades-old per-100 ratios, every dish backward-timed in the head to peak at the muhurtham hour.',
    behavioralContext: 'The capture tags both quantity-estimation and the cook-sequencing as shadow + judgment, with the timed cook as the painful step. The per-100 feel and backward-timing are the master\'s craft — a rigid recipe app would strip the on-the-day adjustment that absorbs headcount surprises.',
    fieldSpecificFit: 'Respect the cooking judgment entirely. The trace only justifies a planning aid: a procurement + quantity calculator off headcount and menu, and a backward-timed prep schedule the master can override — turning the riskiest mental maths into a checkable draft. The cauldron stays analog.',
    build: cateringCook },
  { key: 'fish-vendor', label: 'A fish vendor from dawn auction to the market slab', domain: 'Food prep', region: 'Chennai, TN', emoji: '🐟',
    summary: 'Bidding at the landing auction on a sell-price you cannot yet see, then a live markdown curve held in the head all day.',
    behavioralContext: 'The capture marks the auction bid as the painful step (a gamble on an unseen price) and the through-day pricing as a shadow judgment. Both are reads of freshness and demand that no feed replaces — automating the price would ignore the species-by-species, hour-by-hour feel that prevents spoilage loss.',
    fieldSpecificFit: 'The fit the trace supports is information, not control: a shared landing-price + wholesale-rate feed to make the dawn bid less blind, and a simple end-of-day buy-vs-sell tally to learn the markdown curve. The cutting, bargaining and freshness call stay with the vendor.',
    build: fishVendor },
  { key: 'street-food-vendor', label: 'An evening pani-puri cart', domain: 'Food prep', region: 'Chennai, TN', emoji: '🍢',
    summary: 'A cart vendor running a trust-system mental tally — UPI sticker, mint water that is yesterday\'s judgment, and a tarp for the monsoon evening.',
    behavioralContext: 'The mental plate-tally is a trust contract with regulars — the capture shows it tagged as a shadow step precisely because slotting a POS between vendor and customer would slow the queue and signal distrust. "An extra plate on a dispute, rarely" is cheaper than that friction.',
    fieldSpecificFit: 'Nothing at the cart itself. The only steps the trace marks as friction are the day-end cash + UPI-screenshot count and the pocket-notebook reorder list — fold those into one voice-note that tots takings and texts the morning order to the mint vendor. Leave the serving flow analog.',
    build: streetFoodVendor },
  { key: 'dosa-cart', label: 'A dosa stall at the morning rush', domain: 'Food prep', region: 'Chennai, TN', emoji: '🥞',
    summary: 'A stall cook on the tawa from 6 AM — order by voice, "anna usual" for regulars, batter judgment when the night was cold.',
    behavioralContext: 'Every rush step the trace records is hands-on the tawa with a needs-judgment flag — the flip-timing where quality lives. A device needing a glance or tap steals exactly that attention, and "anna usual" is relationship memory, not a field to fill.',
    fieldSpecificFit: 'Do not touch the rush. The capture only surfaces two friction points worth a tool — the cold-night batter gamble (a ferment-time nudge) and the morning veg top-up (a recurring WhatsApp order). The pour, flip and tally stay where the judgment tags say they belong: in the cook\'s hands.',
    build: dosaCart },
  { key: 'sweet-shop', label: 'TN sweet shop on Diwali eve', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🍬',
    summary: 'Counter staff balancing online pickups, gift-box assortments and a queue — packing is the bottleneck, eye-based stock the only signal.',
    behavioralContext: 'The trace pins the single painful step at packing, not billing — and tags eye-based replenishment as a shadow step because the POS lags reality at festival peak. The staff\'s eye beats the system here, so asking them to update stock mid-rush would only widen the lag.',
    fieldSpecificFit: 'Aim at the step the capture marked painful: a festival-mode packing station (pre-folded boxes, a parallel packer) and a kitchen-facing live-stock screen fed by counter weigh-outs, retiring the eye-based guess without making the counter type. The bill flow the trace shows as smooth is left alone.',
    build: sweetShop },
  { key: 'mess-cook', label: 'A military-hotel cook-owner on Sunday lunch', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🍛',
    summary: 'A small non-veg mess cooking a finite day-batch of biryani + gravies — sells out by design, where today\'s quantity is yesterday\'s gamble.',
    behavioralContext: 'The capture tags the morning quantity-call as both shadow and judgment, and pins the painful step at the 1–2 PM crush. How much mutton vs chicken vs fish to cook is a decades-old read of weather, day-of-week and regulars — a system that flattens that into an "average" would lose the customers who came for the dish that\'s sold out.',
    fieldSpecificFit: 'Leave the cauldron, the palate call and the rush alone — those judgment tags are the mess itself. The trace only justifies a planning aid: a simple end-of-day log of sold-out times + leftovers per dish that turns the morning gamble into a checkable pattern, and a parcel-counter helper to take pressure off the peak. The cook keeps the override.',
    build: messCook },
  { key: 'mutton-butcher', label: 'A mutton-stall butcher on a Sunday queue', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🥩',
    summary: 'A roadside meat stall balancing whole-carcass economics against a queue that all wants the prime cut — the worry is what doesn\'t sell, not what does.',
    behavioralContext: 'The trace marks the cut-to-ask as a judgment step (every customer\'s bone/meat/fat ratio is the loyalty) and pins the painful step at whole-carcass balancing — selling the bones, fat and offal before they spoil. A system that just tracks SKUs would miss that the daily margin lives in moving the unwanted cuts.',
    fieldSpecificFit: 'The cleaver and the regulars\' preferences stay analog — those are the craft. The capture aims the tool at the seams the friction tags name: a standing-bulk-order list for the mess + restaurant pickups, a simple weight-vs-price tally to spot the daily carcass-yield gap, and a kadan note for regulars\' running credit. The cut itself is left alone.',
    build: muttonButcher },
  { key: 'biryani-shop', label: 'A biryani shop with a pot running low at peak', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🍚',
    summary: 'A dum-pot shop allocating finite biryani across counter, parcel and three aggregator apps — the stress is who waits, not how to cook.',
    behavioralContext: 'The capture tags the three-stream order-merging as a shadow step (counter + phone + tablets all draw from the same pot in the owner\'s head) and the pot-running-low moment as the single painful one — refunds vs dine-in goodwill vs app ratings, all judged on the fly. A naive queue-merger would refund the wrong customer.',
    fieldSpecificFit: 'Do not touch the dum or the portioning judgment. Aim at the seam the trace names painful: one unified ticket-board that shows live pot-stock vs all three channels at once, with a pause-this-app button so the owner can protect dine-in or standing parcels deliberately. The "how many pots today" call stays the owner\'s daily read.',
    build: biryaniShop },
  { key: 'jigarthanda-stall', label: 'A jigarthanda + juice stall on a hot evening', domain: 'Food prep', region: 'Tamil Nadu', emoji: '🥤',
    summary: 'A cold-drinks cart racing perishable fruit + milk against the evening heat — the worry is spoilage, not service.',
    behavioralContext: 'The trace tags the sugar-to-ripeness call as a per-batch judgment step and pins the painful one at perishable stocking — cut fruit and milk spoil within hours in summer. A rigid stocking app working off averages would either run dry by 7 PM or compost half the morning prep.',
    fieldSpecificFit: 'The blend, the palate and the heat itself stay with the operator. The capture only points to a small spoilage-log nudge: a weekly tally of fruit bought vs sold vs discarded that turns the daily gamble into a visible pattern, plus a weather-aware morning-buy hint for monsoon evenings flagged in the exceptions. The cart stays as it is.',
    build: jigarthandaStall },
];
