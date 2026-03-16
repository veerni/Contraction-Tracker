
import React, { useState, useEffect } from 'react';
import { User, Contraction } from '../types';

interface Props {
  user: User | null;
  contractions: Contraction[];
  onStart: () => void;
  onHistory: () => void;
  onProfile: () => void;
  onUpdateUser: (user: User) => void;
}

const HomeScreen: React.FC<Props> = ({ user, contractions, onStart, onHistory, onProfile, onUpdateUser }) => {
  const [tempWeeks, setTempWeeks] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const [modalWeeks, setModalWeeks] = useState(user?.weeksAlong?.toString() || '');
  const [modalDueDate, setModalDueDate] = useState(user?.dueDate || '');

  useEffect(() => {
    if (user) {
      setModalWeeks(user.weeksAlong?.toString() || '');
      setModalDueDate(user.dueDate || '');
    }
  }, [user, isUpdateModalOpen]);

  const avgDuration = contractions.length > 0 
    ? Math.round(contractions.slice(-5).reduce((acc, c) => acc + c.duration, 0) / Math.min(contractions.length, 5)) 
    : 0;
    
  const last5Gaps = contractions.slice(-6).map((c, i, arr) => arr[i+1]?.gap).filter(g => g !== undefined) as number[];
  const avgFreq = last5Gaps.length > 0
    ? Math.round(last5Gaps.reduce((acc, g) => acc + g, 0) / last5Gaps.length / 60)
    : 0;

  const getPattern = () => {
    if (contractions.length < 3) return '—';
    const last3 = contractions.slice(-3);
    const variations = last3.map(c => c.duration);
    const max = Math.max(...variations);
    const min = Math.min(...variations);
    return (max - min) < 15 ? 'Regular' : 'Irregular';
  };

  const recentList = [...contractions].reverse().slice(0, 3);

  const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setTempWeeks('');
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
      setTempWeeks(Math.max(0, Math.min(42, num)).toString());
    }
  };

  const handleSaveModal = () => {
    if (user) {
      onUpdateUser({
        ...user,
        weeksAlong: parseInt(modalWeeks) || 0,
        dueDate: modalDueDate
      });
      setIsUpdateModalOpen(false);
    }
  };

  const hasHistory = contractions.length > 0;
  const showFullWeeksCard = !hasHistory && (!user?.weeksAlong || user.weeksAlong === 0) && !user?.dueDate;

  return (
    <div className="relative flex h-full flex-col max-w-[430px] mx-auto bg-zinc-50 dark:bg-background-black animate-fade-in overflow-hidden font-sans transition-colors duration-300">
      {/* FIXED TOP HEADER - Reduced top padding */}
      <header className="flex-none flex items-center justify-between px-10 pt-8 pb-1 z-30">
        <button onClick={onProfile} className="text-zinc-400 dark:text-white/40 active:text-zinc-900 dark:active:text-white transition-colors p-2 -ml-2">
          <span className="material-symbols-outlined text-2xl font-light">menu</span>
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-zinc-300 dark:text-white/20 text-[9px] font-black tracking-[0.5em] uppercase translate-x-[0.25em]">Bloom</span>
        </div>
        <button onClick={onHistory} className="text-zinc-400 dark:text-white/40 active:text-zinc-900 dark:active:text-white transition-colors p-2 -mr-2">
          <span className="material-symbols-outlined text-2xl font-light">history</span>
        </button>
      </header>

      {/* SCROLLABLE CONTENT AREA - Added sufficient bottom padding to clear the fixed button */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-10 pb-44 scroll-smooth">
        <div className="flex flex-col items-center justify-center py-2.5">
          <h2 className="text-primary/60 text-[9px] font-black tracking-[0.35em] uppercase mb-1">
            JOURNEY PROGRESS
          </h2>
          <span className="text-zinc-900 dark:text-white text-[22px] font-semibold tracking-tight text-center leading-tight">
            {contractions.length > 0 ? (
              <>Session: {Math.floor((Date.now() - (contractions[0]?.startTime || Date.now())) / 3600000)}h {Math.floor(((Date.now() - (contractions[0]?.startTime || Date.now())) % 3600000) / 60000)}m</>
            ) : (
              'Ready to Track'
            )}
          </span>
        </div>

        {showFullWeeksCard ? (
          <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] rounded-[2.5rem] p-6 py-6.5 flex items-center justify-between my-2 shadow-sm transition-colors">
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black">SET WEEKS</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                   <input 
                    type="number" 
                    min="0"
                    max="42"
                    placeholder="—" 
                    value={tempWeeks}
                    onChange={handleWeeksChange}
                    className="w-14 bg-transparent border-none p-0 text-zinc-900 dark:text-white text-3xl font-light focus:ring-0 placeholder:text-zinc-200 dark:placeholder:text-white/10 tabular-nums"
                  />
                  <div className="absolute -bottom-1 left-0 w-8 h-px bg-primary/30"></div>
                </div>
                <span className="text-zinc-300 dark:text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">WKS</span>
              </div>
            </div>
            <button 
              onClick={() => onUpdateUser({ ...user!, weeksAlong: parseInt(tempWeeks) || 1 })}
              disabled={!tempWeeks}
              className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white flex items-center justify-center active:scale-95 disabled:opacity-20 transition-all"
            >
              <span className="material-symbols-outlined text-xl font-bold">check</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between py-3 px-5 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] my-2 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary/70 dark:text-primary/60 text-sm">calendar_today</span>
               <span className="text-zinc-500 dark:text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
                 {user?.dueDate ? (
                   <>Due: {new Date(user.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</>
                 ) : (
                   <>{user?.weeksAlong || 0} Weeks Along</>
                 )}
               </span>
            </div>
            <button 
              onClick={() => setIsUpdateModalOpen(true)}
              className="bg-primary/10 dark:bg-primary/20 border border-primary/10 dark:border-primary/5 text-primary dark:text-primary/90 text-[8px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full active:scale-95 transition-all"
            >
              UPDATE
            </button>
          </div>
        )}

        {/* Removed top border (border-b instead of border-y) for a more open transition */}
        <div className="grid grid-cols-3 gap-0 border-b border-zinc-200 dark:border-white/[0.05] py-3.5 mb-4">
          <div className="flex flex-col items-center justify-center">
            <span className="text-zinc-400 dark:text-white/30 text-[7px] uppercase tracking-[0.2em] font-black mb-1 text-center">AVG DURATION</span>
            <span className="text-zinc-900 dark:text-white text-[15px] font-bold tracking-tight">{avgDuration}s</span>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-zinc-200 dark:border-white/[0.05]">
            <span className="text-zinc-400 dark:text-white/30 text-[7px] uppercase tracking-[0.2em] font-black mb-1 text-center">AVG. FREQ</span>
            <span className="text-zinc-900 dark:text-white text-[15px] font-bold tracking-tight">{avgFreq > 0 ? `${avgFreq}m` : '—'}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-zinc-400 dark:text-white/30 text-[7px] uppercase tracking-[0.2em] font-black mb-1 text-center">PATTERN</span>
            <span className="text-zinc-900 dark:text-white text-[15px] font-bold tracking-tight">{getPattern()}</span>
          </div>
        </div>

        <div className="pb-1">
          {contractions.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-300 dark:text-white/15">RECENT EVENTS</h4>
                <button onClick={onHistory} className="text-primary/70 text-[8px] font-black uppercase tracking-[0.25em] active:text-primary transition-colors">VIEW ALL</button>
              </div>
              <div className="space-y-2">
                {recentList.map(c => (
                  <div key={c.id} className="flex justify-between items-center py-3 bg-white dark:bg-white/[0.02] rounded-2xl px-5 border border-zinc-100 dark:border-white/[0.03] shadow-sm">
                    <span className="text-zinc-500 dark:text-white/40 text-[11px] font-bold uppercase tracking-tight">
                      {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-primary font-black text-[14px]">{c.duration}s</span>
                        <span className="text-zinc-300 dark:text-white/10 text-[6px] uppercase font-black tracking-widest">DUR</span>
                      </div>
                      <div className="w-px h-3 bg-zinc-200 dark:bg-white/10"></div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-zinc-400 dark:text-white/40 text-[12px] font-bold">
                          {c.gap ? `${Math.floor(c.gap/60)}m` : '—'}
                        </span>
                        <span className="text-zinc-300 dark:text-white/10 text-[6px] uppercase font-black tracking-widest">GAP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center opacity-10 py-8">
              <span className="material-symbols-outlined text-4xl mb-2 font-light">auto_awesome</span>
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Ready to begin</p>
            </div>
          )}
        </div>
      </main>

      {/* FIXED BOTTOM FOOTER WITH START BUTTON - Stay fixed while content scrolls behind/above it */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex flex-col items-center justify-center pt-8 pb-8 px-10 bg-gradient-to-t from-zinc-50 dark:from-background-black via-zinc-50/98 dark:via-background-black/98 to-transparent z-40 pointer-events-none">
        <div className="relative pointer-events-auto">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-125 -z-10 opacity-60 dark:opacity-80"></div>
          <button 
            onClick={onStart}
            className="blob-shape w-40 h-40 md:w-48 md:h-48 flex cursor-pointer items-center justify-center bg-primary text-white transition-all duration-500 active:scale-[0.94] active:brightness-90 shadow-[0_20px_45px_-12px_rgba(200,137,137,0.5)] z-20 animate-pulse-slow"
          >
            <span className="text-[18px] font-black tracking-[0.5em] ml-4 select-none uppercase">START</span>
          </button>
        </div>
        <div className="h-1 w-24 bg-zinc-200 dark:bg-white/[0.1] rounded-full mt-8 pointer-events-auto"></div>
      </footer>

      {isUpdateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in" 
          onClick={() => setIsUpdateModalOpen(false)}
        >
          <div 
            className="w-full max-w-[430px] glass-dark p-8 pb-12 shadow-2xl rounded-t-[40px] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-8">
              <div className="w-12 h-1.5 bg-zinc-200 dark:bg-white/20 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Journey Setup</h2>
              <span className="text-zinc-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest">Update Timeline</span>
            </div>

            <div className="space-y-8 mb-10">
              <div className="space-y-4">
                <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black block">WEEKS ALONG</span>
                <div className="flex items-center gap-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4">
                  <input 
                    type="number" 
                    min="0"
                    max="42"
                    placeholder="00" 
                    value={modalWeeks}
                    onChange={(e) => setModalWeeks(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-zinc-900 dark:text-white text-2xl font-light focus:ring-0 placeholder:text-zinc-200 dark:placeholder:text-white/10 tabular-nums"
                  />
                  <span className="text-zinc-400 dark:text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Weeks</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-100 dark:bg-white/5 flex-1"></div>
                <span className="text-[8px] font-black text-zinc-300 dark:text-white/10 uppercase tracking-widest">OR</span>
                <div className="h-px bg-zinc-100 dark:bg-white/5 flex-1"></div>
              </div>

              <div className="space-y-4">
                <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black block">DUE DATE</span>
                <div className="flex items-center gap-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4">
                  <input 
                    type="date"
                    value={modalDueDate}
                    onChange={(e) => setModalDueDate(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-zinc-900 dark:text-white text-lg font-light focus:ring-0 placeholder:text-zinc-200 dark:placeholder:text-white/10"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleSaveModal}
                className="w-full py-4.5 bg-primary rounded-full text-white font-black text-[10px] tracking-[0.3em] hover:scale-[1.02] active:scale-[0.96] transition-all shadow-xl shadow-primary/20 uppercase"
                style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
              >
                SAVE UPDATES
              </button>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-zinc-400 dark:text-white/30 text-[9px] font-bold uppercase tracking-[0.4em] py-2 active:text-zinc-900 dark:active:text-white/50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
