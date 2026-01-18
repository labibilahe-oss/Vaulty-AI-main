import React from 'react';
import Logo from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-8 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={onStart}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Central Logo Section */}
      <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-1000">
        <Logo className="w-40 h-40" />
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Vaulty</h1>
        </div>
      </div>

      {/* Tap indicator */}
      <div className="absolute bottom-24 animate-pulse">
        <span className="text-lg font-black text-white uppercase tracking-[0.4em]">Tap to start</span>
      </div>

      {/* Version Indicator */}
      <div className="absolute bottom-6 text-[8px] font-black text-slate-800 uppercase tracking-[0.5em]">
        Portal v1.4.2 — Alpha Access
      </div>
    </div>
  );
};

export default WelcomeScreen;