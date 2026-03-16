
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import FeedbackScreen from './FeedbackScreen';

interface Props {
  user: User | null;
  onBack: () => void;
  onPaywall: () => void;
  onUpdateUser: (user: User) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ProfileScreen: React.FC<Props> = ({ user, onBack, onPaywall, onUpdateUser, theme, onToggleTheme }) => {
  const isGuest = user?.name === 'Guest';
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  const [modalWeeks, setModalWeeks] = useState(user?.weeksAlong?.toString() || '');
  const [modalDueDate, setModalDueDate] = useState(user?.dueDate || '');

  useEffect(() => {
    if (user) {
      setModalWeeks(user.weeksAlong?.toString() || '');
      setModalDueDate(user.dueDate || '');
    }
  }, [user, isUpdateModalOpen]);

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

  const otherApps = [
    { name: 'Baby Monitor', icon: 'videocam', link: '#' },
    { name: 'Period Tracker', icon: 'calendar_month', link: '#' },
    { name: 'Baby Growth Tracker', icon: 'child_care', link: '#' }
  ];

  return (
    <div className="relative flex h-full flex-col max-w-[430px] mx-auto bg-zinc-50 dark:bg-background-black animate-fade-in transition-colors duration-300">
      <header className="pt-16 px-8 pb-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="rounded-full w-14 h-14 bg-primary/10 dark:bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20" style={{ borderRadius: '40% 60% 65% 35% / 35% 40% 60% 65%' }}>
            <span className="material-symbols-outlined text-primary text-3xl">face_6</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{user?.name || 'Guest'}</h1>
            <p className="text-primary/60 text-xs font-medium">
              {user?.dueDate ? (
                <>Due on {new Date(user.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</>
              ) : (
                <>{user?.weeksAlong ? `${user.weeksAlong} weeks along` : 'Set progress'}</>
              )}
            </p>
          </div>
        </div>
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200/50 dark:bg-white/10 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-zinc-500 dark:text-white/80">close</span>
        </button>
      </header>

      <main className="flex-1 px-8 z-10 overflow-y-auto pb-12">
        <div className="space-y-8">
          {isGuest && (
            <button 
              className="w-full py-4.5 bg-primary rounded-full text-white text-[10px] font-black tracking-[0.3em] shadow-xl active:scale-[0.96] transition-all uppercase"
              onClick={() => window.location.reload()}
              style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
            >
              SIGNUP / LOGIN
            </button>
          )}

          {/* Theme Row */}
          <div className="flex items-center justify-between py-4 px-6 bg-white dark:bg-white/[0.03] rounded-3xl border border-zinc-200 dark:border-white/[0.05] shadow-sm">
            <div className="flex items-center gap-4">
               <span className="material-symbols-outlined text-zinc-500 dark:text-white/40 text-xl">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
               <div className="flex flex-col">
                 <span className="text-zinc-400 dark:text-white/20 text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Appearance</span>
                 <span className="text-zinc-900 dark:text-white/90 text-sm font-bold uppercase tracking-widest">{theme} Mode</span>
               </div>
            </div>
            <button 
              onClick={onToggleTheme}
              className="w-14 h-7 bg-zinc-200 dark:bg-white/10 rounded-full relative p-1 transition-colors group"
            >
              <div className={`w-5 h-5 bg-white dark:bg-primary rounded-full transition-transform duration-300 shadow-md ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-4 px-6 bg-white dark:bg-white/[0.03] rounded-3xl border border-zinc-200 dark:border-white/[0.05] shadow-sm">
            <div className="flex items-center gap-4">
               <span className="material-symbols-outlined text-zinc-500 dark:text-white/40 text-xl">calendar_today</span>
               <div className="flex flex-col">
                 <span className="text-zinc-400 dark:text-white/20 text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Your Progress</span>
                 <span className="text-zinc-900 dark:text-white/90 text-sm font-bold">
                   {user?.dueDate ? (
                     <>Due: {new Date(user.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</>
                   ) : (
                     <>{user?.weeksAlong || 0} Weeks Along</>
                   )}
                 </span>
               </div>
            </div>
            <button 
              onClick={() => setIsUpdateModalOpen(true)}
              className="bg-primary/10 dark:bg-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.25em] py-2 px-4 rounded-full active:scale-95 transition-all"
            >
              Update
            </button>
          </div>

          <button 
            onClick={onPaywall}
            className="w-full text-left bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/5 rounded-[2.5rem] p-8 relative overflow-hidden group active:scale-[0.98] transition-all"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">stars</span>
                <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Premium Feature</span>
              </div>
              <div className="space-y-4 mb-6">
                {['Emergency Contact', 'Live Partner Share', 'Detailed Insights & Guidance'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary/80 text-lg">check_circle</span>
                    <span className="text-lg font-bold leading-tight text-zinc-900 dark:text-white">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-primary font-bold text-sm mt-4">
                <span>Upgrade now</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary/5 blob-shape rotate-45 group-hover:scale-110 transition-transform"></div>
          </button>

          <div className="w-full bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 dark:text-white/20 text-[9px] font-black uppercase tracking-[0.35em]">More apps from us</span>
            </div>
            <div className="space-y-4">
              {otherApps.map((app) => (
                <div key={app.name} className="flex items-center justify-between group active:opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/[0.03] flex items-center justify-center">
                      <span className="material-symbols-outlined text-zinc-500 dark:text-white/40 text-xl">{app.icon}</span>
                    </div>
                    <a 
                      href={app.link} 
                      className="text-primary text-sm font-bold tracking-tight"
                    >
                      {app.name}
                    </a>
                  </div>
                  <a href={app.link} className="text-zinc-300 dark:text-white/10">
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {[
              { label: 'Tell us how we can improve', icon: 'chat_bubble', action: () => setIsFeedbackModalOpen(true) },
              { label: 'Privacy', icon: 'shield_person', action: () => {} },
              { label: 'About', icon: 'info', action: () => {} }
            ].map((item, idx) => (
              <React.Fragment key={item.label}>
                <button onClick={item.action} className="w-full flex items-center justify-between py-5 px-1 group active:opacity-50 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/[0.03] flex items-center justify-center">
                      <span className="material-symbols-outlined text-zinc-500 dark:text-white/40 text-xl">{item.icon}</span>
                    </div>
                    <span className="text-zinc-700 dark:text-white/90 font-semibold">{item.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-zinc-300 dark:text-white/20 text-xl">chevron_right</span>
                </button>
                {idx < 2 && <div className="h-px w-full bg-zinc-200 dark:bg-white/[0.05] my-1"></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="pt-4 pb-12 text-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-zinc-100 dark:bg-white/[0.03] text-zinc-400 dark:text-white/30 text-[11px] font-black uppercase tracking-[0.25em] px-10 py-4 border border-zinc-200 dark:border-white/5 rounded-full active:scale-95 transition-all shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <footer className="pb-6 shrink-0 flex justify-center">
        <div className="h-1 w-32 bg-zinc-200 dark:bg-white/10 rounded-full"></div>
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
                    className="w-full bg-transparent border-none p-0 text-zinc-900 dark:text-white text-2xl font-light focus:ring-0 placeholder:text-zinc-300 dark:placeholder:text-white/10 tabular-nums"
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
                    className="w-full bg-transparent border-none p-0 text-zinc-900 dark:text-white text-lg font-light focus:ring-0"
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

      {isFeedbackModalOpen && (
        <FeedbackScreen onBack={() => setIsFeedbackModalOpen(false)} />
      )}
    </div>
  );
};

export default ProfileScreen;
