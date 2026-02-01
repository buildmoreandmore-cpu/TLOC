
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client, SnowballPlan } from '../types';
import { analyzeCreditReport, generateDebtSnowballPlan } from '../geminiService';
import { IconMagic, IconSnowball } from '../components/Icons';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientPortal: React.FC<Props> = ({ clients, setClients }) => {
  const { token } = useParams();
  const client = clients.find(c => c.token === token);
  const [analyzing, setAnalyzing] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [reportText, setReportText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snowballPlan, setSnowballPlan] = useState<SnowballPlan[]>([]);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl text-center max-w-sm border border-slate-100">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-black text-black mb-4">Invalid Access</h1>
          <p className="text-slate-500">The access link you used is invalid or has expired. Please contact support.</p>
        </div>
      </div>
    );
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setReportText(text);
    } catch (err) {
      setError('Could not access clipboard. Please paste manually.');
    }
  };

  const handleAnalysis = async () => {
    if (!reportText.trim()) {
      setError('Please paste your report text first.');
      return;
    }
    setAnalyzing(true);
    setError('');
    setSuccess(false);
    
    try {
      const items = await analyzeCreditReport(reportText);
      const updatedClients = clients.map(c => 
        c.id === client.id ? { 
          ...c, 
          negativeItems: [...c.negativeItems, ...items], 
          status: 'active' as const 
        } : c
      );
      setClients(updatedClients);
      setReportText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze report. Ensure you copied the full text of the report.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSnowballGenerate = async () => {
    if (client.negativeItems.length === 0) {
      setError('Analyze your credit report first to identify debts.');
      return;
    }
    setPlanning(true);
    try {
      const plan = await generateDebtSnowballPlan(client.negativeItems);
      setSnowballPlan(plan);
    } catch (err) {
      setError('Failed to generate payoff plan.');
    } finally {
      setPlanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Client Portal</span>
              <span className="text-slate-200">/</span>
              <span className="text-slate-500 font-bold">Three Level of Credit</span>
            </div>
            <h1 className="text-7xl font-black text-black tracking-tighter leading-none mb-6">Welcome, {client.name}</h1>
            <p className="text-2xl text-slate-500 font-medium">Your journey to a better credit score and a debt-free lifestyle starts here.</p>
          </div>
          <div className="bg-[#f2f7fc] p-8 rounded-[2rem] border border-white shadow-xl flex items-center gap-10">
            <div className="text-right">
              <span className="text-[10px] text-blue-600 uppercase tracking-[0.2em] font-black block mb-2">Current Score</span>
              <div className="text-5xl font-black text-black leading-none">{client.score || '---'}</div>
            </div>
            <div className="w-px h-12 bg-blue-100"></div>
            <div className="text-right">
              <span className="text-[10px] text-blue-600 uppercase tracking-[0.2em] font-black block mb-2">Status</span>
              <div className="text-sm font-black text-black uppercase">{client.status}</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            {/* Analysis Box */}
            <section className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden card-shadow">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-2xl"><IconMagic /></div>
                  <div>
                    <h2 className="text-2xl font-black text-black">AI Credit Report Analysis</h2>
                    <p className="text-slate-500 font-bold">Securely scan for disputable errors</p>
                  </div>
                </div>
                <button 
                  onClick={handlePaste}
                  className="bg-white border border-slate-200 text-xs font-black text-black px-6 py-3 rounded-xl hover:bg-slate-50 transition shadow-sm"
                >
                  Paste from Clipboard
                </button>
              </div>
              
              <div className="p-10">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Copy the full text of your credit report from <strong className="text-black">IdentityIQ</strong> or <strong className="text-black">AnnualCreditReport.com</strong> and paste it below. Our AI will automatically identify negative items.
                </p>
                
                <div className="relative mb-8">
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className={`w-full h-72 p-6 border rounded-[2rem] focus:ring-4 focus:ring-blue-100 outline-none text-base font-mono transition-all resize-none ${error ? 'border-red-300 bg-red-50/20' : 'border-slate-100 bg-slate-50/50'}`}
                    placeholder="Paste credit report raw text data here..."
                  ></textarea>
                  
                  {analyzing && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-[2rem] z-20">
                      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
                      <p className="text-2xl font-black text-black">AI Analysis in Progress...</p>
                      <p className="text-slate-500 mt-2 font-bold italic">Identifying accounts, balances, and legal errors</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-5 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-100 mb-8 flex items-center gap-3">
                    <span className="text-xl">⚠️</span> {error}
                  </div>
                )}

                {success && (
                  <div className="p-5 bg-green-50 text-green-700 font-bold rounded-2xl border border-green-100 mb-8 flex items-center gap-3">
                    <span className="text-xl">✨</span> Report analyzed successfully! New items added below.
                  </div>
                )}

                <button
                  onClick={handleAnalysis}
                  disabled={analyzing || !reportText.trim()}
                  className={`w-full py-6 rounded-2xl font-black text-xl transition-all ${
                    analyzing || !reportText.trim() 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-black text-white hover:scale-[1.01] active:scale-95 shadow-2xl shadow-slate-200'
                  }`}
                >
                  {analyzing ? 'Analyzing Report Data...' : 'Run Smart AI Analysis'}
                </button>
              </div>
            </section>

            {/* Debt Snowball Section */}
            <section className="bg-[#f7fcf2] p-10 rounded-[3rem] shadow-2xl border border-white card-shadow">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl"><IconSnowball /></div>
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight">Debt Snowball Strategy</h2>
                  <p className="text-slate-500 font-bold italic">"Lifestyle of freedom versus a lifestyle of deprivation."</p>
                </div>
              </div>

              {snowballPlan.length > 0 ? (
                <div className="space-y-6 mb-10">
                  {snowballPlan.map((step, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-6 items-start">
                      <div className="w-12 h-12 bg-green-100 text-green-800 rounded-xl flex items-center justify-center font-black flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-black text-black">{step.month}</h4>
                          <span className="text-xs font-black text-green-600 uppercase">Focus: {step.focusDebt}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4">{step.action}</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.max(10, 100 - (idx * 15))}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Debt: ${step.estimatedRemainingTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setSnowballPlan([])}
                    className="text-xs font-black text-slate-400 hover:text-black transition uppercase tracking-widest block mx-auto pt-4"
                  >
                    Reset Strategy
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    Identify your debts first using the AI Credit Analysis, then generate a personalized month-by-month "Snowball" payoff schedule.
                  </p>
                  <button
                    onClick={handleSnowballGenerate}
                    disabled={planning || client.negativeItems.length === 0}
                    className={`px-12 py-5 rounded-2xl font-black text-xl transition-all ${
                      planning || client.negativeItems.length === 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:scale-[1.05] active:scale-95 shadow-xl shadow-green-100'
                    }`}
                  >
                    {planning ? 'Calculating Strategy...' : 'Generate My Payoff Plan'}
                  </button>
                  {client.negativeItems.length === 0 && <p className="text-xs text-red-400 mt-4 font-bold uppercase">No debts detected. Run AI Analysis first.</p>}
                </div>
              )}
            </section>

            {/* List of items */}
            <section className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 card-shadow">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-black">Items Identified ({client.negativeItems.length})</h2>
                <button className="text-sm font-black text-slate-400 hover:text-black transition">Export Report</button>
              </div>
              
              {client.negativeItems.length === 0 ? (
                <div className="text-center py-24 text-slate-400 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="text-7xl mb-6 opacity-20">📋</div>
                  <p className="text-xl font-black text-slate-400">No items found yet.</p>
                  <p className="text-base mt-2">Submit your report text above to begin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {client.negativeItems.map((item, idx) => (
                    <div key={item.id || idx} className="p-8 border border-slate-50 rounded-[2rem] bg-slate-50/30 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition duration-300 group">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-xl font-black text-black group-hover:text-blue-600 transition-colors">{item.creditor}</h4>
                        <span className="px-3 py-1 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {item.status}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Type</span>
                          <span className="font-black text-black">{item.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Balance</span>
                          <span className="font-black text-black">${item.balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Reported</span>
                          <span className="font-black text-black">{item.dateReported || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-40"></div>
              <h3 className="text-2xl font-black mb-10 relative z-10">Progress Track</h3>
              <div className="space-y-8 relative z-10">
                {[
                  { label: 'Account Verified', status: 'completed' },
                  { label: 'Report Analysis', status: client.negativeItems.length > 0 ? 'completed' : 'pending' },
                  { label: 'Payoff Strategy', status: snowballPlan.length > 0 ? 'completed' : 'pending' },
                  { label: 'Bureau Submission', status: 'pending' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                      step.status === 'completed' ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/50' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {step.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <div>
                      <span className={`text-base font-black uppercase tracking-tight ${step.status === 'completed' ? 'text-white' : 'text-slate-600'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 card-shadow">
              <h3 className="text-2xl font-black text-black mb-4">Concierge</h3>
              <p className="text-slate-500 font-medium mb-8">Need assistance? Your dedicated credit specialist is online and ready to help.</p>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-[#fcf7f2] rounded-2xl flex items-center justify-center text-2xl">👤</div>
                <div>
                  <div className="text-lg font-black">Watson, T.</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-[10px] text-green-600 font-black uppercase">Active now</div>
                  </div>
                </div>
              </div>
              <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-black rounded-2xl text-base font-black transition-all active:scale-95 border border-slate-100 flex items-center justify-center gap-3">
                <span>💬</span> Message Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
