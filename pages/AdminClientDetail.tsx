
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, DisputeLetter, Template } from '../types';
import { DISPUTE_TEMPLATES } from '../constants';
import { generateDisputeLetter } from '../geminiService';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  letters: DisputeLetter[];
  setLetters: React.Dispatch<React.SetStateAction<DisputeLetter[]>>;
}

const AdminClientDetail: React.FC<Props> = ({ clients, setClients, letters, setLetters }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = clients.find(c => c.id === id);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(DISPUTE_TEMPLATES[0].id);
  const [generating, setGenerating] = useState(false);
  const [previewLetter, setPreviewLetter] = useState('');

  if (!client) return <div>Client not found</div>;

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
    );
  };

  const handleGenerate = async () => {
    if (selectedItems.length === 0) return alert('Select items to dispute');
    setGenerating(true);
    try {
      const targetItems = client.negativeItems.filter(ni => selectedItems.includes(ni.id));
      const template = DISPUTE_TEMPLATES.find(t => t.id === selectedTemplate);
      const content = await generateDisputeLetter(client.name, targetItems, template?.content || '');
      setPreviewLetter(content);
    } catch (err) {
      alert('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const saveLetter = () => {
    const newLetter: DisputeLetter = {
      id: `L-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      templateId: selectedTemplate,
      content: previewLetter,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    setLetters([newLetter, ...letters]);
    setPreviewLetter('');
    setSelectedItems([]);
    alert('Letter saved to generated letters repository!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigate('/dashboard/clients')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium">
        ← Back to Clients
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
              {client.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold text-center text-slate-900">{client.name}</h1>
            <p className="text-center text-slate-500 mb-6">{client.email}</p>
            
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current Score</span>
                <span className="font-bold text-blue-600">{client.score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Member Since</span>
                <span className="font-bold text-slate-700">{client.joinedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Portal Link</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/#/client/${client.token}`)}
                  className="text-xs text-blue-500 underline"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Tool */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Dispute Letter Generator</h2>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-4">Step 1: Select Items to Dispute</label>
              <div className="space-y-3">
                {client.negativeItems.map((item) => (
                  <label key={item.id} className={`block p-4 border rounded-xl cursor-pointer transition ${
                    selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-5 h-5 rounded border-slate-300" 
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.creditor}</div>
                        <div className="text-xs text-slate-500">{item.type} • ${item.balance} • Reported {item.dateReported}</div>
                      </div>
                    </div>
                  </label>
                ))}
                {client.negativeItems.length === 0 && (
                  <p className="text-slate-400 italic text-sm">No items found for this client.</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-4">Step 2: Choose Template</label>
              <select 
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DISPUTE_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name} - {t.description}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || selectedItems.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white transition ${generating ? 'bg-slate-400' : 'bg-slate-900 hover:bg-black'}`}
            >
              {generating ? 'Crafting Legal Argument with AI...' : 'Generate Dispute Letter'}
            </button>
          </div>

          {previewLetter && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-blue-100 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Generated Letter Preview</h3>
                <button 
                  onClick={saveLetter}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Save & Archive
                </button>
              </div>
              <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 font-serif whitespace-pre-wrap text-slate-800 text-sm shadow-inner min-h-[400px]">
                {previewLetter}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetail;
