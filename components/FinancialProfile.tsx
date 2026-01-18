
import React from 'react';
import { UserProfile } from '../types';
import { CURRENCIES } from '../constants';

interface FinancialProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const FinancialProfile: React.FC<FinancialProfileProps> = ({ profile, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...profile,
      [name]: (name === 'currency') 
        ? value 
        : (parseFloat(value) || 0)
    });
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === profile.currency) || CURRENCIES[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-10 animate-in fade-in duration-500 pb-24 scroll-container">
      <header className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">Wealth Profile</h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">Core financial metrics for high-precision advisory context.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Income Section */}
        <div className="bg-slate-900/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-800/50 space-y-6 md:space-y-8">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50 pb-4">Revenue Baseline</h3>
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Monthly Salary</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-bold">{selectedCurrency.symbol}</span>
                <input 
                  type="number" 
                  name="baseSalary"
                  value={profile.baseSalary}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-10 pr-4 focus:border-indigo-500 outline-none text-lg md:text-xl font-bold text-slate-100 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Secondary Income</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-bold">{selectedCurrency.symbol}</span>
                <input 
                  type="number" 
                  name="otherIncome"
                  value={profile.otherIncome}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-10 pr-4 focus:border-indigo-500 outline-none text-lg md:text-xl font-bold text-slate-100 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="bg-slate-900/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-800/50 space-y-6 md:space-y-8">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50 pb-4">Digital Identity</h3>
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Display Currency</label>
              <div className="relative">
                 <select 
                  name="currency"
                  value={profile.currency}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-6 focus:border-indigo-500 outline-none text-xs md:text-sm font-bold text-slate-100 transition-colors appearance-none"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Net Asset Base</label>
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-bold">{selectedCurrency.symbol}</span>
                <input 
                  type="number" 
                  name="initialAssets"
                  value={profile.initialAssets}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-10 pr-4 focus:border-emerald-500 outline-none text-lg md:text-xl font-bold text-slate-100 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProfile;
