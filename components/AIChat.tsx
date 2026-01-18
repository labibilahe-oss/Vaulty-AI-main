import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction, FinancialSummary, ChatMessage, UserProfile } from '../types';
import InfoIcon from './InfoIcon';

interface AIChatProps {
  transactions: Transaction[];
  summary: FinancialSummary;
  profile: UserProfile;
}

const AIChat: React.FC<AIChatProps> = ({ transactions, summary, profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, forcedInput?: string) => {
    if (e) e.preventDefault();
    const activeInput = forcedInput || input;
    if (!activeInput.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: activeInput }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await getFinancialAdvice(transactions, summary, profile, activeInput, false);
      const aiMessage: ChatMessage = { 
        role: 'model', 
        parts: [{ text: result.text }], 
        sources: result.sources as { title: string; uri: string }[] 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Advisory sync failed. Check connection." }] }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(text);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="flex flex-col h-full max-h-full bg-slate-900/40 rounded-[2rem] border border-slate-900 shadow-2xl relative">
      
      {/* Main Chat Area - Removed overflow-hidden from here to allow header tooltip pop-out */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 relative h-full">
        {/* Advisor Header - Added z-index and explicit overflow-visible */}
        <div className={`shrink-0 px-6 py-4 border-b flex items-center justify-between transition-all duration-500 bg-slate-900/60 border-slate-900 relative z-50 rounded-t-[2rem]`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-800 border border-slate-700 text-indigo-400`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className={`font-bold text-sm tracking-tight flex items-center text-slate-100`}>
              AI Financial Advisor
              <InfoIcon align="center" tooltip="Grounded by real-time Google Search results to provide accurate financial guidance." />
            </h3>
          </div>
          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
            Identity Verified
          </div>
        </div>

        {/* Chat Feed - This keeps its scrolling behavior */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 no-scrollbar scroll-smooth relative z-10" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-2xl md:rounded-[2rem] shadow-2xl relative ${
                m.role === 'user' ? 'bg-indigo-600 text-white font-semibold text-xs rounded-tr-none' : `text-slate-200 text-xs leading-relaxed border rounded-tl-none bg-slate-900 border-slate-800`
              }`}>
                <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">{m.parts[0].text}</div>
                
                {m.role === 'model' && m.sources && m.sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Grounding Sources</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {m.sources.map((source, sIdx) => (
                        <div key={sIdx} className="group flex flex-col bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl transition-all overflow-hidden">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-200 truncate pr-4">{source.title || "External Source"}</span>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => copyToClipboard(source.uri)} className="text-slate-500 hover:text-white p-1 relative">
                                    {copyStatus === source.uri && <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-emerald-600 text-[8px] text-white rounded">Copied!</span>}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                </button>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 p-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 break-all leading-tight select-all bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">{source.uri}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-[9px] font-black text-slate-600 uppercase animate-pulse">Consulting Global Intelligence...</div>}
        </div>

        <div className="shrink-0 p-4 md:p-6 bg-slate-950/40 border-t border-slate-900 z-20 rounded-b-[2rem]">
          <form onSubmit={handleSend} className="flex gap-3 p-1 rounded-2xl border border-slate-800 bg-slate-950">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about markets, taxes, or finance tips..." 
              className="flex-1 bg-transparent px-4 py-2 text-xs md:text-sm text-slate-100 outline-none" 
            />
            <button type="submit" disabled={loading} className="px-5 md:px-8 py-2 md:py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 text-white disabled:opacity-50">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;