import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Download, FileText, AlertTriangle, CheckCircle, Shield, Filter, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

import { blocks, districts, getBlocksByDistrict } from '../data/blocks';
import { forecasts } from '../data/forecasts';
import { toSimpleId, getRiskColor, getRiskLevel } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';

export default function OfficerDashboard() {
  const { language } = useApp();
  
  const [districtFilter, setDistrictFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortKey, setSortKey] = useState('blockName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const tableData = useMemo(() => {
    return blocks.map(block => {
      const forecast = forecasts.find(f => f.blockId === toSimpleId(block.id));
      const w1 = forecast?.weeks[0];
      const w2 = forecast?.weeks[1];
      
      const onset = w1?.onset_prob || 0;
      const breakProb = w2?.break_prob || 0;
      const heavy = w2?.heavy_prob || 0;
      
      let riskLevel = 'Low Risk';
      if (onset < 40 || breakProb > 55 || heavy > 50) {
        riskLevel = 'High Risk';
      } else if (onset < 60 || breakProb > 40 || heavy > 30) {
        riskLevel = 'Medium Risk';
      }
      
      let actionNeeded = 'Monitor';
      if (riskLevel === 'High Risk') actionNeeded = 'Alert farmers';
      else if (riskLevel === 'Medium Risk') actionNeeded = 'Arrange irrigation';

      return {
        id: block.id,
        blockName: block.name,
        district: block.district,
        onset,
        break: breakProb,
        heavy,
        riskLevel,
        actionNeeded,
        sparkline: Array.from({ length: 15 }, () => ({ val: Math.floor(20 + Math.random() * 80) }))
      };
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = tableData;
    
    if (districtFilter !== 'All') {
      result = result.filter(d => d.district === districtFilter);
    }
    
    if (riskFilter !== 'All') {
      result = result.filter(d => d.riskLevel === riskFilter);
    }
    
    result.sort((a, b) => {
      let valA: any = a[sortKey as keyof typeof a];
      let valB: any = b[sortKey as keyof typeof b];
      
      if (sortKey === 'riskLevel') {
        const order = { 'High Risk': 3, 'Medium Risk': 2, 'Low Risk': 1 };
        valA = order[a.riskLevel as keyof typeof order];
        valB = order[b.riskLevel as keyof typeof order];
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [tableData, districtFilter, riskFilter, sortKey, sortDirection]);

  const stats = useMemo(() => {
    const total = tableData.length;
    const high = tableData.filter(d => d.riskLevel === 'High Risk').length;
    const medium = tableData.filter(d => d.riskLevel === 'Medium Risk').length;
    const low = tableData.filter(d => d.riskLevel === 'Low Risk').length;
    return { total, high, medium, low };
  }, [tableData]);

  const highRiskBlocks = useMemo(() => {
    return tableData.filter(d => d.riskLevel === 'High Risk');
  }, [tableData]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const exportCSV = () => {
    const header = 'Block,District,Onset W1 %,Break W2 %,Heavy W2 %,Risk Level\n';
    const rows = filteredAndSortedData.map(r => `${r.blockName},${r.district},${r.onset},${r.break},${r.heavy},${r.riskLevel}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monsoon_risk_report.csv';
    a.click();
    toast.success('CSV Exported Successfully');
  };

  const downloadPDF = () => {
    toast('PDF generation started...', { icon: '📄' });
  };

  const getCellBgColor = (prob: number, type: 'onset' | 'break' | 'heavy') => {
    if (type === 'onset') {
      if (prob < 40) return 'bg-red-500/20 text-red-400';
      if (prob < 60) return 'bg-yellow-500/20 text-yellow-400';
      return 'bg-green-500/20 text-green-400';
    } else {
      if (prob > 55) return 'bg-red-500/20 text-red-400';
      if (prob > 40) return 'bg-yellow-500/20 text-yellow-400';
      return 'bg-green-500/20 text-green-400';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    if (level === 'High Risk') return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (level === 'Medium Risk') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Extension Officer Dashboard</h1>
          <p className="text-slate-400">Data-dense view for agricultural planning and action.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Total Blocks</span>
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-3xl font-bold text-white mt-4">{stats.total}</span>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">High Risk</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-3xl font-bold text-red-400 mt-4">{stats.high}</span>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Medium Risk</span>
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-3xl font-bold text-yellow-400 mt-4">{stats.medium}</span>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Low Risk</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-3xl font-bold text-green-400 mt-4">{stats.low}</span>
        </div>
      </div>

      {highRiskBlocks.length > 0 && (
        <div className="glass rounded-2xl p-6 border-l-4 border-l-red-500">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Blocks Needing Action This Week
          </h2>
          <div className="flex flex-wrap gap-2">
            {highRiskBlocks.map(block => (
              <button 
                key={block.id}
                onClick={() => { setDistrictFilter(block.district); setRiskFilter('High Risk'); }}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-sm font-medium transition-colors cursor-pointer"
              >
                {block.blockName} ({block.district})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Filter & Sort
          </h2>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select 
              value={districtFilter} 
              onChange={e => setDistrictFilter(e.target.value)}
              className="bg-[#121a2f] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 flex-1 md:flex-none"
            >
              <option value="All">All Districts</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <select 
              value={riskFilter} 
              onChange={e => setRiskFilter(e.target.value)}
              className="bg-[#121a2f] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 flex-1 md:flex-none"
            >
              <option value="All">All Risk Levels</option>
              <option value="High Risk">High Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Low Risk">Low Risk</option>
            </select>
            <select 
              value={sortKey} 
              onChange={e => {
                setSortKey(e.target.value);
                setSortDirection('asc');
              }}
              className="bg-[#121a2f] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 flex-1 md:flex-none"
            >
              <option value="riskLevel">Sort by Risk Level</option>
              <option value="blockName">Sort by Block Name</option>
              <option value="onset">Sort by Onset Prob.</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800/50 rounded-tl-lg" onClick={() => handleSort('blockName')}>
                  <div className="flex items-center gap-1">Block Name <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => handleSort('district')}>
                  <div className="flex items-center gap-1">District <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => handleSort('onset')}>
                  <div className="flex items-center gap-1">Onset (W1) <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => handleSort('break')}>
                  <div className="flex items-center gap-1">Break (W2) <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => handleSort('heavy')}>
                  <div className="flex items-center gap-1">Heavy (W2) <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => handleSort('riskLevel')}>
                  <div className="flex items-center gap-1">Risk Level <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-300">Trend</th>
                <th className="py-3 px-4 font-semibold text-slate-300 rounded-tr-lg">Action Needed</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAndSortedData.map((row) => (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-white">{row.blockName}</td>
                    <td className="py-3 px-4 text-slate-300">{row.district}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${getCellBgColor(row.onset, 'onset')}`}>
                        {row.onset}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${getCellBgColor(row.break, 'break')}`}>
                        {row.break}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${getCellBgColor(row.heavy, 'heavy')}`}>
                        {row.heavy}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeColor(row.riskLevel)}`}>
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={row.sparkline}>
                            <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-sm">{row.actionNeeded}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8 text-slate-400">No blocks match the selected filters.</div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          <AnimatePresence>
            {filteredAndSortedData.map((row) => (
              <motion.div 
                key={row.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121a2f] border border-slate-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{row.blockName}</h3>
                    <p className="text-sm text-slate-400">{row.district}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeColor(row.riskLevel)}`}>
                    {row.riskLevel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-slate-400 mb-1">Onset W1</div>
                    <div className={`inline-block px-2 py-0.5 rounded text-sm font-semibold ${getCellBgColor(row.onset, 'onset')}`}>
                      {row.onset}%
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-slate-400 mb-1">Break W2</div>
                    <div className={`inline-block px-2 py-0.5 rounded text-sm font-semibold ${getCellBgColor(row.break, 'break')}`}>
                      {row.break}%
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-slate-400 mb-1">Heavy W2</div>
                    <div className={`inline-block px-2 py-0.5 rounded text-sm font-semibold ${getCellBgColor(row.heavy, 'heavy')}`}>
                      {row.heavy}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="text-sm">
                    <span className="text-slate-400">Action: </span>
                    <span className="text-white font-medium">{row.actionNeeded}</span>
                  </div>
                  <div className="w-16 h-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={row.sparkline}>
                        <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8 text-slate-400 bg-[#121a2f] rounded-xl border border-slate-800">
              No blocks match the selected filters.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
