export interface AdvisoryInput {
  blockId: string;
  crop: string;
  stage: string;
  soilType: string;
  irrigation: string;
}

export interface AdvisoryOutput {
  severity: 'green' | 'yellow' | 'orange' | 'red';
  confidence: number;
  title: string;
  ruleTrace: string;
  actions: string[];
  varietyRecommendation: string | null;
  agronomicPractices: string[];
  weeklyOutlook: string;
}

// Risk levels per block (derived from forecast data patterns)
const blockRiskMap: Record<string, { onsetW1: number; breakW2: number; heavyW2: number }> = {
  'bhubaneswar': { onsetW1: 72, breakW2: 25, heavyW2: 45 },
  'jatni': { onsetW1: 68, breakW2: 30, heavyW2: 42 },
  'balianta': { onsetW1: 65, breakW2: 28, heavyW2: 40 },
  'chilika': { onsetW1: 85, breakW2: 15, heavyW2: 70 },
  'cuttack-sadar': { onsetW1: 62, breakW2: 35, heavyW2: 48 },
  'banki': { onsetW1: 58, breakW2: 40, heavyW2: 38 },
  'athagarh': { onsetW1: 55, breakW2: 42, heavyW2: 35 },
  'baramba': { onsetW1: 52, breakW2: 45, heavyW2: 32 },
  'puri-sadar': { onsetW1: 88, breakW2: 12, heavyW2: 75 },
  'nimapara': { onsetW1: 82, breakW2: 18, heavyW2: 68 },
  'pipili': { onsetW1: 75, breakW2: 22, heavyW2: 55 },
  'konark': { onsetW1: 90, breakW2: 10, heavyW2: 78 },
  'berhampur': { onsetW1: 70, breakW2: 30, heavyW2: 50 },
  'chhatrapur': { onsetW1: 80, breakW2: 18, heavyW2: 62 },
  'aska': { onsetW1: 55, breakW2: 48, heavyW2: 35 },
  'khallikote': { onsetW1: 65, breakW2: 35, heavyW2: 45 },
  'bhawanipatna': { onsetW1: 35, breakW2: 65, heavyW2: 22 },
  'junagarh': { onsetW1: 32, breakW2: 70, heavyW2: 18 },
  'kesinga': { onsetW1: 38, breakW2: 62, heavyW2: 25 },
  'dharamgarh': { onsetW1: 40, breakW2: 58, heavyW2: 28 },
  'baripada': { onsetW1: 60, breakW2: 38, heavyW2: 42 },
  'rairangpur': { onsetW1: 55, breakW2: 42, heavyW2: 38 },
  'udala': { onsetW1: 58, breakW2: 40, heavyW2: 40 },
  'karanjia': { onsetW1: 52, breakW2: 45, heavyW2: 35 },
};

function getBlockRisk(blockId: string) {
  return blockRiskMap[blockId] || { onsetW1: 50, breakW2: 40, heavyW2: 35 };
}

interface Rule {
  id: string;
  condition: (input: AdvisoryInput, risk: { onsetW1: number; breakW2: number; heavyW2: number }) => boolean;
  output: (input: AdvisoryInput, risk: { onsetW1: number; breakW2: number; heavyW2: number }) => AdvisoryOutput;
}

const rules: Rule[] = [
  // Rule 1: Low onset + paddy pre-sowing → delay
  {
    id: 'R1',
    condition: (input, risk) => risk.onsetW1 < 45 && input.crop === 'paddy' && input.stage === 'pre-sowing',
    output: (_input, risk) => ({
      severity: 'orange',
      confidence: 78,
      title: 'Delay Paddy Sowing — Low Onset Probability',
      ruleTrace: `IF onset_prob(W1) = ${risk.onsetW1}% (< 45%) AND crop = Paddy AND stage = Pre-sowing THEN DELAY_SOWING 7–10 days`,
      actions: [
        'Delay direct sowing by 7–10 days until onset signals strengthen',
        'Prepare nursery beds in controlled/irrigated conditions',
        'Keep seeds ready for immediate sowing when onset is confirmed',
        'Monitor IMD bulletins daily for onset updates',
      ],
      varietyRecommendation: 'Lalat (110 days) or Naveen (125 days) — short-to-medium duration for delayed sowing',
      agronomicPractices: [
        'Prepare nursery in raised beds with polythene cover',
        'Apply pre-sowing soil moisture conservation techniques',
        'Ensure seed treatment with Carbendazim @ 2g/kg',
        'Maintain soil mulch to conserve residual moisture',
      ],
      weeklyOutlook: `Week 1: Low rainfall expected (${risk.onsetW1}% onset prob). Week 2: Conditions may improve. Keep nursery ready for transplanting by Week 2–3.`,
    }),
  },
  // Rule 2: High onset + paddy pre-sowing → sow now
  {
    id: 'R2',
    condition: (input, risk) => risk.onsetW1 >= 70 && input.crop === 'paddy' && input.stage === 'pre-sowing',
    output: (_input, risk) => ({
      severity: 'green',
      confidence: 85,
      title: 'Sow Paddy Now — Strong Onset Signal',
      ruleTrace: `IF onset_prob(W1) = ${risk.onsetW1}% (≥ 70%) AND crop = Paddy AND stage = Pre-sowing THEN SOW_NOW`,
      actions: [
        'Proceed with paddy sowing immediately',
        'Complete nursery raising within 2–3 days',
        'Apply basal fertilizer (DAP 50 kg/ha + MOP 30 kg/ha)',
        'Ensure field bunding for water retention',
      ],
      varietyRecommendation: 'Swarna Sub1 (140 days) for flood-prone areas, or MTU-1010 (120 days) for medium lands',
      agronomicPractices: [
        'Puddling and leveling within 48 hours of sowing',
        'Maintain 2–3 cm standing water after transplanting',
        'Apply Butachlor 50EC @ 1.5 kg/ha for weed control within 3 DAS',
        'Plan for 21-day-old seedling transplanting',
      ],
      weeklyOutlook: `Week 1: Good rainfall onset expected (${risk.onsetW1}% prob). Ideal sowing window. Week 2–3: Active monsoon phase likely — favorable for crop establishment.`,
    }),
  },
  // Rule 3: High break risk + paddy vegetative → irrigation + mulching
  {
    id: 'R3',
    condition: (input, risk) => risk.breakW2 > 55 && input.crop === 'paddy' && (input.stage === 'vegetative' || input.stage === 'sowing'),
    output: (_input, risk) => ({
      severity: 'red',
      confidence: 72,
      title: 'Break Alert — Protect Paddy from Dry Spell',
      ruleTrace: `IF break_prob(W2) = ${risk.breakW2}% (> 55%) AND crop = Paddy AND stage = Vegetative THEN IRRIGATE + MULCH`,
      actions: [
        'Arrange supplemental irrigation immediately — 2 irrigations needed in next 10 days',
        'Apply organic mulch (paddy straw) between rows to reduce evaporation',
        'Postpone top-dressing of N fertilizer until rain resumes',
        'Consider life-saving irrigation from nearest water source',
      ],
      varietyRecommendation: 'If crop is still young, consider replanting with Sahabhagi Dhan (drought-tolerant, 105 days)',
      agronomicPractices: [
        'Reduce plant population density by 10% for moisture conservation',
        'Apply potash foliar spray (KCl 1%) for stress tolerance',
        'Create temporary field channels for efficient water distribution',
        'Monitor crop for moisture stress symptoms — leaf rolling, yellowing',
      ],
      weeklyOutlook: `Week 1: Moderate rain. Week 2: ${risk.breakW2}% probability of dry break — 5–8 day dry spell expected. Irrigation critical during this window.`,
    }),
  },
  // Rule 4: Heavy rain + groundnut → drainage
  {
    id: 'R4',
    condition: (input, risk) => risk.heavyW2 > 60 && input.crop === 'groundnut',
    output: (_input, risk) => ({
      severity: 'orange',
      confidence: 75,
      title: 'Heavy Rain Warning — Protect Groundnut',
      ruleTrace: `IF heavy_rain_prob(W2) = ${risk.heavyW2}% (> 60%) AND crop = Groundnut THEN DRAINAGE + DELAY_FERTILIZER`,
      actions: [
        'Ensure proper drainage channels around groundnut fields — clear all existing drains',
        'Delay fertilizer application by 5–7 days to prevent leaching',
        'Apply Trichoderma viride for collar rot prevention',
        'Harvest mature pods immediately if crop is at late maturity stage',
      ],
      varietyRecommendation: null,
      agronomicPractices: [
        'Create raised bed drainage system — 30cm deep, 20cm wide channels',
        'Apply fungicide spray (Mancozeb 75 WP @ 2.5g/l) preventively',
        'Remove waterlogged plants to prevent spread of Tikka disease',
        'Ensure proper earthing up for peg penetration protection',
      ],
      weeklyOutlook: `Week 1: Moderate rain. Week 2: ${risk.heavyW2}% heavy rain probability. Critical drainage preparation window is now.`,
    }),
  },
  // Rule 5: Break risk + maize + no irrigation → switch variety
  {
    id: 'R5',
    condition: (input, risk) => risk.breakW2 > 50 && input.crop === 'maize' && input.irrigation === 'no',
    output: (_input, risk) => ({
      severity: 'red',
      confidence: 70,
      title: 'Drought Risk — Switch Maize Variety',
      ruleTrace: `IF break_prob(W2) = ${risk.breakW2}% (> 50%) AND crop = Maize AND irrigation = No THEN SWITCH_VARIETY`,
      actions: [
        'Switch to short-duration drought-tolerant maize variety',
        'If crop already sown, apply anti-transpirant spray (Kaolin 6%)',
        'Maintain soil moisture through straw mulch (5 tonnes/ha)',
        'Plan for intercropping with drought-tolerant legumes',
      ],
      varietyRecommendation: 'Vivek QPM-9 (80–85 days) or DHM-117 (95 days) — drought tolerant, short duration',
      agronomicPractices: [
        'Apply mulching immediately — reduces soil temperature and evaporation',
        'Skip one nitrogen top-dressing if moisture stress is visible',
        'Ridge and furrow cultivation for in-situ moisture conservation',
        'Thinning to maintain optimal plant population of 55,000–60,000/ha',
      ],
      weeklyOutlook: `Week 1: Limited rain. Week 2–3: ${risk.breakW2}% break probability with no irrigation access. Critical water stress period.`,
    }),
  },
  // Rule 6: Onset delayed + cotton → short duration variety
  {
    id: 'R6',
    condition: (input, risk) => risk.onsetW1 < 40 && input.crop === 'cotton' && input.stage === 'pre-sowing',
    output: (_input, risk) => ({
      severity: 'yellow',
      confidence: 68,
      title: 'Onset Delayed — Adjust Cotton Plan',
      ruleTrace: `IF onset_prob(W1) = ${risk.onsetW1}% (< 40%) AND crop = Cotton AND stage = Pre-sowing THEN DELAY + SHORT_VARIETY`,
      actions: [
        'Wait for confirmed onset before sowing cotton — delay by 10–14 days',
        'Switch to short-duration Bt cotton variety for late sowing',
        'Maintain soil moisture through dry-season tillage',
        'Pre-position inputs (seeds, fertilizer) for rapid sowing at onset',
      ],
      varietyRecommendation: 'Suraj (Bt) — 150 days, suitable for late sowing; Bunny (Bt) — early maturing',
      agronomicPractices: [
        'Deep summer ploughing for moisture conservation',
        'Seed treatment with Imidacloprid 48FS @ 5ml/kg for sucking pest protection',
        'Prepare ridge and furrow system for sowing — 90cm spacing',
        'Apply FYM @ 10 tonnes/ha before sowing',
      ],
      weeklyOutlook: `Week 1: ${risk.onsetW1}% onset probability — too risky for cotton. Week 2–3: Monitor for improvement. Ideal sowing window may shift to late June.`,
    }),
  },
  // Rule 7: Heavy rain + vegetables → raised beds
  {
    id: 'R7',
    condition: (input, risk) => risk.heavyW2 > 55 && input.crop === 'vegetables',
    output: (_input, risk) => ({
      severity: 'orange',
      confidence: 73,
      title: 'Heavy Rain — Protect Vegetable Crops',
      ruleTrace: `IF heavy_rain_prob(W2) = ${risk.heavyW2}% (> 55%) AND crop = Vegetables THEN RAISED_BED + DRAINAGE`,
      actions: [
        'Move vegetable seedlings to raised beds immediately',
        'Create drainage channels — 30cm deep around all beds',
        'Apply copper-based fungicide preventively for blight/damping off',
        'Harvest any mature produce before heavy rain event',
      ],
      varietyRecommendation: null,
      agronomicPractices: [
        'Raised bed preparation — 15cm height, 1m width',
        'Mulching with black polythene to prevent soil splash',
        'Staking of tomato, brinjal plants for wind/rain protection',
        'Apply Bordeaux mixture (1%) for disease prevention',
      ],
      weeklyOutlook: `Week 2: ${risk.heavyW2}% heavy rainfall probability. Prepare all drainage and protective measures within next 5 days.`,
    }),
  },
  // Rule 8: Break + pigeon pea + limited irrigation → mulch + reduce density
  {
    id: 'R8',
    condition: (input, risk) => risk.breakW2 > 45 && input.crop === 'pigeonpea' && input.irrigation !== 'yes',
    output: (_input, risk) => ({
      severity: 'yellow',
      confidence: 65,
      title: 'Dry Spell Risk — Protect Pigeon Pea',
      ruleTrace: `IF break_prob(W2) = ${risk.breakW2}% (> 45%) AND crop = Pigeon Pea AND irrigation ≠ Yes THEN MULCH + THIN`,
      actions: [
        'Apply thick organic mulch (8–10 cm) between rows',
        'Reduce plant density by 15% through selective thinning',
        'Postpone intercultural operations to avoid moisture loss',
        'Apply foliar spray of 2% urea for nitrogen support during stress',
      ],
      varietyRecommendation: 'ICPL 88039 (short-duration, 120 days) or Asha (ICPL 87119)',
      agronomicPractices: [
        'Interculture with hoe at 25 DAS to break soil crust',
        'Nipping at 40–45 DAS for compact growth and stress tolerance',
        'Pre-emergence herbicide Pendimethalin 30 EC @ 3.3 L/ha',
        'Support with Rhizobium seed inoculation for biological nitrogen',
      ],
      weeklyOutlook: `Week 2: ${risk.breakW2}% dry break probability. Conservation measures critical. Rain likely to resume by Week 3.`,
    }),
  },
  // Rule 9: Good onset + maize + irrigation available → sow now
  {
    id: 'R9',
    condition: (input, risk) => risk.onsetW1 >= 60 && input.crop === 'maize' && input.stage === 'pre-sowing',
    output: (_input, risk) => ({
      severity: 'green',
      confidence: 80,
      title: 'Favorable Conditions — Sow Maize Now',
      ruleTrace: `IF onset_prob(W1) = ${risk.onsetW1}% (≥ 60%) AND crop = Maize AND stage = Pre-sowing THEN SOW_NOW`,
      actions: [
        'Proceed with maize sowing — optimal window for kharif planting',
        'Apply basal dose of NPK (60:40:20 kg/ha)',
        'Ensure seed rate of 20 kg/ha with spacing 60×25 cm',
        'Complete sowing within next 3–5 days for best germination',
      ],
      varietyRecommendation: 'HQPM-1 (90 days, quality protein) or Bio-9681 (105 days, high yield)',
      agronomicPractices: [
        'Seed treatment with Thiram @ 3g/kg before sowing',
        'Ridge sowing at 60 cm spacing for waterlogging protection',
        'Apply Atrazine 50WP @ 0.5 kg/ha as pre-emergence within 2 DAS',
        'Plan for first top-dressing of N at knee-high stage (25–30 DAS)',
      ],
      weeklyOutlook: `Week 1: ${risk.onsetW1}% onset probability — good planting window. Week 2: Active monsoon expected, ensuring germination.`,
    }),
  },
  // Rule 10: High onset + paddy flowering + heavy rain → drainage
  {
    id: 'R10',
    condition: (input, risk) => risk.heavyW2 > 50 && input.crop === 'paddy' && input.stage === 'flowering',
    output: (_input, risk) => ({
      severity: 'yellow',
      confidence: 70,
      title: 'Heavy Rain at Flowering — Rice Yield Protection',
      ruleTrace: `IF heavy_rain_prob(W2) = ${risk.heavyW2}% (> 50%) AND crop = Paddy AND stage = Flowering THEN DRAIN + PROTECT`,
      actions: [
        'Maintain shallow water (2–3 cm) — drain excess before heavy rain',
        'Apply supplemental potash spray (0.5% KCl) for grain filling',
        'Monitor for blast, sheath blight — spray Tricyclazole if symptoms appear',
        'Avoid any field operations during heavy rain period',
      ],
      varietyRecommendation: null,
      agronomicPractices: [
        'Drain field 10 days before expected harvest',
        'Apply propiconazole 25EC @ 1ml/l for sheath blight prevention',
        'Install bird perches for natural pest control during maturity',
        'Plan harvest scheduling based on Week 3–4 rainfall outlook',
      ],
      weeklyOutlook: `Week 2: ${risk.heavyW2}% heavy rain probability during flowering — manage water levels carefully.`,
    }),
  },
  // Rule 11: Break + groundnut + sandy soil → critical
  {
    id: 'R11',
    condition: (input, risk) => risk.breakW2 > 40 && input.crop === 'groundnut' && input.soilType === 'sandy',
    output: (_input, risk) => ({
      severity: 'red',
      confidence: 72,
      title: 'Critical Moisture Risk — Sandy Soil Groundnut',
      ruleTrace: `IF break_prob(W2) = ${risk.breakW2}% (> 40%) AND crop = Groundnut AND soil = Sandy THEN EMERGENCY_IRRIGATION`,
      actions: [
        'Arrange emergency irrigation — sandy soil has lowest water holding capacity',
        'Apply heavy mulch (sugarcane trash / paddy straw, 10 t/ha)',
        'Consider foliar application of ZnSO4 (0.5%) for stress tolerance',
        'If at pegging stage, ensure soil moisture around pegging zone',
      ],
      varietyRecommendation: 'TAG 24 (drought tolerant, bunch type, 110 days)',
      agronomicPractices: [
        'Gypsum application @ 400 kg/ha at flowering for calcium supply',
        'Avoid deep cultivation to prevent root damage',
        'Spray Mancozeb 75 WP @ 2.5g/l for Tikka disease prevention during stress',
        'Consider sprinkler irrigation if available — 25mm per irrigation',
      ],
      weeklyOutlook: `Week 2: ${risk.breakW2}% dry break expected. Sandy soil will lose moisture fast. Irrigation within 3 days is critical.`,
    }),
  },
  // Rule 12: Any crop at harvest + heavy rain → urgent harvest
  {
    id: 'R12',
    condition: (input, risk) => risk.heavyW2 > 55 && input.stage === 'harvest',
    output: (input, risk) => ({
      severity: 'red',
      confidence: 82,
      title: `Urgent Harvest — Heavy Rain Approaching`,
      ruleTrace: `IF heavy_rain_prob(W2) = ${risk.heavyW2}% (> 55%) AND stage = Harvest THEN URGENT_HARVEST for ${input.crop}`,
      actions: [
        'Complete harvesting immediately — within next 3–4 days maximum',
        'Arrange adequate labor and machinery for rapid harvesting',
        'Prepare covered storage / tarpaulin-covered drying areas',
        'If harvest not possible, arrange plant support to prevent lodging',
      ],
      varietyRecommendation: null,
      agronomicPractices: [
        'Use combine harvester if available for rapid harvesting',
        'Dry harvested produce to <14% moisture before storage',
        'Apply storage insecticide (Deltamethrin 2.8EC) on storage bags',
        'Contact nearest procurement center for immediate MSP sale',
      ],
      weeklyOutlook: `Week 2: ${risk.heavyW2}% heavy rain — complete harvest before this window. Post-harvest losses up to 25% if crop remains in field.`,
    }),
  },
];

export const crops = [
  { id: 'paddy', name: 'Paddy (Rice)' },
  { id: 'maize', name: 'Maize' },
  { id: 'groundnut', name: 'Groundnut' },
  { id: 'pigeonpea', name: 'Pigeon Pea (Arhar)' },
  { id: 'cotton', name: 'Cotton' },
  { id: 'vegetables', name: 'Vegetables' },
];

export const stages = [
  { id: 'pre-sowing', name: 'Pre-Sowing' },
  { id: 'sowing', name: 'Sowing' },
  { id: 'vegetative', name: 'Vegetative' },
  { id: 'flowering', name: 'Flowering' },
  { id: 'harvest', name: 'Harvest' },
];

export const soilTypes = [
  { id: 'clay', name: 'Clay' },
  { id: 'loam', name: 'Loam' },
  { id: 'sandy', name: 'Sandy' },
  { id: 'laterite', name: 'Laterite' },
];

export const irrigationOptions = [
  { id: 'yes', name: 'Yes — Assured Irrigation' },
  { id: 'limited', name: 'Limited — Partial Access' },
  { id: 'no', name: 'No — Rainfed Only' },
];

export function generateAdvisory(input: AdvisoryInput): AdvisoryOutput {
  const risk = getBlockRisk(input.blockId);
  
  // Find first matching rule
  for (const rule of rules) {
    if (rule.condition(input, risk)) {
      return rule.output(input, risk);
    }
  }

  // Default advisory if no rule matches
  const avgRisk = (risk.onsetW1 + risk.breakW2 + risk.heavyW2) / 3;
  const sev = avgRisk > 60 ? 'yellow' : 'green';

  return {
    severity: sev,
    confidence: 60,
    title: `General Advisory for ${input.crop.charAt(0).toUpperCase() + input.crop.slice(1)}`,
    ruleTrace: `DEFAULT: No specific risk pattern matched. Onset=${risk.onsetW1}%, Break=${risk.breakW2}%, Heavy=${risk.heavyW2}% for current block.`,
    actions: [
      'Continue normal agricultural operations with standard precautions',
      'Monitor daily weather bulletins from IMD and state agriculture department',
      'Keep drainage channels clear as a general precaution',
      'Maintain recommended fertilizer and pesticide schedule',
    ],
    varietyRecommendation: null,
    agronomicPractices: [
      'Follow recommended package of practices for your agro-climatic zone',
      'Maintain crop insurance documentation and registration',
      'Coordinate with local KVK (Krishi Vigyan Kendra) for technical guidance',
      'Participate in community-level crop planning for risk diversification',
    ],
    weeklyOutlook: `Current conditions are within normal range. No extreme weather event predicted in the next 2 weeks. Regular monsoon activity expected.`,
  };
}
