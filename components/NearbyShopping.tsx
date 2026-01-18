
import React from 'react';

const NearbyShopping: React.FC = () => {
  return (
    <div className="relative min-h-[600px] w-full flex flex-col items-center justify-center overflow-hidden rounded-[3rem]">
      {/* Background Content (Extremely Blurred) */}
      <div className="absolute inset-0 z-0 space-y-12 blur-[80px] grayscale pointer-events-none select-none opacity-20 p-12">
        <div className="h-16 w-1/3 bg-slate-800 rounded-2xl"></div>
        <div className="h-16 w-full bg-slate-800 rounded-2xl"></div>
        <div className="grid grid-cols-2 gap-8">
          <div className="h-80 bg-slate-800 rounded-[3rem]"></div>
          <div className="h-80 bg-slate-800 rounded-[3rem]"></div>
        </div>
      </div>

      {/* Restricted Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-6">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Module Status: Coming Soon</span>
        </div>

        <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-200 uppercase tracking-widest mb-4">Smart Commerce</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-loose">
          Localized deal synchronization and unit-price comparison engines are being calibrated for your region.
        </p>
        <div className="mt-10 h-1 w-20 bg-slate-800 rounded-full"></div>
      </div>
    </div>
  );
};

export default NearbyShopping;
