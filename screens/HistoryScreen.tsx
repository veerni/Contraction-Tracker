
import React, { useState } from 'react';
import { Contraction } from '../types';

interface Props {
  contractions: Contraction[];
  onBack: () => void;
  onUpdate: (contraction: Contraction) => void;
}

const HistoryScreen: React.FC<Props> = ({ contractions, onBack, onUpdate }) => {
  const [editingContraction, setEditingContraction] = useState<Contraction | null>(null);
  const [editIntensity, setEditIntensity] = useState(3);
  const [editNotes, setEditNotes] = useState('');

  const avgDuration = contractions.length > 0 
    ? Math.round(contractions.reduce((acc, c) => acc + c.duration, 0) / contractions.length) 
    : 0;
    
  const lastGaps = contractions.slice(1).map((c) => c.gap).filter(g => g !== undefined) as number[];
  const avgFreq = lastGaps.length > 0
    ? Math.round(lastGaps.reduce((acc, g) => acc + g, 0) / lastGaps.length / 60)
    : 0;

  const groupHistory = () => {
    const sorted = [...contractions].sort((a, b) => b.startTime - a.startTime);
    const groups: { [key: string]: Contraction[] } = {};
    sorted.forEach(c => {
      const dateKey = new Date(c.startTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(c);
    });
    return groups;
  };

  const grouped = groupHistory();

  const handleStartEdit = (c: Contraction) => {
    setEditingContraction(c);
    setEditIntensity(c.intensity || 3);
    setEditNotes(c.notes || '');
  };

  const handleSaveEdit = () => {
    if (editingContraction) {
      onUpdate({
        ...editingContraction,
        intensity: editIntensity,
        notes: editNotes
      });
      setEditingContraction(null);
    }
  };

  const renderIntensityDots = (level: number = 0) => {
    return (
      <div className="flex gap-1.5 ml-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`w-1 h-1 rounded-full ${i <= level ? 'bg-primary' : 'bg-zinc-200 dark:bg-white/10'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex h-full flex-col max-w-[430px] mx-auto bg-zinc-50 dark:bg-background-black overflow-hidden animate-fade-in transition-colors duration-300">
      <header className="flex items-center justify-between p-6 pt-16 px-8 shrink-0">
        <h1 className="text-zinc-900 dark:text-white text-4xl font-bold tracking-tight">
          History
        </h1>
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200/50 dark:bg-white/5 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-zinc-500 dark:text-white/60">close</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="rounded-[2.5rem] bg-primary/[0.04] dark:bg-primary/[0.04] border border-primary/[0.1] dark:border-primary/[0.08] p-8 mb-10 mt-2 shadow-sm">
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
              <span className="text-primary/60 dark:text-primary/40 text-[9px] uppercase tracking-[0.3em] font-black">SESSION SUMMARY</span>
              <span className="material-symbols-outlined text-primary/40 dark:text-primary/30 text-base">monitoring</span>
            </div>
            <div className="flex items-center justify-between">
              {[
                { label: 'AVG.\nDURATION', val: `${avgDuration}s` },
                { label: 'AVG.\nFREQ', val: `${avgFreq}m` },
                { label: 'TOTAL\nEVENTS', val: contractions.length }
              ].map((stat, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-primary text-3xl font-black tabular-nums">{stat.val}</span>
                    <span className="text-zinc-400 dark:text-white/20 text-[8px] font-black uppercase tracking-[0.2em] leading-tight whitespace-pre-line">{stat.label}</span>
                  </div>
                  {i < 2 && <div className="w-px h-12 bg-zinc-200 dark:bg-white/[0.05]"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {Object.keys(grouped).map(date => (
            <div key={date} className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 dark:text-white/15 px-2">{date}</h3>
              <div className="space-y-3">
                {grouped[date].map((c) => (
                  <div key={c.id} className="rounded-[2rem] bg-white dark:bg-white/[0.02] border border-zinc-100 dark:border-white/[0.05] p-6 transition-all shadow-sm">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-white font-bold text-lg tabular-nums tracking-tight">
                              {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="text-zinc-400 dark:text-white/15 text-[8px] uppercase tracking-[0.2em] font-black mt-0.5">STARTED</span>
                          </div>
                          <div className="h-8 w-px bg-zinc-100 dark:bg-white/5"></div>
                          <div className="flex flex-col">
                            <span className="text-primary font-black text-lg tabular-nums tracking-tight">{c.duration}s</span>
                            <span className="text-zinc-400 dark:text-white/15 text-[8px] uppercase tracking-[0.2em] font-black mt-0.5">DURATION</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-zinc-600 dark:text-white/60 font-bold text-lg tabular-nums tracking-tight">
                            {c.gap ? `${Math.floor(c.gap/60)}m ${c.gap%60}s` : '—'}
                          </span>
                          <span className="text-zinc-400 dark:text-white/15 text-[8px] uppercase tracking-[0.2em] font-black mt-0.5">PREV GAP</span>
                        </div>
                      </div>

                      <div className="h-px bg-zinc-100 dark:bg-white/[0.05] w-full mb-5"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center">
                            <span className="text-[8px] uppercase tracking-[0.25em] font-black text-zinc-400 dark:text-white/10">INTENSITY</span>
                            {renderIntensityDots(c.intensity)}
                          </div>
                          {c.notes && (
                            <p className="text-[11px] text-zinc-500 dark:text-white/30 italic font-medium mt-1 leading-relaxed">
                              "{c.notes}"
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleStartEdit(c)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/[0.08] text-primary active:scale-95 transition-all shrink-0"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {contractions.length === 0 && (
            <div className="text-center text-zinc-300 dark:text-white/5 py-24 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-6xl opacity-40">event_busy</span>
              <p className="font-black uppercase tracking-[0.4em] text-[10px]">No history yet</p>
            </div>
          )}
        </div>
      </main>

      <div className="pb-8 pt-4 flex justify-center shrink-0">
        <div className="h-1 w-24 bg-zinc-200 dark:bg-white/5 rounded-full"></div>
      </div>

      {editingContraction && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditingContraction(null)}>
          <div 
            className="w-full max-w-[430px] glass-dark p-8 pb-12 shadow-2xl rounded-t-[40px] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-8">
              <div className="w-12 h-1.5 bg-zinc-200 dark:bg-white/20 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Edit Record</h2>
              <span className="text-zinc-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest">
                {new Date(editingContraction.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>

            <div className="space-y-8 mb-10">
              <div className="space-y-4">
                <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black block">INTENSITY</span>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1"
                  value={editIntensity}
                  onChange={(e) => setEditIntensity(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-zinc-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                  style={{ WebkitAppearance: 'none' }}
                />
                <div className="flex justify-between px-1 text-[8px] text-zinc-300 dark:text-white/15 font-black tracking-[0.15em] uppercase">
                  <span>MILD</span>
                  <span>STRONG</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black block">NOTES</span>
                <textarea 
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes..."
                  className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-white/20 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none min-h-[100px] resize-none text-sm leading-relaxed" 
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleSaveEdit}
                className="w-full py-4.5 bg-primary rounded-full text-white font-black text-[10px] tracking-[0.3em] hover:scale-[1.02] active:scale-[0.96] transition-all shadow-xl shadow-primary/20 uppercase"
                style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
              >
                SAVE CHANGES
              </button>
              <button 
                onClick={() => setEditingContraction(null)}
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

export default HistoryScreen;
