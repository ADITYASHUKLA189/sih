import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, YAxis as BarYAxis, XAxis as BarXAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Pause, X, TrendingUp, Droplets, CloudRain, ArrowRightLeft } from 'lucide-react';

import { blocks, getBlockById } from '../data/blocks';
import { forecasts } from '../data/forecasts';
import { toSimpleId, getRiskColor, getRiskLevel } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';

// SHAP dummy data generator
const generateShapData = (blockId: string) => {
  const hash = blockId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [
    { feature: 'ENSO', value: (hash % 10) * 0.03 - 0.1 },
    { feature: 'IOD', value: (hash % 8) * 0.04 - 0.15 },
    { feature: 'MJO Phase', value: (hash % 12) * 0.02 + 0.05 },
    { feature: 'SST Gradient', value: (hash % 5) * 0.05 },
    { feature: '850hPa Winds', value: (hash % 7) * 0.03 - 0.05 },
    { feature: 'Soil Moisture', value: (hash % 6) * 0.04 - 0.08 },
    { feature: 'Topography', value: (hash % 9) * 0.02 + 0.02 },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
};

export default function RiskMap() {
  const { language, selectedBlock, setSelectedBlock, drawerOpen, setDrawerOpen } = useApp();
  
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedHazard, setSelectedHazard] = useState<'onset' | 'break' | 'heavy'>('onset');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    let interval: number | ReturnType<typeof setTimeout>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDay((prev) => (prev >= 30 ? 1 : prev + 1));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  // interpolate selected week based on current day
  const effectiveWeek = isPlaying ? Math.ceil(currentDay / 7.5) : selectedWeek;

  const handleBlockClick = (blockId: string) => {
    setSelectedBlock(blockId);
    setDrawerOpen(true);
  };

  const blockDetails = selectedBlock ? getBlockById(selectedBlock) : null;
  const blockForecast = selectedBlock ? forecasts.find(f => f.blockId === toSimpleId(selectedBlock)) : null;

  return (
    <div className="flex flex-col h-full gap-4 relative">
      {/* Controls Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Lead time */}
        <div className="flex bg-[#111827] rounded-lg p-1">
          {[1, 2, 3, 4].map(w => (
            <button
              key={w}
              onClick={() => { setSelectedWeek(w); setIsPlaying(false); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${effectiveWeek === w && !isPlaying ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Week {w}
            </button>
          ))}
        </div>

        {/* Hazard Toggle */}
        <div className="flex bg-[#111827] rounded-lg p-1">
          <button
            onClick={() => setSelectedHazard('onset')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${selectedHazard === 'onset' ? 'bg-[#0f172a] border border-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <TrendingUp size={16} className={selectedHazard === 'onset' ? 'text-teal-400' : ''} />
            Onset
          </button>
          <button
            onClick={() => setSelectedHazard('break')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${selectedHazard === 'break' ? 'bg-[#0f172a] border border-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Droplets size={16} className={selectedHazard === 'break' ? 'text-yellow-400' : ''} />
            Dry Spell
          </button>
          <button
            onClick={() => setSelectedHazard('heavy')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${selectedHazard === 'heavy' ? 'bg-[#0f172a] border border-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <CloudRain size={16} className={selectedHazard === 'heavy' ? 'text-blue-400' : ''} />
            Heavy Rain
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search block or panchayat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Compare */}
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
          <ArrowRightLeft size={16} />
          Compare
        </button>
      </div>

      {/* Main Map Area */}
      <div className="relative flex-1 glass rounded-2xl overflow-hidden min-h-[60vh] z-0">
        <MapContainer center={[20.5, 84.5]} zoom={7} style={{ height: '600px', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {blocks.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.panchayats.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))).map(block => {
            const forecast = forecasts.find(f => f.blockId === toSimpleId(block.id));
            const hazardKey = selectedHazard as 'onset' | 'break' | 'heavy';
            const weekKey = `week${effectiveWeek}` as 'week1' | 'week2' | 'week3' | 'week4';
            const prob = forecast?.hazardProbabilities[hazardKey]?.[weekKey] ?? 50;
            const color = getRiskColor(prob);
            
            return (
              <Polygon 
                key={block.id} 
                positions={block.polygon as any} 
                pathOptions={{
                  fillColor: color,
                  fillOpacity: selectedBlock === block.id ? 0.8 : 0.6,
                  color: selectedBlock === block.id ? '#fff' : 'rgba(255,255,255,0.3)',
                  weight: selectedBlock === block.id ? 3 : 1
                }}
                eventHandlers={{
                  click: () => handleBlockClick(block.id)
                }}
              >
                <LeafletTooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip">
                  <div className="bg-[#0a0e1a] border border-gray-700 p-2 rounded shadow-xl text-white text-sm">
                    <div className="font-bold">{block.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                      <span>Probability: {prob}%</span>
                    </div>
                  </div>
                </LeafletTooltip>
              </Polygon>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-[1000] glass p-3 rounded-xl border border-gray-800">
          <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Risk Level</div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Extreme (>80%)', color: '#ef4444' },
              { label: 'High (60-80%)', color: '#f97316' },
              { label: 'Moderate (40-60%)', color: '#eab308' },
              { label: 'Low (<40%)', color: '#22c55e' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4 z-10 relative">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-teal-600/20 text-teal-400 flex items-center justify-center hover:bg-teal-600/30 transition-colors"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Day 1</span>
            <span className="font-medium text-white">Day {currentDay} of 30 — Monsoon Progression</span>
            <span>Day 30</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            value={currentDay}
            onChange={(e) => {
              setCurrentDay(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full accent-teal-500 bg-gray-800 rounded-lg appearance-none h-2 cursor-pointer"
          />
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && blockDetails && blockForecast && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0a0e1a]/95 backdrop-blur-xl border-l border-gray-800 z-[2000] overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-gray-800 sticky top-0 bg-[#0a0e1a]/90 backdrop-blur z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{blockDetails.name}</h2>
                <p className="text-sm text-gray-400">{blockDetails.district} District</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-6">
              {/* Gauges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Onset', prob: blockForecast.hazardProbabilities.onset.week1, color: '#2dd4bf' },
                  { label: 'Break', prob: blockForecast.hazardProbabilities.break.week1, color: '#facc15' },
                  { label: 'Heavy Rain', prob: blockForecast.hazardProbabilities.heavy.week1, color: '#60a5fa' }
                ].map(hazard => (
                  <div key={hazard.label} className="bg-gray-800/30 rounded-xl p-3 flex flex-col items-center relative">
                    <div className="h-16 w-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{ value: hazard.prob }, { value: 100 - hazard.prob }]}
                            cx="50%" cy="50%"
                            innerRadius={20} outerRadius={28}
                            startAngle={90} endAngle={-270}
                            dataKey="value" stroke="none"
                          >
                            <Cell fill={hazard.color} />
                            <Cell fill="#1f2937" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                      {hazard.prob}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">{hazard.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-gray-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-4">30-Day Rainfall Forecast (mm)</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={blockForecast.dailyRainfall} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                      <RTooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="p90" stroke="none" fill="#1e3a8a" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="p75" stroke="none" fill="#1e3a8a" fillOpacity={0.4} />
                      <Area type="monotone" dataKey="median" stroke="#3b82f6" strokeWidth={2} fill="url(#colorMedian)" />
                      <Area type="step" dataKey={() => 30} stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Onset Threshold (30mm)
                  </div>
                  <div className="text-white font-medium">Predicted: {blockForecast.onsetPrediction.startDate}</div>
                </div>
              </div>

              {/* SHAP Explanation */}
              <div className="bg-gray-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-4">Why this forecast?</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={generateShapData(blockDetails.id)}
                      margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                      <BarXAxis type="number" stroke="#6b7280" fontSize={10} />
                      <BarYAxis type="category" dataKey="feature" stroke="#6b7280" fontSize={10} width={80} />
                      <RTooltip 
                        cursor={{fill: '#374151', opacity: 0.4}}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        formatter={(val: any) => [Number(val) > 0 ? `+${Number(val).toFixed(2)}` : Number(val).toFixed(2), 'Impact']}
                      />
                      <Bar dataKey="value">
                        {generateShapData(blockDetails.id).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Historical Analogs */}
              <div className="bg-gray-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Historical Analog Years</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-[#111827] p-2 rounded-lg text-sm border border-gray-700/50">
                    <span className="font-bold text-white">2019</span>
                    <span className="text-gray-400">High Similarity</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#111827] p-2 rounded-lg text-sm border border-gray-700/50">
                    <span className="font-bold text-white">2015</span>
                    <span className="text-blue-400">La Niña</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#111827] p-2 rounded-lg text-sm border border-gray-700/50">
                    <span className="font-bold text-white">2020</span>
                    <span className="text-orange-400">IOD+</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#111827] p-2 rounded-lg text-sm border border-gray-700/50">
                    <span className="font-bold text-white">2017</span>
                    <span className="text-gray-400">Neutral</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
