import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { ensoData, iodData, mjoData, climateDriversSummary } from '../data/indices';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Thermometer, Waves, Wind, Info } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-16 w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2} 
          dot={false}
          isAnimationActive={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const MjoPhaseDiagram = () => {
  const center = 150;
  const maxRmm = 3.5;
  const scale = 110 / maxRmm; // 110 is max radius to leave room for labels
  const innerRadius = scale * 1; // amplitude = 1

  // 8 sectors lines
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  
  const trajectory = mjoData?.trajectory || [];
  
  return (
    <div className="flex justify-center items-center py-4">
      <svg width="300" height="300" viewBox="0 0 300 300" className="max-w-full">
        {/* Background circles */}
        <circle cx={center} cy={center} r={110} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={center} y={center} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" dominantBaseline="middle">
          Amplitude {"<"} 1
        </text>

        {/* Sector Lines */}
        {angles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = center + 110 * Math.cos(rad);
          const y2 = center + 110 * Math.sin(rad);
          return (
            <line 
              key={i}
              x1={center} 
              y1={center} 
              x2={x2} 
              y2={y2} 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1"
            />
          );
        })}

        {/* Phase Labels - placed around the edge roughly */}
        {[
          { p: 1, x: 80, y: 280 },
          { p: 2, x: 220, y: 280 },
          { p: 3, x: 280, y: 220 },
          { p: 4, x: 280, y: 80 },
          { p: 5, x: 220, y: 20 },
          { p: 6, x: 80, y: 20 },
          { p: 7, x: 20, y: 80 },
          { p: 8, x: 20, y: 220 },
        ].map((pos) => {
          const label = mjoData?.phaseLabels ? mjoData.phaseLabels[pos.p] : `Phase ${pos.p}`;
          return (
            <text key={pos.p} x={pos.x} y={pos.y} fill="rgba(255,255,255,0.4)" fontSize="12" textAnchor="middle">
              {label}
            </text>
          );
        })}

        {/* Trajectory */}
        {trajectory.map((point: any, i: number) => {
          if (i === 0) return null;
          const prev = trajectory[i - 1];
          const x1 = center + prev.rmm1 * scale;
          const y1 = center - prev.rmm2 * scale; // Invert Y
          const x2 = center + point.rmm1 * scale;
          const y2 = center - point.rmm2 * scale; // Invert Y
          
          const opacity = 0.2 + (i / trajectory.length) * 0.8;
          
          return (
            <line 
              key={`line-${i}`}
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke={`rgba(45, 212, 191, ${opacity})`} 
              strokeWidth="2"
            />
          );
        })}
        
        {trajectory.map((point: any, i: number) => {
          const x = center + point.rmm1 * scale;
          const y = center - point.rmm2 * scale;
          const isLast = i === trajectory.length - 1;
          const opacity = 0.2 + (i / trajectory.length) * 0.8;
          
          return (
            <circle 
              key={`dot-${i}`}
              cx={x} 
              cy={y} 
              r={isLast ? 6 : 3} 
              fill={`rgba(45, 212, 191, ${opacity})`}
              className={isLast ? "animate-pulse" : ""}
            />
          );
        })}
      </svg>
    </div>
  );
};

const GlobalDrivers = () => {
  const { language } = useApp();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wind className="w-8 h-8 text-teal-400" />
            {t(language, 'climate_teleconnections') || 'Climate Teleconnections'}
          </h1>
          <p className="text-gray-400">
            {t(language, 'global_drivers_desc') || 'Monitor large-scale climate patterns affecting the monsoon.'}
          </p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* ENSO Card */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-white">ENSO (Niño 3.4)</h2>
            </div>
            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Weak El Niño
            </span>
          </div>
          
          <div className="mt-2">
            <div className="text-3xl font-bold text-white mb-1">+0.6 <span className="text-sm font-normal text-gray-400">°C anomaly</span></div>
          </div>

          <Sparkline data={ensoData.series || []} color="#eab308" />
        </motion.div>

        {/* IOD Card */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">IOD (DMI)</h2>
            </div>
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Slightly Negative
            </span>
          </div>
          
          <div className="mt-2">
            <div className="text-3xl font-bold text-white mb-1">−0.3 <span className="text-sm font-normal text-gray-400">°C anomaly</span></div>
          </div>

          <Sparkline data={iodData.series || []} color="#60a5fa" />
        </motion.div>

        {/* MJO Card */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 lg:col-span-3 lg:row-start-2">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <Wind className="w-6 h-6 text-teal-400" />
                  <h2 className="text-xl font-semibold text-white">MJO Phase</h2>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    Phase 3
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                    Amp: 1.4
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                The Madden-Julian Oscillation (MJO) is currently in Phase 3 over the Indian Ocean with moderate amplitude. 
                This generally supports enhanced convection and favorable rainfall patterns for the Indian subcontinent.
              </p>
              
              <div className="bg-[#111827] rounded-xl p-4 border border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Regional Impacts:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>Enhanced rainfall likelihood over Peninsular India and Bay of Bengal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>Favorable for active monsoon conditions in the next 1-2 weeks.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex-shrink-0 lg:w-1/2 flex justify-center bg-black/20 rounded-xl">
              <MjoPhaseDiagram />
            </div>
          </div>
        </motion.div>

        {/* Climate Summary */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Composite Outlook
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 text-lg text-gray-200 leading-relaxed font-light">
              {climateDriversSummary?.overallInterpretation || "The combination of a weak El Niño and slightly negative IOD suggests a cautious outlook for total seasonal rainfall. However, the current active MJO phase in the Indian Ocean may provide short-term bursts of enhanced precipitation, temporarily overriding the larger scale suppression."}
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <div className="text-sm text-gray-400">Onset Impact</div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-white font-medium">{climateDriversSummary?.onsetImpact || "Slight Delay"}</span>
                </div>
              </div>
              <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <div className="text-sm text-gray-400">Break Risk</div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-white font-medium">{climateDriversSummary?.breakRisk || "Elevated"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default GlobalDrivers;
