
import React, { useState } from 'react';
import { Contraction } from '../types';

interface Props {
  contraction: Contraction | null;
  advice: string;
  onDone: (intensity: number, notes: string) => void;
  onCancel: () => void;
}

const SummaryScreen: React.FC<Props> = ({ contraction, advice, onDone, onCancel }) => {
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (!contraction) return null;

  return (
    <div className="relative flex h-full flex-col max-w-[430px] mx-auto bg-zinc-50 dark:bg-background-black overflow-hidden animate-fade-in font-sans transition-colors duration-300">
      <header className="flex items-center p-6 pt-12 justify-center z-10 shrink-0">
        <h2 className="text-primary/70 text-[10px] font-black tracking-[0.4em] uppercase">
          CONTRACTION SAVED
        </h2>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-2 px-8 z-10 overflow-hidden">
        {/* Data Card */}
        <div className="w-full bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] rounded-[2rem] p-5 space-y-4 shrink-0 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.2em] font-black">DURATION</span>
              <span className="text-zinc-900 dark:text-white text-3xl font-light tracking-tight tabular-nums flex items-baseline">
                {contraction.duration}<span className="text-[10px] ml-1 opacity-20 font-bold uppercase tracking-widest">s</span>
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.2em] font-black">GAP</span>
              <span className="text-zinc-900 dark:text-white text-3xl font-light tracking-tight tabular-nums">
                {contraction.gap ? (
                  <>
                    {Math.floor(contraction.gap / 60)}<span className="text-[10px] ml-1 opacity-20 font-bold uppercase tracking-widest">m</span>
                  </>
                ) : '—'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative px-1">
              <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.2em] font-black block mb-4">INTENSITY</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full accent-primary h-1 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{ WebkitAppearance: 'none' }}
              />
              <div className="flex justify-between mt-3 px-1 text-[8px] text-zinc-300 dark:text-white/15 font-black tracking-[0.15em] uppercase">
                <span>MILD</span>
                <span>STRONG</span>
              </div>
            </div>

            <div className="flex flex-col items-center pt-1">
              {!showNotes ? (
                <button 
                  onClick={() => setShowNotes(true)}
                  className="text-zinc-400 dark:text-white/30 text-[9px] font-black uppercase tracking-[0.25em] py-2 px-4 bg-zinc-100 dark:bg-white/10 rounded-full active:scale-95 transition-all"
                >
                  + ADD NOTES
                </button>
              ) : (
                <div className="w-full animate-fade-in">
                  <textarea 
                    autoFocus
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes..."
                    className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-3 text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-primary/50 outline-none resize-none placeholder:text-zinc-300 dark:placeholder:text-white/10"
                    rows={2}
                  />
                  <button onClick={() => setShowNotes(false)} className="mt-1 text-[8px] font-black text-primary/40 uppercase tracking-widest">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advice Section */}
        <div className="w-full text-center px-6">
          <span className="text-primary/40 text-[9px] uppercase tracking-[0.3em] font-black block mb-3">BLOOM INSIGHT</span>
          <p className="text-primary/80 text-[12px] font-normal leading-relaxed tracking-wide">
            {advice}
          </p>
        </div>
      </main>

      <footer className="p-10 pb-12 flex flex-col items-center gap-6 shrink-0 z-20">
        <button 
          onClick={() => onDone(intensity, notes)}
          className="w-full max-w-[280px] py-4.5 bg-primary rounded-full text-white text-[10px] font-black tracking-[0.3em] shadow-xl active:scale-[0.96] transition-all uppercase"
          style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
        >
          DONE
        </button>
        <button 
          onClick={onCancel}
          className="bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-zinc-400 dark:text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full active:scale-95 transition-all"
        >
          TAPPED STOP BY MISTAKE
        </button>
        <div className="h-1 w-24 bg-zinc-200 dark:bg-white/10 rounded-full mt-2"></div>
      </footer>
    </div>
  );
};

export default SummaryScreen;
