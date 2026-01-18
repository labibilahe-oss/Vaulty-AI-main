import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, FinancialSummary, BudgetGoal } from '../types';
import { CATEGORIES } from '../constants';
import { downloadCSV } from '../utils/exportUtils';
import InfoIcon from './InfoIcon';

interface DashboardProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  budgets: BudgetGoal[];
}

const COLORS = ['#6366f1', '#4ade80', '#fb7185', '#fbbf24', '#a78bfa', '#2dd4bf', '#f472b6', '#94a3b8'];

const Dashboard: React.FC<DashboardProps> = ({ summary, transactions, budgets }) => {
  const chartData = transactions.slice(-10).map(t => ({
    name: t.date.split('-').slice(1).join('/'),
    amount: t.type === 'income' ? Number(t.amount) : -Number(t.amount)
  }));

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (Number(acc[t.category]) || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => Number(b.value) - Number(a.value));
  }, [transactions]);

  const metrics = [
    { label: 'MONTHLY INCOME', value: `$${Number(summary.monthlyIncome).toLocaleString()}`, trend: '+12%', color: 'text-[#4ade80]' },
    { label: 'OUTBOUND FLOW', value: `$${Number(summary.monthlyExpenses).toLocaleString()}`, trend: '-5%', color: 'text-[#fb7185]' },
    { label: 'SAVINGS RATE', value: `${(Number(summary.savingsRate) * 100).toFixed(1)}%`, trend: 'Target: 20%', color: 'text-[#a78bfa]' },
  ];

  const handleExportSummary = () => {
    const summaryData = [
      { Metric: 'Estimated Net Worth', Value: summary.netWorth },
      { Metric: 'Monthly Income', Value: summary.monthlyIncome },
      { Metric: 'Monthly Expenses', Value: summary.monthlyExpenses },
      { Metric: 'Savings Rate', Value: `${(summary.savingsRate * 100).toFixed(2)}%` },
      { Metric: 'Projected Annual Income', Value: summary.projectedAnnualIncome },
      { Metric: 'Total Balance', Value: summary.totalBalance }
    ];
    downloadCSV(summaryData, 'vaulty_financial_summary');
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      {/* Net Worth Card - Removed overflow-hidden */}
      <div className="bg-[#0a0f1e]/60 p-8 md:p-10 rounded-[2.5rem] border border-slate-800/40 shadow-2xl flex flex-col justify-between h-44 md:h-52 group relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32 pointer-events-none rounded-full"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">ESTIMATED NET WORTH</span>
          <button 
            onClick={handleExportSummary}
            className="text-[9px] font-bold px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest hover:bg-indigo-500/20 transition-all active:scale-95"
          >
            Export Summary
          </button>
        </div>
        <div className="text-5xl md:text-6xl font-black text-white tracking-tighter relative z-10">
          ${Number(summary.netWorth).toLocaleString()}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {metrics.map((card, idx) => (
          <div key={idx} className="bg-[#0a0f1e]/60 p-6 md:p-8 rounded-[2rem] border border-slate-800/40 flex flex-col justify-between group h-36 shadow-lg transition-all hover:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{card.label}</span>
              <div className="bg-[#020617] px-2 py-0.5 rounded border border-slate-800/60">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{card.trend}</span>
              </div>
            </div>
            <div className={`text-3xl font-bold ${card.color} tracking-tight`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Spending Breakdown */}
        <div className="bg-[#0a0f1e]/40 p-8 md:p-10 rounded-[2.5rem] border border-slate-800/40">
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-8">Outbound Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 md:w-56 md:h-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {categoryData.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-100">${Number(item.value).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Performance */}
        <div className="bg-[#0a0f1e]/40 p-8 md:p-10 rounded-[2.5rem] border border-slate-800/40">
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-8">Budget Guardrails</h3>
          <div className="space-y-6">
            {budgets.map((budget) => {
              const percent = Math.min((Number(budget.spent) / Number(budget.limit)) * 100, 100);
              const isHigh = percent > 85;
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{budget.category}</span>
                    <span className="text-[10px] font-bold text-slate-100">
                      ${Number(budget.spent).toLocaleString()} / <span className="text-slate-500">${Number(budget.limit).toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isHigh ? 'bg-rose-500' : percent > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Liquidity Chart Section - Removed overflow-hidden */}
      <div className="bg-slate-900/20 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-800/40 shadow-inner relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
           <div className="flex items-center">
             <h3 className="text-lg font-bold text-slate-200 tracking-tight">Liquidity Timeline</h3>
             <InfoIcon tooltip="Visualize your transaction history as a net flow over time. Spikes represent large income entries, while dips show spending cycles." align="left" />
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Net Cash Flow</span>
           </div>
        </div>
        <div className="h-[250px] md:h-[400px] -ml-6 md:-ml-8 overflow-hidden rounded-[2rem]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#1e293b" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 600}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 600}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.7)' }}
                itemStyle={{ color: '#f8fafc', fontSize: '10px', fontWeight: 700 }}
                cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={4} animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;