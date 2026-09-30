import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { t, languageNames, type Language } from '../data/translations';
import { blocks } from '../data/blocks';
import { forecasts } from '../data/forecasts';
import { toSimpleId, getRiskColor, getRiskLevel } from '../utils/helpers';
import { Volume2, Share2, CloudRain, Sun, CloudOff, AlertTriangle } from 'lucide-react';

const FarmerView: React.FC = () => {
  const { language, setLanguage, selectedBlock, setSelectedBlock } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Data access
  const blockId = selectedBlock || (blocks.length > 0 ? blocks[0].id : '');
  const forecast = forecasts.find(f => f.blockId === toSimpleId(blockId));
  
  const onsetProb = forecast?.hazardProbabilities?.onset?.week1 ?? 0;
  const breakProb = forecast?.hazardProbabilities?.break?.week1 ?? 0;
  const heavyProb = forecast?.hazardProbabilities?.heavy?.week1 ?? 0;

  const onsetRiskLevel = getRiskLevel(onsetProb);
  const breakRiskLevel = getRiskLevel(breakProb);
  const heavyRiskLevel = getRiskLevel(heavyProb);

  const onsetStatus = onsetProb > 60 ? 'Likely this week. Prepare fields.' : 'Unlikely this week. Wait for updates.';
  const breakStatus = breakProb > 60 ? 'High chance of dry spell. Conserve water.' : 'Normal rainfall expected.';
  const heavyStatus = heavyProb > 60 ? 'Heavy rain expected. Ensure drainage.' : 'No heavy rain expected.';

  const weeklyOutlook = [
    { condition: (forecast?.hazardProbabilities?.heavy?.week1 ?? 0) > 50 ? 'Heavy Rain' : (forecast?.hazardProbabilities?.onset?.week1 ?? 0) > 50 ? 'Rain' : 'Sunny' },
    { condition: (forecast?.hazardProbabilities?.heavy?.week2 ?? 0) > 50 ? 'Heavy Rain' : (forecast?.hazardProbabilities?.onset?.week2 ?? 0) > 50 ? 'Rain' : 'Sunny' },
    { condition: (forecast?.hazardProbabilities?.heavy?.week3 ?? 0) > 50 ? 'Heavy Rain' : (forecast?.hazardProbabilities?.onset?.week3 ?? 0) > 50 ? 'Rain' : 'Sunny' },
    { condition: (forecast?.hazardProbabilities?.heavy?.week4 ?? 0) > 50 ? 'Heavy Rain' : (forecast?.hazardProbabilities?.onset?.week4 ?? 0) > 50 ? 'Rain' : 'Sunny' }
  ];

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string, lang: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'or' ? 'or-IN' : lang === 'bn' ? 'bn-IN' : lang === 'te' ? 'te-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const getAdvisoryText = () => {
    if (!forecast) return t(language, 'no_data') || 'No data available.';
    return `${t(language, 'monsoon_onset') || 'Monsoon Onset'}: ${onsetStatus}. ${t(language, 'dry_spells') || 'Dry Spells'}: ${breakStatus}. ${t(language, 'heavy_rain') || 'Heavy Rain'}: ${heavyStatus}.`;
  };

  const shareOnWhatsApp = () => {
    const text = getAdvisoryText();
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const languages: Language[] = ['en', 'hi', 'or', 'bn', 'te', 'ta'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0e1a] text-white flex items-center justify-center p-0 sm:p-6 pb-20 sm:pb-6">
      {/* Phone Frame Wrapper */}
      <div className="w-full h-full sm:w-[400px] sm:h-[800px] sm:border-[12px] sm:border-gray-900 sm:rounded-[3rem] sm:overflow-hidden relative bg-[#0f172a] sm:shadow-2xl flex flex-col overflow-y-auto">
        
        {/* Header Section */}
        <div className="p-4 bg-[#1e293b] shadow-md z-10 sticky top-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sun className="text-yellow-400" /> 
              {t(language, 'farmer_portal') || 'Farmer Portal'}
            </h1>
            <select
              value={blockId}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-[#334155] text-white border border-[#475569] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[140px] truncate"
            >
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  language === lang 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#334155] text-gray-300 hover:bg-[#475569]'
                }`}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <motion.div 
          className="flex-1 p-4 flex flex-col gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <button
              onClick={() => speak(getAdvisoryText(), language)}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
                isSpeaking ? 'bg-blue-500 text-white' : 'bg-[#334155] text-white hover:bg-[#475569]'
              }`}
            >
              <Volume2 className={isSpeaking ? 'animate-pulse' : ''} size={20} />
              {isSpeaking ? (t(language, 'playing') || 'Playing...') : (t(language, 'listen') || 'Listen')}
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <Share2 size={20} />
              {t(language, 'share') || 'Share'}
            </button>
          </motion.div>

          {forecast ? (
            <>
              {/* Risk Cards */}
              <motion.div variants={itemVariants} className="glass rounded-2xl p-5 border-l-4" style={{ borderColor: getRiskColor(onsetProb) }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CloudRain className="text-blue-400" />
                    {t(language, 'monsoon_onset') || 'Monsoon Onset'}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${getRiskColor(onsetProb)}20`, color: getRiskColor(onsetProb) }}
                  >
                    {onsetRiskLevel}
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1">{onsetProb}% <span className="text-sm font-normal text-gray-400">probability</span></p>
                <p className="text-gray-300 mt-2 text-sm">{onsetStatus}</p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass rounded-2xl p-5 border-l-4" style={{ borderColor: getRiskColor(breakProb) }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CloudOff className="text-orange-400" />
                    {t(language, 'dry_spells') || 'Dry Spells'}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${getRiskColor(breakProb)}20`, color: getRiskColor(breakProb) }}
                  >
                    {breakRiskLevel}
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1">{breakProb}% <span className="text-sm font-normal text-gray-400">probability</span></p>
                <p className="text-gray-300 mt-2 text-sm">{breakStatus}</p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass rounded-2xl p-5 border-l-4" style={{ borderColor: getRiskColor(heavyProb) }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="text-red-400" />
                    {t(language, 'heavy_rain') || 'Heavy Rain'}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${getRiskColor(heavyProb)}20`, color: getRiskColor(heavyProb) }}
                  >
                    {heavyRiskLevel}
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1">{heavyProb}% <span className="text-sm font-normal text-gray-400">probability</span></p>
                <p className="text-gray-300 mt-2 text-sm">{heavyStatus}</p>
              </motion.div>

              {/* Weekly Outlook */}
              <motion.div variants={itemVariants} className="mt-2 mb-4">
                <h3 className="text-md font-semibold mb-3">{t(language, 'weekly_outlook') || 'Weekly Outlook'}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {weeklyOutlook.map((week, idx) => (
                    <div key={idx} className="bg-[#1e293b] rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-sm">
                      <span className="text-xs text-gray-400 mb-1">W{idx + 1}</span>
                      <span className="text-2xl mb-1">
                        {week.condition.toLowerCase().includes('heavy') ? '⛈️' : week.condition.toLowerCase().includes('rain') ? '🌧️' : '☀️'}
                      </span>
                      <span className="text-[10px] text-gray-300 leading-tight">
                        {week.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              {t(language, 'no_data') || 'No data available for this block.'}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FarmerView;
