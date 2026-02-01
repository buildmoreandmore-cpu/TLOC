
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '../types';
import { analyzeCreditReport } from '../geminiService';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientPortal: React.FC<Props> = ({ clients, setClients }) => {
  const { token } = useParams();
  const client = clients.find(c => c.token === token);
  const [analyzing, setAnalyzing] = useState(false);
  const [reportText, setReportText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Access</h1>
          <p className="text-slate-600">The access link you used is invalid or has expired. Please contact support.</p>
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Client Portal</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-sm">Three Level of Credit</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome, {client.name}</h1>
            <p className="text-slate-600 mt-1 font-medium">Your journey to a better credit score starts here.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mb-1">Equifax Score</span>
              <div className="text-3xl font-black text-blue-600 leading-none">{client.score || '---'}</div>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mb-1">Status</span>
              <div className="text-xs font-bold text-slate-700 uppercase">{client.status}</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Analysis Box */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">✨</div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">AI Credit Report Analysis</h2>
                    <p className="text-xs text-slate-500">Securely scan for disputable errors</p>
                  </div>
                </div>
                <button 
                  onClick={handlePaste}
                  className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                >
                  Paste from Clipboard
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">
                  Copy the full text of your credit report from <span className="font-bold text-slate-800">IdentityIQ</span> or <span className="font-bold text-slate-800">AnnualCreditReport.com</span> and paste it below. Our AI will automatically identify negative items.
                </p>
                
                <div className="relative">
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className={`w-full h-56 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4 text-sm font-mono transition-colors ${error ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-slate-50/30'}`}
                    placeholder="Paste credit report raw text data here..."
                  ></textarea>
                  
                  {analyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl animate-pulse">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="font-bold text-blue-800">AI Analysis in Progress...</p>
                      <p className="text-xs text-blue-600 mt-1 italic">Identifying accounts, balances, and legal errors</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 mb-4 flex items-center gap-2">
                    <span>❌</span> {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 mb-4 flex items-center gap-2">
                    <span>✅</span> Report analyzed successfully! New items added below.
                  </div>
                )}

                <button
                  onClick={handleAnalysis}
                  disabled={analyzing || !reportText.trim()}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                    analyzing || !reportText.trim() 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  {analyzing ? 'Analyzing Report Data...' : 'Run Smart AI Analysis'}
                </button>
              </div>
            </section>

            {/* List of items */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Items Identified ({client.negativeItems.length})</h2>
                <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Export PDF</button>
              </div>
              
              {client.negativeItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="text-5xl mb-4 opacity-50">📋</div>
                  <p className="font-medium">No items found yet.</p>
                  <p className="text-xs mt-1">Submit your report text above to begin the cleanup.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {client.negativeItems.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.creditor}</h4>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-black uppercase tracking-tighter">
                          {item.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Type</span>
                          <span className="font-semibold text-slate-700">{item.type}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Balance</span>
                          <span className="font-semibold text-slate-700">${item.balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Reported</span>
                          <span className="font-semibold text-slate-700">{item.dateReported || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
              <h3 className="text-lg font-bold mb-6 relative z-10">Step-by-Step Progress</h3>
              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Account Verified', status: 'completed' },
                  { label: 'Credit Report Analysis', status: client.negativeItems.length > 0 ? 'completed' : 'pending' },
                  { label: 'Dispute Letter Drafts', status: 'pending' },
                  { label: 'Mailing Sent', status: 'pending' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.status === 'completed' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {step.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <div>
                      <span className={`text-sm font-bold ${step.status === 'completed' ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Concierge</h3>
              <p className="text-sm text-slate-500 mb-6">Need assistance with your report? Your dedicated credit specialist is ready to help.</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                <div>
                  <div className="text-sm font-bold">Watson, T.</div>
                  <div className="text-[10px] text-green-600 font-bold uppercase">Online Now</div>
                </div>
              </div>
              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                <span>💬</span> Open Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
