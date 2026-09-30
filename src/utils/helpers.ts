// Utility to normalize block IDs between different data files
// blocks.ts uses: blk_kh_bhubaneswar format
// forecasts.ts uses: bhubaneswar format
// We'll create maps and helper functions

const prefixToSimple: Record<string, string> = {
  'blk_kh_bhubaneswar': 'bhubaneswar',
  'blk_kh_jatni': 'jatni',
  'blk_kh_balianta': 'balianta',
  'blk_kh_chilika': 'chilika',
  'blk_cu_cuttack': 'cuttack-sadar',
  'blk_cu_banki': 'banki',
  'blk_cu_athagarh': 'athagarh',
  'blk_cu_baramba': 'baramba',
  'blk_pu_puri': 'puri-sadar',
  'blk_pu_nimapara': 'nimapara',
  'blk_pu_pipili': 'pipili',
  'blk_pu_konark': 'konark',
  'blk_ga_berhampur': 'berhampur',
  'blk_ga_chhatrapur': 'chhatrapur',
  'blk_ga_aska': 'aska',
  'blk_ga_khallikote': 'khallikote',
  'blk_ka_bhawanipatna': 'bhawanipatna',
  'blk_ka_junagarh': 'junagarh',
  'blk_ka_kesinga': 'kesinga',
  'blk_ka_dharamgarh': 'dharamgarh',
  'blk_ma_baripada': 'baripada',
  'blk_ma_rairangpur': 'rairangpur',
  'blk_ma_udala': 'udala',
  'blk_ma_karanjia': 'karanjia',
};

const simpleToPrefixed = Object.fromEntries(
  Object.entries(prefixToSimple).map(([k, v]) => [v, k])
);

export function toSimpleId(blockId: string): string {
  return prefixToSimple[blockId] || blockId;
}

export function toPrefixedId(simpleId: string): string {
  return simpleToPrefixed[simpleId] || simpleId;
}

// Risk color utility
export function getRiskColor(probability: number): string {
  if (probability >= 75) return '#ef4444'; // red
  if (probability >= 55) return '#f97316'; // orange
  if (probability >= 35) return '#eab308'; // yellow
  return '#22c55e'; // green
}

export function getRiskLevel(probability: number): string {
  if (probability >= 75) return 'very_high_risk';
  if (probability >= 55) return 'high_risk';
  if (probability >= 35) return 'moderate_risk';
  return 'low_risk';
}

export function getRiskBadgeColor(severity: string): string {
  switch (severity) {
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

// Date utilities
export function getBaseDate(): Date {
  return new Date();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getRelativeDate(daysOffset: number): Date {
  const d = getBaseDate();
  d.setDate(d.getDate() + daysOffset);
  return d;
}

// Simulated loading helper
export function simulateLoad(ms: number = 1500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate fake phone numbers
export function generateFakePhone(): string {
  const prefixes = ['98', '97', '96', '95', '94', '93', '91', '90', '89', '88'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const mid = 'XXXXX';
  const last = Math.floor(Math.random() * 900 + 100).toString();
  return `${prefix}${mid}${last}`;
}

// Fake farmer names
export const fakeFarmerNames = [
  'Ramesh Pradhan', 'Sita Nayak', 'Bijay Mohapatra', 'Lakshmi Sahoo',
  'Manoj Patra', 'Sunita Behera', 'Durga Mishra', 'Ashok Jena',
  'Priya Mohanty', 'Ravi Swain', 'Kamala Dalai', 'Suresh Rout',
  'Gita Parida', 'Narayan Sahu', 'Padma Dash', 'Bimal Naik',
  'Kalpana Sethi', 'Jagannath Panda', 'Rina Barik', 'Trinath Mallick',
  'Sabita Lenka', 'Hemant Kar', 'Pushpa Muduli', 'Debendra Suna',
  'Anjana Majhi', 'Gobind Meher', 'Sasmita Hial', 'Tikeswar Bag',
  'Mamata Tandia', 'Raghunath Bhoi',
];
