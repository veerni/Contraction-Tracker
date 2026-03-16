
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

const FeedbackScreen: React.FC<Props> = ({ onBack }) => {
  const [selected, setSelected] = useState<number>(3);
  const [feedback, setFeedback] = useState('');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in" 
      onClick={onBack}
    >
      <div 
        className="w-full max-w-[430px] glass-dark p-8 pb-12 shadow-2xl rounded-t-[40px] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-1.5 bg-zinc-200 dark:bg-white/20 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Share Feedback</h2>
          <span className="text-zinc-400 dark:text-white/20 text-[10px] font-black uppercase tracking-widest">Help us improve</span>
        </div>
        
        <div className="space-y-8 mb-10">
          <div className="space-y-4">
            <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black block">HOW IS YOUR EXPERIENCE?</span>
            <div className="flex justify-between items-center px-2">
              {[1, 2, 3, 4, 5].map((idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selected === idx 
                        ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' 
                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-white/20'
                    }`}
                    style={{ borderRadius: '40% 60% 65% 35% / 35% 40% 60% 65%' }}
                  >
                    <span className="text-lg font-black">{idx}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between px-2 text-[8px] text-zinc-300 dark:text-white/10 font-black tracking-widest uppercase">
              <span>NEEDS WORK</span>
              <span>LOVING IT</span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-zinc-400 dark:text-white/30 text-[8px] uppercase tracking-[0.25em] font-black block">TELL US MORE</span>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What can we do better?"
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-6 text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-white/20 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none min-h-[140px] resize-none text-sm leading-relaxed" 
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onBack}
            className="w-full py-4.5 bg-primary rounded-full text-white font-black text-[10px] tracking-[0.3em] hover:scale-[1.02] active:scale-[0.96] transition-all shadow-xl shadow-primary/20 uppercase"
            style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
          >
            SEND FEEDBACK
          </button>
          <button 
            onClick={onBack}
            className="text-zinc-400 dark:text-white/30 text-[9px] font-bold uppercase tracking-[0.4em] py-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;
