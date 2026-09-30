import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { blocks, districts } from '../data/blocks';
import { generateAdvisory, crops, stages, soilTypes, irrigationOptions } from '../data/advisories';
import { toSimpleId, getRiskBadgeColor } from '../utils/helpers';
import { Sprout, Loader2, CheckCircle, AlertTriangle, Shield, Leaf, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdvisoryPage() {
  const { language, theme, selectedBlock: defaultBlockId } = useApp();
  
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>(defaultBlockId || '');
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy (Rice)');
  const [selectedStage, setSelectedStage] = useState<string>('Sowing');
  const [selectedSoil, setSelectedSoil] = useState<string>('Clay');
  const [selectedIrrigation, setSelectedIrrigation] = useState<string>('Yes — Assured');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [advisoryResult, setAdvisoryResult] = useState<any>(null);

  // Initialize selected district based on defaultBlockId if available
  useEffect(() => {
    if (defaultBlockId) {
      const block = blocks.find((b) => b.id === defaultBlockId);
      if (block) {
        setSelectedDistrict(block.district);
        setSelectedBlock(defaultBlockId);
      }
    } else if (districts.length > 0) {
      setSelectedDistrict(districts[0].id);
    }
  }, [defaultBlockId]);

  // Update block selection when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const districtBlocks = blocks.filter((b) => b.district === selectedDistrict);
      if (districtBlocks.length > 0) {
        // Only set if current selected block is not in the new district
        const isCurrentBlockInDistrict = districtBlocks.some(b => b.id === selectedBlock);
        if (!isCurrentBlockInDistrict) {
           setSelectedBlock(districtBlocks[0].id);
        }
      }
    }
  }, [selectedDistrict]);


  const filteredBlocks = blocks.filter((b) => b.district === selectedDistrict);

  const handleGenerate = () => {
    setIsGenerating(true);
    setAdvisoryResult(null);
    setProgress(0);

    const loadingSteps = [
      'Analyzing onset probabilities...',
      'Checking break risk windows...',
      'Running rule engine reasoning...',
      'Generating crop-specific advisory...'
    ];
    
    let step = 0;
    setLoadingText(loadingSteps[0]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) return 100;
        return next;
      });
      
      if (step < loadingSteps.length - 1 && Math.random() > 0.7) {
        step++;
        setLoadingText(loadingSteps[step]);
      }
    }, 75);

    setTimeout(() => {
      clearInterval(interval);
      setIsGenerating(false);
      
      const result = generateAdvisory({
        blockId: toSimpleId(selectedBlock),
        crop: selectedCrop,
        stage: selectedStage,
        soilType: selectedSoil,
        irrigation: selectedIrrigation,
      });
      
      setAdvisoryResult(result);
      toast.success('Advisory generated successfully');
    }, 1500);
  };

  const getRiskColorClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'severe': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <Sprout className="w-8 h-8 text-teal-400" />
        <h1 className="text-3xl font-bold text-white">{t(language, 'advisoryEngine')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="glass rounded-2xl p-6 h-fit space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Input Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">District</label>
              <select
                className="w-full bg-[#131b2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Block</label>
              <select
                className="w-full bg-[#131b2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                {filteredBlocks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Crop</label>
              <select
                className="w-full bg-[#131b2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sowing Stage</label>
              <select
                className="w-full bg-[#131b2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Soil Type</label>
              <select
                className="w-full bg-[#131b2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
              >
                {soilTypes.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Irrigation</label>
              <select
                className="w-full bg-[#131b2f] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                value={selectedIrrigation}
                onChange={(e) => setSelectedIrrigation(e.target.value)}
              >
                {irrigationOptions.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sprout className="w-5 h-5" />
                Generate Advisory
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] space-y-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-700 border-t-teal-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-teal-500 animate-pulse" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium text-white">Rule Engine Active</h3>
                  <p className="text-teal-400 h-6 transition-all">{loadingText}</p>
                </div>

                <div className="w-full max-w-md bg-gray-800 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-2.5 rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {!isGenerating && advisoryResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Header Card */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColorClass(advisoryResult.severity)}`}>
                      {advisoryResult.severity.toUpperCase()} RISK
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full text-sm font-medium flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {advisoryResult.confidence}% Confidence
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{advisoryResult.title}</h2>
                  <p className="text-gray-300">{advisoryResult.weeklyOutlook}</p>
                </div>

                {/* Rule Trace */}
                <div className="glass rounded-2xl p-6 bg-[#0a0e1a]/80">
                  <h3 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Rule Engine Trace
                  </h3>
                  <pre className="font-mono text-sm text-teal-300 bg-black/30 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
                    {advisoryResult.ruleTrace}
                  </pre>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-teal-400" />
                      Actionable Steps
                    </h3>
                    <ul className="space-y-4">
                      {advisoryResult.actions.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-medium mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    {advisoryResult.varietyRec && (
                      <div className="glass rounded-2xl p-6 border border-teal-500/30 bg-teal-900/10">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-teal-400" />
                          Variety Recommendation
                        </h3>
                        <p className="text-gray-300">{advisoryResult.varietyRec}</p>
                      </div>
                    )}
                    
                    {advisoryResult.agronomicPractices && advisoryResult.agronomicPractices.length > 0 && (
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Droplets className="w-5 h-5 text-blue-400" />
                          Agronomic Practices
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {advisoryResult.agronomicPractices.map((practice: string, idx: number) => (
                            <li key={idx}>{practice}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {!isGenerating && !advisoryResult && (
              <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <Sprout className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">Ready to Generate Advisory</h3>
                <p className="text-gray-500 max-w-sm">
                  Select your parameters on the left and click 'Generate Advisory' to run the rule engine.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
