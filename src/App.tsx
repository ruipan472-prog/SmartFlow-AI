/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  CreditCard, 
  Upload, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  History,
  Crown,
  Building2,
  Users,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { cn } from './lib/utils';
import { Transaction, CreditHealth, AppState, Applicant } from './types';
import { classifyTransactions } from './services/geminiService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export default function App() {
  const [state, setState] = useState<AppState>({
    role: 'proprietor',
    isPremium: false,
    transactions: [],
    isClassifying: false,
    view: 'upload'
  });

  const [promptData, setPromptData] = useState("");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const demoData = [
    { date: '2024-04-01', balance: 5000 },
    { date: '2024-04-05', balance: 4800 },
    { date: '2024-04-10', balance: 6500 },
    { date: '2024-04-15', balance: 6200 },
    { date: '2024-04-20', balance: 7800 },
    { date: '2024-04-25', balance: 7500 },
    { date: '2024-04-28', balance: 8200 },
  ];

  const categoryData = [
    { name: 'Business', value: 75, color: '#10B981' },
    { name: 'Personal', value: 25, color: '#6B7280' },
  ];

  const mockApplicants: Applicant[] = [
    { id: '1', businessName: 'Creative Bloom Studio', ownerName: 'Sarah Jenkins', score: 742, status: 'Review', lastUpdated: '2024-04-28', sector: 'Service' },
    { id: '2', businessName: 'Swift Logic Tech', ownerName: 'Michael Chen', score: 810, status: 'Approved', lastUpdated: '2024-04-27', sector: 'SaaS' },
    { id: '3', businessName: 'Neighborhood Bakehouse', ownerName: 'Elena Rossi', score: 655, status: 'Pending', lastUpdated: '2024-04-25', sector: 'Retail' },
    { id: '4', businessName: 'Iron Roots Logistics', ownerName: 'Tom Harding', score: 590, status: 'Review', lastUpdated: '2024-04-24', sector: 'Transport' },
  ];

  const handleUpload = async (rawText?: string, pdfData?: string) => {
    setState(prev => ({ ...prev, isClassifying: true }));
    const dataToProcess = rawText || (pdfData ? "" : promptData) || "Amazon, $45.50, Bank; Starbucks, $12.00, Bank; New Client, $1500, PayPal";
    const classified = await classifyTransactions(dataToProcess, pdfData);
    
    setState(prev => ({
      ...prev,
      transactions: classified,
      isClassifying: false,
      view: 'dashboard',
      creditHealth: {
        score: 742,
        label: 'Good',
        lastUpdated: new Date().toISOString(),
        factors: [
          { name: 'Revenue Consistency', value: 85, description: 'Matching expected growth curve' },
          { name: 'Expense Ratio', value: 62, description: 'Better than 70% of sole proprietors' },
          { name: 'Cash Flow Health', value: 91, description: 'Excellent liquidity buffer' }
        ]
      }
    }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    if (file.type === 'application/pdf') {
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        handleUpload(undefined, base64);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleUpload(content);
      };
      reader.readAsText(file);
    }
  };

  const switchRole = (role: 'proprietor' | 'bank') => {
    setState(prev => ({
      ...prev,
      role,
      view: role === 'proprietor' ? 'upload' : 'bank_dashboard'
    }));
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[var(--color-soft-bg)] overflow-hidden border-x border-gray-200">
      {/* Role Switcher & Header */}
      <div className="bg-white border-b border-gray-100 z-50">
        <div className="flex p-2 justify-center gap-2">
          <button 
            onClick={() => switchRole('proprietor')}
            className={cn(
              "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all",
              state.role === 'proprietor' ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            )}
          >
            Proprietor (B2C)
          </button>
          <button 
            onClick={() => switchRole('bank')}
            className={cn(
              "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all",
              state.role === 'bank' ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            )}
          >
            Bank Portal (B2B)
          </button>
        </div>

        <header className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <h1 className="font-semibold text-base tracking-tight">SmartFlow AI</h1>
          </div>
          <button 
            onClick={() => setState(p => ({ ...p, isPremium: !p.isPremium }))}
            className={cn(
              "px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 transition-all rounded-lg",
              state.isPremium 
                ? "bg-amber-100 text-amber-700" 
                : "bg-black text-white hover:opacity-90"
            )}
          >
            {state.isPremium ? <Crown className="w-3 h-3 text-amber-500 fill-current" /> : null}
            {state.isPremium ? 'Premium Plan' : 'Basic Tier'}
          </button>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        <AnimatePresence mode="wait">
          {/* Proprietor Flow */}
          {state.role === 'proprietor' && state.view === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-4">
                <h2 className="text-2xl font-black mb-1 leading-tight italic">ELEVATE YOUR CREDIT.</h2>
                <p className="text-[var(--color-brand-secondary)] text-sm">
                  AI-driven classification for messy cash flow data.
                </p>
              </div>

              <div 
                className="border-2 border-dashed border-gray-200 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 bg-white hover:border-gray-300 transition-colors cursor-pointer relative overflow-hidden"
                onClick={() => document.getElementById('hidden-file-input')?.click()}
              >
                <input 
                  type="file" 
                  id="hidden-file-input" 
                  className="hidden" 
                  accept=".csv,.txt,.pdf" 
                  onChange={onFileChange}
                />
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  {state.isClassifying ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-8 h-8 text-black" />
                    </motion.div>
                  ) : (
                    <Upload className="w-8 h-8 text-black" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold">{state.isClassifying ? 'Analyzing...' : 'Upload Transactions'}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">CSV • PDF • WeChat • PayPal</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] uppercase font-black text-gray-400 mb-2 px-1">Quick Demo Input</p>
                <textarea 
                  className="w-full p-4 rounded-3xl border border-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-black h-24 shadow-sm bg-white"
                  placeholder="Paste transaction text here..."
                  value={promptData}
                  onChange={(e) => setPromptData(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4 flex flex-col gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <p className="text-xs font-bold">Secure Vault</p>
                  <p className="text-[10px] text-gray-400">AES-256 Protocol</p>
                </div>
                <div className="glass-card p-4 flex flex-col gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <p className="text-xs font-bold">AI Processing</p>
                  <p className="text-[10px] text-gray-400">Instant Report</p>
                </div>
              </div>
            </motion.div>
          )}

          {state.role === 'proprietor' && state.view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 flex flex-col items-center text-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div className="absolute inset-0 border-[10px] border-gray-50 rounded-full"></div>
                  <svg className="absolute inset-0 w-44 h-44 -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="78"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="10"
                      strokeDasharray="490"
                      strokeDashoffset={490 - (490 * (state.creditHealth?.score || 742)) / 900}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl font-black italic">{state.creditHealth?.score || 742}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mt-1">
                      {state.creditHealth?.label || 'Good'}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                    View Full Factors <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Revenue Split</h3>
                <div className="glass-card p-4 flex items-center gap-6">
                  <div className="w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {categoryData.map(c => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-[10px] font-black uppercase">{c.name}</span>
                        </div>
                        <span className="text-xs font-bold italic">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cn(
                "relative overflow-hidden rounded-[32px] p-6 transition-all duration-500",
                state.isPremium ? "premium-gradient text-white" : "bg-white border border-gray-100"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black italic">Business Deep-Dive</h3>
                  <div className={cn(
                    "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter",
                    state.isPremium ? "bg-amber-400 text-black" : "bg-gray-100 text-gray-400"
                  )}>
                    Premium Only
                  </div>
                </div>

                {!state.isPremium ? (
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-gray-400 mb-2">Upgrade to unlock:</p>
                    <ul className="space-y-2 mb-4">
                      {['Downloadable PDF Reports', 'Multi-Year Trend Analysis', 'Custom Risk Factor Insights'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                          <div className="w-1 h-1 bg-amber-400 rounded-full" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setState(p => ({ ...p, isPremium: true }))}
                      className="w-full py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Crown className="w-3 h-3 text-amber-400 fill-current" /> Access Reports
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="h-32 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={demoData}>
                          <Area type="monotone" dataKey="balance" stroke="#10B981" fill="rgba(16, 185, 129, 0.2)" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {state.creditHealth?.factors.map(f => (
                        <div key={f.name} className="premium-glass p-3 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-[9px] uppercase font-black text-gray-400 leading-none mb-1">{f.name}</p>
                            <p className="text-[10px] text-gray-300">{f.description}</p>
                          </div>
                          <span className="text-xs font-black italic text-green-400">{f.value}%</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 premium-glass text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-white/20">
                      <Download className="w-3 h-3" /> Download PDF Report
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {state.role === 'proprietor' && state.view === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-black italic">History</h2>
              {state.transactions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                  <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">No data mapped</p>
                </div>
              ) : (
                <div className="space-y-3 pb-8">
                  {state.transactions.map((t, i) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center",
                          t.category === 'Business' ? "bg-green-50" : "bg-gray-50"
                        )}>
                          {t.amount > 0 ? (
                            <ArrowDownLeft className={cn("w-5 h-5", t.category === 'Business' ? "text-green-600" : "text-gray-400")} />
                          ) : (
                            <ArrowUpRight className={cn("w-5 h-5", t.category === 'Business' ? "text-green-600" : "text-gray-400")} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black truncate max-w-[140px] leading-tight">{t.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t.date}</span>
                            <span className={cn(
                              "text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-tight",
                              t.category === 'Business' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            )}>
                              {t.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black italic">
                          {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">{Math.round(t.confidence * 100)}% AI Confidence</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Bank Flow */}
          {state.role === 'bank' && state.view === 'bank_dashboard' && (
            <motion.div
              key="bank_dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6 pb-20"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black italic">Applicants</h2>
                <button className="p-2 bg-white rounded-xl border border-gray-100"><Filter className="w-4 h-4" /></button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search portfolios..." 
                  className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-white border border-gray-100 text-sm focus:outline-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Active Reviews</p>
                  <p className="text-2xl font-black italic">12</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Avg Score</p>
                  <p className="text-2xl font-black italic">712</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Recent Applications</p>
                {mockApplicants.map(applicant => (
                  <motion.div 
                    key={applicant.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setState(p => ({ ...state, view: 'applicant_detail', selectedApplicant: applicant }))}
                    className="glass-card p-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black leading-tight">{applicant.businessName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-gray-400 font-bold uppercase">{applicant.sector}</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase",
                            applicant.status === 'Approved' ? "bg-green-100 text-green-700" : 
                            applicant.status === 'Review' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                          )}>
                            {applicant.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black italic">{applicant.score}</p>
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter leading-none mt-1">Risk Profile</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {state.role === 'bank' && state.view === 'applicant_detail' && state.selectedApplicant && (
            <motion.div
              key="applicant_detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pb-20"
            >
              <button 
                onClick={() => setState(p => ({ ...state, view: 'bank_dashboard' }))}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                <ChevronLeft className="w-4 h-4" /> Back to List
              </button>

              <div className="glass-card p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black italic leading-tight">{state.selectedApplicant.businessName}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Owned by {state.selectedApplicant.ownerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black italic text-green-600">{state.selectedApplicant.score}</span>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Score Index</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Financial Sector</p>
                    <p className="text-xs font-bold">{state.selectedApplicant.sector}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Reporting Period</p>
                    <p className="text-xs font-bold">12 Months (2023-24)</p>
                  </div>
                </div>
              </div>

              {/* Premium Bank Insights */}
              <div className={cn(
                "rounded-[32px] overflow-hidden transition-all duration-500",
                state.isPremium ? "" : "border border-gray-100 bg-white p-6"
              )}>
                {!state.isPremium ? (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                      <Crown className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest">Premium Underwriting</h3>
                      <ul className="space-y-1.5 mt-3 mb-4 text-left">
                        {['Granular Cash-Flow Heatmaps', 'AI Automated Risk Summaries', 'Churn Risk Projections'].map(f => (
                          <li key={f} className="flex items-center gap-2 text-[9px] font-bold text-gray-500">
                             <ShieldCheck className="w-2.5 h-2.5 text-blue-400" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => setState(p => ({ ...p, isPremium: true }))}
                      className="w-full py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90"
                    >
                      Unlock Detailed Reports
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="premium-gradient text-white rounded-[32px] p-6">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" /> Cash Flow Health
                      </h3>
                      <div className="h-40 w-full font-mono text-[8px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={demoData}>
                            <Area type="monotone" dataKey="balance" stroke="#10B981" fill="rgba(16, 185, 129, 0.4)" strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="premium-glass p-2 rounded-xl text-center">
                          <p className="text-[8px] font-black uppercase text-gray-400">Churn</p>
                          <p className="text-xs font-bold underline">Low</p>
                        </div>
                        <div className="premium-glass p-2 rounded-xl text-center">
                          <p className="text-[8px] font-black uppercase text-gray-400">Liquidity</p>
                          <p className="text-xs font-bold underline">High</p>
                        </div>
                        <div className="premium-glass p-2 rounded-xl text-center">
                          <p className="text-[8px] font-black uppercase text-gray-400">Trend</p>
                          <p className="text-xs font-bold underline text-green-400">+12%</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 font-mono">Analysis Summary</h3>
                      <div className="glass-card p-4 space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase">Revenue Consistency</p>
                            <p className="text-[10px] text-gray-500 italic mt-0.5 font-serif">Top 5% of sole proprietors in {state.selectedApplicant.sector}. AI suggests high predictability.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase">Customer Churn Risk</p>
                            <p className="text-[10px] text-gray-500 italic mt-0.5 font-serif">Diverse client base detected. No single-client dependency identified.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Approve Limit
                </button>
                <button className="p-4 bg-white border border-gray-100 rounded-2xl">
                  <Download className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation - Only for Proprietor */}
      {state.role === 'proprietor' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex items-center justify-between z-50">
          <NavButton 
            active={state.view === 'dashboard'} 
            onClick={() => setState(p => ({ ...p, view: 'dashboard' }))}
            icon={<LayoutGrid className="w-6 h-6" />}
            label="Home"
          />
          <NavButton 
            active={state.view === 'transactions'} 
            onClick={() => setState(p => ({ ...p, view: 'transactions' }))}
            icon={<History className="w-6 h-6" />}
            label="History"
          />
          <div className="relative -top-8">
            <button 
              onClick={() => setState(p => ({ ...p, view: 'upload' }))}
              className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-all"
            >
              <Upload className="text-white w-6 h-6" />
            </button>
          </div>
          <NavButton 
            active={false} 
            onClick={() => {}}
            icon={<TrendingUp className="w-6 h-6" />}
            label="Insights"
            disabled
          />
          <NavButton 
            active={false} 
            onClick={() => {}}
            icon={<CreditCard className="w-6 h-6" />}
            label="Wallet"
            disabled
          />
        </nav>
      )}

      {/* Bank Specific Nav/Footer if needed, or just keep it simple */}
      {state.role === 'bank' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-4 flex items-center justify-around text-[9px] font-black uppercase tracking-widest text-gray-400">
           <div className="flex flex-col items-center gap-1 text-black">
              <Users className="w-5 h-5" />
              <span>Portfolios</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-20">
              <BarChart3 className="w-5 h-5" />
              <span>Risk Desk</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-20">
              <ExternalLink className="w-5 h-5" />
              <span>Export</span>
           </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick, disabled = false }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-black" : "text-gray-400 hover:text-gray-600",
        disabled && "opacity-10 cursor-not-allowed"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-black rounded-full mt-0.5"
        />
      )}
    </button>
  );
}

