import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudRain, BarChart3, Map, FileText, Bell, Smartphone,
  Users, BookOpen, ChevronLeft, ChevronRight, Sun, Moon,
  Play, Menu, X, Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: CloudRain, labelKey: 'overview' },
  { path: '/drivers', icon: Globe, labelKey: 'global_drivers' },
  { path: '/map', icon: Map, labelKey: 'risk_map' },
  { path: '/advisory', icon: FileText, labelKey: 'advisory' },
  { path: '/farmer', icon: Smartphone, labelKey: 'farmer_view' },
  { path: '/alerts', icon: Bell, labelKey: 'alerts' },
  { path: '/officer', icon: Users, labelKey: 'extension_officer' },
  { path: '/methodology', icon: BookOpen, labelKey: 'methodology' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, language, setLanguage, sidebarOpen, setSidebarOpen, demoMode, setDemoMode } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 12, seconds: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ticking countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0e1a] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Status Bar */}
      <div className={`h-8 flex items-center justify-between px-4 text-xs ${theme === 'dark' ? 'bg-[#0f1729] border-b border-white/5' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 pulse-live"></span>
            <span className="text-green-400 font-medium">LIVE</span>
          </span>
          <span className="opacity-60">
            {t(language, 'last_model_run')}: {today}, 00Z cycle
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-60">
            {t(language, 'next_update')}: {countdown.hours}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
          </span>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${demoMode ? 'bg-teal-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <Play className="w-3 h-3 inline mr-1" />{t(language, 'demo_mode')}
          </button>
        </div>
      </div>

      {/* Top Nav */}
      <header className={`h-14 flex items-center justify-between px-4 ${theme === 'dark' ? 'bg-[#0f1729]/80 backdrop-blur-xl border-b border-white/5' : 'bg-white/80 backdrop-blur-xl border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <CloudRain className="w-6 h-6 text-teal-400" />
          <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            {t(language, 'app_title')}
          </h1>
          <span className="hidden md:inline text-xs opacity-40 ml-2">Block/Village Scale</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className={`text-xs rounded-lg px-2 py-1.5 ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-100 border border-slate-200'}`}
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="or">ଓଡ଼ିଆ</option>
            <option value="bn">বাংলা</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
          </select>
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className={`hidden md:flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-52' : 'w-16'} ${theme === 'dark' ? 'bg-[#0f1729]/50 border-r border-white/5' : 'bg-white border-r border-slate-200'}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-3 self-end transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? (theme === 'dark' ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-50 text-teal-700')
                      : (theme === 'dark' ? 'hover:bg-white/5 text-white/60' : 'hover:bg-slate-100 text-slate-500')
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="truncate">{t(language, item.labelKey)}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className={`md:hidden fixed inset-0 z-50 flex`}
            >
              <div className={`w-64 ${theme === 'dark' ? 'bg-[#0f1729]' : 'bg-white'} p-4 shadow-2xl`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-teal-400">{t(language, 'app_title')}</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                          isActive ? 'bg-teal-500/15 text-teal-400' : 'hover:bg-white/5 text-white/60'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{t(language, item.labelKey)}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className={`h-8 flex items-center justify-center text-[10px] ${theme === 'dark' ? 'bg-[#0f1729]/50 border-t border-white/5 text-white/30' : 'bg-white border-t border-slate-200 text-slate-400'}`}>
        {t(language, 'prototype_disclaimer')}
      </footer>
    </div>
  );
}
