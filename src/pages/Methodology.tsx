import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Brain, Database, Cloud, Satellite, MessageSquare, Target, Award, ArrowRight, Layers, Cpu } from 'lucide-react';

const Methodology = () => {
  const { language } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const comparisonData = [
    {
      metric: 'Onset Accuracy',
      'Our Model': 85,
      'IMD Baseline': 62,
    },
    {
      metric: 'Break Detection',
      'Our Model': 78,
      'IMD Baseline': 45,
    },
    {
      metric: 'Heavy Rain F1',
      'Our Model': 81,
      'IMD Baseline': 58,
    },
    {
      metric: 'Lead Time (days)',
      'Our Model': 21,
      'IMD Baseline': 7,
    },
  ];

  const validationMetrics = [
    {
      name: 'Brier Score',
      value: '0.18',
      explanation: 'Lower is better. Indicates the accuracy of probabilistic predictions.',
      score: 82, // for progress bar equivalent (100 - 18)
    },
    {
      name: 'ROC-AUC',
      value: '0.87',
      explanation: 'Measures model ability to distinguish between classes (e.g. rain vs no rain).',
      score: 87,
    },
    {
      name: 'CRPS',
      value: '12.3 mm',
      explanation: 'Continuous Ranked Probability Score. Lower is better for rainfall amount.',
      score: 75,
    },
    {
      name: 'Onset Date MAE',
      value: '3.2 days',
      explanation: 'Mean Absolute Error. Average deviation in predicting monsoon onset date.',
      score: 90,
    },
    {
      name: 'Reliability Slope',
      value: '0.94',
      explanation: 'Perfect reliability is 1.0. Measures how well predicted probabilities match observed frequencies.',
      score: 94,
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Prototype (Current)',
      desc: 'Validation with 6 districts, 24 blocks in Odisha.',
    },
    {
      phase: 'Phase 2',
      title: 'Real-time Integration (6m)',
      desc: 'Integration with real-time NCMRWF data, expand to all 30 Odisha districts.',
    },
    {
      phase: 'Phase 3',
      title: 'Operational Deployment (12m)',
      desc: 'Deployment with IMD, automated early warning alert system.',
    },
    {
      phase: 'Phase 4',
      title: 'Pan-India Coverage (18m)',
      desc: 'Pan-India coverage, integration with PM-KISAN, crop insurance linkage.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t(language, 'methodology') || 'Methodology & Architecture'}</h1>
        <p className="text-slate-400">Discover how our hybrid ML architecture processes multi-source data to generate reliable forecasts.</p>
      </motion.div>

      {/* Architecture Diagram Section */}
      <motion.section initial="hidden" animate="visible" variants={itemVariants} className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Layers className="text-teal-400" /> System Architecture
        </h2>
        
        <div className="relative flex flex-col items-center py-4">
          
          {/* Layer 1: Data Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10">
            <motion.div variants={itemVariants} className="glass rounded-xl p-5 border border-slate-700/50 bg-slate-800/40 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Database size={20} /></div>
                <h3 className="font-semibold text-white">Global Climate Indices</h3>
              </div>
              <p className="text-sm text-slate-300">ENSO, Indian Ocean Dipole (IOD), and Madden-Julian Oscillation (MJO) data.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-xl p-5 border border-slate-700/50 bg-slate-800/40 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Satellite size={20} /></div>
                <h3 className="font-semibold text-white">NWP & Satellite Inputs</h3>
              </div>
              <p className="text-sm text-slate-300">ERA5, NCMRWF NCUM, IMD gridded rainfall, CHIRPS, and soil moisture.</p>
            </motion.div>
          </div>

          {/* SVG Animated Arrows 1 */}
          <svg className="w-full h-16 max-w-4xl -my-1 z-0" preserveAspectRatio="none">
            <path d="M 25% 0 C 25% 40, 50% 40, 50% 64" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            <path d="M 75% 0 C 75% 40, 50% 40, 50% 64" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            <polygon points="50,64 46,56 54,56" fill="#2dd4bf" />
          </svg>

          {/* Layer 2: Model Core */}
          <motion.div variants={itemVariants} className="glass rounded-xl p-6 border border-teal-500/30 bg-teal-900/20 w-full max-w-2xl z-10 text-center shadow-[0_0_30px_rgba(45,212,191,0.1)] relative">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-teal-500/20 rounded-full text-teal-400 ring-4 ring-teal-500/10">
                <Brain size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hybrid Machine Learning Engine</h3>
            <p className="text-slate-300 text-sm mb-4">LSTM/Transformer architecture for sequential modeling combined with XGBoost for localized spatial downscaling, followed by Bayesian calibration.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-slate-800/60 rounded-full text-xs text-teal-300">Transformers</span>
              <span className="px-3 py-1 bg-slate-800/60 rounded-full text-xs text-teal-300">XGBoost</span>
              <span className="px-3 py-1 bg-slate-800/60 rounded-full text-xs text-teal-300">Bayesian NNs</span>
            </div>
          </motion.div>

          {/* SVG Animated Arrows 2 */}
          <svg className="w-full h-16 max-w-2xl -my-1 z-0" preserveAspectRatio="none">
            <path d="M 50% 0 L 50% 64" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            <polygon points="50,64 46,56 54,56" fill="#2dd4bf" />
          </svg>

          {/* Layer 3: Probabilistic Outputs & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10">
            <motion.div variants={itemVariants} className="glass rounded-xl p-5 border border-slate-700/50 bg-slate-800/40 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><Target size={20} /></div>
                <h3 className="font-semibold text-white">Probabilistic Outputs</h3>
              </div>
              <p className="text-sm text-slate-300">Monsoon onset probability, dry break likelihood, heavy rain clustering, and uncertainty quantification (UQ).</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass rounded-xl p-5 border border-slate-700/50 bg-slate-800/40 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Cpu size={20} /></div>
                <h3 className="font-semibold text-white">Expert System Rules</h3>
              </div>
              <p className="text-sm text-slate-300">Risk mapping combining physical domain knowledge with model outputs to generate actionable advisory logic.</p>
            </motion.div>
          </div>

          {/* SVG Animated Arrows 3 */}
          <svg className="w-full h-16 max-w-4xl -my-1 z-0" preserveAspectRatio="none">
            <path d="M 25% 0 C 25% 40, 50% 40, 50% 64" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            <path d="M 75% 0 C 75% 40, 50% 40, 50% 64" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            <polygon points="50,64 46,56 54,56" fill="#2dd4bf" />
          </svg>

          {/* Layer 4: Delivery */}
          <motion.div variants={itemVariants} className="glass rounded-xl p-5 border border-slate-700/50 bg-slate-800/40 w-full max-w-2xl z-10 relative text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><MessageSquare size={24} /></div>
            </div>
            <h3 className="font-semibold text-white mb-2">Multilingual Delivery Channels</h3>
            <p className="text-sm text-slate-300">Interactive Web Dashboard, automated SMS alerts, WhatsApp chatbot integration, and IVR systems in local languages.</p>
          </motion.div>

        </div>
      </motion.section>

      {/* Grid for Metrics and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Validation Metrics */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="text-yellow-400" /> Validation Metrics
          </h2>
          <div className="space-y-5">
            {validationMetrics.map((metric, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{metric.name}</span>
                  <span className="font-bold text-teal-400">{metric.value}</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{metric.explanation}</p>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full" style={{ width: `${metric.score}%` }}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Comparison Chart */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-red-400" /> Model vs IMD Baseline Performance
          </h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Our Model" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="IMD Baseline" fill="#64748b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Note: 'Heavy Rain F1' scaled by 100 for visualization. Lead time evaluated on persistent anomaly detection.</p>
        </motion.section>
      </div>

      {/* Roadmap Section */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-8">Project Roadmap</h2>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2 z-0 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 z-10 relative">
            {roadmapPhases.map((phase, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left relative group">
                <div className={`w-8 h-8 rounded-full border-4 border-slate-900 z-10 mb-4 flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-teal-400' : 'bg-slate-600 group-hover:bg-teal-500 transition-colors'}`}>
                  {idx === 0 && <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>}
                </div>
                
                {/* Mobile connecting line */}
                {idx !== roadmapPhases.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-0.5 h-full bg-slate-700 -translate-x-1/2 -z-10 md:hidden"></div>
                )}
                
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 w-full hover:border-teal-500/30 transition-colors">
                  <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">{phase.phase}</span>
                  <h3 className="text-white font-semibold mt-1 mb-2">{phase.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Global styles for dashed animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -8;
          }
        }
      `}} />
    </div>
  );
};

export default Methodology;
