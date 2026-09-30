import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { blocks, districts } from '../data/blocks';
import { fakeFarmerNames, generateFakePhone } from '../utils/helpers';
import { Send, MessageSquare, Phone, Check, CheckCheck, Users, Radio, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

type Channel = 'sms' | 'whatsapp' | 'ivr';
type MessageState = 'idle' | 'sent' | 'delivered' | 'read';

interface RecipientLog {
  id: string;
  name: string;
  phone: string;
  block: string;
  status: 'sent' | 'delivered' | 'read';
  time: string;
}

const AlertGateway = () => {
  const { language, theme } = useApp();
  
  const [district, setDistrict] = useState(districts[0]?.id || '');
  const [block, setBlock] = useState('');
  const [crop, setCrop] = useState('Paddy');
  const [msgLanguage, setMsgLanguage] = useState('English');
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [isExtensionOfficer, setIsExtensionOfficer] = useState(false);
  const [messageState, setMessageState] = useState<MessageState>('idle');
  const [reachCount, setReachCount] = useState(0);
  const [logs, setLogs] = useState<RecipientLog[]>([]);

  const crops = ['Paddy', 'Maize', 'Groundnut', 'Pigeon Pea', 'Cotton', 'Vegetables'];
  const languages = ['English', 'Hindi', 'Odia'];

  const filteredBlocks = blocks.filter(b => b.district === district);

  useEffect(() => {
    if (filteredBlocks.length > 0 && !filteredBlocks.find(b => b.id === block)) {
      setBlock(filteredBlocks[0].id);
    }
  }, [district, filteredBlocks]);

  const blockName = blocks.find(b => b.id === block)?.name || 'Unknown Block';

  const getMessageContent = () => {
    if (isExtensionOfficer) {
      return `[${msgLanguage}] DEPT OF AGRI ALERT: \nRegion: ${blockName}\nOnset Prob: 82% (High Confidence)\nThreshold: >2.5mm/day for 3 days.\nAdvisory for ${crop}: Prepare for immediate sowing. Monitor soil moisture at 15cm depth. Do not apply urea until 48hrs post-onset.\nAction: Distribute advisory immediately.`;
    }
    return `[${msgLanguage}] Monsoon Alert 🌧️\nBlock: ${blockName}\nRisk: Moderate (Rain expected soon)\nCrop: ${crop}\nAdvisory: Please prepare fields for sowing. Avoid spraying chemicals today.\nStay safe! 🌾`;
  };

  const getSmsContent = () => {
    const fullMsg = getMessageContent();
    return fullMsg.length > 160 ? fullMsg.substring(0, 157) + '...' : fullMsg;
  };

  const handleBroadcast = () => {
    setMessageState('sent');
    setReachCount(0);
    setLogs([]);
    toast.success('Broadcast initiated');

    setTimeout(() => setMessageState('delivered'), 500);
    setTimeout(() => setMessageState('read'), 1500);

    let currentReach = 0;
    const targetReach = Math.floor(Math.random() * 500) + 800;
    const interval = setInterval(() => {
      currentReach += Math.floor(targetReach / 30);
      if (currentReach >= targetReach) {
        setReachCount(targetReach);
        clearInterval(interval);
      } else {
        setReachCount(currentReach);
      }
    }, 100);

    // Generate Logs
    const newLogs: RecipientLog[] = Array.from({ length: 12 }).map((_, i) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 5));
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: fakeFarmerNames[i % fakeFarmerNames.length],
        phone: generateFakePhone(),
        block: blockName,
        status: ['sent', 'delivered', 'read'][Math.floor(Math.random() * 3)] as 'sent' | 'delivered' | 'read',
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
    
    setTimeout(() => {
      setLogs(newLogs);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert Gateway Simulator</h1>
          <p className="text-slate-400">Broadcast advisories to farmers and extension officers.</p>
        </div>
        <Radio className="w-10 h-10 text-teal-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Admin Panel */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-teal-400" /> Message Configuration
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">District</label>
              <select 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#162032] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500"
              >
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Block</label>
              <select 
                value={block} 
                onChange={(e) => setBlock(e.target.value)}
                className="w-full bg-[#162032] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500"
              >
                {filteredBlocks.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Crop Focus</label>
              <select 
                value={crop} 
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-[#162032] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500"
              >
                {crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
              <select 
                value={msgLanguage} 
                onChange={(e) => setMsgLanguage(e.target.value)}
                className="w-full bg-[#162032] border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500"
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Channel</label>
            <div className="flex bg-[#162032] p-1 rounded-lg">
              <button 
                onClick={() => setChannel('whatsapp')}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${channel === 'whatsapp' ? 'bg-[#25D366] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </button>
              <button 
                onClick={() => setChannel('sms')}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${channel === 'sms' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" /> SMS
              </button>
              <button 
                onClick={() => setChannel('ivr')}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${channel === 'ivr' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Phone className="w-4 h-4" /> IVR
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#162032] rounded-lg border border-slate-700">
            <div>
              <p className="font-medium text-white">Extension Officer Mode</p>
              <p className="text-sm text-slate-400">Include technical probabilities and raw metrics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isExtensionOfficer} onChange={() => setIsExtensionOfficer(!isExtensionOfficer)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <button 
            onClick={handleBroadcast}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2"
          >
            <Radio className="w-5 h-5" /> Broadcast Message
          </button>
        </div>

        {/* Right Column - Preview */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
          <h3 className="text-lg font-medium text-white mb-6 self-start w-full border-b border-slate-700 pb-2">Preview</h3>
          
          {channel === 'whatsapp' && (
            <div className="w-full max-w-sm rounded-3xl overflow-hidden bg-[#0b141a] border border-slate-800 shadow-2xl relative">
              <div className="bg-[#202c33] p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🌧️</span>
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-1">
                    Monsoon Alert <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </h4>
                  <p className="text-xs text-slate-400">Official Account</p>
                </div>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto bg-[url('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/whatsapp.svg')] bg-opacity-5 relative" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%232a3942\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')"}}>
                <AnimatePresence>
                  {messageState !== 'idle' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto shadow-sm relative pb-6"
                    >
                      <p className="text-sm whitespace-pre-wrap">{getMessageContent()}</p>
                      <div className="absolute bottom-1 right-2 flex items-center gap-1">
                        <span className="text-[10px] text-slate-300">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {messageState === 'sent' && <Check className="w-3 h-3 text-slate-400" />}
                        {messageState === 'delivered' && <CheckCheck className="w-3 h-3 text-slate-400" />}
                        {messageState === 'read' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {channel === 'sms' && (
            <div className="w-full max-w-sm rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl relative">
              <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-slate-800 font-medium">Monsoon Dept</h4>
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-4 h-96 overflow-y-auto bg-slate-50 flex flex-col justify-end">
                <AnimatePresence>
                  {messageState !== 'idle' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-blue-500 text-white p-4 rounded-2xl rounded-br-sm max-w-[90%] ml-auto shadow-sm mb-2"
                    >
                      <p className="text-sm whitespace-pre-wrap">{getSmsContent()}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="text-xs text-slate-400 text-right mt-1 px-1">
                  {messageState === 'idle' ? '' : 'Delivered'} {getSmsContent().length}/160 chars
                </div>
              </div>
            </div>
          )}

          {channel === 'ivr' && (
            <div className="text-center p-8">
              <motion.div 
                animate={messageState !== 'idle' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Phone className="w-10 h-10 text-purple-400" />
              </motion.div>
              <h4 className="text-white text-lg font-medium">Automated Voice Call</h4>
              <p className="text-slate-400 text-sm mt-2">Farmers will receive an automated call with the advisory in {msgLanguage}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Delivery Log */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Delivery Log</h2>
          <div className="flex items-center gap-2 bg-[#162032] px-4 py-2 rounded-lg border border-slate-700">
            <Users className="w-5 h-5 text-teal-400" />
            <span className="text-2xl font-bold text-white">{reachCount.toLocaleString()}</span>
            <span className="text-sm text-slate-400">reached</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#162032] text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Block</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-700/50 hover:bg-[#162032]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{log.name}</td>
                  <td className="px-4 py-3">{log.phone}</td>
                  <td className="px-4 py-3">{log.block}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                      log.status === 'delivered' ? 'bg-teal-500/20 text-teal-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.time}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No recent broadcasts. Select configuration and broadcast to see logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertGateway;
