
import React, { useState, useEffect } from 'react';
import { Contraction, User, ScreenState } from './types';
import { geminiService } from './services/geminiService';

// --- Screens ---
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import TrackingScreen from './screens/TrackingScreen';
import SummaryScreen from './screens/SummaryScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PaywallScreen from './screens/PaywallScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeContraction, setActiveContraction] = useState<Contraction | null>(null);
  const [advice, setAdvice] = useState<string>("Breathe deeply. You're doing great.");
  const [lastSavedContraction, setLastSavedContraction] = useState<Contraction | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('bloom_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('bloom_user');
    const savedHistory = localStorage.getItem('bloom_history');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setContractions(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bloom_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const saveUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('bloom_user', JSON.stringify(userData));
  };

  const handleOnboardingSignup = () => {
    const guestUser = { name: 'New User', weeksAlong: 0, isPremium: false };
    saveUser(guestUser);
    setScreen('home');
  };

  const handleOnboardingGuest = () => {
    const guestUser = { name: 'Guest', weeksAlong: 0, isPremium: false };
    saveUser(guestUser);
    setScreen('home');
  };

  const startContraction = () => {
    const now = Date.now();
    const lastContraction = contractions[contractions.length - 1];
    const gap = lastContraction ? Math.floor((now - (lastContraction.endTime || now)) / 1000) : undefined;
    
    const newC: Contraction = {
      id: now.toString(),
      startTime: now,
      duration: 0,
      gap
    };
    setActiveContraction(newC);
    setScreen('tracking');
  };

  const stopContraction = async () => {
    if (!activeContraction) return;
    const now = Date.now();
    const duration = Math.floor((now - activeContraction.startTime) / 1000);
    const finishedC: Contraction = { ...activeContraction, endTime: now, duration, intensity: 3 };
    
    setLastSavedContraction(finishedC);
    setScreen('summary');
    
    const newAdvice = await geminiService.getAdvice([...contractions, finishedC], user);
    setAdvice(newAdvice);
  };

  const finalizeContraction = (intensity: number, notes: string) => {
    if (!lastSavedContraction) return;
    const finalC = { ...lastSavedContraction, intensity, notes };
    const updatedHistory = [...contractions, finalC];
    setContractions(updatedHistory);
    localStorage.setItem('bloom_history', JSON.stringify(updatedHistory));
    setActiveContraction(null);
    setLastSavedContraction(null);
    setScreen('home');
  };

  const updateContraction = (updatedC: Contraction) => {
    const updatedHistory = contractions.map(c => c.id === updatedC.id ? updatedC : c);
    setContractions(updatedHistory);
    localStorage.setItem('bloom_history', JSON.stringify(updatedHistory));
  };

  const cancelActive = () => {
    setActiveContraction(null);
    setLastSavedContraction(null);
    setScreen('home');
  };

  const resumeContraction = () => {
    setLastSavedContraction(null);
    setScreen('tracking');
  };

  const goHome = () => setScreen('home');
  const goHistory = () => setScreen('history');
  const goProfile = () => setScreen('profile');
  const goPaywall = () => setScreen('paywall');

  return (
    <div className="relative w-full h-screen bg-zinc-50 dark:bg-black overflow-hidden font-sans transition-colors duration-300">
      {screen === 'onboarding' && (
        <OnboardingScreen 
          onNext={handleOnboardingSignup} 
          onGuest={handleOnboardingGuest} 
        />
      )}
      {screen === 'home' && (
        <HomeScreen 
          user={user} 
          contractions={contractions} 
          onStart={startContraction} 
          onHistory={goHistory} 
          onProfile={goProfile}
          onUpdateUser={saveUser}
        />
      )}
      {screen === 'tracking' && <TrackingScreen startTime={activeContraction?.startTime || Date.now()} onStop={stopContraction} onCancel={cancelActive} />}
      {screen === 'summary' && (
        <SummaryScreen 
          contraction={lastSavedContraction} 
          advice={advice} 
          onDone={finalizeContraction} 
          onCancel={resumeContraction} 
        />
      )}
      {screen === 'history' && (
        <HistoryScreen 
          contractions={contractions} 
          onBack={goHome} 
          onUpdate={updateContraction}
        />
      )}
      {screen === 'profile' && (
        <ProfileScreen 
          user={user} 
          onBack={goHome} 
          onPaywall={goPaywall} 
          onUpdateUser={saveUser}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {screen === 'paywall' && <PaywallScreen onBack={goProfile} />}
    </div>
  );
};

export default App;
