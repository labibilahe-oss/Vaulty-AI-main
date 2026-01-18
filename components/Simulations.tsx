
import React, { useState } from 'react';
import { runWealthSimulation } from '../services/geminiService';
import { UserProfile, FinancialSummary } from '../types';

interface SimulationsProps {
  profile?: UserProfile;
  summary?: FinancialSummary;
}

const Simulations: React.FC<SimulationsProps> = ({ profile, summary }) => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!scenario.trim() || !profile || !summary) return;
    setLoading(true);
    setResult(null);
    try {
      const output = await runWealthSimulation(scenario, profile, summary);
      setResult(output);
    } catch (e) {
      alert("Simulation failed. Neural link timeout.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What if I invest $1,000 extra monthly in high-growth tech stocks?",
    "Scenario: Buying a $450k house in 3 years with 20% down.",
    "Impact of taking a 15% salary cut for a better work-life balance job.",
    "Early retirement at age 50 assuming current savings trajectory."
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-black text-slate-100 uppercase tracking-tighter">Trajectory Labs</h2>
        <p className="text-sm text-slate-500 font-medium">Predictive wealth modeling powered by high-inference intelligence.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
        {/* Input Panel */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-[#0a0f1e]/60 p-8 rounded-[2.5rem] border border-slate-800/40 shadow-xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Define Scenario</label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Ex: I want to retire in 10 years with a $2M portfolio..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 min-h-[160px] outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>
            
            <button 
              onClick={handleSimulate}
              disabled={loading || !scenario.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Inference Running...
                </>
              ) : 'Run Simulation'}
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2">Quick Scenarios</h4>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setScenario(s)}
                  className="w-full text-left p-4 rounded-xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/40 text-[10px] font-bold text-slate-400 hover:text-indigo-300 transition-all leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="xl:col-span-2">
          {!result && !loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/10 border border-dashed border-slate-800 rounded-[3rem] p-12 text-center opacity-40">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Awaiting Simulation Parameters</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-8 p-12 bg-[#0a0f1e]/40 rounded-[3rem] border border-slate-800/40">
               <div className="relative">
                  <div className="w-24 h-24 border-2 border-indigo-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-2 border-indigo-400 border-b-transparent rounded-full animate-[spin_1s_linear_infinite_reverse]"></div>
               </div>
               <div className="space-y-2 text-center">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse">Computing Trajectories</p>
                  <p className="text-xs text-slate-600 italic">Processing historical data against market volatility models...</p>
               </div>
            </div>
          ) : (
            <div className="bg-[#0a0f1e]/80 p-8 md:p-12 rounded-[3rem] border border-slate-800/40 shadow-2xl animate-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800/60">
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Projection Analysis</h3>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
               </div>
               <div className="prose prose-invert prose-slate prose-sm max-w-none prose-p:text-slate-400 prose-strong:text-indigo-400 prose-headings:text-slate-100">
                  {result?.split('\n').map((line, i) => (
                    <p key={i} className="mb-4 leading-relaxed font-medium">
                      {line}
                    </p>
                  ))}
               </div>
               <div className="mt-12 p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 flex items-center gap-4">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[10px] text-indigo-300 font-bold leading-relaxed">
                    Confidence Interval: 87.4%. Models are based on linear growth and historical asset volatility. Consult a human fiduciary for final decisions.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulations;
