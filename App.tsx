import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import MarketAnalysis from './components/MarketAnalysis';
import NearbyShopping from './components/NearbyShopping';
import FinancialProfile from './components/FinancialProfile';
import Simulations from './components/Simulations';
import WelcomeScreen from './components/WelcomeScreen';
import { Transaction, FinancialSummary, BudgetGoal, UserProfile } from './types';
import { CATEGORIES, MOCK_TRANSACTIONS, INITIAL_BUDGETS } from './constants';
import { parseReceipt, parseBankStatement } from './services/geminiService';
import { downloadCSV } from './utils/exportUtils';

const STORAGE_KEYS = {
  TRANSACTIONS: 'vaulty_transactions_v14',
  BUDGETS: 'vaulty_budgets_v14',
  PROFILE: 'vaulty_profile_v14',
  HAS_STARTED: 'vaulty_has_started'
};

const DEFAULT_PROFILE: UserProfile = {
  baseSalary: 4500,
  otherIncome: 500,
  initialAssets: 15000,
  initialLiabilities: 3630,
  currency: 'USD',
  isPro: false,
  institutionLinked: false
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.HAS_STARTED) === 'true';
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<BudgetGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const parsed = saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    return { ...parsed, isPro: false };
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBankLink, setShowBankLink] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  
  const [newTx, setNewTx] = useState({
    amount: '',
    description: '',
    category: CATEGORIES[0],
    type: 'expense' as 'expense' | 'income'
  });

  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  const handleStart = () => {
    setHasStarted(true);
    sessionStorage.setItem(STORAGE_KEYS.HAS_STARTED, 'true');
  };

  const summary = useMemo((): FinancialSummary => {
    const transactionIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const transactionExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const currentNetWorth = (profile.initialAssets - profile.initialLiabilities) + (transactionIncome - transactionExpenses);
    return {
      totalBalance: transactionIncome - transactionExpenses,
      monthlyIncome: profile.baseSalary + profile.otherIncome,
      monthlyExpenses: transactionExpenses,
      savingsRate: (profile.baseSalary + profile.otherIncome) > 0 ? ((profile.baseSalary + profile.otherIncome) - (transactionExpenses)) / (profile.baseSalary + profile.otherIncome) : 0,
      netWorth: currentNetWorth,
      projectedAnnualIncome: (profile.baseSalary + profile.otherIncome) * 12
    };
  }, [transactions, profile]);

  const handleAddTransaction = (tx: Partial<Transaction>) => {
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: tx.date || new Date().toISOString().split('T')[0],
      amount: Math.abs(tx.amount || 0),
      description: tx.description || 'Entry',
      category: tx.category || 'Other',
      type: tx.type || 'expense',
      source: tx.source || 'manual'
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const processFile = async (file: File) => {
    setIsLinking(true);
    try {
      const text = await file.text();
      const parsed = await parseBankStatement(text);
      if (Array.isArray(parsed)) {
        parsed.forEach((tx: any) => handleAddTransaction({ ...tx, source: 'bank_sync' }));
        setProfile(prev => ({ ...prev, institutionLinked: true }));
        setShowBankLink(false);
      }
    } catch (e) {
      alert("Statement sync failed.");
    } finally {
      setIsLinking(false);
    }
  };

  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Camera access denied.");
      setShowScanner(false);
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      
      try {
        const result = await parseReceipt(base64);
        handleAddTransaction({ ...result, source: 'receipt' });
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setShowScanner(false);
      } catch (e) {
        alert("Could not read receipt.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleExportTransactions = () => {
    downloadCSV(transactions, 'vaulty_transactions');
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="flex bg-slate-950 h-screen w-full text-slate-200 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isPro={false} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="shrink-0 z-30 bg-slate-950/60 backdrop-blur-md border-b border-slate-900/60 px-4 md:px-8 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-slate-100 tracking-tight">Vaulty</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={startScanner} className="p-2 md:p-3 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl hover:bg-slate-800 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={2}/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2}/></svg>
            </button>
            <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl text-[11px] md:text-sm font-black hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Add Entry</button>
          </div>
        </header>

        {/* Content Area - Dedicated Scrolling container */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-6xl mx-auto w-full px-4 md:px-12 py-6 md:py-10 pb-32">
            {activeTab === 'dashboard' && <Dashboard summary={summary} transactions={transactions} budgets={budgets} />}
            {activeTab === 'profile' && <FinancialProfile profile={profile} onUpdate={setProfile} />}
            {activeTab === 'advisor' && <AIChat transactions={transactions} summary={summary} profile={profile} />}
            {activeTab === 'market' && <MarketAnalysis />}
            {activeTab === 'shopping' && <NearbyShopping />}
            {activeTab === 'simulations' && <Simulations profile={profile} summary={summary} />}
            
            {activeTab === 'transactions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-slate-900/40 rounded-[2rem] border border-slate-900 overflow-hidden shadow-2xl">
                  <div className="p-6 md:p-8 border-b border-slate-900 flex justify-between items-center bg-slate-900/20">
                    <h3 className="font-bold text-slate-100">Verified Ledger</h3>
                    <div className="flex gap-2">
                      <button onClick={handleExportTransactions} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-400/20 px-3 py-1.5 rounded-lg hover:bg-indigo-400/10 transition-all">Export Ledger</button>
                      <button onClick={() => setShowBankLink(true)} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-400/20 px-3 py-1.5 rounded-lg hover:bg-indigo-400/10 transition-all">Connect Bank</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left text-sm min-w-[500px]">
                      <thead className="bg-slate-950 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <tr><th className="px-6 py-5">Date</th><th className="px-6 py-5">Label</th><th className="px-6 py-5">Source</th><th className="px-6 py-5 text-right">Amount</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {transactions.slice().reverse().map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-6 py-4 text-slate-600 font-mono text-[10px]">{tx.date}</td>
                            <td className="px-6 py-4 font-semibold text-slate-200 text-xs">{tx.description}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase ${tx.source === 'receipt' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : tx.source === 'bank_sync' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{tx.source || 'Manual'}</span>
                            </td>
                            <td className={`px-6 py-4 text-right font-black text-xs ${tx.type === 'income' ? 'text-indigo-400' : 'text-slate-100'}`}>{tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      {showScanner && (<div className="fixed inset-0 bg-black z-[110] flex flex-col overflow-hidden"><header className="p-4 md:p-6 flex justify-between items-center text-white bg-black/40 backdrop-blur-md absolute top-0 inset-x-0 z-10"><h3 className="text-[10px] font-black uppercase tracking-widest">Neural Scan</h3><button onClick={() => { (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(track => track.stop()); setShowScanner(false); }} className="text-2xl p-2">&times;</button></header><video ref={videoRef} className="flex-1 object-cover" playsInline muted></video><canvas ref={canvasRef} className="hidden"></canvas><footer className="p-10 md:p-12 flex justify-center bg-gradient-to-t from-black to-transparent absolute bottom-0 inset-x-0"><button onClick={captureAndScan} disabled={isScanning} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white flex items-center justify-center group relative"><div className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-white transition-all ${isScanning ? 'scale-0' : 'group-hover:scale-90'}`}></div>{isScanning && <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>}</button></footer></div>)}
      {showBankLink && (<div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4"><div className="bg-slate-900 w-full max-w-xl rounded-[2rem] border border-slate-800 shadow-2xl p-8 space-y-6 relative">{isLinking && (<div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6"><div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div><p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Syncing...</p></div>)}<div className="flex justify-between items-start"><div><h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter">Universal Sync</h3><p className="text-[10px] text-slate-500 mt-1">Drop banking CSV exports.</p></div><button onClick={() => setShowBankLink(false)} className="text-slate-500 hover:text-white text-3xl">&times;</button></div><div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if(f) processFile(f); }} className="border-2 border-dashed border-slate-800 bg-slate-950/30 rounded-[1.5rem] p-12 flex flex-col items-center justify-center text-center"><p className="text-xs font-bold text-slate-400">Drag Statement or <span className="text-indigo-400 cursor-pointer">Browse</span></p><input type="file" className="hidden" id="bank-file" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} /><label htmlFor="bank-file" className="mt-6 px-6 py-2 bg-slate-800 text-[10px] font-bold rounded-xl cursor-pointer">Select File</label></div></div></div>)}
      {showAddModal && (<div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"><div className="bg-slate-900 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl border border-slate-800"><div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-100">Entry</h3><button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white text-2xl">&times;</button></div><form onSubmit={(e) => { e.preventDefault(); handleAddTransaction({ amount: parseFloat(newTx.amount), description: newTx.description, category: newTx.category, type: newTx.type, source: 'manual' }); setShowAddModal(false); }} className="space-y-6"><div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800"><button type="button" onClick={() => setNewTx({...newTx, type: 'expense'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${newTx.type === 'expense' ? 'bg-slate-800 text-indigo-400' : 'text-slate-600'}`}>Expense</button><button type="button" onClick={() => setNewTx({...newTx, type: 'income'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${newTx.type === 'income' ? 'bg-slate-800 text-indigo-400' : 'text-slate-600'}`}>Income</button></div><input type="number" required value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: e.target.value})} placeholder="0.00" className="w-full bg-transparent text-4xl font-bold text-slate-100 border-b-2 border-slate-800 outline-none pb-4" /><input type="text" required value={newTx.description} onChange={(e) => setNewTx({...newTx, description: e.target.value})} placeholder="Label" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none" /><button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-indigo-600/20 active:scale-95">Log Entry</button></form></div></div>)}
    </div>
  );
};

export default App;