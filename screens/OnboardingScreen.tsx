
import React from 'react';

interface Props {
  onNext: () => void;
  onGuest: () => void;
}

const OnboardingScreen: React.FC<Props> = ({ onNext, onGuest }) => {
  return (
    <div className="flex flex-col h-full bg-black animate-fade-in overflow-hidden">
      <div className="h-14 shrink-0"></div>
      <div className="px-10 pt-16 flex flex-col items-center gap-2 shrink-0">
        <h1 className="text-white tracking-tight text-[18px] md:text-[22px] font-bold leading-tight text-center max-w-xs">
          We'll be with you along this <span className="text-primary/90">exciting journey</span>.
        </h1>
        <p className="text-white/30 text-[12px] text-center font-medium max-w-[240px] leading-relaxed">
          Track contractions with one tap.<br/>Your data stays private on your phone.
        </p>
      </div>

      <div className="flex-grow flex items-center justify-center relative py-8">
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full scale-150"></div>
          <div className="absolute inset-0 bg-primary/80 blob-shape animate-pulse-slow"></div>
          <div className="absolute inset-4 bg-white/5 blur-xl blob-shape"></div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-white text-[9px] font-black tracking-[0.4em] uppercase text-center px-4 leading-tight opacity-80">
              Bloom
            </span>
          </div>
        </div>
      </div>

      <div className="flex-none pb-20 px-10 flex flex-col items-center gap-6">
        <button 
          onClick={onNext}
          className="w-full max-w-[280px] py-4.5 bg-primary rounded-full text-white text-[10px] font-black tracking-[0.3em] shadow-xl active:scale-[0.96] transition-all uppercase"
          style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
        >
          SIGNUP / LOGIN
        </button>
        <button 
          onClick={onGuest}
          className="text-white/20 text-[9px] font-bold hover:text-white/40 transition-colors tracking-[0.4em] uppercase"
        >
          SKIP
        </button>
      </div>
      <div className="h-6 shrink-0"></div>
    </div>
  );
};

export default OnboardingScreen;
