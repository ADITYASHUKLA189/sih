import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Language = 'en' | 'hi' | 'or' | 'bn' | 'te' | 'ta';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedBlock: string | null;
  setSelectedBlock: (id: string | null) => void;
  selectedDistrict: string | null;
  setSelectedDistrict: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, language, setLanguage,
      selectedBlock, setSelectedBlock,
      selectedDistrict, setSelectedDistrict,
      isLoading, setIsLoading,
      sidebarOpen, setSidebarOpen,
      demoMode, setDemoMode,
      drawerOpen, setDrawerOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
