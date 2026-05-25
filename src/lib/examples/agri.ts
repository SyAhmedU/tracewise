// AGRICULTURE — Erode rice mill paddy batch, Madurai jasmine wholesale
import { S, mk, type WorkedExample } from './_shared';

const dairyFarmer = () => mk({
  role: 'Smallholder dairy farmer (milk to co-op society)',
  context: 'A 4–6 cattle household dairy supplying a village milk co-op (Aavin-style) twice daily; fat/SNF-based payment',
  outputName: 'a can of milk poured + recorded at the society',
  officialVersion: 'Milk cattle → carry to society → machine tests fat/SNF → quantity recorded → fortnightly payment → manage feed + health.',
  instanceAnchor: 'a 6 AM pouring at the society collection point',
  trigger: 'Pre-dawn milking time / society collection window opens',
  steps: [
    S(1, { action: 'Milk the cattle by hand / machine, strain into cans', tool: 'Hands + can', timeMins: 45, frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(2, { action: 'Judge each animal\'s health + yield drop, decide feed / vet need', tool: 'Eye + experience', frequency: 'daily', needsJudgment: true, notes: 'A dip in yield or off-feed animal is caught by daily familiarity — the herd read that protects the income.' }),
    S(3, { action: 'Carry cans to the society before the window closes', tool: 'Cycle / walk', timeMins: 15, frequency: 'many-times-a-day', frictionTags: ['movement', 'wait'] }),
    S(4, { action: 'Wait in the pouring queue; milk tested for fat / SNF', tool: 'Society analyser', inputSource: 'Another team', frequency: 'many-times-a-day', frictionTags: ['wait', 'approval'], isPainful: true, notes: 'The fat/SNF reading sets my price and I can\'t verify the machine — a low reading I can\'t contest is the quiet grievance.' }),
    S(5, { action: 'Quantity + test recorded against my member number', tool: 'Society register / app', outputDestination: 'A system / report', frequency: 'many-times-a-day', frictionTags: ['manual-transfer'] }),
    S(6, { action: 'Track my own pouring + expected payment in a notebook', tool: 'Pocket notebook', isShadow: true, frequency: 'daily', needsJudgment: true, notes: 'My private tally to cross-check the fortnightly society payment — I don\'t fully trust the slip.' }),
    S(7, { action: 'Buy / mix feed, manage fodder, schedule AI / vet visits', tool: 'Feed + phone', frequency: 'daily', needsJudgment: true, frictionTags: ['chasing'] }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Milk co-op society', what: 'milk cans for testing + collection', typicalDelay: 'twice daily window' },
    { direction: 'wait-on', who: 'Veterinary / AI worker', what: 'animal health + insemination visits', typicalDelay: 'on call' },
  ],
  exceptions: [
    { trigger: 'Animal falls sick / yield crashes', whatYouDo: 'Call vet, adjust feed, absorb the income dip; sell if chronic', howOften: 'monthly' },
    { trigger: 'Society disputes / low fat reading', whatYouDo: 'Argue at the counter, compare with my notebook, mostly accept it', howOften: 'weekly' },
  ],
});

const broilerPoultry = () => mk({
  role: 'Contract broiler poultry farmer',
  context: 'A household broiler shed on contract to an integrator who supplies chicks + feed + medicine; farmer paid a growing margin on weight / FCR',
  outputName: 'a batch of broilers raised to market weight',
  officialVersion: 'Receive chicks → brood → feed per schedule → medicate → monitor mortality → integrator weighs + lifts → settle on FCR.',
  instanceAnchor: 'day 25 of a ~40-day batch in summer heat',
  trigger: 'Integrator places a batch of day-old chicks in the shed',
  steps: [
    S(1, { action: 'Receive chicks, set brooder temperature, water, starter feed', tool: 'Brooder + feeders', timeMins: 60, frequency: 'monthly', needsJudgment: true }),
    S(2, { action: 'Feed on schedule, manage waterers, adjust per growth stage', tool: 'Feed + water lines', frequency: 'many-times-a-day', frictionTags: ['movement'] }),
    S(3, { action: 'Read the flock — activity, panting, droppings — for early disease / heat stress', tool: 'Eye + experience', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'A disease or a heat-wave can wipe a batch in days; reading the flock\'s subtle signs early is the make-or-break judgment.' }),
    S(4, { action: 'Manage shed climate — fog/fan in heat, curtains, litter', tool: 'Fans + curtains', frequency: 'many-times-a-day', needsJudgment: true }),
    S(5, { action: 'Record daily mortality + feed consumed', tool: 'Notebook / app', frequency: 'daily', frictionTags: ['manual-transfer'], isShadow: true, notes: 'Daily mortality + feed tally is my own record — it\'s the basis of the FCR I\'ll be paid on, so I keep it carefully.' }),
    S(6, { action: 'Call integrator supervisor about sick birds / medicine / feed gaps', tool: 'Phone', outputDestination: 'A client / customer', frequency: 'daily', frictionTags: ['chasing', 'wait'] }),
    S(7, { action: 'At lift: birds weighed, FCR computed, margin settled', tool: 'Weighbridge + contract', inputSource: 'A client / customer', frequency: 'monthly', frictionTags: ['approval', 'manual-transfer'], needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Integrator company', what: 'chicks, feed, medicine, supervisor visits', typicalDelay: 'per batch / on call' },
    { direction: 'hand-to', who: 'Integrator lifting team', what: 'grown birds at weighing', typicalDelay: 'batch end' },
  ],
  exceptions: [
    { trigger: 'Disease outbreak in the shed', whatYouDo: 'Isolate, call integrator vet, medicate fast, accept mortality hit', howOften: 'a few times a year' },
    { trigger: 'Heat wave', whatYouDo: 'Run foggers + fans round the clock, add electrolytes, watch panting', howOften: 'summer batches' },
  ],
});

const sugarcaneFarmer = () => mk({
  role: 'Sugarcane farmer (supply to sugar mill)',
  context: 'A few acres of cane contracted to a sugar mill; harvest by gang, transport by lorry/cart, weighed at mill on a token system',
  outputName: 'a harvested cane load weighed + accepted at the mill',
  officialVersion: 'Mill issues cutting order / token → arrange harvest gang → cut → load → transport → weighbridge → mill accepts → payment per tonne.',
  instanceAnchor: 'a harvest day after the mill finally issues the cutting token',
  trigger: 'Mill issues the cutting order / token for my plot',
  steps: [
    S(1, { action: 'Wait for + chase the mill\'s cutting token (timing decides sugar recovery + price)', tool: 'Phone + mill office', inputSource: 'A system / report', frequency: 'monthly', frictionTags: ['wait', 'chasing', 'approval'], isPainful: true, notes: 'The cutting token can come late; cane over-matures + loses weight while I wait — the delay I can\'t control hurts most.' }),
    S(2, { action: 'Arrange the harvest gang + bullock cart / lorry for the date', tool: 'Phone + contacts', frequency: 'monthly', frictionTags: ['chasing', 'wait'] }),
    S(3, { action: 'Supervise cutting + detrashing to mill spec', tool: 'Field + gang', timeMins: 240, frequency: 'monthly', needsJudgment: true }),
    S(4, { action: 'Load cane onto transport, secure', tool: 'Cart / lorry', frequency: 'monthly', frictionTags: ['movement'] }),
    S(5, { action: 'Transport to mill, join the weighbridge queue', tool: 'Lorry', frequency: 'monthly', frictionTags: ['movement', 'wait'] }),
    S(6, { action: 'Weighed at bridge; mill grades + accepts', tool: 'Weighbridge', inputSource: 'Another team', frequency: 'monthly', frictionTags: ['approval'] }),
    S(7, { action: 'Track tonnage + expected payment; reconcile against mill statement later', tool: 'Notebook', isShadow: true, frequency: 'monthly', needsJudgment: true, notes: 'I keep my own tonnage record to check the mill\'s delayed payment statement against.' }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Sugar mill', what: 'cutting token + weighbridge + payment', typicalDelay: 'days to weeks' },
    { direction: 'wait-on', who: 'Harvest gang + transport', what: 'labour + lorry on the cutting date', typicalDelay: 'arranged per harvest' },
  ],
  exceptions: [
    { trigger: 'Token delayed, cane over-matures', whatYouDo: 'Keep chasing the mill, irrigate to hold weight, accept some loss', howOften: 'most seasons' },
    { trigger: 'Lorry / gang no-show on token day', whatYouDo: 'Scramble alternates fast — the token window is tight', howOften: 'seasonal' },
  ],
});

const bananaFarmer = () => mk({
  role: 'Banana farmer (commission-agent sale)',
  context: 'A few acres of banana (Theni / Trichy belt) sold through a commission agent (mandi) to wholesalers; price set at sale, not before',
  outputName: 'a harvested banana lot sold through the agent',
  officialVersion: 'Judge ripeness → harvest → transport to agent / mandi → agent sells to wholesaler → commission deducted → payment.',
  instanceAnchor: 'a harvest when the agent signals a buyer is ready',
  trigger: 'Bunches reach harvest maturity / agent says a buyer wants stock',
  steps: [
    S(1, { action: 'Judge bunch maturity for the target market + transit time', tool: 'Eye + experience', frequency: 'weekly', needsJudgment: true, notes: 'Cut too early or late and it rots in transit or fetches less — pure judgment on maturity vs distance.' }),
    S(2, { action: 'Arrange cutting labour + transport', tool: 'Phone + contacts', frequency: 'weekly', frictionTags: ['chasing', 'wait'] }),
    S(3, { action: 'Harvest bunches, handle to avoid bruising, load', tool: 'Field + labour', timeMins: 180, frequency: 'weekly', frictionTags: ['movement'] }),
    S(4, { action: 'Transport to the commission agent / mandi', tool: 'Lorry / van', frequency: 'weekly', frictionTags: ['movement'] }),
    S(5, { action: 'Agent sells to wholesaler at the day\'s rate; I have little price visibility', tool: 'Agent', inputSource: 'A system / report', frequency: 'weekly', frictionTags: ['wait'], isPainful: true, notes: 'The price is whatever the agent reports — I can\'t see the real market or other buyers; this opacity is the core grievance.' }),
    S(6, { action: 'Agent deducts commission + dues, hands the balance', tool: 'Agent ledger', frequency: 'weekly', frictionTags: ['approval', 'manual-transfer'] }),
    S(7, { action: 'Note rate + quantity to compare agents + seasons over time', tool: 'Notebook', isShadow: true, frequency: 'weekly', needsJudgment: true }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Commission agent (mandi)', what: 'harvested lot for sale', typicalDelay: 'same day' },
    { direction: 'wait-on', who: 'Agent', what: 'sale price report + payment', typicalDelay: 'days' },
  ],
  exceptions: [
    { trigger: 'Glut crashes the price on harvest day', whatYouDo: 'Sell anyway (can\'t hold ripe fruit) or try a distant market, take the loss', howOften: 'seasonal' },
    { trigger: 'Suspect the agent under-reported price', whatYouDo: 'Compare with other farmers + my notebook, switch agents next time', howOften: 'occasional' },
  ],
});

const copraMaker = () => mk({
  role: 'Coconut farmer-cum-copra maker',
  context: 'A coconut holding (Pollachi belt) drying nuts into copra for the oil-mill market; price tracks volatile copra rates',
  outputName: 'a batch of copra dried + sold to the market',
  officialVersion: 'Harvest nuts → de-husk → split → dry to copra → grade → sell at the regulated market / to a trader → payment.',
  instanceAnchor: 'a drying batch timed against a rising copra rate',
  trigger: 'Nuts mature / a price upswing makes selling worthwhile',
  steps: [
    S(1, { action: 'Arrange climber + labour to harvest mature nuts', tool: 'Phone + climber', frequency: 'monthly', frictionTags: ['chasing', 'wait'], isPainful: true, notes: 'Skilled coconut climbers are scarce + costly; waiting on one to be free is the recurring bottleneck.' }),
    S(2, { action: 'De-husk + split nuts', tool: 'Tools + labour', timeMins: 180, frequency: 'monthly', frictionTags: ['movement'] }),
    S(3, { action: 'Sun-dry / kiln-dry to copra, turn + judge dryness over days', tool: 'Drying yard', timeMins: 240, frequency: 'monthly', needsJudgment: true, notes: 'Under-dried copra molds + is rejected; judging "done" across changing weather is the craft.' }),
    S(4, { action: 'Decide WHEN to sell — track copra rate, hold or release', tool: 'Rate news + traders', isShadow: true, frequency: 'monthly', needsJudgment: true, notes: 'Copra stores, so timing the volatile rate is a held-in-head trading call that can beat the farming margin.' }),
    S(5, { action: 'Grade + bag copra by quality', tool: 'Sorting', frequency: 'monthly', needsJudgment: true }),
    S(6, { action: 'Transport to regulated market / trader, negotiate', tool: 'Lorry + market', frequency: 'monthly', frictionTags: ['movement', 'wait'] }),
    S(7, { action: 'Sell, settle, record rate + quantity', tool: 'Market + notebook', outputDestination: 'A system / report', frequency: 'monthly', frictionTags: ['approval', 'manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Coconut climber + labour', what: 'harvesting the nuts', typicalDelay: 'days, scarce' },
    { direction: 'hand-to', who: 'Regulated market / oil-mill trader', what: 'graded copra for sale', typicalDelay: 'per trip' },
  ],
  exceptions: [
    { trigger: 'Rain during drying', whatYouDo: 'Cover + move copra, extend drying, risk mold on a part of the batch', howOften: 'monsoon' },
    { trigger: 'Copra price slumps', whatYouDo: 'Store dried copra and wait for recovery (storage advantage)', howOften: 'seasonal' },
  ],
});

const uzhavarSandhai = () => mk({
  role: 'Vegetable farmer selling at Uzhavar Sandhai',
  context: 'A smallholder selling own vegetables directly at the government farmers\' market (Uzhavar Sandhai) at a regulated slab + price board',
  outputName: 'a day\'s vegetables sold directly to consumers',
  officialVersion: 'Harvest → grade → take allotted slab → sell at the official daily price → settle → carry back unsold.',
  instanceAnchor: 'a morning at the allotted market slab',
  trigger: 'Market day; my produce is harvested + graded',
  steps: [
    S(1, { action: 'Harvest + grade vegetables the evening / dawn before', tool: 'Field + sorting', timeMins: 90, frequency: 'few-times-a-week', needsJudgment: true }),
    S(2, { action: 'Decide quantity to bring — what will sell vs spoil', tool: 'Experience', isShadow: true, frequency: 'few-times-a-week', needsJudgment: true, notes: 'Guessing the day\'s demand by weather, day-of-week + festivals — over-bring = haul back + spoilage.' }),
    S(3, { action: 'Transport + occupy my allotted slab, display produce', tool: 'Van + crates', timeMins: 45, frequency: 'few-times-a-week', frictionTags: ['movement'] }),
    S(4, { action: 'Sell at the market\'s posted daily price (no haggling on board items)', tool: 'Price board + scale', outputDestination: 'A client / customer', frequency: 'many-times-a-day', frictionTags: ['wait'] }),
    S(5, { action: 'Weigh + collect cash / UPI, give change', tool: 'Scale + cash + UPI', frequency: 'many-times-a-day' }),
    S(6, { action: 'Judge end-of-day markdown on remaining stock', tool: 'Mental pricing', frequency: 'many-times-a-day', needsJudgment: true, isPainful: true, notes: 'Clearing perishables before the market closes vs hauling back to rot — the end-of-day dump call is the daily pinch.' }),
    S(7, { action: 'Tally takings, carry back unsold, note what to plant / bring next', tool: 'Notebook', inputSource: 'My own notes', frequency: 'few-times-a-week', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'wait-on', who: 'Uzhavar Sandhai administration', what: 'slab allotment + daily price board', typicalDelay: 'each market day' },
    { direction: 'hand-to', who: 'Walk-in consumers', what: 'vegetables at the posted price', typicalDelay: 'minutes' },
  ],
  exceptions: [
    { trigger: 'Heavy unsold stock at close', whatYouDo: 'Deep discount last hour, sell to a trader cheap, or give away', howOften: 'weekly' },
    { trigger: 'Rain keeps buyers away', whatYouDo: 'Carry produce back, sell to a local trader at a loss', howOften: 'monsoon' },
  ],
});

const marineFishing = () => mk({
  role: 'Small-boat marine fisherman (owner-operator)',
  context: 'A small motorised fishing boat (Rameswaram / Nagapattinam coast) on day trips; catch auctioned at the landing centre',
  outputName: 'a day\'s catch landed + auctioned',
  officialVersion: 'Check weather → fuel + ice + crew → go out → fish the grounds → return → auction catch at landing → settle crew + costs.',
  instanceAnchor: 'a pre-dawn departure on a fair-weather day',
  trigger: 'Weather window + crew available for a trip',
  steps: [
    S(1, { action: 'Read weather, sea + season, decide go / no-go + which ground', tool: 'Sky + forecast + experience', frequency: 'daily', needsJudgment: true, isPainful: true, notes: 'A wrong weather call risks lives + a wasted costly trip — the heaviest judgment, made on sky-sense plus a patchy forecast.' }),
    S(2, { action: 'Arrange diesel, ice, crew shares, nets', tool: 'Fuel + ice + crew', timeMins: 60, frequency: 'daily', frictionTags: ['chasing', 'movement'] }),
    S(3, { action: 'Navigate to the fishing ground by GPS + remembered marks', tool: 'Boat + GPS', timeMins: 120, frequency: 'daily', frictionTags: ['movement'], isShadow: true, notes: 'Productive spots are remembered coordinates + sea-reading passed down — my private fishing map.' }),
    S(4, { action: 'Cast + haul nets, judge where + how long to fish', tool: 'Nets', frequency: 'daily', needsJudgment: true }),
    S(5, { action: 'Ice the catch, sort by species on the way back', tool: 'Ice box', frequency: 'daily', frictionTags: ['movement'] }),
    S(6, { action: 'Land + auction the catch at the landing centre', tool: 'Auctioneer', outputDestination: 'Another team', frequency: 'daily', frictionTags: ['wait', 'approval'], notes: 'Price is set by the landing auction + middlemen — little control over what the catch fetches.' }),
    S(7, { action: 'Settle fuel + ice costs + crew shares, keep the balance', tool: 'Cash + memory', inputSource: 'My own notes', frequency: 'daily', frictionTags: ['manual-transfer'] }),
  ],
  handoffs: [
    { direction: 'hand-to', who: 'Landing-centre auctioneer / middleman', what: 'catch for auction', typicalDelay: 'on landing' },
    { direction: 'wait-on', who: 'Diesel + ice supplier', what: 'trip inputs', typicalDelay: 'pre-dawn' },
  ],
  exceptions: [
    { trigger: 'Weather turns at sea', whatYouDo: 'Abort + return, secure crew, accept the lost trip cost', howOften: 'monsoon / cyclone season' },
    { trigger: 'Poor catch after a costly trip', whatYouDo: 'Absorb the loss, adjust crew shares, try a different ground next day', howOften: 'weekly' },
  ],
});

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
  { key: 'dairy-farmer', label: 'A smallholder pouring milk at the co-op society', domain: 'Agriculture', region: 'Tamil Nadu', emoji: '🐄',
    summary: 'Herd health read from daily familiarity, a fat/SNF reading that sets the price but can\'t be verified, and a private notebook to cross-check the society slip.',
    behavioralContext: 'The capture marks the unverifiable fat/SNF test as the painful step (it sets income, the farmer can\'t contest the machine) and tags the private tally as a shadow trust-gap against the society slip. The herd read is the judgment that protects yield.',
    fieldSpecificFit: 'The trace points the fit at trust + transparency: a member app that shows each pouring\'s test result and running payment transparently (closing the notebook trust-gap), plus simple herd-health reminders. The animal-reading judgment stays the farmer\'s.',
    build: dairyFarmer },
  { key: 'broiler-poultry', label: 'A contract farmer raising a broiler batch', domain: 'Agriculture', region: 'Tamil Nadu', emoji: '🐔',
    summary: 'Reading the flock\'s subtle signs to catch disease or heat stress before it wipes a batch, with a carefully-kept daily mortality + feed tally — the basis of the FCR they\'re paid on.',
    behavioralContext: 'The capture marks early flock-reading as the painful, make-or-break judgment and tags the mortality/feed record as a shadow log that underpins the contract payment. Automating climate helps; the disease-spotting judgment is what saves the batch.',
    fieldSpecificFit: 'The trace supports sensor-assisted climate control (foggers/fans on temperature) and a digital batch log feeding a transparent FCR settlement, while keeping the flock-health read human — IoT backs the eye, it doesn\'t replace it.',
    build: broilerPoultry },
  { key: 'sugarcane-mill-supply', label: 'A cane farmer supplying a sugar mill', domain: 'Agriculture', region: 'Tamil Nadu', emoji: '🎋',
    summary: 'A mill cutting-token that arrives late while cane over-matures and loses weight, then a weighbridge price the farmer can only cross-check from a private record.',
    behavioralContext: 'The capture pins the painful step at waiting on (and chasing) the mill\'s cutting token — a delay outside the farmer\'s control that erodes weight and recovery — and tags the private tonnage record as a shadow check on the delayed mill statement.',
    fieldSpecificFit: 'The trace aims the fit at the mill-farmer seam: transparent digital token scheduling + weighbridge slips the farmer can see, so the wait is visible and the tonnage isn\'t a trust-gap. The harvest-quality judgment stays the farmer\'s.',
    build: sugarcaneFarmer },
  { key: 'banana-commission-sale', label: 'A banana farmer selling through a commission agent', domain: 'Agriculture', region: 'Theni, TN', emoji: '🍌',
    summary: 'Maturity judged against transit time, then a sale price that is simply whatever the agent reports — no visibility of the real market or other buyers.',
    behavioralContext: 'The capture tags maturity-timing as judgment and marks the agent\'s opaque price report as the painful core grievance — the farmer can\'t see the market. The shadow rate-notebook is an attempt to claw back some price knowledge.',
    fieldSpecificFit: 'The trace points the fit at price transparency, not the farming: a market-price feed + direct-buyer / FPO linkage so the agent\'s report can be checked against reality. The maturity-and-handling judgment stays the farmer\'s craft.',
    build: bananaFarmer },
  { key: 'copra-maker', label: 'A coconut farmer drying and timing copra sale', domain: 'Agriculture', region: 'Pollachi, TN', emoji: '🥥',
    summary: 'Scarce climbers as the recurring bottleneck, dryness judged across changing weather, and a held-in-head call on when to sell the storable copra against a volatile rate.',
    behavioralContext: 'The capture marks waiting on scarce climbers as the painful bottleneck and tags the sell-timing as a shadow trading judgment that can beat the farming margin (copra stores, so timing matters). The dryness call is craft.',
    fieldSpecificFit: 'The trace supports a climber-booking / labour-pooling link and a copra rate-tracker with a simple hold/sell view to inform the timing call. The drying judgment and the final sell decision stay the farmer\'s.',
    build: copraMaker },
  { key: 'uzhavar-sandhai', label: 'A farmer selling at the Uzhavar Sandhai', domain: 'Agriculture', region: 'Tamil Nadu', emoji: '🥬',
    summary: 'Quantity-to-bring guessed against weather and festivals, selling at the posted board price, then an end-of-day markdown call on perishables before haul-back.',
    behavioralContext: 'The capture tags the bring-quantity decision as a shadow demand-guess and marks the end-of-day clearance markdown as the painful pinch (sell cheap vs haul back to rot). Selling at the regulated board price removes haggling but not the spoilage risk.',
    fieldSpecificFit: 'The trace points the fit at demand signal + clearance, not the direct selling that is the market\'s whole point: a simple sandhai-level demand/footfall signal to size the haul, and an end-of-day surplus alert to nearby buyers. The pricing-at-board stays as is.',
    build: uzhavarSandhai },
  { key: 'marine-fishing', label: 'A small-boat fisherman on a day trip', domain: 'Agriculture', region: 'Rameswaram, TN', emoji: '🎣',
    summary: 'A go/no-go weather call made on sky-sense plus a patchy forecast where a wrong read risks lives, fishing grounds held as a private remembered map, and an auction price beyond the fisher\'s control.',
    behavioralContext: 'The capture marks the weather go/no-go as the painful, life-critical judgment and tags the remembered fishing-ground coordinates as a shadow private map. The sea-reading and ground knowledge are exactly what no system replaces.',
    fieldSpecificFit: 'The trace points the fit at safety + price information: reliable localised marine weather + PFZ (potential fishing zone) advisories to back the sky-sense, and landing-price transparency / direct-buyer links against the auction opacity. The go/no-go and fishing judgment stay the fisher\'s.',
    build: marineFishing },
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
