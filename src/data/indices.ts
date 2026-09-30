export interface ENSOData {
  current: number;
  status: string;
  series: { month: string; value: number }[];
  interpretation: string;
}

export interface IODData {
  current: number;
  status: string;
  series: { month: string; value: number }[];
  interpretation: string;
}

export interface MJOData {
  currentPhase: number;
  currentAmplitude: number;
  status: string;
  trajectory: { day: number; rmm1: number; rmm2: number; phase: number; amplitude: number }[];
  phaseLabels: Record<number, string>;
  interpretation: string;
}

export interface ClimateDriversSummary {
  overallInterpretation: string;
  onsetImpact: 'enhancing' | 'suppressing' | 'neutral';
  breakRisk: 'elevated' | 'normal' | 'reduced';
}

export const ensoData: ENSOData = {
  current: 0.6,
  status: 'Weak El Niño',
  series: [
    { month: 'Oct 2025', value: -0.5 },
    { month: 'Nov 2025', value: -0.6 },
    { month: 'Dec 2025', value: -0.7 },
    { month: 'Jan 2026', value: -0.5 },
    { month: 'Feb 2026', value: -0.3 },
    { month: 'Mar 2026', value: -0.2 },
    { month: 'Apr 2026', value: -0.2 },
    { month: 'May 2026', value: 0.0 },
    { month: 'Jun 2026', value: 0.2 },
    { month: 'Jul 2026', value: 0.3 },
    { month: 'Aug 2026', value: 0.5 },
    { month: 'Sep 2026', value: 0.6 }
  ],
  interpretation: 'ENSO has transitioned from a La Niña phase to a Weak El Niño over the past 6 months. While not exceptionally strong, this steady warming trend in the central Pacific typically acts to suppress late-season monsoon rainfall over the Indian subcontinent.'
};

export const iodData: IODData = {
  current: -0.3,
  status: 'Slightly Negative',
  series: [
    { month: 'Oct 2025', value: 0.6 },
    { month: 'Nov 2025', value: 0.3 },
    { month: 'Dec 2025', value: 0.1 },
    { month: 'Jan 2026', value: -0.1 },
    { month: 'Feb 2026', value: -0.2 },
    { month: 'Mar 2026', value: 0.0 },
    { month: 'Apr 2026', value: 0.1 },
    { month: 'May 2026', value: -0.1 },
    { month: 'Jun 2026', value: -0.3 },
    { month: 'Jul 2026', value: -0.4 },
    { month: 'Aug 2026', value: -0.4 },
    { month: 'Sep 2026', value: -0.3 }
  ],
  interpretation: 'The Indian Ocean Dipole is currently in a slightly negative phase. This mildly discourages convective activity over the western Indian Ocean, compounding the suppressing effect of the emerging El Niño.'
};

export const mjoData: MJOData = {
  currentPhase: 3,
  currentAmplitude: 1.4,
  status: 'Active over Indian Ocean',
  phaseLabels: {
    1: 'Western Hemisphere & Africa',
    2: 'Indian Ocean',
    3: 'Indian Ocean',
    4: 'Maritime Continent',
    5: 'Maritime Continent',
    6: 'Western Pacific',
    7: 'Western Pacific',
    8: 'Western Hemisphere & Africa'
  },
  trajectory: [
    { day: -39, rmm1: -0.20, rmm2: -0.80, phase: 2, amplitude: 0.82 },
    { day: -38, rmm1: -0.40, rmm2: -0.85, phase: 2, amplitude: 0.94 },
    { day: -37, rmm1: -0.60, rmm2: -0.90, phase: 2, amplitude: 1.08 },
    { day: -36, rmm1: -0.75, rmm2: -0.80, phase: 2, amplitude: 1.10 },
    { day: -35, rmm1: -0.90, rmm2: -0.50, phase: 3, amplitude: 1.03 },
    { day: -34, rmm1: -0.95, rmm2: -0.20, phase: 3, amplitude: 0.97 },
    { day: -33, rmm1: -0.90, rmm2: 0.10, phase: 3, amplitude: 0.91 },
    { day: -32, rmm1: -0.85, rmm2: 0.30, phase: 4, amplitude: 0.90 },
    { day: -31, rmm1: -0.70, rmm2: 0.60, phase: 4, amplitude: 0.92 },
    { day: -30, rmm1: -0.50, rmm2: 0.80, phase: 4, amplitude: 0.94 },
    { day: -29, rmm1: -0.20, rmm2: 1.00, phase: 5, amplitude: 1.02 },
    { day: -28, rmm1: 0.10, rmm2: 1.10, phase: 5, amplitude: 1.10 },
    { day: -27, rmm1: 0.40, rmm2: 1.20, phase: 5, amplitude: 1.26 },
    { day: -26, rmm1: 0.70, rmm2: 1.15, phase: 6, amplitude: 1.35 },
    { day: -25, rmm1: 0.90, rmm2: 1.00, phase: 6, amplitude: 1.35 },
    { day: -24, rmm1: 1.10, rmm2: 0.70, phase: 6, amplitude: 1.30 },
    { day: -23, rmm1: 1.20, rmm2: 0.40, phase: 6, amplitude: 1.26 },
    { day: -22, rmm1: 1.25, rmm2: 0.10, phase: 7, amplitude: 1.25 },
    { day: -21, rmm1: 1.20, rmm2: -0.20, phase: 7, amplitude: 1.22 },
    { day: -20, rmm1: 1.10, rmm2: -0.50, phase: 7, amplitude: 1.21 },
    { day: -19, rmm1: 0.90, rmm2: -0.80, phase: 7, amplitude: 1.20 },
    { day: -18, rmm1: 0.60, rmm2: -1.00, phase: 8, amplitude: 1.17 },
    { day: -17, rmm1: 0.30, rmm2: -1.10, phase: 8, amplitude: 1.14 },
    { day: -16, rmm1: 0.00, rmm2: -1.20, phase: 8, amplitude: 1.20 },
    { day: -15, rmm1: -0.30, rmm2: -1.10, phase: 1, amplitude: 1.14 },
    { day: -14, rmm1: -0.50, rmm2: -1.00, phase: 1, amplitude: 1.12 },
    { day: -13, rmm1: -0.70, rmm2: -0.90, phase: 1, amplitude: 1.14 },
    { day: -12, rmm1: -0.90, rmm2: -0.80, phase: 1, amplitude: 1.20 },
    { day: -11, rmm1: -1.00, rmm2: -0.60, phase: 2, amplitude: 1.17 },
    { day: -10, rmm1: -1.10, rmm2: -0.40, phase: 2, amplitude: 1.17 },
    { day: -9, rmm1: -1.20, rmm2: -0.20, phase: 2, amplitude: 1.22 },
    { day: -8, rmm1: -1.25, rmm2: -0.05, phase: 2, amplitude: 1.25 },
    { day: -7, rmm1: -1.30, rmm2: 0.10, phase: 3, amplitude: 1.30 },
    { day: -6, rmm1: -1.35, rmm2: 0.30, phase: 3, amplitude: 1.38 },
    { day: -5, rmm1: -1.30, rmm2: 0.50, phase: 3, amplitude: 1.39 },
    { day: -4, rmm1: -1.25, rmm2: 0.70, phase: 3, amplitude: 1.43 },
    { day: -3, rmm1: -1.20, rmm2: 0.85, phase: 3, amplitude: 1.47 },
    { day: -2, rmm1: -1.15, rmm2: 0.95, phase: 3, amplitude: 1.49 },
    { day: -1, rmm1: -1.05, rmm2: 0.95, phase: 3, amplitude: 1.42 },
    { day: 0, rmm1: -0.95, rmm2: 1.03, phase: 3, amplitude: 1.40 }
  ],
  interpretation: 'The MJO is currently situated in Phase 3 with a strong amplitude (1.4), directing active convection over the Indian Ocean. Historically, an active MJO traversing Phases 2 and 3 significantly enhances rainfall over India, partially counteracting the broader suppressing effects of the ENSO and IOD in the near term.'
};

export const climateDriversSummary: ClimateDriversSummary = {
  overallInterpretation: 'The background climate state features a developing Weak El Niño and a slightly negative IOD, a setup that generally suppresses rainfall over East India and elevates the risk of monsoon breaks. However, a robust MJO currently active over the Indian Ocean (Phase 3) is expected to temporarily fuel convection, driving active monsoon conditions for Week 1 before its eastward propagation introduces a drier regime in Week 2.',
  onsetImpact: 'enhancing',
  breakRisk: 'elevated'
};
