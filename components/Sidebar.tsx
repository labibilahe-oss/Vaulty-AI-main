import React from 'react';
import Logo from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPro: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', soon: false },
    { id: 'profile', label: 'Wealth Profile', soon: false },
    { id: 'transactions', label: 'Transactions', soon: false },
    { id: 'simulations', label: 'Trajectory Labs', soon: true },
    { id: 'shopping', label: 'Market Deals', soon: true },
    { id: 'advisor', label: 'AI Advisor', soon: false },
    { id: 'market', label: 'Market Intel', soon: true },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] border-r border-slate-900 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-screen shrink-0 overflow-hidden`}>
        <div className="p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Vaulty</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-6 scroll-smooth">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => { 
                if (!item.soon) {
                  setActiveTab(item.id);
                  onClose(); 
                }
              }} 
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group ${item.soon ? 'opacity-60 cursor-not-allowed' : ''} ${activeTab === item.id ? 'bg-slate-900/60 text-indigo-400 font-bold border border-slate-800/40 shadow-lg shadow-black/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/30'}`}
            >
              <div className={`w-1 h-4 rounded-full mr-3 transition-colors ${activeTab === item.id ? 'bg-indigo-500' : 'bg-transparent group-hover:bg-slate-800'}`}></div>
              <span className="text-sm">{item.label}</span>
              {item.soon && (
                <span className="ml-auto text-[8px] font-black uppercase text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded tracking-tighter">Soon</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 shrink-0 border-t border-slate-900/50 bg-[#020617]">
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
            Secure Portal v1.4
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;