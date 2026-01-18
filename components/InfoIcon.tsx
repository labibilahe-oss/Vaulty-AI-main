import React from 'react';

interface InfoIconProps {
  tooltip: string;
  align?: 'left' | 'right' | 'center';
}

const InfoIcon: React.FC<InfoIconProps> = ({ tooltip, align = 'center' }) => {
  const alignClasses = {
    left: 'left-0 translate-x-0',
    right: 'right-0 translate-x-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  const arrowClasses = {
    left: 'left-2',
    right: 'right-2',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div className="group relative inline-block ml-1.5 align-middle z-[100]">
      <svg className="w-4 h-4 text-slate-500 hover:text-indigo-400 cursor-help transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {/* Changed to top-full to show below the icon, safer for top-of-page elements */}
      <div className={`absolute top-full mt-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[11px] text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-[999] leading-relaxed text-center w-[240px] max-w-[70vw] ${alignClasses[align]}`}>
        {tooltip}
        {/* Adjusted arrow for top-to-bottom positioning */}
        <div className={`absolute bottom-full border-8 border-transparent border-b-slate-800 ${arrowClasses[align]}`}></div>
      </div>
    </div>
  );
};

export default InfoIcon;