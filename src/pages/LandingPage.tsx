import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { MapPin, Clock, Target, Users } from 'lucide-react';

const AnimatedCounter = ({ target, duration = 2000, suffix = '' }: { target: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Use easeOutQuart for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [target, duration]);

  // Format with commas for large numbers
  const formatted = new Intl.NumberFormat('en-IN').format(count);
  return <span>{formatted}{suffix}</span>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { language } = useApp();

  // Create raindrop styles
  const raindrops = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${0.5 + Math.random() * 0.5}s`
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center hero-gradient z-10">
        
        {/* Background Rain Animation */}
        <div className="rain-container absolute inset-0 pointer-events-none overflow-hidden">
          {raindrops.map(drop => (
            <div 
              key={drop.id} 
              className="raindrop absolute top-0 w-[2px] h-[20px] bg-blue-400/40 rounded-full"
              style={{
                left: drop.left,
                animationDelay: drop.animationDelay,
                animationDuration: drop.animationDuration
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl z-20 space-y-8"
        >
          <div className="inline-block px-4 py-2 rounded-full glass mb-4 border border-blue-500/30">
            <span className="text-blue-400 font-medium text-sm tracking-wider uppercase">
              Monsoon Predict AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg mb-6">
            Hyperlocal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Monsoon Onset</span>
            <br />& Break Prediction
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Predicting monsoon dynamics for Odisha at Block/Village Scale. 
            Bridging the gap between global climate models and farm-level decisions.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-8"
          >
            <button 
              onClick={() => navigate('/map')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-full text-white font-semibold text-lg shadow-xl shadow-blue-900/20 transition-all border border-blue-400/20 flex items-center justify-center mx-auto space-x-2"
            >
              <span>Launch Dashboard</span>
              <Target className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* KPI Section */}
      <div className="w-full bg-[#070a13] relative z-20 py-16 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Blocks Covered */}
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MapPin className="w-16 h-16 text-blue-400" />
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-slate-400 font-medium">Blocks Covered</h3>
              </div>
              <div className="text-4xl font-bold text-white">
                <AnimatedCounter target={24} duration={2500} />
              </div>
              <p className="text-sm text-slate-500 mt-2">Across Odisha state</p>
            </motion.div>

            {/* Forecast Lead Time */}
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-16 h-16 text-cyan-400" />
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-slate-400 font-medium">Forecast Lead Time</h3>
              </div>
              <div className="text-4xl font-bold text-white">
                7-30 <span className="text-2xl text-slate-300 font-normal">days</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Actionable early warnings</p>
            </motion.div>

            {/* Brier Skill Score */}
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-16 h-16 text-emerald-400" />
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-slate-400 font-medium">Brier Skill Score</h3>
              </div>
              <div className="text-4xl font-bold text-white">
                <AnimatedCounter target={78} duration={2000} suffix="%" />
              </div>
              <p className="text-sm text-slate-500 mt-2">High accuracy reliability</p>
            </motion.div>

            {/* Farmers Advised */}
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-16 h-16 text-purple-400" />
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-slate-400 font-medium">Farmers Advised</h3>
              </div>
              <div className="text-4xl font-bold text-white">
                <AnimatedCounter target={12847} duration={3000} />+
              </div>
              <p className="text-sm text-slate-500 mt-2">Active subscribers</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
