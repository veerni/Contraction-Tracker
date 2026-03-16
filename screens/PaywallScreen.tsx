
import React from 'react';

interface Props {
  onBack: () => void;
}

const PaywallScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="relative flex h-full flex-col bg-background-black overflow-hidden animate-fade-in">
      <header className="flex items-center p-4 pb-2 justify-between">
        <button onClick={onBack} className="text-white/40 p-2">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-primary text-sm font-bold uppercase tracking-widest flex-1 text-center pr-10">Premium Access</h2>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="relative w-full flex justify-center mb-8">
          <div className="w-32 h-32 bg-primary/10 blob-shape absolute -top-4 -left-4 blur-xl"></div>
          <div className="w-48 h-48 bg-primary/5 blob-shape absolute -bottom-8 -right-4 blur-2xl"></div>
          <div className="relative z-10 p-10 bg-primary/20 blob-shape flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-6xl fill-1">favorite</span>
          </div>
        </div>

        <h1 className="text-white tracking-tight text-[36px] font-extrabold leading-[1.1] text-center pb-8">
          Simple.<br/>Privacy-First.<br/>One-Time Payment.
        </h1>

        <div className="space-y-3 mb-12 max-w-sm mx-auto w-full">
          {[
            'Emergency contact',
            'Live share with partner',
            'Advanced insights and guidance'
          ].map((item) => (
            <div key={item} className="flex items-center gap-x-4 py-4 px-6 bg-white/[0.03] rounded-2xl border border-white/10">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                <span className="material-symbols-outlined text-primary text-sm font-bold">check</span>
              </div>
              <p className="text-gray-200 text-lg font-medium">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            className="w-full max-w-[320px] py-4.5 bg-primary rounded-full text-white text-[11px] font-black tracking-[0.25em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 uppercase"
            style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
          >
            UNLOCK FULL ACCESS - $1.99
          </button>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] text-center px-4 mt-2">
            Supporting a focused, ad-free experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaywallScreen;
