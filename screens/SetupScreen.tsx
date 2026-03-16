
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  onSave: (user: User) => void;
}

const SetupScreen: React.FC<Props> = ({ onSave }) => {
  const [weeks, setWeeks] = useState<string>('');
  const [name, setName] = useState<string>('');

  return (
    <div className="flex flex-col h-full bg-background-black animate-fade-in">
      <header className="flex items-center p-6 pt-12 justify-between z-20">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 opacity-0 pointer-events-none">
          <span className="material-symbols-outlined text-white/60">menu</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 z-10 text-center -mt-12">
        <div className="w-full max-w-[320px] bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h2 className="text-white text-lg font-semibold mb-6 tracking-tight">How far along are you?</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex flex-col gap-2">
              <input 
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 bg-white/5 border-none rounded-2xl px-4 text-center text-lg font-medium focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/20"
              />
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <input 
                type="number"
                placeholder="00"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className="w-24 h-16 bg-white/5 border-none rounded-2xl text-center text-2xl font-bold focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/10"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Weeks</span>
            </div>
          </div>

          <button 
            disabled={!weeks || !name}
            onClick={() => onSave({ name, weeksAlong: parseInt(weeks), isPremium: false })}
            className="w-full bg-primary disabled:opacity-50 py-4 rounded-2xl font-bold tracking-widest text-sm active:scale-95 transition-all shadow-lg shadow-primary/20 mb-4"
          >
            SAVE
          </button>
          <button className="text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest font-bold">
            Add Due Date instead
          </button>
        </div>
      </main>

      <footer className="pb-12 flex flex-col items-center">
        <div className="h-1 w-24 bg-white/10 rounded-full"></div>
      </footer>
    </div>
  );
};

export default SetupScreen;
