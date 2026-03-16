
import React, { useState, useEffect } from 'react';

interface Props {
  startTime: number;
  onStop: () => void;
  onCancel: () => void;
}

const TrackingScreen: React.FC<Props> = ({ startTime, onStop, onCancel }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex h-full flex-col max-w-[430px] mx-auto bg-zinc-50 dark:bg-background-black overflow-hidden animate-fade-in transition-colors duration-300">
      <header className="flex items-center px-6 pt-16 justify-center z-20 shrink-0">
        <div className="w-full flex justify-center">
          <div className="flex items-center justify-between bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full pl-4 pr-1 py-1 h-12 w-full max-w-[280px] shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="material-symbols-outlined text-primary text-sm animate-pulse">music_note</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-zinc-900 dark:text-white/90 truncate uppercase tracking-wider">Ocean Waves</span>
                <button className="text-[9px] text-zinc-400 dark:text-white/40 font-medium text-left hover:text-primary transition-colors uppercase tracking-widest">Change Music</button>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-zinc-500 dark:text-white/80 text-xl">volume_up</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center z-10 text-center px-10 pt-12">
        <div className="mb-12 flex flex-col items-center">
          <span className="text-6xl font-light tracking-widest text-zinc-900 dark:text-white tabular-nums">
            {formatTime(elapsed)}
          </span>
          <span className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-white/30 font-black">
            Current Duration
          </span>
        </div>

        <div className="mb-14">
          <p className="text-primary/70 text-lg font-medium tracking-wide animate-pulse">
            Breathe with the pulse...
          </p>
        </div>

        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-80 h-80 bg-primary/20 blur-[60px] animate-pulse-fast opacity-50 dark:opacity-100"></div>
          <button 
            onClick={onStop}
            className="blob-shape w-64 h-64 flex cursor-pointer items-center justify-center overflow-hidden bg-primary text-white shadow-2xl shadow-primary/40 dark:shadow-primary/20 animate-pulse-fast active:scale-95 transition-all duration-700"
          >
            <span className="text-3xl font-extrabold tracking-[0.3em] select-none ml-2">STOP</span>
          </button>
        </div>
      </main>

      <footer className="p-10 flex flex-col items-center justify-end z-20 shrink-0">
        <button 
          onClick={onCancel}
          className="text-zinc-400 dark:text-white/20 hover:text-zinc-900 dark:hover:text-white/40 text-[11px] font-black uppercase tracking-[0.2em] transition-colors py-4 px-10 border border-zinc-200 dark:border-white/10 rounded-full w-full max-w-[280px]"
        >
          Cancel false alarm
        </button>
        <div className="mt-8">
          <div className="h-1.5 w-32 bg-zinc-200 dark:bg-white/10 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};

export default TrackingScreen;
